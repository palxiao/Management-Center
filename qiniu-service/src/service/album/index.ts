/*
 * @Author: ShawnPhang
 * @Date: 2021-08-30 17:55:45
 * @Description: 相册接口
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-09-24 19:53:45
 * @site: book.palxp.com / blog.palxp.com
 */
const { Upload } = require('../../utils/upload.ts')
const fs = require('fs')
const { preDir, dir } = { preDir: 'static', dir: '/data.json' }
const { QiNiu } = require('../../../config.js')

module.exports = {
  async getPicList(req: any, res: any) {
    /**
     * @api {get} pic/list 获取空间下图片列表
     * @apiVersion 1.0.0
     * @apiGroup 七牛
     * @apiDescription 无
     *
     * @apiParam {String} bucket 空间名
     * @apiParam {String} prefix 文件名前缀
     * @apiParam {String} limit 单页返回条数
     */
    let config = QiNiu
    fs.readFile(preDir + dir, async function (err: any, data: any) {
      if (err) {
        return false
      }
      const json = JSON.parse(data.toString())
      for (let i = 0; i < json.length; i++) {
        if (json[i].Alias === req.query.id) {
          config = json[i]
          break
        }
      }

      const upload = new Upload(config) // 临时操作
      const { bucket, prefix = '', limit = 20 } = req.query
      const buckets = await upload.listBucket()
      let urlPrefix: string = ''
      const configBucket = config.DefaultSpace || bucket
      for (const item of buckets) {
        if (item.tbl === configBucket) {
          urlPrefix = item.domain
        }
      }
      // console.log(config, bucket)
      try {
        const result = await upload.listPrefix(bucket || config.DefaultSpace, { prefix, limit })
        res.json({ code: 200, result: Object.assign({ domain: 'https://' + urlPrefix + '/' }, result) })
      } catch (e) {}
    })
  },
}

export {}
