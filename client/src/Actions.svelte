<script lang="ts">
    import { slide } from 'svelte/transition';
    import game from './game.svelte';
    import Loading from './Loading.svelte';
    import { texts } from './i18n.svelte';
</script>

{#if game.theyOfferDraw}
    <div transition:slide>
        <button type="button" class="accept" onclick={() => game.acceptDraw()}> {texts.acceptDraw} </button>
        <button type="button" class="reject" onclick={() => game.rejectDraw()}> {texts.rejectDraw} </button>
    </div>
{:else if game.theyRequestUndo}
    <div transition:slide>
        <button type="button" class="accept" onclick={() => game.acceptUndo()}> {texts.acceptUndo} </button>
        <button type="button" class="reject" onclick={() => game.rejectUndo()}> {texts.rejectUndo} </button>
    </div>
{:else}
    <div transition:slide>
        <button type="button" onclick={() => game.resign()}> {texts.resign} </button>
        {#if game.weOfferDraw}
            <Loading />
        {:else}
            <button type="button" onclick={() => game.offerDraw()}> {texts.draw} </button>
        {/if}
        {#if game.weRequestUndo}
            <Loading />
        {:else if game.ourLastMove}
            <button type="button" onclick={() => game.requestUndo()}> {texts.undo} </button>
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
        color: white;
        background: linear-gradient(45deg, darkgray, rgba(144, 144, 144, 0.936));
    }

    button.accept {
        background: linear-gradient(45deg, green, rgba(144, 238, 144, 0.936));
    }
    button.reject {
        background: linear-gradient(45deg, red, rgba(139, 0, 0, 0.841));
    }
</style>
