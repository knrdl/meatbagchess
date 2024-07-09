<script lang="ts">
    import { type Color } from 'chess.js';
    import { createEventDispatcher } from 'svelte';
    import PieceImg from './lib/chesspieces/PieceImg.svelte';
    import shareImg from './lib/share.png';

    const dispatch = createEventDispatcher<{ create: Color }>();

    let dialog: HTMLDialogElement;

    export function show() {
        dialog.showModal();
    }

    export function close() {
        dialog.close();
    }
</script>

<dialog bind:this={dialog} on:cancel|preventDefault={() => {}}>
    <!-- prevent focus on open -->
    <button type="button" style="opacity: 0; width: 0; height: 0; margin: 0; padding: 0; border: none" />
    <div
        style="
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 2rem
    "
    >
        <h2>New Game</h2>
        {#if navigator.share}
            <button
                type="button"
                on:click={() => {
                    navigator.share({ url: window.location.toString() });
                }}
            >
                <img src={shareImg} alt="Share" class="share" />
            </button>
        {/if}
    </div>
    <div
        style="
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        align-items: center;"
    >
        <button
            type="button"
            on:click={() => {
                dispatch('create', 'w');
            }}
        >
            <PieceImg color="w" type="k" />
        </button>
        <button
            type="button"
            on:click={() => {
                dispatch('create', Math.random() >= 0.5 ? 'b' : 'w');
            }}
        >
            <div style="position: relative;">
                <div style="opacity:0">
                    <PieceImg color="w" type="k" />
                </div>
                <div style="position: absolute;left:0;top:0;width:50%;overflow: hidden;">
                    <PieceImg color="w" type="k" />
                </div>
                <div style="position: absolute;right:0;top:0;width:50%;transform: rotateY(180deg);overflow: hidden;">
                    <PieceImg color="b" type="k" />
                </div>
            </div>
        </button>
        <button
            type="button"
            on:click={() => {
                dispatch('create', 'b');
            }}
        >
            <PieceImg color="b" type="k" />
        </button>
    </div>
</dialog>

<style>
    dialog {
        background: linear-gradient(0deg, #262626ee, #000e);
        color: white;
    }

    @media (prefers-color-scheme: dark) {
        img.share {
            filter: invert(1);
        }
    }
</style>
