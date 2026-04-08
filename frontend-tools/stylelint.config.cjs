/** Stylelint 16+: stylistic rules like indentation / max-line-length were removed from core (use Prettier). */
module.exports = {
    extends: ['stylelint-config-standard-scss'],
    plugins: ['stylelint-scss', 'stylelint-order'],
    ignoreFiles: [
        '**/build/**',
        '**/*.html',
        'package-lock.json',
        '**/node_modules/**',
        '**/dist/**',
        '**/public/**',
        '**/assets/**',
        '**/*.js',
        '**/*.ts',
        '**/*.json',
        '**/storefront/src/main.css',
        '**/storefront/src/scss/vendor/**',
        '**/storefront/src/scss/vendor/**/*',
    ],
    rules: {
        'no-empty-source': null,
        'selector-class-pattern': '^.*$',
        'annotation-no-unknown': null,
        'scss/at-mixin-pattern': null,
        'keyframes-name-pattern':
            '^([A-Z][a-zA-Z]*|[a-z]+([A-Z][a-z]+)*)$',
        'color-no-invalid-hex': true,
        'block-no-empty': true,
        'media-feature-range-notation': 'prefix',
        'max-nesting-depth': 7,
        'order/order': ['custom-properties', 'declarations'],
        'order/properties-order': ['width', 'height'],
        'scss/at-extend-no-missing-placeholder': null,
        'scss/no-global-function-names': null,
        'no-descending-specificity': null,
        'selector-id-pattern': null,
    },
    overrides: [
        {
            files: ['**/*.scss'],
            customSyntax: 'postcss-scss',
        },
        {
            files: ['**/*.vue', '**/*.html.twig'],
            customSyntax: 'postcss-html',
            rules: {
                'block-no-empty': true,
                'max-nesting-depth': 2,
            },
        },
    ],
};
