import js from '@eslint/js'
import globals from 'globals'
import airbnbBase from 'eslint-config-airbnb-base'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

const sharedRules = {
    'max-len': ['error', { code: 120, ignoreComments: true }],
    'no-console': 'off',
    'no-var': 'off',
    'one-var': 'off',
    'prefer-const': 'off',
    'vars-on-top': 'off',
    eqeqeq: 'off',
    'no-else-return': 'off',
    'eol-last': 'off',
    indent: ['error', 4, { SwitchCase: 1 }],
    'no-multiple-empty-lines': 'off',
    'no-plusplus': 'off',
    'operator-linebreak': 'off',
    'object-shorthand': 'off',
    'dot-notation': 'off',
    'no-prototype-builtins': 'off',
    'array-element-newline': 'off',
    'array-bracket-newline': 'off',
    'arrow-parens': 'off',
    'prefer-spread': 'off',
    'function-paren-newline': 'off',
    'func-names': 'off',
    'prefer-arrow-callback': 'off',
    'no-iterator': 'off',
    'no-restricted-syntax': 'off',
    'no-restricted-properties': 'off',
    'no-use-before-define': 'off',
    'switch-colon-spacing': 'off',
    'prefer-destructuring': 'off',
    quotes: 'off',
    'prefer-template': 'off',
    'no-unused-vars': 'off',
    'no-param-reassign': 'off',
    'lines-between-class-members': 'off',
    radix: 'off',
    'import/extensions': 'off',
    'no-alert': 'off',
    'import/no-unresolved': 'off',
    'prettier/prettier': 'error'
}

export default defineConfig([
    globalIgnores(['dist']),

    {
        files: ['**/*.{js,jsx}'],

        extends: [
            js.configs.recommended,
            airbnbBase,
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
            prettierConfig,
        ],

        plugins: {
            prettier: prettierPlugin,
        },

        languageOptions: {
            ecmaVersion: 2020,
            parserOptions: {
                ecmaFeatures: { jsx: true }
            },
            globals: {
                ...globals.browser,
                jasmine: true
            }
        },

        rules: {
            ...sharedRules,
        }
    },

    {
        files: ['**/*.{ts,tsx}'],

        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
            prettierConfig,
        ],

        plugins: {
            prettier: prettierPlugin,
        },

        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module'
            },
            globals: globals.browser
        },

        rules: {
            ...sharedRules,
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
        }
    }
])
