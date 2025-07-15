import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
    plugins: [svelte()],
    server: {
        proxy: {
            '/socket.io/': {
                target: 'http://server:8000',
                changeOrigin: true,
                ws: true,
            },
        },
    },
})
