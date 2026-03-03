import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginPromise from 'eslint-plugin-promise'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import importX from 'eslint-plugin-import-x'
import globals from 'globals'

// https://orm.drizzle.team/docs/eslint-plugin?utm_source=copilot.com
import drizzlePlugin from 'eslint-plugin-drizzle'

/* ========================================================================

======================================================================== */

export default [
  {
    ignores: ['eslint.config.js', 'src/generated']
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
    languageOptions: {
      globals: globals.bunBuiltin
    }
  },
  {
    plugins: {
      drizzle: drizzlePlugin
    },
    rules: {
      ...drizzlePlugin.configs.recommended.rules,
      'drizzle/enforce-delete-with-where': 'warn',
      'drizzle/enforce-update-with-where': 'warn'
    }
  },

  // The "js/recommended" configuration ensures all of the rules marked as recommended on the rules page will be turned on.
  // https://eslint.org/docs/latest/rules
  js.configs.recommended,
  ...tseslint.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript, // adds TypeScript-specific resolver support
  pluginPromise.configs['flat/recommended'],
  eslintPluginPrettierRecommended,

  // Some typescript-eslint rules (like no-unnecessary-type-assertion) need the actual TypeScript type checker to run
  // — not just the parser. This block enables that by telling ESLint where to find your tsconfig.json.
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        // What does project: true do?
        // It tells the TypeScript parser to find and use the nearest tsconfig.json relative to each file being linted.
        // Without it, typescript-eslint only parses your TypeScript syntax — it doesn't load type information. With it,
        // ESLint can ask TypeScript questions like "what type is this variable actually?" which enables the type-aware rules.
        project: true,
        // What does tsconfigRootDir: import.meta.dirname do?
        // It sets the base directory for resolving project: true. import.meta.dirname is the directory of your eslint.config.js file
        // — so it anchors the tsconfig search to your project root. Without it, TypeScript might look in the wrong place and fail to
        // find your tsconfig.json.
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    rules: {
      /* ======================
        eslint-plugin-prettier
      ====================== */

      'prettier/prettier': 'warn', // For eslint-plugin-prettier - downgrade to "warn"
      'arrow-body-style': 'off', // eslint-plugin-prettier recommendation
      'prefer-arrow-callback': 'off', // eslint-plugin-prettier recommendation

      /* ======================
          typescript-eslint
      ====================== */

      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/only-throw-error': 'warn',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/consistent-type-imports': 'warn',

      '@typescript-eslint/ban-ts-comment': 'off', // Allows @ts-ignore statement
      '@typescript-eslint/no-non-null-assertion': 'off', // Allows ! bang operator - already "off" in Next.js by defualt.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off', // Allows type Props = {}
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_', // Ignore unused arguments that start with _
          varsIgnorePattern: '^_', // Ignore unused variables that start with _
          caughtErrorsIgnorePattern: '^_', // Ignore caught errors that start with _
          destructuredArrayIgnorePattern: '^_' // Ignore destructured array elements that start with _
        }
      ],

      /* ======================
        eslint-plugin-import-x
      ====================== */

      'import-x/no-unresolved': ['warn', { ignore: ['^bun:'] }],
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-cycle': 'warn',
      'import-x/order': 'warn',

      // 'import/consistent-type-specifier-style': 'warn',
      // 'import/newline-after-import': 'warn',
      // 'import/no-duplicates': 'warn',

      // 'import/first': 'warn',

      // By default, all types of anonymous default exports are forbidden, but any types can be selectively
      // allowed by toggling them on in the options. Ensuring that default exports are named helps improve
      // the grepability of the codebase by encouraging the re-use of the same identifier for the module's
      // default export at its declaration site and at its import sites.
      // We could set this to "off", but for now "warn"
      // 'import/no-anonymous-default-export': 'warn',

      /* ======================
          General Rules
      ====================== */

      // 'no-shadow': 'off',
      // 'sort-imports': 'warn', // Can conflict with import-x/order

      ///////////////////////////////////////////////////////////////////////////
      //
      //   const data = { name: 'Fred',  age: 35,}
      //
      //   for (const key in data) {
      //     if (Object.prototype.hasOwnProperty.call(data, key)) {
      //       console.log(`${key}: ${data[key as keyof typeof data]}`)
      //     }
      //   }
      //
      ///////////////////////////////////////////////////////////////////////////
      'guard-for-in': 'warn', // Off by default in Next.js

      // Would require an await inside the body of an async function: export const func = async () => null
      // Off by default in Next.js
      'require-await': 'off',

      'no-var': 'warn', // Warns user to implement let or const instead.
      'prefer-const': 'warn',
      'no-eq-null': 'warn', // Warns user to implement strict equality.
      'no-prototype-builtins': 'off',
      'no-throw-literal': 'warn', // Warns user to use an Error object. This may be deprecated now.
      'no-unreachable': 'warn', // Warns user when code is unreachable due to return, throw, etc.

      /* ======================
        eslint-plugin-promise
      ====================== */

      'promise/always-return': 'warn',
      'promise/no-return-wrap': 'warn',
      'promise/param-names': 'warn',
      'promise/catch-or-return': ['warn', { allowFinally: true }],
      'promise/no-native': 'off',
      'promise/no-nesting': 'warn',
      'promise/no-promise-in-callback': 'warn',
      'promise/no-callback-in-promise': 'warn',
      'promise/avoid-new': 'off',
      'promise/no-new-statics': 'warn',
      'promise/no-return-in-finally': 'warn',
      'promise/valid-params': 'warn',
      'promise/no-multiple-resolved': 'warn'
    }
  }
]
