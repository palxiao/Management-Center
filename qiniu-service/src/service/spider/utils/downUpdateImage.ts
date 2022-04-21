/*
 * @Author: ShawnPhang
 * @Date: 2022-01-05 10:48:38
 * @Description: 七牛入库
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-04-21 23:04:54
 * @site: book.palxp.com / blog.palxp.com
 */
const axiosHttp = require('../../../utils/http.ts')
const { Upload: Uploader } = require('../../../utils/upload.ts')
const { QiNiu } = require('../../../../config.js')
// 初始化七牛
const qiniuPrefix = 'https://design.palxp.com/'
const uploader = new Uploader(QiNiu) // 临时操作

module.exports = async function downUpdateImage(imgUrl: string, headers: any = {}, prefix: string = 'cache', space: string, fullPath: string = '') {
  return new Promise(async (resolve) => {
    const resp = await axiosHttp.get(imgUrl, {
      headers,
      responseType: 'arraybuffer',
    })
    let result: any = {}
    let imgName = fullPath || imgUrl.split('?')[0].split('/').pop()
    ;(imgName?.split('.') || []).length <= 1 && (imgName += '.png')
    console.log('资源入库:', imgName, '类型:', prefix)
    const buffer = Buffer.from(resp, 'binary')
    const suffix = imgName?.split('.')[imgName?.split('.').length - 1]
    const finalName = fullPath || `${new Date().getTime()}.${suffix}`
    const resName = space ? `${prefix}/${space}/${finalName}` : `${prefix}/${new Date().getTime()}/${finalName}`
    result = await uploader.uploadFileByBuffer('cloud-design', resName, buffer)
    result.url = qiniuPrefix + result.key
    resolve(result)
  })
}

// function throwErrorInfo(text: string, data: any, type: any) {
//   const fs = require('fs')
//   const path = require('path')
//   console.error(text + ' --> 日志已生成 ')
//   fs.writeFile(path.resolve(__dirname, `${type}-${Math.random()}.json`), JSON.stringify(data), (e: any) => {})
// }
