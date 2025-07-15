import { BLACK, Chess, Move, WHITE, type Color, type PieceSymbol, type Square } from 'chess.js'
import { io, Socket } from 'socket.io-client'
import { playSound, stopSound } from './lib/sounds'
import { texts } from './i18n.svelte'

const COLOR_NAMES = { [BLACK]: 'black', [WHITE]: 'white' }

const moveCallbacks: (() => void)[] = []

let socket = $state<Socket>()
let game = $state<Game>()
let ourLastMove = $state<Move>()
let theirLastMove = $state<Move>()

let weOfferDraw = $derived(game?.drawOfferBy === 'us')
let theyOfferDraw = $derived(game?.drawOfferBy === 'them')
let weRequestUndo = $derived(game?.undoRequestBy === 'us')
let theyRequestUndo = $derived(game?.undoRequestBy === 'them')

let ourColor = $derived<Color>(game?.ourColor || WHITE)
let theirColor = $derived<Color>(ourColor === WHITE ? BLACK : WHITE)
let ourCaptures = $derived(game ? game.captures[ourColor] : [])
let theirCaptures = $derived(game ? game.captures[theirColor] : [])

let isRunning = $derived(game && game.status !== 'preparing')
let isPlaying = $derived(game && game.status === 'playing')
let isWon = $derived(game && (game.status === COLOR_NAMES[ourColor] + ' wins' || game.status === COLOR_NAMES[theirColor] + ' resigns'))
let isLost = $derived(game && (game.status === COLOR_NAMES[theirColor] + ' wins' || game.status === COLOR_NAMES[ourColor] + ' resigns'))
let isDraw = $derived(game && game.status.startsWith('draw'))
let translatedGameResult = $derived(game && game.status !== 'playing' && game.status !== 'preparing' ? texts.gameResult[game.status] : '')

export interface Game {
    status:
        | 'preparing'
        | 'playing'
        | 'white resigns'
        | 'black resigns'
        | 'draw by agreement'
        | 'draw by stalemate'
        | 'draw by threefold repetition'
        | 'draw by insufficient material'
        | 'draw by 50 moves'
        | 'white wins'
        | 'black wins'
    ourColor: Color
    chess: Chess
    captures: { [key in Color]: PieceSymbol[] }
    undos: { [key in Color]: number }
    elapsedTime: { [key in Color]: number | null }
    drawOfferBy: null | 'them' | 'us'
    undoRequestBy: null | 'them' | 'us'
}

function updateMoves() {
    const movesLastFirst = game?.chess.history({ verbose: true }).reverse()
    ourLastMove = movesLastFirst?.find(move => move.color === ourColor)
    theirLastMove = movesLastFirst?.find(move => move.color === theirColor)

    moveCallbacks.forEach(cb => cb())
}

function init(gameId: string, startGameCb: () => void) {
    function initGame(ourColor: Color) {
        game = {
            status: 'preparing',
            ourColor,
            chess: new Chess(),
            captures: { [BLACK]: [], [WHITE]: [] },
            undos: { [BLACK]: 0, [WHITE]: 0 },
            elapsedTime: { [BLACK]: null, [WHITE]: null },
            drawOfferBy: null,
            undoRequestBy: null,
        }
    }

    initGame(WHITE)

    if (!socket) {
        socket = io({ query: { gameId } })

        socket.on('start-game', ({ yourColor }) => {
            initGame(yourColor)
            updateMoves()
            game!.status = 'playing'
            startGameCb()
        })

        socket.on('continue-game', ({ fen, pgn, yourColor }: { fen: string; pgn: string; yourColor: Color }) => {
            initGame(yourColor)
            try {
                game!.chess.loadPgn(pgn)
            } catch (_e) {
                game!.chess.load(fen)
            }
            game!.chess.history({ verbose: true }).forEach(move => {
                if (move.captured) game!.captures[move.color].push(move.captured)
            })
            updateMoves()
            game!.status = 'playing'
            startGameCb()
        })

        socket.on('move', ({ from, to, promotion }) => {
            game!.drawOfferBy = null
            game!.undoRequestBy = null
            const currentTurn = game!.chess.turn()
            const result = game!.chess.move({ from, to, promotion })
            if (result.captured) {
                game!.captures[currentTurn].push(result.captured)
            }
            updateMoves()

            if (game!.chess.inCheck()) playSound('check')
            else if (result.captured) playSound('capture')
            else playSound(game!.chess.turn() === ourColor ? 'theirMove' : 'ourMove')
        })

        socket.on('status-update', status => {
            game!.status = status
            game!.drawOfferBy = null
            game!.undoRequestBy = null
            if (isWon) playSound('win')
            else if (isLost) playSound('lose')
            else if (isDraw) playSound('draw')
        })

        socket.on('clock-sync', elapsedTime => {
            game!.elapsedTime = elapsedTime
        })

        socket.on('draw-offer', () => {
            playSound('offer')
            game!.drawOfferBy = 'them'
        })

        socket.on('draw-rejection', () => {
            game!.drawOfferBy = null
        })

        socket.on('undo-request', () => {
            playSound('offer')
            game!.undoRequestBy = 'them'
        })

        socket.on('undo-rejection', () => {
            game!.undoRequestBy = null
        })

        socket.on('undo', ({ turns }: { turns: number }) => {
            playSound('undo')
            game!.undoRequestBy = null
            for (let i = 0; i < turns; i++) {
                const move = game!.chess.undo()
                if (!move) {
                    console.error('error on undo move', i)
                } else if (move.captured) {
                    game!.captures[move.color].splice(game!.captures[move.color].indexOf(move.captured), 1)
                }
            }
            updateMoves()
        })

        socket.on('undo-count', undos => {
            game!.undos = undos
        })
    }
}

