// eslint.config.mjs

import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import pluginImport from 'eslint-plugin-import'; // Импортируем плагин import
import pluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  {
    files: ['**/*.{js,mjs,ts}'],
    languageOptions: {
      parser,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2023,
        ...globals.jest, // Добавляем Jest-глобали
        ...globals.browser, // Добавляем браузерные глобали (window, document, и т.д.)
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: pluginImport, // Добавляем плагин import
      prettier: pluginPrettier, // добавили Prettier
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.ts'],
        },
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...pluginImport.configs.recommended.rules, // Добавляем рекомендованные правила import
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // 'no-console': 'warn',
      'no-console': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          mjs: 'never',
          ts: 'never',
        },
      ],
      'import/no-unresolved': 'off', // Отключаем проверку на неразрешённые импорты
      // активируем правила Prettier
      'prettier/prettier': 'error',
    },
  },
];