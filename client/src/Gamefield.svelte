<script lang="ts">
    import Captures from './Captures.svelte'
    import Actions from './Actions.svelte'
    import Clock from './Clock.svelte'
    import GameOverScreen from './GameOverScreen.svelte'
    import { fade } from 'svelte/transition'
    import game from './game.svelte'
    import Board from './Board.svelte'
    import UndoCounter from './UndoCounter.svelte'

    let { onnewgame }: { onnewgame?: () => void } = $props()
</script>

{#if game.isPlaying}
    <aside transition:fade style="margin-bottom: .5rem;">
        <Actions />
    </aside>
{/if}

<main>
    <article class="playfield">
        <section style="grid-area: their-captures">
            <Captures capturedBy="them" />
        </section>
        <section style="grid-area: their-clock">
            <Clock color={game.theirColor} />
            <UndoCounter color={game.theirColor} />
        </section>
        <section style="grid-area: board" class="board-container">
            <Board />
            {#if !game.isPlaying}
                <GameOverScreen onclick={() => onnewgame?.()} />
            {/if}
        </section>
        <section style="grid-area: our-clock">
            <Clock color={game.ourColor} />
            <UndoCounter color={game.ourColor} />
        </section>
        <section style="grid-area: our-captures">
            <Captures capturedBy="us" />
        </section>
    </article>
</main>

<style>
    .playfield {
        display: grid;
        grid-template:
            'their-captures'
            'their-clock'
            'board' max-content
            'our-clock'
            'our-captures'
            / auto;
        justify-content: center;
        align-content: center;
    }

    .playfield > * {
        justify-self: center;
    }

    .board-container {
        position: relative;
        aspect-ratio: 1 / 1;
    }

    @media (orientation: portrait) {
        .board-container {
            width: min(100vw, calc(100vh - 18rem));
        }
    }

    @media (orientation: landscape) {
        .playfield {
            grid-template:
                'board . their-clock'
                'board . their-captures'
                'board . .' max-content
                'board . our-clock'
                'board . our-captures'
                / auto 1rem min-content;
        }
        .board-container {
            width: 100%;
            height: calc(100vh - 6rem);
        }
    }
</style>
