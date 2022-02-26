/*
 * @Author: ShawnPhang
 * @Date: 2021-08-25 15:24:07
 * @Description: 
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-09-25 19:56:52
 * @site: book.palxp.com / blog.palxp.com
 */
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'nprogress'
declare module 'tiny-emitter/instance'
declare module '@kangc/v-md-editor'
declare module '@kangc/v-md-editor/lib/theme/github.js'
declare module 'highlight.js/lib/core'
declare module 'highlight.js/lib/languages/json'
declare module 'highlight.js/lib/languages/javascript'
declare module 'highlight.js/lib/languages/typescript'
declare module '@kangc/v-md-editor/lib/plugins/line-number/index';