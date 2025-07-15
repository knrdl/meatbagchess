<script lang="ts">
    import { BLACK, KING, WHITE, type Color } from 'chess.js';
    import PieceImg from './lib/chesspieces/PieceImg.svelte';
    import shareImg from './lib/share.png';
    import { scale, slide } from 'svelte/transition';
    import { texts } from './i18n.svelte';

    let { onselect }: { onselect: (color: Color) => void } = $props();

    let dialog = $state<HTMLDialogElement>();

    let selectedColor = $state<typeof BLACK | typeof WHITE | null>(null);

    export function show() {
        selectedColor = null;
        dialog!.showModal();
    }

    export function close() {
        dialog!.close();
    }
</script>

<dialog bind:this={dialog} oncancel={(e) => e.preventDefault()} class="glass3d">
    <!-- prevent focus on open -->
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button type="button" style="opacity: 0; width: 0; height: 0; margin: 0; padding: 0; border: none"></button>
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
        <h2 style="font-size: xx-large;">{texts.newGame}</h2>
        {#if navigator.share}
            <button
                type="button"
                onclick={() => {
                    navigator.share({ url: window.location.toString() });
                }}
            >
                <img src={shareImg} alt="Share" class="share" />
            </button>
        {/if}
    </div>
    {#if !selectedColor}
        <div
            style="
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        align-items: center;"
            in:slide
        >
            <button
                type="button"
                onclick={() => {
                    selectedColor = WHITE;
                    onselect(WHITE);
                }}
            >
                <PieceImg color={WHITE} type={KING} />
            </button>
            <button
                type="button"
                onclick={() => {
                    selectedColor = Math.random() >= 0.5 ? BLACK : WHITE;
                    onselect(selectedColor);
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
                onclick={() => {
                    selectedColor = BLACK;
                    onselect(BLACK);
                }}
            >
                <PieceImg color={BLACK} type={KING} />
            </button>
        </div>
    {:else}
        <div in:scale={{ duration: 1250 }}><PieceImg color={selectedColor} type={KING} /></div>
        <div style="margin-top: 1rem;">{texts.waitingForOpponent} . . .</div>
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
