/*
 * @Author: ShawnPhang
 * @Date: 2021-07-12 15:03:31
 * @Description: 全局配置文件
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-10-11 20:15:03
 * @site: book.palxp.com / blog.palxp.com
 */
// const prefix = import.meta.env
const prefix = process.env

const isDev = prefix.NODE_ENV === 'development'

export default {
  BASE_URL: isDev ? '/' : './',
  VERSION: '0.0.0',
  APP_COPYRIGHT: '',
  API_URL: 'http://' + window.location.host.split(':')[0] + ':9998',
  ADMIN_URL: 'http://' + window.location.host.split(':')[0] + ':8090',
  IMG_URL: '',
  ICONFONT_URL: '//at.alicdn.com/t/font_2766680_y35279pyhun.css',
}
