import { defineConfig } from 'vite'
import Uni from '@dcloudio/vite-plugin-uni'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [Uni()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
      'utils': fileURLToPath(new URL('./utils', import.meta.url)),
      'components': fileURLToPath(new URL('./components', import.meta.url)),
      'stores': fileURLToPath(new URL('./store', import.meta.url)),
      'api': fileURLToPath(new URL('./api', import.meta.url)),
      'vue': fileURLToPath(new URL('./node_modules/vue', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 关键修复：全局注入 uview-plus 的主题变量
        // 确保路径正确指向 node_modules/uview-plus/theme.scss
        additionalData: `@import "uview-plus/theme.scss";`
      }
    }
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  }
})