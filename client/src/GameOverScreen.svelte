<script lang="ts">
    import { fade } from 'svelte/transition';
    import { game } from './game';
</script>

<button
    type="button"
    class="gameover shadow"
    class:green={$game.status === $game.ourColorLong + ' wins' || $game.status === $game.theirColorLong + ' resigns'}
    class:red={$game.status === $game.theirColorLong + ' wins' || $game.status === $game.ourColorLong + ' resigns'}
    class:yellow={$game.status.startsWith('draw')}
    transition:fade
    on:click
>
    {$game.status}
</button>

<style>
    .gameover {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        text-align: center;
        border: none;
        margin: 0;
        padding: 0.5rem;
        word-wrap: break-word;

        font-size: 3rem;
        letter-spacing: 1rem;
    }

    .red {
        background: linear-gradient(0deg, #ff000099, #cc0000aa, #ff003399);
    }
    .yellow {
        background: linear-gradient(50deg, #eeff0099, #a3cc00aa, #ffe60099);
    }
    .green {
        background: linear-gradient(50deg, #37ff00aa, #0dff00aa, #0dff00aa);
    }

    /* .shadow {
        position: relative;
    } */

    .shadow:before,
    .shadow:after {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        width: calc(100% + 4px);
        height: calc(100% + 4px);
        background: linear-gradient(45deg, #fb0094cc, #0000ffcc, #00ff00cc, #ffff00, #ff0000cc, #fb0094cc, #0000ffcc, #00ff00cc, #ffff00cc, #ff0000cc);
        background-size: 400%;
        z-index: -1;
        animation: shadow 20s linear infinite;
        border-radius: 8px;
    }

    .shadow:after {
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

    @media screen and (max-width: 500px) {
        .shadow,
        .shadow:before,
        .shadow:after {
            border-radius: 0;
        }
    }
</style>
