<script lang="ts">
  import NewGameDialog from './NewGameDialog.svelte';
  import { onMount } from 'svelte';
  import { io, Socket } from 'socket.io-client';
  import Gamefield from './Gamefield.svelte';
  import { Game, game } from './game';

  let socket: Socket;

  let newGameDialog: NewGameDialog;

  onMount(() => {
    if (gameId?.length !== 36) {
      const params = new URLSearchParams(window.location.search);
      params.set('gameid', window.crypto.randomUUID());
      window.location.search = params.toString();
    } else {
      socket = io({ query: { gameId } });

      newGameDialog.show();

      socket.on('start-game', ({ yourColor }) => {
        newGameDialog.close();
        $game = new Game(yourColor, socket);
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
{#if $game}
  <Gamefield on:new-game={newGame} />
{/if}
