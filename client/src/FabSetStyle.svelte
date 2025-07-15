<script>
    import { PAWN, WHITE } from 'chess.js'
    import PieceImg from './lib/chesspieces/PieceImg.svelte'
    import { PIECES_STYLE_KEY, piecesStyle } from './lib/chesspieces/index.svelte'
</script>

<button
    type="button"
    style="position: fixed;right:1rem;bottom:1rem;border-radius:50%;padding:.25rem;width:2.5rem;height:2.5rem;background-color:#6663"
    onclick={() => {
        piecesStyle.selected = piecesStyle.selected === 'standard' ? 'cats' : 'standard'
        localStorage.setItem(PIECES_STYLE_KEY, piecesStyle.selected)
    }}
>
    <PieceImg style={piecesStyle.selected === 'standard' ? 'cats' : 'standard'} color={WHITE} type={PAWN} --size="1.5rem" />
</button>
