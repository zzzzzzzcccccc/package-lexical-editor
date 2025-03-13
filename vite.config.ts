import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import babel from '@rollup/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: 'build'
  },
  plugins: [
    babel({
      exclude: '/**/node_modules/**',
      babelHelpers: 'bundled',
      extensions: ['.jsx', '.js', '.ts', '.tsx', '.mjs'],
      presets: [['@babel/preset-react', { runtime: 'automatic' }]]
    }),
    react()
  ]
})
