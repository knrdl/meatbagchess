<script lang="ts">
    import { onMount, tick } from 'svelte'
    import NewGameDialog from './NewGameDialog.svelte'

    import game from './game.svelte'
    import Gamefield from './Gamefield.svelte'
    import FabSetStyle from './FabSetStyle.svelte'
    import { SvelteURLSearchParams } from 'svelte/reactivity'

    let newGameDialog = $state<NewGameDialog>()
    let reload = $state(false)

    let gameId = $derived(new URLSearchParams(window?.location?.search)?.get('gameid'))

    onMount(async () => {
        if (gameId?.length !== 36) {
            const params = new SvelteURLSearchParams(window.location.search)
            params.set('gameid', window.crypto.randomUUID())
            window.location.search = params.toString()
        } else {
            startNewGame()
        }
    })

    async function startNewGame() {
        newGameDialog!.show()
        reload = true
        game.init(gameId!, () => newGameDialog!.close())
        await tick()
        reload = false
    }
</script>

<NewGameDialog bind:this={newGameDialog} onselect={myColor => game.selectColor(myColor)} />

{#if !reload}
    <Gamefield onnewgame={() => startNewGame()} />
{/if}

<FabSetStyle />
