import bb from './images/bB.png'
import bk from './images/bK.png'
import bn from './images/bN.png'
import bp from './images/bP.png'
import bq from './images/bQ.png'
import br from './images/bR.png'
import wb from './images/wB.png'
import wk from './images/wK.png'
import wn from './images/wN.png'
import wp from './images/wP.png'
import wq from './images/wQ.png'
import wr from './images/wR.png'

const piecesImages: Record<string, string> = { bb, bk, bn, bp, bq, br, wb, wk, wn, wp, wq, wr }

import { type Piece } from 'chess.js'

export function getPieceImage(piece: Piece) {
    return piecesImages[(piece.color + piece.type)]
}