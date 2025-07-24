<script lang="ts">
    import { PAWN, WHITE } from 'chess.js'
    import PieceImg from './lib/chesspieces/PieceImg.svelte'
    import { PIECES_STYLE_KEY, PIECES_STYLES, piecesStyle } from './lib/chesspieces/index.svelte'

    function getNextStyle(selectedStyle: typeof piecesStyle.selected) {
        return PIECES_STYLES[(PIECES_STYLES.indexOf(selectedStyle) + 1) % PIECES_STYLES.length]
    }
</script>

<button
    type="button"
    style="position: fixed;right:1rem;bottom:1rem;border-radius:50%;padding:.25rem;width:2.5rem;height:2.5rem;background-color:#6663"
    onclick={() => {
        piecesStyle.selected = getNextStyle(piecesStyle.selected)
        localStorage.setItem(PIECES_STYLE_KEY, piecesStyle.selected)
    }}
>
    <PieceImg style={getNextStyle(piecesStyle.selected)} color={WHITE} type={PAWN} --size="1.5rem" />
</button>
