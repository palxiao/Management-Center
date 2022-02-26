/*
 * @Author: ShawnPhang
 * @Date: 2021-08-25 09:36:27
 * @Description: 事件解耦
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-25 09:38:22
 * @site: book.palxp.com / blog.palxp.com
 */

import emitter from 'tiny-emitter/instance'

export default {
  $on: (...args: any) => emitter.on(...args),
  $once: (...args: any) => emitter.once(...args),
  $off: (...args: any) => emitter.off(...args),
  $emit: (...args: any) => emitter.emit(...args),
}
