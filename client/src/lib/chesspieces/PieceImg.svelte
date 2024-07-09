<script lang="ts">
    import { type Color, type PieceSymbol } from 'chess.js';
    import { getPieceImage } from '.';
    export let color: Color;
    export let type: PieceSymbol;
</script>

<img src={getPieceImage({ color, type })} alt="Piece {color} {type}" style="max-width: var(--size); max-height: var(--size)" />
