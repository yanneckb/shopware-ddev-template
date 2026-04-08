const path = require('path');
const globals = require('globals');
const eslintConfigPrettier = require('eslint-config-prettier');
const eslintPluginPrettier = require('eslint-plugin-prettier');
const eslintPluginInclusiveLanguage = require('eslint-plugin-inclusive-language');
const eslintPluginPromise = require('eslint-plugin-promise');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptEslintParser = require('@typescript-eslint/parser');
const eslintPluginImport = require('eslint-plugin-import');

const appGlob = 'custom/static-plugins/**/src/Resources/app/**/*.{js,ts}';
const tsGlob = 'custom/static-plugins/**/src/Resources/app/**/*.ts';

const tsconfigPath = path.join(__dirname, 'tsconfig.eslint.json');

module.exports = [
    {
        files: [appGlob],
        ignores: [
            '**/build/**',
            '**/*.html',
            'package-lock.json',
            '**/node_modules/**',
            '**/dist/**',
            '**/public/**',
            '**/assets/**',
        ],
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                bootstrap: 'readonly',
            },
            parser: typescriptEslintParser,
        },
        plugins: {
            prettier: eslintPluginPrettier,
            'inclusive-language': eslintPluginInclusiveLanguage,
            promise: eslintPluginPromise,
            '@typescript-eslint': typescriptEslintPlugin,
            import: eslintPluginImport,
        },
        rules: {
            'no-console': [
                'warn',
                { allow: ['info', 'warn', 'error', 'debug'] },
            ],
            'no-debugger': 'warn',
            'inclusive-language/use-inclusive-words': 'warn',
            'import/no-unresolved': [2, { ignore: [''] }],
            'class-methods-use-this': 'off',
            'import/extensions': [
                'error',
                'ignorePackages',
                { '': 'never', js: 'never' },
            ],
            'no-param-reassign': [2, { props: false }],
            'no-use-before-define': [
                'error',
                {
                    functions: false,
                    classes: true,
                    variables: true,
                    allowNamedExports: false,
                },
            ],
        },
    },
    {
        files: [tsGlob],
        ignores: ['**/build/**', '**/node_modules/**', '**/dist/**'],
        languageOptions: {
            parserOptions: {
                project: tsconfigPath,
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            '@typescript-eslint/consistent-type-exports': 'error',
            '@typescript-eslint/consistent-type-imports': 'error',
        },
    },
    eslintConfigPrettier,
];
