import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  // Ignore patterns
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'public/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'dist/**',
      'build/**',
      '.vercel/**',
      '.sanity/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'sanity/static/**',
      'sanity/.sanity/**',
      'scripts/_archive/**',
      'analyze-*.ts',  // Analysis scripts can use console.log
      'memory-bank/**',
      // Ignore test files in root (not part of build)
      'test-*.mjs',
      'test-*.js',
    ],
  },

  // Base JavaScript config
  js.configs.recommended,

  // TypeScript config for all TS/TSX files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        // Note: Not using 'project' to allow linting files outside tsconfig.json (e.g., scripts/)
      },
      globals: {
        React: 'readonly',
        JSX: 'readonly',
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      '@next/next': nextPlugin,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // General code quality
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'prefer-const': 'warn',
      'no-unused-vars': 'off', // Disabled in favor of @typescript-eslint/no-unused-vars
      'no-undef': 'off', // TypeScript handles this

      // React rules
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js
      'react/prop-types': 'off', // Using TypeScript for prop validation

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Next.js specific rules
      '@next/next/no-html-link-for-pages': 'warn',
      '@next/next/no-img-element': 'warn',
    },
  },

  // JavaScript config
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Test files - relaxed rules
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/__tests__/**',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-console': 'off',
    },
  },

  // Scripts - relaxed rules (console.log is expected in scripts)
  {
    files: ['scripts/**/*.ts', 'scripts/**/*.js', 'scripts/**/*.mjs'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // CLI utility scripts - allow console output for progress/status
  {
    files: [
      'src/scripts/**/*.ts',
      'src/scripts/**/*.js',
      'src/scripts/**/*.mjs',
      'src/lib/chatbot/ingest-*.ts',
      'src/lib/chatbot/setup-*.ts',
      'src/lib/chatbot/smart-sync.ts',
      'src/lib/chatbot/sanity-fetcher.ts', // CLI progress output
      'src/lib/logger.ts', // Logging utility wrapper
    ],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // ArticleContent - allow img tags for Sanity optimization
  {
    files: [
      'src/components/ArticleContent.tsx',
      'src/components/case-study-flowing/ArticleContent.tsx',
    ],
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },

  // Sanity schemas - allow 'any' type (required by Sanity's validation API)
  {
    files: ['sanity/schemas/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Chatbot utilities - allow 'any' for flexible content/logging
  {
    files: [
      'src/lib/chatbot/content-hash.ts',
      'src/lib/chatbot/logging.ts',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Sanity client - allow 'any' for third-party API types
  {
    files: ['src/sanity/lib/client.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Config files - relaxed rules
  {
    files: [
      'next.config.*',
      'tailwind.config.*',
      'postcss.config.*',
      'playwright.config.*',
      'vitest.config.*',
    ],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'no-console': 'off',
    },
  },
];
