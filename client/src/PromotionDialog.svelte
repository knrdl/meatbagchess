<script lang="ts">
    import { type Color, type PieceSymbol, type Square, QUEEN, ROOK, BISHOP, KNIGHT } from 'chess.js'
    import PieceImg from './lib/chesspieces/PieceImg.svelte'

    let {
        color,
        onpromote,
    }: {
        color: Color
        onpromote: ({ type, target }: { type: PieceSymbol; target: Square }) => void
    } = $props()

    let dialog = $state<HTMLDialogElement>()

    const promotions: PieceSymbol[] = [QUEEN, ROOK, BISHOP, KNIGHT]

    let targetSquare = $state<Square>()

    export function show(target: Square) {
        dialog!.showModal()
        targetSquare = target
    }
</script>

<dialog bind:this={dialog} oncancel={e => e.preventDefault()}>
    <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 1.5rem">
        {#each promotions as type (type)}
            <button
                type="button"
                onclick={() => {
                    onpromote({ type, target: targetSquare! })
                    dialog!.close()
                }}
            >
                <PieceImg {color} {type} />
            </button>
        {/each}
    </div>
</dialog>
