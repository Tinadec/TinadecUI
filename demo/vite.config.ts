import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      // Vapor SFCs inside @tinadec/ui compile to `import { defineVaporComponent }
      // from 'vue'`; point `vue` at the package's shim re-exporting both runtimes.
      vue: path.resolve(__dirname, '../src/lib/vue-shim.ts'),
      '@vue/reactivity': path.resolve(__dirname, 'node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js'),
      '@vue/runtime-dom': path.resolve(__dirname, 'node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js'),
      '@vue/runtime-vapor': path.resolve(__dirname, 'node_modules/@vue/runtime-vapor/dist/runtime-vapor.esm-bundler.js'),
    },
    dedupe: ['vue', '@vue/reactivity', '@vue/runtime-dom', '@vue/runtime-vapor'],
  },
  server: {
    port: 5191,
    fs: {
      // @tinadec/ui is linked from ../; fonts resolve through /@fs/ and need allow.
      allow: ['.', path.resolve(__dirname, '..')],
    },
  },
})
