/*
 * @Author: ShawnPhang
 * @Date: 2021-07-22 01:09:44
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-25 13:51:33
 * @site: book.palxp.com / blog.palxp.com
 */
// import store from '../store'
import services from '../api/index'
import * as utils from './utils'
import _config from '@/config'
import cssLoader from './plugins/css-loader'

/**
 * 全局组件方法
 */
export default {
  install(myVue: Type.Object) {
    /** iconfont 注入 */
    cssLoader(_config.ICONFONT_URL)

    myVue.config.globalProperties.$ajax = services

    myVue.config.globalProperties.$utils = utils

    // myVue.config.globalProperties.$bus =
  },
}
