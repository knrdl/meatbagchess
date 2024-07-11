<script lang="ts">
    import { WHITE, type Color, type PieceSymbol } from 'chess.js';
    import { getPieceImage } from '.';
    export let color: Color;
    export let type: PieceSymbol;
</script>

<img src={getPieceImage({ color, type })} alt="Piece {color === WHITE ? 'white' : 'black'} {type}" style="max-width: var(--size); max-height: var(--size)" />
