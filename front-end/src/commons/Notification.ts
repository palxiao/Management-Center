/*
 * @Author: ShawnPhang
 * @Date: 2021-08-26 16:44:44
 * @Description: 封装 element notification
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-26 18:22:44
 * @site: book.palxp.com / blog.palxp.com
 */
import { ElNotification } from 'element-plus'

export default {
  success: (message: string, title: string = '') => {
    ElNotification({
      title,
      message,
      type: 'success',
    })
  },
  warning: (message: string, title: string = '') => {
    ElNotification({
      title,
      message,
      type: 'warning',
    })
  },
  error: (message: string, title: string = '') => {
    ElNotification({
      title,
      message,
      type: 'error',
    })
  },
  info: (message: string, title: string = '') => {
    ElNotification({
      title,
      message,
    })
  },
}
