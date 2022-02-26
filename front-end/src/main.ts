import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import utils from './utils'
import directives from './utils/widgets/directives'
import elementConfig from './utils/widgets/elementConfig'

import 'normalize.css/normalize.css'
import '@/assets/styles/index.scss'
import 'element-plus/packages/theme-chalk/src/base.scss'

// ---- 富文本编辑器 ----
import VMdEditor from '@kangc/v-md-editor'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
// import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index' // 代码行数显示
// highlightjs 支持列表: https://github.com/highlightjs/highlight.js/tree/main/src/languages
// import hljs from 'highlight.js' // 引入全部
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
hljs.registerLanguage('json', json)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
VMdEditor.use(githubTheme, {
  Hljs: hljs,
})
// .use(createLineNumbertPlugin())
// ---- 富文本编辑器 End ----

const app = createApp(App)

elementConfig.components.forEach((component) => {
  app.component(component.name, component)
})

elementConfig.plugins.forEach((plugin: any) => {
  app.use(plugin)
})

// 全局指令
for (const key in directives) {
  if (Object.prototype.hasOwnProperty.call(directives, key)) {
    app.directive(key, (directives as any)[key])
  }
}

app
  .use(store)
  .use(router)
  .use(utils)
  .use(VMdEditor) // 富文本编辑器
  .mount('#app')
