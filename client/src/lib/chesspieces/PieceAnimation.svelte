<svelte:options accessors={true} />

<script lang="ts">
    import { WHITE, type Square } from 'chess.js';
    import { getPieceImage } from '.';
    import type { Game } from '../../game';
    import { createEventDispatcher, tick } from 'svelte';

    const dispatch = createEventDispatcher<{ animate: boolean }>();

    export let squares: Partial<Record<Square, HTMLButtonElement>>;
    export let lastMove: Game['lastMove'] = null;

    const animationDuration = 250;
    let handle: number | null = null;

    export function animate(move: Game['lastMove']) {
        lastMove = null;
        tick().then(() => (lastMove = move));
        if (handle !== null) clearTimeout(handle);
        handle = setTimeout(() => (lastMove = null), animationDuration);
    }

    $: dispatch('animate', !!lastMove);
</script>

{#if lastMove}
    {@const fromRect = squares[lastMove.from]?.getBoundingClientRect()}
    {@const toRect = squares[lastMove.to]?.getBoundingClientRect()}
    {#if fromRect && toRect}
        <img
            src={getPieceImage(lastMove.piece)}
            alt="Piece {lastMove.piece.color === WHITE ? 'white' : 'black'} {lastMove.piece.type}"
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
