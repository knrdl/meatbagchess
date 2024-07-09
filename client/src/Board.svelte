<script lang="ts">
    import { KING, type PieceSymbol, type Square } from 'chess.js';
    import { getPieceImage } from './lib/chesspieces';
    import PromotionDialog from './PromotionDialog.svelte';
    import { createEventDispatcher } from 'svelte';
    import { game } from './game';

    const dispatch = createEventDispatcher<{ move: { from: Square; to: Square; promotion?: PieceSymbol } }>();

    const files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8];

    let promotionDialog: PromotionDialog;

    let selectedPiece: {
        square: Square;
        possibleMoves: Square[];
    } | null = null;

    let lastMove: { from: Square; to: Square } | null = null;

    function getSquareInfo(x: number, y: number, ...rest: any[]) {
        const rank = $game.ourColor === 'w' ? ranks[7 - y] : ranks[y];
        const file = $game.ourColor === 'w' ? files[x] : files[7 - x];
        const square = (file.toLowerCase() + rank.toString()) as Square;
        const piece = $game.chess.get(square);
        return { rank, file, square, piece };
    }

    function selectSquare(square: Square) {
        const piece = $game.chess.get(square);

        if (selectedPiece?.square === square) {
            selectedPiece = null;
        } else if (piece.color === $game.ourColor) {
            selectedPiece = {
                square,
                possibleMoves: $game.chess.moves({ square, verbose: true }).map((move) => move.to),
            };
        } else if (selectedPiece?.possibleMoves.includes(square)) {
            const isPromotion = $game.chess
                .moves({ square: selectedPiece.square, verbose: true })
                .filter((move) => move.to === square)
                .some((move) => move.promotion);

            if (isPromotion) promotionDialog.show(square);
            else {
                const move = { from: selectedPiece!.square, to: square };
                dispatch('move', move);
                lastMove = move;
                selectedPiece = null;
            }
        } else if (selectedPiece) {
            selectedPiece = null;
        }
    }

    function handlePromotion({ type, target }: { type: PieceSymbol; target: Square }) {
        dispatch('move', { from: selectedPiece!.square, to: target, promotion: type });
        selectedPiece = null;
    }
</script>

<PromotionDialog bind:this={promotionDialog} color={$game.ourColor} on:promote={({ detail }) => handlePromotion(detail)} />

<div class="board">
    {#each [0, 1, 2, 3, 4, 5, 6, 7] as y}
        {#each [0, 1, 2, 3, 4, 5, 6, 7] as x}
            {@const { rank, file, square, piece } = getSquareInfo(x, y, $game)}
            {@const isSelected = selectedPiece?.square === square}
            {@const isSelectable = piece?.color === $game.ourColor || selectedPiece?.possibleMoves.includes(square)}
            {@const isCheck =
                piece.type === KING &&
                $game.chess.isCheck() &&
                (($game.chess.turn() === $game.ourColor && piece.color === $game.ourColor) || ($game.chess.turn() !== $game.ourColor && piece.color !== $game.ourColor))}
            <button
                type="button"
                class="square {$game.chess.squareColor(square)}"
                class:check={isCheck}
                class:last-move={lastMove?.from === square || lastMove?.to === square}
                class:selected={isSelected}
                class:selectable={isSelectable}
                style={piece ? `background-image: url('${getPieceImage(piece)}')` : 'background-image: none'}
                on:click={() => selectSquare(square)}
            >
                {#if x === 0}
                    <div style="position: absolute; left:.1rem;top:-.1rem">
                        {rank}
                    </div>
                {/if}
                {#if y === 7}
                    <div style="position: absolute; right:.1rem;bottom:-.1rem">
                        {file}
                    </div>
                {/if}
                {#if selectedPiece?.possibleMoves.includes(square)}
                    <div class="move-target"></div>
                {/if}
            </button>
        {/each}
    {/each}
</div>

<style>
    .board {
        width: 100%;
        height: 100%;
        display: grid;
        gap: 0.125rem;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        text-align: left;
    }

    .board > .square {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        transition: background-image 2s ease-in-out;

        position: relative;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .board > .square.dark {
        background-color: #a57a60;
    }

    .board > .square.light {
        background-color: #d6b18b;
    }

    .board > .square > .move-target {
        border-radius: 100%;
        width: 2rem;
        height: 2rem;
        background-color: rgba(100, 83, 108, 0.66);
        filter: drop-shadow(0 0 2em rgba(100, 108, 255, 0.667));
    }

    .board > .square.selected {
        box-shadow: inset 0 0 20px #f8a100cc;
    }

    .board > .square:not(.selectable) {
        border-color: transparent !important;
    }

    .board > .square.check {
        box-shadow: inset 0 0 20px red;
    }

    .board > .square.last-move {
        box-shadow: inset 0 0 20px #0007;
    }

    @media screen and (max-width: 500px) {
        .board {
            gap: 0.1rem;
        }

        .board > .square {
            background-size: 125%;
        }

        .board > .square > .move-target {
            width: 1rem;
            height: 1rem;
        }
    }
</style>
