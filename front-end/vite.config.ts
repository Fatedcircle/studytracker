/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
        environment: "jsdom",
        globals: true,
        coverage: 
          { exclude:
            [
              'coverage/**',
              'dist/**',
              '**/node_modules/**',
              '**/[.]**',
              'packages/*/test?(s)/**',
              '**/*.d.ts',
              '**/virtual:*',
              '**/__x00__*',
              '**/\x00*',
              'cypress/**',
              'test?(s)/**',
              'test?(-*).?(c|m)[jt]s?(x)',
              '**/*{.,-}{test,spec,bench,benchmark}?(-d).?(c|m)[jt]s?(x)',
              '**/__tests__/**',
              '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
              '**/vitest.{workspace,projects}.[jt]s?(on)',
              '**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}',
              'src/main.tsx',
              'src/app.tsx'
            ],
            reporter: ['text'],
          },
        
  },
})
