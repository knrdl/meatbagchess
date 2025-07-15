<script lang="ts">
    import { BISHOP, KNIGHT, PAWN, QUEEN, ROOK, KING, WHITE, type PieceSymbol } from 'chess.js';
    import PieceImg from './lib/chesspieces/PieceImg.svelte';
    import { slide } from 'svelte/transition';
    import game from './game.svelte';

    let { capturedBy }: { capturedBy: 'us' | 'them' } = $props();

    const order: PieceSymbol[] = [QUEEN, ROOK, BISHOP, KNIGHT, PAWN];

    let captures = $derived(capturedBy === 'us' ? game.ourCaptures : game.theirCaptures);
</script>

{#if captures.length > 0}
    <div transition:slide style="display: flex; flex-wrap: wrap; gap: .25rem; align-items: center; justify-content: center">
        {#each order as type (type)}
            {@const count = captures.filter((c) => c === type).length}
            {#if count > 0}
                <div style="position: relative" class="{capturedBy} {captures[captures.length - 1] == type ? 'last-capture' : ''}" transition:slide>
                    <PieceImg color={capturedBy === 'us' ? game.theirColor : game.ourColor} {type} --size="var(--piece-size)" />
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

    .last-capture {
        border-radius: 8px;
    }

    .last-capture.us {
        border-bottom: 3px solid gray;
    }

    .last-capture.them {
        border-top: 3px solid gray;
    }
</style>
