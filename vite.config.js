import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    // Build configuration for production
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production', // Disable sourcemaps in production for smaller bundle
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['react-hot-toast', 'react-modal']
          }
        }
      }
    },
    // Define global constants
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_ENV || 'development')
    }
  }
})