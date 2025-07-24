<div style="margin-left:1.5rem;margin-right:1.5rem">
    <span class="loader"></span>
</div>

<style>
    .loader {
        width: 8px;
        height: 40px;
        display: block;
        margin: auto;
        left: -40px;
        position: relative;
        border-radius: 4px;
        box-sizing: border-box;
        animation: animloader 1s linear infinite alternate;
    }

    @media (prefers-color-scheme: dark) {
        @keyframes animloader {
            0% {
                box-shadow:
                    20px 0 rgb(255 255 255 / 25%),
                    40px 0 white,
                    60px 0 white;
            }

            50% {
                box-shadow:
                    20px 0 white,
                    40px 0 rgb(255 255 255 / 25%),
                    60px 0 white;
            }

            100% {
                box-shadow:
                    20px 0 white,
                    40px 0 white,
                    60px 0 rgb(255 255 255 / 25%);
            }
        }
    }

    @media (prefers-color-scheme: light) {
        @keyframes animloader {
            0% {
                box-shadow:
                    20px 0 black,
                    40px 0 rgb(128 128 128 / 25%),
                    60px 0 rgb(128 128 128 / 25%);
            }

            50% {
                box-shadow:
                    20px 0 rgb(128 128 128 / 25%),
                    40px 0 black,
                    60px 0 rgb(128 128 128 / 25%);
            }

            100% {
                box-shadow:
                    20px 0 rgb(128 128 128 / 25%),
                    40px 0 rgb(128 128 128 / 25%),
                    60px 0 black;
            }
        }
    }
</style>
