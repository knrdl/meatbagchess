<script lang="ts">
    import type { Color } from 'chess.js';
    import { game } from './game';
    import { slide } from 'svelte/transition';

    export let color: Color;

    let handle: number | null = null;

    function formatTime(seconds: number) {
        const h = Math.floor(seconds / 60 / 60);
        const m = Math.floor((seconds / 60) % 60);
        const s = Math.floor(seconds % 60);
        return (h > 0 ? [h, m, s] : [m, s]).join(':').replace(/\b(\d)\b/g, '0$1');
    }

    $: elapsedTime = $game.elapsedTime[color];

    $: if (elapsedTime !== null && handle === null) {
        handle = setInterval(() => {
            if ($game.status !== 'playing' && handle !== null) {
                clearInterval(handle);
                handle = null;
            } else if ($game.chess.turn() === color) {
                elapsedTime!++;
            }
        }, 1000);
    }
</script>

{#if elapsedTime !== null}
    <div transition:slide>
        {formatTime(elapsedTime)}
    </div>
{:else}
    <div style="visibility: hidden;" aria-hidden="true">XX:XX</div>
{/if}

<style>
    div {
        font-family: 'Orbitron';
        letter-spacing: 0.125rem;
        font-size: large;
        min-width: 5rem;
    }
</style>
