<script lang="ts">
  import NewGameDialog from './NewGameDialog.svelte';
  import { onMount, tick } from 'svelte';
  import { io, Socket } from 'socket.io-client';
  import Gamefield from './Gamefield.svelte';
  import { Game, game } from './game';
  import { WHITE, type Color } from 'chess.js';

  let socket: Socket;

  let newGameDialog: NewGameDialog;
  let reload = false;

  onMount(() => {
    if (gameId?.length !== 36) {
      const params = new URLSearchParams(window.location.search);
      params.set('gameid', window.crypto.randomUUID());
      window.location.search = params.toString();
    } else {
      socket = io({ query: { gameId } });
      $game = new Game(WHITE, socket); // show an empty game as background of the new game dialog

      socket.on('continue-game', ({ fen, yourColor }: { fen: string; yourColor: Color }) => {
        newGameDialog.close();
        $game?.stop();
        $game = new Game(yourColor, socket);
        $game.chess.load(fen);
        $game = $game;
      });

      newGameDialog.show();

      socket.on('start-game', ({ yourColor }) => {
        newGameDialog.close();
        reload = true;
        $game?.stop();
        tick().then(() => {
          $game = new Game(yourColor, socket);
          reload = false;
        });
      });
    }
  });

  $: gameId = new URLSearchParams(window?.location?.search)?.get('gameid');

  function newGame() {
    newGameDialog.show();
  }
</script>

<NewGameDialog
  bind:this={newGameDialog}
  on:create={({ detail }) => {
    socket.emit('prepare-game', { myColor: detail });
  }}
/>
{#if $game && !reload}
  <Gamefield on:new-game={newGame} />
{/if}
