/* eslint-disable */

module.exports = {
    extends: [
        'stylelint-config-prettier',
        'stylelint-config-recommended',
        'stylelint-config-standard-scss',
    ],
    plugins: [
        'stylelint-scss', // SCSS plugin for additional SCSS rules
        'stylelint-order', // Plugin for ordering properties
    ],
    ignoreFiles: [
        '**/build/**', // Ignored artifacts
        '**/*.html', // Ignore all HTML files
        'package-lock.json', // Ignore package-lock
        '**/node_modules/**', // Commonly ignored directories
        '**/dist/**', // Distribution files
        '**/public/**', // Publicly accessible files
        '**/assets/**', // Asset files
        '**/*.js',
        '**/*.ts',
        '**/*.json',
        '**/storefront/src/main.css', // Ignore compiled main.css
        '**/storefront/src/scss/vendor/**', // Ignore vendor files
    ],
    rules: {
        'no-empty-source': null, // Allow empty source files
        'selector-class-pattern': '^.*$', // BEM naming convention
        'annotation-no-unknown': null, // Allow unknown annotations
        'scss/at-mixin-pattern': '^([A-Z][a-zA-Z]*|[a-z]+([A-Z][a-z]+)*)$', // camelCase and PascalCase for mixins
        'max-line-length': 200, // Maximum line length
        'keyframes-name-pattern': '^([A-Z][a-zA-Z]*|[a-z]+([A-Z][a-z]+)*)$', // camelCase and PascalCase for keyframes
        'color-no-invalid-hex': true, // Disallow invalid hex colors
        'declaration-colon-space-after': 'always', // Require space after colon in declarations
        'block-no-empty': true, // Disallow empty blocks
        'max-nesting-depth': 5, // Maximum nesting depth
        indentation: 2, // 2-space indentation
        'order/order': [
            'custom-properties', // Custom properties first
            'declarations', // Then declarations
        ],
        'order/properties-order': [
            'width', // Specific order for properties
            'height',
            // Add more properties if needed
        ],
        'scss/at-extend-no-missing-placeholder': null, // Rule disabled
        'scss/no-global-function-names': null, // Rule disabled as Shopware does not use global functions
        'no-descending-specificity': null, // disalbes no descending specificy
        'selector-id-pattern': null, // disables id selector pattern rule
    },
    overrides: [
        {
            files: ['**/*.scss'], // Override rules for SCSS files
            customSyntax: 'postcss-scss', // Use SCSS syntax
        },
        {
            files: ['**/*.vue', '**/*.html.twig'], // Override rules for Vue and Twig files
            customSyntax: 'postcss-html', // Use HTML syntax
            rules: {
                'block-no-empty': true, // Disallow empty blocks in Vue and Twig files
                'max-nesting-depth': 2, // Maximum nesting depth
            },
        },
    ],
};
