<script lang="ts">
    import { slide } from 'svelte/transition';
    import { game } from './game';
    import Loading from './Loading.svelte';
</script>

{#if $game.drawOfferBy === 'them'}
    <div transition:slide>
        <button type="button" class="green" on:click={() => $game.acceptDraw()}> accept draw </button>
        <button type="button" class="red" on:click={() => $game.rejectDraw()}> reject draw </button>
    </div>
{:else if $game.undoRequestBy === 'them'}
    <div transition:slide>
        <button type="button" class="green" on:click={() => $game.acceptUndo()}> accept undo </button>
        <button type="button" class="red" on:click={() => $game.rejectUndo()}> reject undo </button>
    </div>
{:else}
    <div transition:slide>
        <button type="button" on:click={() => $game.resign()}> resign </button>
        {#if $game.drawOfferBy === 'us'}
            <Loading />
        {:else}
            <button type="button" on:click={() => $game.offerDraw()}> draw </button>
        {/if}
        {#if $game.undoRequestBy === 'us'}
            <Loading />
        {:else}
            <button type="button" on:click={() => $game.requestUndo()}> undo </button>
        {/if}
    </div>
{/if}

<style>
    div {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1.5rem;
        flex-wrap: wrap;
    }

    button {
        text-transform: uppercase;
    }

    button.green {
        background: linear-gradient(45deg, green, rgba(144, 238, 144, 0.736));
    }
    button.red {
        background: linear-gradient(45deg, red, rgba(139, 0, 0, 0.841));
    }
</style>
