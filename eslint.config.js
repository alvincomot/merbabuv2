// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // Abaikan folder umum
  { ignores: ['dist', 'build', 'node_modules'] },

  // ==== Frontend (browser): src/**
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
      globals: {
        ...globals.browser,
        // Vite env var
        'import.meta': 'readonly',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // ==== Backend (node): api/**
  {
    files: ['api/**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,   // <-- bikin `process` dkk dikenal
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      // non-React; matikan rule yang khusus React kalau perlu
      'react-refresh/only-export-components': 'off',
    },
  },
]
