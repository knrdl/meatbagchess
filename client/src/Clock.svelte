<script lang="ts">
    import type { Color } from 'chess.js';

    export let color: Color;

    function formatTime(seconds: number) {
        const h = Math.floor(seconds / 60 / 60);
        const m = Math.floor((seconds / 60) % 60);
        const s = Math.floor(seconds % 60);
        return (h > 0 ? [h, m, s] : [m, s]).join(':').replace(/\b(\d)\b/g, '0$1');
    }

    let elapsedTime = 0;
</script>

<div>
    {#if elapsedTime > 0}
        {formatTime(elapsedTime)}
        {color}
    {/if}
</div>

<style>
    div {
        font-family: 'Orbitron';
        letter-spacing: 0.125rem;
        font-size: large;
    }
</style>
