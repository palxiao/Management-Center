/*
 * @Author: ShawnPhang
 * @Date: 2021-08-29 15:46:31
 * @Description: 二次封装弹出提示。type字段表明消息类型，可以为success，error，info和warning，无效的设置将会被忽略。
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-29 23:27:24
 * @site: book.palxp.com / blog.palxp.com
 */
import { ElMessageBox } from 'element-plus'

export default {
  open: (text: string, type: any = 'warning') => {
    return new Promise((resolve: any, reject: any) => {
      ElMessageBox.confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type,
      })
        .then(() => {
          resolve()
        })
        .catch(() => {
          reject()
        })
    })
  },
  prompt: (title: string, text: string = '', value: string = '') => {
    return new Promise((resolve: any, reject: any) => {
      ElMessageBox.prompt(text, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: value,
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '邮箱格式不正确',
      })
        .then(({ value }) => {
          resolve(value)
        })
        .catch(() => {})
    })
  },
}
