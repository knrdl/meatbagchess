<script lang="ts">
    import { WHITE, type Color, type PieceSymbol } from 'chess.js';
    import { getPieceImage, piecesStyle } from './index.svelte';

    let { color, type, style }: { color: Color; type: PieceSymbol; style?: typeof piecesStyle.selected } = $props();
</script>

<img
    src={getPieceImage({ color, type }, style ?? piecesStyle.selected)}
    alt="Piece {color === WHITE ? 'white' : 'black'} {type}"
    style="max-width: var(--size); max-height: var(--size)"
/>
