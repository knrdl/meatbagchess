/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
export default {
    plugins: ['prettier-plugin-svelte'],
    overrides: [
        {
            files: '*.svelte',
            options: {
                parser: 'svelte',
            },
        },
    ],

    semi: false,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'es5',
    printWidth: 180,
    arrowParens: 'avoid',
}
