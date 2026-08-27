import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Vapor SFCs inside @tinadec/ui compile to `import { defineVaporComponent }
      // from 'vue'`; point `vue` at the package's shim re-exporting both runtimes.
      vue: path.resolve(__dirname, 'node_modules/@tinadec/ui/src/lib/vue-shim.ts'),
      '@vue/reactivity': path.resolve(__dirname, 'node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js'),
      '@vue/runtime-dom': path.resolve(__dirname, 'node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js'),
      '@vue/runtime-vapor': path.resolve(__dirname, 'node_modules/@vue/runtime-vapor/dist/runtime-vapor.esm-bundler.js'),
    },
    dedupe: ['vue', '@vue/reactivity', '@vue/runtime-dom', '@vue/runtime-vapor'],
  },
  server: {
    port: 5190,
    fs: {
      // @tinadec/ui is linked from ../TinadecUI; its deps (Geist fonts) resolve
      // through /@fs/ and need explicit allow.
      allow: ['.', path.resolve(__dirname, '../TinadecUI')],
    },
  },
})
