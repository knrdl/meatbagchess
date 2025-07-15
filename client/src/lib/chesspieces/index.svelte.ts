import bbStandard from './standard/bB.png'
import bkStandard from './standard/bK.png'
import bnStandard from './standard/bN.png'
import bpStandard from './standard/bP.png'
import bqStandard from './standard/bQ.png'
import brStandard from './standard/bR.png'
import wbStandard from './standard/wB.png'
import wkStandard from './standard/wK.png'
import wnStandard from './standard/wN.png'
import wpStandard from './standard/wP.png'
import wqStandard from './standard/wQ.png'
import wrStandard from './standard/wR.png'

import bbCat from './cats/bB.png'
import bkCat from './cats/bK.png'
import bnCat from './cats/bN.png'
import bpCat from './cats/bP.png'
import bqCat from './cats/bQ.png'
import brCat from './cats/bR.png'
import wbCat from './cats/wB.png'
import wkCat from './cats/wK.png'
import wnCat from './cats/wN.png'
import wpCat from './cats/wP.png'
import wqCat from './cats/wQ.png'
import wrCat from './cats/wR.png'

const piecesImages: Record<'standard' | 'cats', Record<`${Color}${PieceSymbol}`, string>> = {
    standard: {
        bb: bbStandard,
        bk: bkStandard,
        bn: bnStandard,
        bp: bpStandard,
        bq: bqStandard,
        br: brStandard,
        wb: wbStandard,
        wk: wkStandard,
        wn: wnStandard,
        wp: wpStandard,
        wq: wqStandard,
        wr: wrStandard,
    },
    cats: {
        bb: bbCat,
        bk: bkCat,
        bn: bnCat,
        bp: bpCat,
        bq: bqCat,
        br: brCat,
        wb: wbCat,
        wk: wkCat,
        wn: wnCat,
        wp: wpCat,
        wq: wqCat,
        wr: wrCat,
    },
}

export const PIECES_STYLE_KEY = 'selectedPiecesStyle'
export let piecesStyle = $state<{ selected: keyof typeof piecesImages }>({
    selected: (localStorage.getItem(PIECES_STYLE_KEY) ?? 'standard') as keyof typeof piecesImages,
})

import { type Color, type Piece, type PieceSymbol } from 'chess.js'

export function getPieceImage(piece: Piece, style: typeof piecesStyle.selected) {
    return piecesImages[style][(piece.color + piece.type) as `${Color}${PieceSymbol}`]
}
