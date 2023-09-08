import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    resolve: { alias: { '@': './src' } },
    host: '0.0.0.0',
    port: 7000,
    // host: '192.168.1.130',
    watch: {
      usePolling: true,
    },
    // hmr: {
    //   port: 7010
    // }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
