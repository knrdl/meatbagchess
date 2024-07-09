import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { BLACK, Chess, WHITE } from 'chess.js'

const app = express()
app.use(express.static('www'))

const server = createServer(app)
const io = new Server(server)

/**
 * @type {Map<string, {
 *  status: 'preparing' | 'playing' | 'done', 
 *  chess?: Chess, 
 *  drawOfferBy?: Color,
 *  undoRequestBy?: Color,
 *  clock?: {elapsed: {w: number|null, b: number|null}, stamps: {w?: number, b?: number}}
 * }>}
*/
const games = new Map()

function room(gameId) {
    return 'room:' + gameId
}

function epoch() {
    return Math.floor(new Date().getTime() / 1000)
}

function updateGame(gameId, updater) {
    games.set(gameId, { ...games.get(gameId), ...updater })
}

async function tryStartGame(gameId) {
    if (games.get(gameId).status === 'preparing') {
        const sockets = await io.in(room(gameId)).fetchSockets()
        if (sockets.length === 2) {
            const readySocket = sockets.find(socket => socket.data.color)
            if (readySocket) {
                const otherSocket = sockets.find(socket => socket !== readySocket)
                otherSocket.data.color = (readySocket.data.color === WHITE ? BLACK : WHITE)

                updateGame(gameId, { status: 'playing', chess: new Chess(), clock: { elapsed: { w: null, b: null }, stamps: {} } })

                sockets.forEach(socket => {
                    socket.emit('start-game', { yourColor: socket.data.color })
                })
            }
        }
    }
}

io.on('connection', async (socket) => {
    const gameId = socket.handshake.query.gameId
    if (/^[a-z0-9\-]{36}$/.test(gameId)) {
        if (!games.has(gameId)) {
            games.set(gameId, { status: 'preparing' })
        }

        const emitStatus = status => io.to(room(gameId)).emit('status-update', status)

        const sockets = await io.in(room(gameId)).fetchSockets()
        if (sockets.length < 2) {
            socket.data.gameId = gameId
            socket.join(room(gameId))

            tryStartGame(gameId)

            socket.on('prepare-game', async ({ myColor }) => {
                if (['preparing', 'done'].includes(games.get(gameId).status)) {

                    if (games.get(gameId).status === 'done') {
                        for (const sock of await io.in(room(gameId)).fetchSockets()) {
                            sock.data = {}
                        }
                        games.set(gameId, { status: 'preparing' })
                    }

                    if ([BLACK, WHITE].includes(myColor)) {
                        socket.data.color = myColor
                        tryStartGame(gameId)
                    }
                }
            })

            socket.on('move', ({ from, to, promotion }) => {
                if (games.get(gameId).status === 'playing') {
                    const chess = games.get(gameId).chess
                    const move = (() => {
                        try {
                            return chess.move({ from, to, promotion })
                        } catch (e) {
                            return null
                        }
                    })()
                    if (move) {
                        if (!games.get(gameId).clock.stamps[socket.data.color]) {
                            games.get(gameId).clock.elapsed[socket.data.color] = 0
                            games.get(gameId).clock.stamps[socket.data.color] = epoch()
                        } else {
                            const now = epoch()
                            const theirColor = socket.data.color === WHITE ? BLACK : WHITE
                            games.get(gameId).clock.elapsed[socket.data.color] += (now - games.get(gameId).clock.stamps[theirColor])
                            games.get(gameId).clock.stamps[socket.data.color] = now
                        }
                        io.to(room(gameId)).emit('clock-sync', games.get(gameId).clock.elapsed)

                        io.to(room(gameId)).emit('move', move)

                        if (chess.isGameOver()) {
                            updateGame(gameId, { status: 'done' })
                            if (chess.isInsufficientMaterial()) emitStatus('draw by insufficient material')
                            else if (chess.isStalemate()) emitStatus('draw by stalemate')
                            else if (chess.isThreefoldRepetition()) emitStatus('draw by threefold repetition')
                            else if (chess.isCheckmate()) emitStatus((chess.turn() === WHITE ? 'white' : 'black') + ' wins')
                        }
                    }
                }
            })

            socket.on('resign', () => {
                if (games.get(gameId).status === 'playing') {
                    updateGame(gameId, { status: 'done' })
                    emitStatus((socket.data.color === WHITE ? 'white' : 'black') + ' resigns')
                }
            })

            socket.on('offer-draw', async () => {
                if (games.get(gameId).status === 'playing') {
                    updateGame(gameId, { drawOfferBy: socket.data.color })
                    const sockets = await io.in(room(gameId)).fetchSockets()
                    const theirSocket = sockets.find(sock => sock !== socket)
                    if (theirSocket) {
                        theirSocket.emit('draw-offer')
                    }
                }
            })

            socket.on('accept-draw', async () => {
                if (games.get(gameId).status === 'playing') {
                    updateGame(gameId, { status: 'done' })
                    const drawOfferBy = games.get(gameId).drawOfferBy
                    if (drawOfferBy && drawOfferBy !== socket.data.color) {
                        emitStatus('draw by agreement')
                    }
                }
            })

            socket.on('reject-draw', () => {
                if (games.get(gameId).status === 'playing') {
                    updateGame(gameId, { drawOfferBy: undefined })
                }
            })

            socket.on('request-undo', async () => {
                if (games.get(gameId).status === 'playing') {
                    updateGame(gameId, { undoRequestBy: socket.data.color })
                    const sockets = await io.in(room(gameId)).fetchSockets()
                    const theirSocket = sockets.find(sock => sock !== socket)
                    if (theirSocket) {
                        theirSocket.emit('undo-request')
                    }
                }
            })

            socket.on('accept-undo', async () => {
                if (games.get(gameId).status === 'playing') {
                    const undoRequestBy = games.get(gameId).undoRequestBy
                    if (undoRequestBy && undoRequestBy !== socket.data.color) {
                        updateGame(gameId, { undoRequestBy: undefined })
                        const move = games.get(gameId).chess.undo()
                        if (move) {
                            io.to(room(gameId)).emit('undo')
                        }
                    }
                }
            })

            socket.on('reject-undo', () => {
                if (games.get(gameId).status === 'playing') {
                    updateGame(gameId, { undoRequestBy: undefined })
                }
            })

            socket.on('disconnect', async (reason) => {
                // todo:
                // const sockets = await io.in(room(gameId)).fetchSockets()
                // if (sockets.length < 2)
                //     emitStatus('user disconnected')
                console.log('user disconnected:', reason)
            })
        } else {
            socket.disconnect()
        }
    } else {
        socket.disconnect()
    }
})

server.listen(8000, () => {
    console.log('server running on port 8000')
})