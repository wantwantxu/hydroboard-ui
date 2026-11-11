import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue2'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devPort = Number(env.VITE_DEV_PORT || 5172)

  return {
    plugins: [vue()],
    optimizeDeps: {
      include: [],
      exclude: ['@easydarwin/easyplayer', '@vue-office/docx'],
      needsInterop: [],
      esbuildOptions: {
        target: 'esnext'
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '~': path.resolve(__dirname, './'),
        'lottie-web': path.resolve(__dirname, './src/shims/lottie-web.js'),
        '@vue-office/docx': path.resolve(__dirname, './src/shims/vue-office-docx.js')
      },
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue']
    },
    server: {
      host: '0.0.0.0',
      port: devPort,
      open: false

    },
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: true
        }
      }
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode === 'development' ? 'development' : 'production'),
      'process.env.MODE': JSON.stringify(env.MODE || 'DEMO'),
      'process.env.API_HOST': JSON.stringify(env.VITE_API_HOST || '/api'),
      'process.env.API_HOST_MAP': JSON.stringify(env.VITE_API_HOST_MAP || ''),
      'process.env.WS_HOST': JSON.stringify(env.VITE_WS_HOST || ''),
      'process.env.LOGIN_URL': JSON.stringify(env.VITE_LOGIN_URL || ''),
      'process.env.LOGOUT_URL': JSON.stringify(env.VITE_LOGOUT_URL || '/'),
      'process.env.LAYERS': JSON.stringify(env.VITE_LAYERS || ''),
      'process.env.OAUTH_CLIENT_ID': JSON.stringify(env.VITE_OAUTH_CLIENT_ID || 'demo')
    },
    css: {
      postcss: {
        plugins: []
      },
      preprocessorOptions: {
        scss: {
          additionalData: ''
        },
        sass: {
          additionalData: ''
        }
      }
    }
  }
})
