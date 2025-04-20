import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vuePlugin from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: ['dist', 'node_modules'],
  },

  // Config JS base
  js.configs.recommended,

  {
    languageOptions: {
      globals: {
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        File: 'readonly',
        FormData: 'readonly',
        URLSearchParams: 'readonly',
        Blob: 'readonly',
        Event: 'readonly',
        HTMLInputElement: 'readonly',
        localStorage: 'readonly',
        setTimeout: 'readonly',
        alert: 'readonly',
        __dirname: 'readonly', // si usás esto en un entorno Node
        module: 'readonly',
        require: 'readonly',
      },
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue: vuePlugin,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // TypeScript
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',

      // JS
      'no-console': 'off', // lo querés permitir
      'no-undef': 'off',   // lo desactivamos porque estás en entorno browser

      // Vue
      'vue/no-unused-components': 'warn',
      'vue/multi-word-component-names': 'off',
    },
  },
]
