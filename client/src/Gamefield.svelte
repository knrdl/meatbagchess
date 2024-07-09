<script lang="ts">
  import { type Square, type PieceSymbol } from 'chess.js';
  import audioclipMove from './lib/move.mp3';
  import Captures from './Captures.svelte';
  import Actions from './Actions.svelte';
  import Clock from './Clock.svelte';
  import GameOverScreen from './GameOverScreen.svelte';
  import { fade } from 'svelte/transition';
  import Board from './Board.svelte';
  import { game } from './game';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ 'new-game': void }>();

  const audioMove = new Audio(audioclipMove);

  function doMove({ from, to, promotion }: { from: Square; to: Square; promotion?: PieceSymbol }) {
    audioMove.play();
    $game.move({ from, to, promotion });
  }
</script>

{#if $game.status === 'playing'}
  <aside transition:fade>
    <Actions />
  </aside>
{/if}
<main>
  <article class="playfield">
    <section class="captures">
      <Captures capturedBy="them" />
    </section>
    <section class="clock">
      <Clock color={$game.theirColor} />
    </section>
    <section style="position: relative" class="board-container">
      <Board on:move={({ detail }) => doMove(detail)} />
      {#if $game.status !== 'playing'}
        <GameOverScreen on:click={() => dispatch('new-game')} />
      {/if}
    </section>
    <section class="clock">
      <Clock color={$game.ourColor} />
    </section>
    <section class="captures">
      <Captures capturedBy="us" />
    </section>
  </article>
</main>

<style>
  .playfield {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .playfield > .captures {
    max-width: 75%;
  }

  .board-container {
    width: min(100%, calc(100vh - 18rem));
    aspect-ratio: 1 / 1;
  }
</style>
