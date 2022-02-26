/*
 * @Author: ShawnPhang
 * @Date: 2021-07-22 01:09:44
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-09-25 19:58:54
 * @site: book.palxp.com / blog.palxp.com
 */
import store from '@/store'
const $store = store as Type.Object
const Token = $store.getters.user.token
import NProgress from 'nprogress' // progress bar
import '@/assets/styles/nprogress.less' // progress bar custom style
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const loginPath = '/login'
export default (router: Type.Object) => {
  router.beforeEach((to: Type.Object, from: Type.Object, next: any) => {
    NProgress.start() // start progress bar
    if (to.path === loginPath) {
      next()
      NProgress.done()
      return
    }
    // 有必要时清除残余的loading框
    // store.commit('loading', false);
    //  $store.commit('changeRoute', from.path)

    if (!Token) {
      // 拦截登录
      next({ path: loginPath, query: { redirect: to.fullPath } })
      NProgress.done()
      return
    }

    if (/\/http/.test(to.path) || /\/https/.test(to.path)) {
      const url = to.path.split('http')[1]
      window.location.href = `http${url}`
    } else {
      next()
      NProgress.done()
    }
  })

  router.afterEach(() => {
    window.scrollTo(0, 0)
    NProgress.done()
  })
}
