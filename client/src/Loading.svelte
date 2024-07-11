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

    @keyframes animloader {
        0% {
            box-shadow:
                20px 0 rgba(255, 255, 255, 0.25),
                40px 0 white,
                60px 0 white;
        }
        50% {
            box-shadow:
                20px 0 white,
                40px 0 rgba(255, 255, 255, 0.25),
                60px 0 white;
        }
        100% {
            box-shadow:
                20px 0 white,
                40px 0 white,
                60px 0 rgba(255, 255, 255, 0.25);
        }
    }
</style>
