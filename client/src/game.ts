import { BLACK, Chess, WHITE, type Color, type PieceSymbol, type Square } from "chess.js"
import type { Socket } from "socket.io-client"
import { writable } from "svelte/store"

export type GameStatus = 'playing' | 'white resigns' | 'black resigns' | 'draw by agreement' | 'draw by stalemate' | 'draw by threefold repetition' | 'draw by insufficient material' | 'white wins' | 'black wins' | 'user disconnected'

export const game = writable<Game>()

export class Game {

    readonly chess = new Chess()

    public status: GameStatus = 'playing'
    public captures: { [key in Color]: PieceSymbol[] } = { b: [], w: [] }

    public hasDrawOffer = false
    public hasUndoRequest = false

    constructor(public ourColor: Color, private socket: Socket) {

        socket.on('move', ({ from, to, promotion }) => {
            const currentTurn = this.chess.turn()
            const result = this.chess.move({ from, to, promotion })
            if (result.captured) {
                this.captures[currentTurn].push(result.captured)
            }
            game.set(this)
        })

        socket.on('status-update', status => {
            this.status = status
            game.set(this)
        })

        socket.on('draw-offer', () => {
            this.hasDrawOffer = true
            game.set(this)
        })

        socket.on('undo-request', () => {
            this.hasUndoRequest = true
            game.set(this)
        })

        socket.on('undo', () => {
            const move = this.chess.undo()
            if (move?.captured) {
                this.captures[move.color].splice(this.captures[move.color].indexOf(move.captured), 1)
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

    resign() {
        this.socket.emit('resign')
    }

    move({ from, to, promotion }: { from: Square; to: Square; promotion?: PieceSymbol }) {
        this.socket.emit('move', { from, to, promotion })
    }

    offerDraw() {
        this.socket.emit('offer-draw')
    }

    rejectDraw() {
        this.socket.emit('reject-draw')
        this.hasDrawOffer = false
        game.set(this)
    }

    acceptDraw() {
        this.socket.emit('accept-draw')
        this.hasDrawOffer = false
        game.set(this)
    }

    requestUndo() {
        this.socket.emit('request-undo')
    }

    acceptUndo() {
        this.socket.emit('accept-undo')
        this.hasUndoRequest = false
        game.set(this)
    }

    rejectUndo() {
        this.socket.emit('reject-undo')
        this.hasUndoRequest = false
        game.set(this)
    }


}