export default {
    init,
    selectColor(myColor: Color) {
        socket!.emit('prepare-game', { myColor })
    },
    resign() {
        socket!.emit('resign')
    },
    offerDraw() {
        playSound('offer')
        game!.drawOfferBy = 'us'
        socket!.emit('offer-draw')
    },

    rejectDraw() {
        stopSound('offer')
        socket!.emit('reject-draw')
        game!.drawOfferBy = null
    },

    acceptDraw() {
        stopSound('offer')
        socket!.emit('accept-draw')
        game!.drawOfferBy = null
    },

    requestUndo() {
        playSound('offer')
        game!.undoRequestBy = 'us'
        socket!.emit('request-undo')
    },

    acceptUndo() {
        stopSound('offer')
        socket!.emit('accept-undo')
        game!.undoRequestBy = null
    },

    rejectUndo() {
        stopSound('offer')
        socket!.emit('reject-undo')
        game!.undoRequestBy = null
    },
    move({ from, to, promotion }: { from: Square; to: Square; promotion?: PieceSymbol }) {
        socket!.emit('move', { from, to, promotion })
    },
    onMove(cb: () => void) {
        moveCallbacks.push(cb)
    },
    offMove(cb: () => void) {
        moveCallbacks.splice(moveCallbacks.indexOf(cb), 1)
    },

    getPossibleMoves(square: Square) {
        if (this.currentTurn === this.ourColor) {
            return game!.chess.moves({ square, verbose: true }).map(move => move.to)
        } else {
            const tokens = game!.chess.fen().split(' ')
            tokens[1] = this.theirColor
            tokens[1] = tokens[1] === WHITE ? BLACK : WHITE
            const fakeGame = new Chess(tokens.join(' '))
            return fakeGame.moves({ square, verbose: true }).map(move => move.to)
        }
    },

    getSquarePiece(square: Square) {
        return game?.chess.get(square)
    },
    getSquareColor(square: Square) {
        return game?.chess.squareColor(square) || undefined
    },
    isCheck() {
        return game?.chess.isCheck()
    },

    isMovePromotion({ from, to }: { from: Square; to: Square }) {
        return (
            game?.chess
                .moves({ square: from, verbose: true })
                .filter(move => move.to === to)
                .some(move => move.promotion) ?? false
        )
    },

    get isRunning() {
        return isRunning
    },
    get isPlaying() {
        return isPlaying
    },
    get translatedGameResult() {
        return translatedGameResult
    },
    get currentTurn() {
        return game?.chess.turn()
    },
    get isWon() {
        return isWon
    },
    get isLost() {
        return isLost
    },
    get isDraw() {
        return isDraw
    },
    get weOfferDraw() {
        return weOfferDraw
    },
    get theyOfferDraw() {
        return theyOfferDraw
    },
    get weRequestUndo() {
        return weRequestUndo
    },
    get theyRequestUndo() {
        return theyRequestUndo
    },
    get ourColor() {
        return ourColor
    },
    get theirColor() {
        return theirColor
    },
    get ourCaptures() {
        return ourCaptures
    },
    get theirCaptures() {
        return theirCaptures
    },
    get elapsedTime() {
        return game?.elapsedTime
    },
    get undos() {
        return game?.undos
    },
    get ourLastMove() {
        return ourLastMove
    },
    get theirLastMove() {
        return theirLastMove
    },
}
