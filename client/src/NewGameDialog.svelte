<script lang="ts">
    import { BLACK, KING, WHITE, type Color } from 'chess.js';
    import { createEventDispatcher } from 'svelte';
    import PieceImg from './lib/chesspieces/PieceImg.svelte';
    import shareImg from './lib/share.png';

    const dispatch = createEventDispatcher<{ create: Color }>();

    let dialog: HTMLDialogElement;

    let isWaiting = false;

    export function show() {
        isWaiting = false;
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
                isWaiting = true;
                dispatch('create', WHITE);
            }}
        >
            <PieceImg color={WHITE} type={KING} />
        </button>
        <button
            type="button"
            on:click={() => {
                isWaiting = true;
                dispatch('create', Math.random() >= 0.5 ? BLACK : WHITE);
            }}
        >
            <div style="position: relative;">
                <div style="opacity:0">
                    <PieceImg color={WHITE} type={KING} />
                </div>
                <div style="position: absolute;left:0;top:0;width:50%;overflow: hidden;">
                    <PieceImg color={WHITE} type={KING} />
                </div>
                <div style="position: absolute;right:0;top:0;width:50%;transform: rotateY(180deg);overflow: hidden;">
                    <PieceImg color={BLACK} type={KING} />
                </div>
            </div>
        </button>
        <button
            type="button"
            on:click={() => {
                isWaiting = true;
                dispatch('create', BLACK);
            }}
        >
            <PieceImg color={BLACK} type={KING} />
        </button>
    </div>
    {#if isWaiting}
        <div style="margin-top: 1rem;">Waiting for the opponent to join . . .</div>
    {/if}
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
