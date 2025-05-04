<script lang="ts">
    import type { Color } from 'chess.js';
    import { game } from './game';
    import { slide } from 'svelte/transition';

    export let color: Color;
</script>

{#if $game.undos && $game.undos[color] > 0}
    {#key $game.undos[color]}
        <div transition:slide>
            {$game.undos[color]}x&nbsp;undo
        </div>
    {/key}
{/if}

<style>
    div {
        font-family: 'Orbitron';
        letter-spacing: 0.125rem;
        font-size: large;
        min-width: 5rem;
    }
</style>
