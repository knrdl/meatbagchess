<script lang="ts">
    import { WHITE, type Color, type PieceSymbol } from 'chess.js';
    import { getPieceImage } from '.';

    let { color, type }: { color: Color; type: PieceSymbol } = $props();
</script>

<img src={getPieceImage({ color, type })} alt="Piece {color === WHITE ? 'white' : 'black'} {type}" style="max-width: var(--size); max-height: var(--size)" />
