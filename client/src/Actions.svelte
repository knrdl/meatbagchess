<script lang="ts">
    import { slide } from 'svelte/transition';
    import { game } from './game';
    import beep from './lib/beep.wav';

    const audioMove = new Audio(beep);
    audioMove.playbackRate = 0.3;
    audioMove.volume = 0.5;

    $: if ($game.hasDrawOffer || $game.hasUndoRequest) {
        audioMove.play();
    }
</script>

{#if $game.hasDrawOffer}
    <div transition:slide>
        <button type="button" class="green" on:click={() => $game.acceptDraw()}> accept draw </button>
        <button type="button" class="red" on:click={() => $game.rejectDraw()}> reject draw </button>
    </div>
{:else if $game.hasUndoRequest}
    <div transition:slide>
        <button type="button" class="green" on:click={() => $game.acceptUndo()}> accept undo </button>
        <button type="button" class="red" on:click={() => $game.rejectUndo()}> reject undo </button>
    </div>
{:else}
    <div transition:slide>
        <button type="button" on:click={() => $game.resign()}> resign </button>
        <button type="button" on:click={() => $game.offerDraw()}> draw </button>
        <button type="button" on:click={() => $game.requestUndo()}> undo </button>
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
