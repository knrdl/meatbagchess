<script lang="ts">
    import { KING, WHITE, type PieceSymbol, type Square } from 'chess.js';
    import { getPieceImage } from './lib/chesspieces';
    import PromotionDialog from './PromotionDialog.svelte';
    import game from './game.svelte';
    import PieceAnimation from './lib/chesspieces/PieceAnimation.svelte';
    import { onDestroy, onMount } from 'svelte';

    const files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8];

    let forceUpdate = $state(Date.now());

    let promotionDialog = $state<PromotionDialog>();

    let selectedPiece: {
        square: Square;
        possibleMoves: Square[];
    } | null = $state(null);

    let squares: Partial<Record<Square, HTMLButtonElement>> = $state({});

    let pieceAnimation = $state<PieceAnimation>();

    onMount(() => {
        game.onMove(onMove);
    });

    onDestroy(() => {
        game.offMove(onMove);
    });

    function onMove() {
        forceUpdate = Date.now();
        if (game.currentTurn === game.ourColor) {
            // update possible moves
            if (selectedPiece && game.getSquarePiece(selectedPiece.square)?.color === game.ourColor) setSelectedPiece(selectedPiece.square);
            else selectedPiece = null;
            if (game.theirLastMove) pieceAnimation?.animate(game.theirLastMove);
        } else {
            if (game.ourLastMove) pieceAnimation?.animate(game.ourLastMove);
        }
    }

    function getSquareInfo(x: number, y: number, ..._rest: unknown[]) {
        const rank = game.ourColor === WHITE ? ranks[7 - y] : ranks[y];
        const file = game.ourColor === WHITE ? files[x] : files[7 - x];
        const square = (file.toLowerCase() + rank.toString()) as Square;
        const piece = game.getSquarePiece(square);
        return { rank, file, square, piece };
    }

    function setSelectedPiece(square: Square) {
        selectedPiece = { square, possibleMoves: game.getPossibleMoves(square) };
    }

    function selectSquare(square: Square) {
        if (selectedPiece?.square === square) {
            selectedPiece = null;
        } else if (game.getSquarePiece(square)?.color === game.ourColor) {
            setSelectedPiece(square);
        } else if (game.currentTurn === game.ourColor && selectedPiece?.possibleMoves.includes(square)) {
            if (game.isMovePromotion({ from: selectedPiece.square, to: square })) promotionDialog?.show(square);
            else {
                game.move({ from: selectedPiece!.square, to: square });
                selectedPiece = null;
            }
        } else if (selectedPiece) {
            selectedPiece = null;
        }
    }

    function handlePromotion({ type, target }: { type: PieceSymbol; target: Square }) {
        const move = { from: selectedPiece!.square, to: target };
        game.move({ ...move, promotion: type });
        selectedPiece = null;
    }
</script>

<PromotionDialog bind:this={promotionDialog} color={game.ourColor} onpromote={(detail) => handlePromotion(detail)} />

<PieceAnimation bind:this={pieceAnimation} {squares} />

<div class="board">
    {#each [0, 1, 2, 3, 4, 5, 6, 7] as y (y)}
        {#each [0, 1, 2, 3, 4, 5, 6, 7] as x (x)}
            {@const { rank, file, square, piece } = getSquareInfo(x, y, forceUpdate)}
            {@const isSelected = selectedPiece?.square === square}
            {@const isSelectable = piece?.color === game.ourColor || selectedPiece?.possibleMoves.includes(square)}
            {@const isCheck =
                piece?.type === KING &&
                game.isCheck() &&
                ((game.currentTurn === game.ourColor && piece.color === game.ourColor) || (game.currentTurn !== game.ourColor && piece.color !== game.ourColor))}
            {@const isLastMove = game.ourLastMove?.from === square || game.ourLastMove?.to === square || game.theirLastMove?.from === square || game.theirLastMove?.to === square}
            <button
                bind:this={squares[square]}
                type="button"
                class="
            square {game.getSquareColor(square) || ''}
            {isSelectable ? 'selectable' : ''}
            {isSelected ? 'selected' : ''}
            {!isSelected && isCheck ? 'check' : ''}
            {!isSelected && !isCheck && isLastMove ? 'last-move' : ''}
            "
                style={piece && pieceAnimation?.lastMove?.to !== square ? `background-image: url('${getPieceImage(piece)}')` : 'background-image: none'}
                onclick={() => selectSquare(square)}
            >
                {#if x === 0}
                    <div style="position: absolute; left:.1rem;top:-.1rem" class="text-border">
                        {rank}
                    </div>
                {/if}
                {#if y === 7}
                    <div style="position: absolute; right:.1rem;bottom:-.1rem" class="text-border">
                        {file}
                    </div>
                {/if}
                {#if selectedPiece?.possibleMoves.includes(square)}
                    <div class="move-target {game.currentTurn === game.ourColor ? 'our-turn' : 'their-turn'} {piece?.color === game.theirColor ? 'attack' : ''}"></div>
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
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(8, 1fr);
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
        padding: 0;
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
    }

    .board > .square > .move-target.our-turn {
        box-shadow: 0px 0px 10px rgba(162, 30, 135, 0.5);
        background-color: rgba(162, 30, 135, 0.5);
    }

    .board > .square > .move-target.our-turn.attack {
        box-shadow: 0px 0px 10px rgba(255, 70, 9, 0.667);
        background-color: rgba(255, 70, 9, 0.8);
    }

    .board > .square > .move-target.their-turn {
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.667);
    }

    .board > .square > .move-target.their-turn.attack {
        border: 1px solid #0007;
        background-color: rgba(250, 100, 100, 0.75);
    }

    .board > .square.selected {
        box-shadow: inset 0 0 20px #f8a100cc;
        background-size: 110%;
    }

    .board > .square:not(.selectable) {
        border-color: transparent !important;
    }

    .board > .square.check {
        box-shadow: inset 0 0 20px red;
    }

    .board > .square.last-move {
        box-shadow: inset 0 0 25px #000a;
        transition: box-shadow 500ms linear;
    }

    .text-border {
        text-shadow:
            -1px 0 black,
            0 1px black,
            1px 0 black,
            0 -1px black;
    }

    @media screen and (max-width: 500px) {
        .board {
            gap: 0;
        }

        .board > .square {
            background-size: 120%;
            border-radius: 0;
            border: none;
        }

        .board > .square > .move-target {
            width: 1rem;
            height: 1rem;
        }
    }
</style>
