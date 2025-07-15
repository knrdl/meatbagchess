<script lang="ts">
    import { Move, WHITE, type Square } from 'chess.js';
    import { getPieceImage } from '.';
    import { tick } from 'svelte';

    let { squares }: { squares: Partial<Record<Square, HTMLButtonElement>> } = $props();

    let lastMove = $state<Move>();

    const animationDuration = 500; // ms
    let handle: number | null = null;

    export function animate(move: Move) {
        lastMove = undefined;
        tick().then(() => (lastMove = move));
        if (handle !== null) clearTimeout(handle);
        handle = setTimeout(() => (lastMove = undefined), animationDuration);
    }

    export { lastMove };
</script>

{#if lastMove}
    {@const fromRect = squares[lastMove.from]?.getBoundingClientRect()}
    {@const toRect = squares[lastMove.to]?.getBoundingClientRect()}
    {#if fromRect && toRect}
        <img
            src={getPieceImage({ color: lastMove.color, type: lastMove.piece })}
            alt="Piece {lastMove.color === WHITE ? 'white' : 'black'} {lastMove.piece}"
            style="
                --x1: {fromRect.x}px;
                --y1: {fromRect.y}px;
                --x2: {toRect.x}px;
                --y2: {toRect.y}px;
                --duration: {animationDuration}ms;
                --width: {fromRect.width}px;
                --height: {fromRect.height}px;
            "
            class="piece"
        />
    {/if}
{/if}

<style>
    .piece {
        animation-name: piecemove;
        animation-iteration-count: 1;
        animation-timing-function: ease-in-out;
        animation-duration: var(--duration);

        left: 0;
        top: 0;
        position: fixed;
        z-index: 10;

        width: var(--width);
        height: var(--height);
    }

    @keyframes piecemove {
        0% {
            transform: translateX(var(--x1)) translateY(var(--y1));
        }

        100% {
            transform: translateX(var(--x2)) translateY(var(--y2));
        }
    }
</style>
