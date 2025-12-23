<script lang="ts">
    let { onclick } = $props()
    import game from './game.svelte'
</script>

<button type="button" class="gameover shadow {game.isWon ? 'green' : ''} {game.isDraw ? 'yellow' : ''} {game.isLost ? 'red' : ''}" {onclick}>
    {game.translatedGameResult}
</button>

<style>
    .gameover {
        width: 100%;
        position: absolute;
        inset: 0;
        text-align: center;
        border: none;
        margin: 0;
        padding: 0.5rem;
        overflow-wrap: break-word;
        color: white;

        /* stay in background */
        transform: none !important;
        background-color: transparent !important;
        font-size: 3rem;
        letter-spacing: 1rem;
    }

    .red {
        background: linear-gradient(0deg, #f009, #c00a, #f039);
    }

    .yellow {
        background: linear-gradient(50deg, #ef09, #a3cc00aa, #ffe60099);
    }

    .green {
        background: linear-gradient(50deg, #37ff00aa, #0dff00aa, #0dff00aa);
    }

    .shadow::before,
    .shadow::after {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        width: calc(100% + 4px);
        height: calc(100% + 4px);
        background: linear-gradient(45deg, #fb0094cc, #00fc, #0f0c, #ff0, #f00c, #fb0094cc, #00fc, #0f0c, #ff0c, #f00c);
        background-size: 400%;
        z-index: -1;
        animation: shadow 20s linear infinite;
        border-radius: 8px;
    }

    .shadow::after {
        top: -8px;
        left: -8px;
        width: calc(100% + 16px);
        height: calc(100% + 16px);
        filter: blur(24px);
        opacity: 0.9;
    }

    @keyframes shadow {
        0% {
            background-position: 0 0;
        }

        50.01% {
            background-position: 200% 0;
        }

        100% {
            background-position: 0 0;
        }
    }

    @media screen and (width <= 500px) {
        .shadow,
        .shadow::before,
        .shadow::after {
            border-radius: 0;
        }
    }
</style>
