<script lang="ts">
    import { BISHOP, KNIGHT, PAWN, QUEEN, ROOK, type Color, type PieceSymbol } from 'chess.js';
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
                <div style="position: relative">
                    <PieceImg color={capturedBy === 'us' ? $game.theirColor : $game.ourColor} {type} --size="4rem" />
                    {#if count > 1}
                        <div class="dot">{count}</div>
                    {/if}
                </div>
            {/if}
        {/each}
    </div>
{/if}

<style>
    .dot {
        position: absolute;
        border-radius: 100%;
        background-color: darkmagenta;
        color: white;
        right: 0.5rem;
        bottom: 0.5rem;
        width: 1.5rem;
        height: 1.5rem;
    }
</style>
