import { BLACK, Chess, WHITE, type Color, type Piece, type PieceSymbol, type Square } from "chess.js"
import type { Socket } from "socket.io-client"
import { writable } from "svelte/store"
import { playSound, stopSound } from "./lib/sounds"

export type GameStatus = 'playing' | 'white resigns' | 'black resigns' | 'draw by agreement' | 'draw by stalemate' | 'draw by threefold repetition' | 'draw by insufficient material' | 'white wins' | 'black wins'

export const game = writable<Game>()

export class Game {

    readonly chess

    public status: GameStatus
    public captures: { [key in Color]: PieceSymbol[] }

    public hasDrawOffer = false
    public hasUndoRequest = false

    public elapsedTime: { [key in Color]: number | null }
    public lastMove: { from: Square, to: Square, piece: Piece } | null = null

    constructor(public ourColor: Color, private socket: Socket) {

        this.chess = new Chess()
        this.status = 'playing'
        this.captures = { [BLACK]: [], [WHITE]: [] }
        this.elapsedTime = { [BLACK]: null, [WHITE]: null }

        socket.on('move', ({ from, to, promotion }) => {
            this.hasDrawOffer = false
            this.hasUndoRequest = false
            const currentTurn = this.chess.turn()
            const result = this.chess.move({ from, to, promotion })
            if (result.captured) {
                this.captures[currentTurn].push(result.captured)
            }
            this.lastMove = { from, to, piece: { color: result.color, type: result.piece } }

            if (this.chess.inCheck())
                playSound('check')
            else if (result.captured)
                playSound('capture')
            else
                playSound(this.chess.turn() === this.ourColor ? 'theirMove' : 'ourMove')

            game.set(this)
        })

        socket.on('status-update', status => {
            this.status = status
            if (this.isWon) playSound('win')
            else if (this.isLost) playSound('lose')
            else if (this.isDraw) playSound('draw')
            game.set(this)
        })

        socket.on('clock-sync', elapsedTime => {
            this.elapsedTime = elapsedTime
            game.set(this)
        })

        socket.on('draw-offer', () => {
            playSound('offer')
            this.hasDrawOffer = true
            game.set(this)
        })

        socket.on('undo-request', () => {
            playSound('offer')
            this.hasUndoRequest = true
            game.set(this)
        })

        socket.on('undo', ({ turns }: { turns: number }) => {
            playSound('undo')
            for (let i = 0; i < turns; i++) {
                const move = this.chess.undo()
                if (move?.captured) {
                    this.captures[move.color].splice(this.captures[move.color].indexOf(move.captured), 1)
                }
            }
            game.set(this)
        })

    }

    get theirColor() {
        return this.ourColor === WHITE ? BLACK : WHITE
    }

    get ourColorLong() {
        return this.ourColor === WHITE ? 'white' : 'black'
    }

    get theirColorLong() {
        return this.ourColor === WHITE ? 'black' : 'white'
    }

    get isWon() {
        return this.status === this.ourColorLong + ' wins' || this.status === this.theirColorLong + ' resigns'
    }

    get isLost() {
        return this.status === this.theirColorLong + ' wins' || this.status === this.ourColorLong + ' resigns'
    }
    get isDraw() {
        return this.status.startsWith('draw')
    }

    getPossibleMoves(square: Square) {
        if (this.chess.turn() === this.ourColor) {
            return this.chess.moves({ square, verbose: true }).map((move) => move.to)
        } else {
            const tokens = this.chess.fen().split(' ')
            tokens[1] = this.theirColor
            tokens[1] = tokens[1] === WHITE ? BLACK : WHITE
            const fakeGame = new Chess(tokens.join(' '))
            return fakeGame.moves({ square, verbose: true }).map((move) => move.to)
        }
    }

    resign() {
        this.socket.emit('resign')
    }

    move({ from, to, promotion }: { from: Square; to: Square; promotion?: PieceSymbol }) {
        this.socket.emit('move', { from, to, promotion })
    }

    offerDraw() {
        playSound('offer')
        this.socket.emit('offer-draw')
    }

    rejectDraw() {
        stopSound('offer')
        this.socket.emit('reject-draw')
        this.hasDrawOffer = false
        game.set(this)
    }

    acceptDraw() {
        stopSound('offer')
        this.socket.emit('accept-draw')
        this.hasDrawOffer = false
        game.set(this)
    }

    requestUndo() {
        playSound('offer')
        this.socket.emit('request-undo')
    }

    acceptUndo() {
        stopSound('offer')
        this.socket.emit('accept-undo')
        this.hasUndoRequest = false
        game.set(this)
    }

    rejectUndo() {
        stopSound('offer')
        this.socket.emit('reject-undo')
        this.hasUndoRequest = false
        game.set(this)
    }

    stop() {
        for (const event of ['move', 'status-update', 'clock-sync', 'draw-offer', 'undo-request', 'undo',]) {
            this.socket.off(event)
        }
    }


}