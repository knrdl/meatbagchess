<script lang="ts">
    import { type Color, type PieceSymbol, type Square, QUEEN, ROOK, BISHOP, KNIGHT } from 'chess.js';
    import { createEventDispatcher } from 'svelte';
    import PieceImg from './lib/chesspieces/PieceImg.svelte';

    const dispatch = createEventDispatcher<{ promote: { type: PieceSymbol; target: Square } }>();

    export let color: Color;

    let dialog: HTMLDialogElement;

    const promotions: PieceSymbol[] = [QUEEN, ROOK, BISHOP, KNIGHT];

    let targetSquare: Square;

    export function show(target: Square) {
        dialog.showModal();
        targetSquare = target;
    }
</script>

<dialog bind:this={dialog} on:cancel|preventDefault={() => {}}>
    <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 1.5rem">
        {#each promotions as type}
            <button
                type="button"
                on:click={() => {
                    dispatch('promote', { type, target: targetSquare });
                    dialog.close();
                }}
            >
                <PieceImg {color} {type} />
            </button>
        {/each}
    </div>
</dialog>
