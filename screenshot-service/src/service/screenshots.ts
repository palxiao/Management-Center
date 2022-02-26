/*
 * @Author: ShawnPhang
 * @Date: 2020-07-22 20:13:14
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-11 17:07:34
 * @site: book.palxp.com / blog.palxp.com
 */
const sql = require('../utils/widget/sql.ts')
// const func = require('../utils/mysql.ts')
const $utils = require('../utils/index.ts')
const { saveScreenshot } = require('../utils/download.ts')
const { filePath } = require('../configs.ts')
const queueRun = require('../utils/node-queue.ts')
// const queueRun = require('../utils/queue.ts')
const path = require('path')
const fs = require('fs')

module.exports = {
  testPath(req: any, res: any) {
    res.json({ path4: filePath })
  },
  async getImg(req: any, res: any) {
    /**
     * @api {get} api/screenshots 截图
     * @apiVersion 1.0.0
     * @apiGroup screenShot
     *
     * @apiParam {String|Number} id (必传) 截图id
     * @apiParam {String} width (必传)视窗大小
     * @apiParam {String} height (必传)视窗大小
     * @apiParam {String} screenshot_url 可选
     */
    const { id, width, height, screenshot_url } = req.query
    const defaultUrl = 'http://sudo.palxp.com/draw'
    const url = (screenshot_url || defaultUrl) + '?id='
    const path = filePath + `screenshot-${id}.png` // .jpg` 

    if (id && width && height) {
      console.log(url + id);
      queueRun(saveScreenshot, url + id, { width, height, path }).then(() => {
        res.setHeader('Content-Type', 'image/jpg')
        // const stats = fs.statSync(path)
        // res.setHeader('Cache-Control', stats.size)
        res.sendFile(path)
      }).catch((e: any) => {
        res.json({ code: 500, e })
      })
    } else {
      res.json({ code: 500, msg: '缺少参数，请检查' })
    }
  },
  // 保存数据
  async saveData(req: any, res: any) {
    const { data } = req.body
    try {
      fs.writeFileSync('static/data.json', data)
      //文件写入成功。
    } catch (err) {
      console.error(err)
    }
    res.json({ code: 200, msg: '保存成功' })
  },
  // 获取数据
  async getData(req: any, res: any) {
    try {
      let data = fs.readFileSync('static/data.json', 'utf8')
      data = JSON.parse(data)
      res.json({ code: 200, msg: 'success', data })
    } catch (err) {
      console.error(err)
    }
  },
}

export {}
