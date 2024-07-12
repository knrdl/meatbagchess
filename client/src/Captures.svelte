<script lang="ts">
    import { BISHOP, KNIGHT, PAWN, QUEEN, ROOK, KING, WHITE, type PieceSymbol } from 'chess.js';
    import PieceImg from './lib/chesspieces/PieceImg.svelte';
    import { slide } from 'svelte/transition';
    import { game } from './game';

    export let capturedBy: 'us' | 'them';

    const order: PieceSymbol[] = [QUEEN, ROOK, BISHOP, KNIGHT, PAWN];

    $: captures = $game.captures[capturedBy === 'us' ? $game.ourColor : $game.theirColor];
</script>

{#if captures.length > 0}
    <div transition:slide style="display: flex; flex-wrap: wrap; gap: .25rem; align-items: center; justify-content: center">
        {#each order as type}
            {@const count = captures.filter((c) => c === type).length}
            {#if count > 0}
                <div style="position: relative" class={capturedBy} class:last_capture={captures[captures.length - 1] == type} transition:slide>
                    <PieceImg color={capturedBy === 'us' ? $game.theirColor : $game.ourColor} {type} --size="var(--piece-size)" />
                    {#if count > 1}
                        <div class="dot">{count}</div>
                    {/if}
                </div>
            {/if}
        {/each}
    </div>
{:else}
    <div style="visibility: hidden;" aria-hidden="true">
        <PieceImg color={WHITE} type={KING} --size="var(--piece-size)" />
    </div>
{/if}

<style>
    :root {
        --piece-size: 4rem;
    }
    @media screen and (max-width: 500px), screen and (max-height: 500px) {
        :root {
            --piece-size: 3.5rem;
        }
    }

    .dot {
        position: absolute;
        border-radius: 100%;
        background-color: darkmagenta;
        color: white;
        right: 0.5rem;
        bottom: 0.5rem;
        width: 1.5rem;
        height: 1.5rem;
        user-select: none;
    }

    .last_capture {
        border-radius: 8px;
    }

    .last_capture.us {
        border-bottom: 1px solid gray;
    }

    .last_capture.them {
        border-top: 1px solid gray;
    }
</style>
