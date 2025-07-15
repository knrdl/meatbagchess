<script lang="ts">
    import type { Color } from 'chess.js'
    import game from './game.svelte'
    import { slide } from 'svelte/transition'
    import { texts } from './i18n.svelte'

    let { color }: { color: Color } = $props()
</script>

{#if (game.undos?.[color] || 0) > 0}
    {#key game.undos![color]}
        <div transition:slide>
            {game.undos![color]}x&nbsp;{texts.undoCount}
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
