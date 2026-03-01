import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/components.d.ts',
      }),
    ],
    server: {
      host: true,
      proxy: {
        '/api': {
          target: (env.VITE_API_BASE_URL && env.VITE_API_BASE_URL.startsWith('http')) ? env.VITE_API_BASE_URL : 'http://127.0.0.1:3000',
          changeOrigin: true,
        },
        '/uploads': {
          target: (env.VITE_API_BASE_URL && env.VITE_API_BASE_URL.startsWith('http')) ? env.VITE_API_BASE_URL.replace('/api', '') : 'http://127.0.0.1:3000',
          changeOrigin: true,
        }
      }
    },
    build: {
      rollupOptions: {
        external: ['chart.js', 'leaflet'],
        output: {
          manualChunks: {
            'element-plus': ['element-plus'],
            'dplayer': ['dplayer'],
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      },
      chunkSizeWarningLimit: 800,
      cssCodeSplit: true
    }
  }
})
