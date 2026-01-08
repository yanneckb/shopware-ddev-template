/* eslint-disable */

const eslintPluginPrettier = require('eslint-plugin-prettier');
const eslintPluginInclusiveLanguage = require('eslint-plugin-inclusive-language');
const eslintPluginPromise = require('eslint-plugin-promise');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptEslintParser = require('@typescript-eslint/parser');
const eslintPluginNode = require('eslint-plugin-node');
const eslintPluginImport = require('eslint-plugin-import'); // Import plugin

module.exports = [
    // Main ESLint configuration for JavaScript and TypeScript
    {
        files: ['src/Resources/app/**/*.js', 'src/Resources/app/**/*.ts'], // Specify the files to lint
        ignores: [
            '**/build/**', // Ignored artifacts
            '**/*.html', // Ignore all HTML files
            'package-lock.json', // Ignore package-lock
            '**/node_modules/**', // Commonly ignored directories
            '**/dist/**', // Distribution files
            '**/public/**', // Publicly accessible files
            '**/assets/**', // Asset files
        ],
        languageOptions: {
            ecmaVersion: 2018, // Specify the ECMAScript version
            sourceType: 'module', // Enable ES module syntax
            globals: {
                bootstrap: true, // Define global variables
                browser: true, // Enable browser globals
                node: true, // Enable Node.js globals
            },
            parser: typescriptEslintParser, // Specify the parser for TypeScript
        },
        plugins: {
            prettier: eslintPluginPrettier, // Include Prettier plugin
            'inclusive-language': eslintPluginInclusiveLanguage, // Include inclusive language plugin
            promise: eslintPluginPromise, // Include promise plugin for handling promises
            '@typescript-eslint': typescriptEslintPlugin, // Include TypeScript ESLint plugin
            node: eslintPluginNode, // Include Node.js plugin
            import: eslintPluginImport, // Include Import plugin
        },
        rules: {
            // Recommended rules
            'no-console': 'warn', // Warn when console is used
            'no-debugger': 'warn', // Warn when debugger is used
            'inclusive-language/use-inclusive-words': 'warn', // Warn for non-inclusive language
            'node/no-unsupported-features/es-syntax': [
                'warn',
                { ignores: ['modules'] },
            ], // Allow ES module syntax
            'import/no-unresolved': [2, { ignore: [''] }], // Ignore unresolved imports
            'node/no-missing-import': 'warn', // Warn for missing imports
            'class-methods-use-this': 'off', // Allow class methods not to use 'this'
            'import/extensions': [
                'error',
                'ignorePackages',
                { '': 'never', js: 'never' }, // Allow imports without extensions for JS
            ],
            'no-param-reassign': [2, { props: false }], // Disallow reassigning function parameters
            'no-use-before-define': [
                'error',
                {
                    functions: false, // Allow functions to be used before their definition
                    classes: true, // Disallow classes to be used before their definition
                    variables: true, // Disallow variables to be used before their definition
                    allowNamedExports: false, // Disallow named exports to be used before their definition
                },
            ],
        },
    },
    // TypeScript specific configuration
    {
        files: ['src/Resources/**/*.ts'], // Override rules for TypeScript files
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json', // Specify the path to the TypeScript configuration file
                tsconfigRootDir: __dirname, // Specify the root directory for the TypeScript configuration
            },
        },
        rules: {
            '@typescript-eslint/consistent-type-exports': 'error', // Enforce consistent type exports
            '@typescript-eslint/consistent-type-imports': 'error', // Enforce consistent type imports
        },
    },
];
