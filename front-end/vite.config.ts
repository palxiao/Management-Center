/*
 * @Author: ShawnPhang
 * @Date: 2021-07-13 18:13:30
 * @Description: Setting
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-07-22 15:44:07
 * @site: book.palxp.com / blog.palxp.com
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import viteCompression from 'vite-plugin-compression'
import styleImport from 'vite-plugin-style-import'

const resolve = (...data: string[]) => path.resolve(__dirname, ...data)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    styleImport({
      libs: [{
        libraryName: 'element-plus',
        esModule: true,
        ensureStyleFile: true,
        resolveStyle: (name) => {
          name = name.slice(3)
          return `element-plus/packages/theme-chalk/src/${name}.scss`;
        },
        resolveComponent: (name) => {
          return `element-plus/lib/${name}`;
        },
      }]
    })
  ],
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
  define: {
    'process.env': process.env,
  },
})
