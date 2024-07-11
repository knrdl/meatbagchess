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
 *  clock?: {elapsed: {[WHITE]: number|null, [BLACK]: number|null}, stamps: {[WHITE]?: number, [BLACK]?: number}}
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
    const sockets = await io.in(room(gameId)).fetchSockets()
    if (sockets.length === 2) {
        const readySocket = sockets.find(socket => socket.data.color)
        if (readySocket) {
            console.info('start game', gameId)

            const otherSocket = sockets.find(socket => socket !== readySocket)
            otherSocket.data.color = (readySocket.data.color === WHITE ? BLACK : WHITE)

            updateGame(gameId, { status: 'playing', chess: new Chess(), clock: { elapsed: { [WHITE]: null, [BLACK]: null }, stamps: {} } })

            sockets.forEach(socket => {
                socket.emit('start-game', { yourColor: socket.data.color })
            })
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

        const roomSockets = await io.in(room(gameId)).fetchSockets()
        if (roomSockets.length < 2) {
            socket.join(room(gameId))

            if (games.get(gameId).status === 'preparing') {
                tryStartGame(gameId)
            } else if (games.get(gameId).status === 'playing' && roomSockets.length === 1) {
                socket.data.color = roomSockets[0].data.color === WHITE ? BLACK : WHITE
                socket.emit('continue-game', {
                    fen: games.get(gameId).chess.fen(),
                    yourColor: socket.data.color
                })
                socket.emit('clock-sync', games.get(gameId).clock.elapsed)
            }

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
                        updateGame(gameId, { drawOfferBy: undefined, undoRequestBy: undefined })
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
                            else if (chess.isCheckmate()) emitStatus((chess.turn() === WHITE ? 'black' : 'white') + ' wins')
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
                        const undoTurns = games.get(gameId).chess.turn() === undoRequestBy ? 2 : 1
                        const move = games.get(gameId).chess.undo()
                        if (move) {
                            if (undoTurns === 2) {
                                games.get(gameId).chess.undo()
                            }
                            io.to(room(gameId)).emit('undo', { turns: undoTurns })
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
                console.error('user disconnected:', reason)
                if ((await io.in(room(gameId)).fetchSockets()).length === 0) {
                    games.delete(gameId) // stop game
                    console.info('stop game', gameId)
                }
            })
        } else {
            socket.disconnect()
        }
    } else {
        socket.disconnect()
    }
})

server.listen(8000, () => {
    console.info('server running on port 8000')
})