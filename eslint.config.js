// ESLint v9 flat config
// Minimal, TS-focused, lenient for CI success
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: [
      'node_modules/**',
      '.output/**',
      'dist/**',
      '.nitro/**',
      '**/*.d.ts',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        // We don't rely on project-wide type info during lint
        project: false,
      },
      globals: {
        ...globals.browser,
        ...globals.es2022,
        // Common Nitro/H3 globals (declared in types/ambient.d.ts as well)
        eventHandler: 'readonly',
        defineEventHandler: 'readonly',
        readBody: 'readonly',
        getQuery: 'readonly',
        setResponseHeader: 'readonly',
        send: 'readonly',
        defineNitroErrorHandler: 'readonly',
        defineNitroPlugin: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Keep CI lenient; use warnings instead of errors for common patterns
      'no-console': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
];