const { Upload } = require('../../utils/upload.ts')
// const fs = require('fs')
const request = require('axios')
const moment = require('moment')

const { preDir, dir } = { preDir: 'static', dir: '/data.json' }
const keys: any = {}

module.exports = {
  async init(req: any, res: any) {
    /**
     * @api {post} pic/init 初始化，拉取空间列表
     * @apiVersion 1.0.0
     * @apiGroup 七牛
     * @apiDescription 每次生成的token有效期默认为1小时
     *
     */
    // const uploadToken = upload.auth()
    const params = req.body.params || {}
    if (!params.AK && !params.SK && !params.Alias) {
      res.json({ code: 200, msg: '初始化失败，检查配置' })
      return
    }

    // fs.readFile(preDir + dir, function (err: any, data: any) {
    //   if (err) {
    //     console.log(err)
    //     return false
    //   }
    //   const json = JSON.parse(data.toString())
    //   for (let i = 0; i < json.length; i++) {
    //     // 剔除初始化的值
    //     if (json[i].Alias === params.Alias) {
    //       json.splice(i, 1)
    //     }
    //   }
    //   json.push(params) // 写入新值
    //   fs.writeFile(preDir + dir, JSON.stringify(json), async (err: any) => {
    //     if (err) throw err
    const upload = new Upload(params)
    const buckets = await upload.listBucket()
    res.json({ code: 200, msg: 'QiNiu初始化完毕', result: { buckets } })
    keys[params.Alias] = params
    //   })
    // })
  },
  async prepareInit(QiNiuData: any) {
    keys[''] = QiNiuData
  },

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
    const upload = new Upload(keys[req.query.alias || '']) // 临时操作
    const { bucket, prefix = '', limit = 10, marker = '' } = req.query
    const result = await upload.listPrefix(bucket, { prefix, limit, marker })
    result.data.reverse()
    // TODO: 可能存在问题，读取的Alias目前可为空
    const begin = moment(new Date()).subtract(1, 'hour').format('YYYYMMDDhhmmss')
    const end = moment(new Date()).format('YYYYMMDDhhmmss')
    const host = 'http://api.qiniu.com'
    const path = `/v6/count?begin=${begin}&end=${end}&g=day&bucket=${bucket}`
    const getCount = await request({
      url: host + path,
      headers: {
        Authorization: upload.getSignToken(keys[''], path),
        'content-type': 'application/x-www-form-urlencoded',
      },
    })
    result.total = getCount.data.datas[0]
    res.json({ code: 200, msg: 'ok', result })
  },

  getPics({ bucket, prefix = '', limit = 10, marker = '' }: any) {
    return new Promise(async (resolve) => {
      const upload = new Upload(keys['']) // 临时操作
      const buckets = await upload.listBucket()
      const preUrl = `http://${buckets[buckets.findIndex((x: any) => x.tbl === bucket)].domain}/`
      const result = await upload.listPrefix(bucket, { prefix, limit, marker })
      result.data.reverse()
      result.data = result.data.map((x: string) => preUrl + x)
      resolve(result)
    })
  },

  async delPic(req: any, res: any) {
    /**
     * @api {post} pic/delOne 删除图片
     * @apiVersion 1.0.0
     * @apiGroup 七牛
     * @apiDescription 无
     *
     * @apiParam {String} bucket 空间名
     * @apiParam {String} key 文件名
     */
    const params = req.body || {}
    const upload = new Upload(keys[params.alias || '']) // 临时操作
    const code = await upload.delete(params)
    res.json({ code, msg: 'ok' })
  },

  async delPicMulti(req: any, res: any) {
    /**
     * @api {post} pic/del 多选删除多张图片
     * @apiVersion 1.0.0
     * @apiGroup 七牛
     * @apiDescription 无
     *
     * @apiParam {String} bucket 空间名
     * @apiParam {String} key 文件名的数组
     */
    const upload = new Upload(keys[req.body.alias || '']) // 临时操作
    const code = await upload.delete(req.body)
    res.json({ code, msg: 'ok' })
  },
  delPicForTemp(arr: any) {
    const upload = new Upload(keys['']) // 临时操作
    return new Promise((resolve: Function) => {
      upload.delete(arr).then(() => {
        resolve()
      })
    })
  },

  async getToken(req: any, res: any) {
    /**
     * @api {get} pic/getToken 取得上传token
     * @apiVersion 1.0.0
     * @apiGroup 七牛
     * @apiDescription 无
     *
     * @apiParam {String} bucket 空间名
     * @apiParam {String} name 文件名
     */
    const upload = new Upload(keys[req.query.alias || '']) // 临时操作
    const { bucket, name } = req.query
    const result = upload.getUploadToken(bucket, name)
    res.json({ code: 200, msg: 'ok', result })
  },

  async reName(req: any, res: any) {
    /**
     * @api {post} pic/rename 重命名文件
     * @apiVersion 1.0.0
     * @apiGroup 七牛
     * @apiDescription 无
     *
     * @apiParam {String} bucket 空间
     * @apiParam {String} key 源文件名
     * @apiParam {String} name 新文件名
     */
    const upload = new Upload(keys[req.body.alias || '']) // 临时操作
    const { bucket, key, name } = req.body
    const params = { srcBucket: bucket, srcKey: key, destBucket: bucket, destKey: name }
    const result = upload.move(params)
    res.json({ code: 200, msg: 'ok', result })
  },
}

export {}
