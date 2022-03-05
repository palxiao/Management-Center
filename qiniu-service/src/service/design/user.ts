/*
 * @Author: ShawnPhang
 * @Date: 2022-02-13 21:18:01
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-03-05 21:18:48
 * @site: book.palxp.com / blog.palxp.com
 */
const { getPics, prepareInit } = require('../qiniu/index.ts')
const { QiNiu: QiNiuData } = require('../../configs.ts')
const func2 = require('../../utils/mysql.ts')
const screenShotUrl = 'http://app.palxp.com:7001/api/screenshots?'
// const screenShotUrl = 'http://localhost:7001/api/screenshots?'
const Img2QiNiu = require('../spider/utils/downUpdateImage.ts')

function getQiNiuKey(url: string) {
  const arr = url.split('/')
  arr.splice(0, 3)
  return arr.join('/')
}

module.exports = {
  getUserImages(req: any, res: any) {
    prepareInit(QiNiuData)
    //bucket 空间名 prefix 文件名前缀 limit 单页返回条数
    getPics({ bucket: 'cloud-design', prefix: 'user', marker: req.query.marker }).then((result: any) => {
      res.json({ code: 0, result })
    })
  },
  fetchUserImages(req: any, res: any) {
    const { page = 1, pageSize = 20, order = 'desc' } = req.query
    const jumpNum = (+page - 1) * +pageSize
    func2.connPool(`SELECT * FROM my_images order by created_time ${order} LIMIT ${jumpNum},${pageSize}`, [], async (rows: any) => {
      const total = await func2.pConnPool(`select count(id) from my_images`)
      res.json({ code: 200, msg: 'ok', result: { list: rows, total: total[0]['count(id)'] } })
    })
  },
  async addUserImages(req: any, res: any) {
    const { url, width, height } = req.query
    const query = `INSERT INTO my_images (url, width, height) VALUES(?,?,?)` // type
    const arr = [url, width, height]
    await func2.pConnPool(query, arr)
    res.json({ code: 200, msg: 'ok' })
  },
  async deleteUserImage(req: any, res: any) {
    const { id, key } = req.body
    if (id) {
      prepareInit(QiNiuData)
      const { delPicForTemp } = require('../qiniu/index.ts')
      await delPicForTemp({ bucket: 'cloud-design', key: [key] })
      func2.connPool('DELETE FROM my_images WHERE id=?', id, (rows: any) => {
        res.json({ code: 200, msg: 'delete ok !' })
      })
    } else {
      res.json({ code: 200, msg: '没有id' })
    }
  },
  updateDesign(req: any, res: any) {
    const { id, title, data, temp_id: template_id = '0', width, height } = req.body
    const paramsArr = []
    const textArr = []
    const arr = []
    const collecter: any = { title, data, template_id, width, height }
    for (const key in collecter) {
      if (Object.prototype.hasOwnProperty.call(collecter, key)) {
        if (typeof collecter[key] !== 'undefined' && String(collecter[key])) {
          arr.push(collecter[key])
          paramsArr.push(`${key}=?`)
          textArr.push(key)
        }
      }
    }
    if (id) {
      arr.push(id)
      const query = `UPDATE my_design SET ${paramsArr.toString()} WHERE id=?`
      func2.connPool(query, arr, async (rows: any) => {
        res.json({ code: 200, msg: '修改成功' })
        setTimeout(async () => {
          const data = await func2.pConnPool(`SELECT width,height FROM my_design WHERE id = ${id}`)
          const { url } = await Img2QiNiu(`${screenShotUrl}id=${id}&width=${data[0].width}&height=${data[0].height}&type=cover`, null, 'cover', 'user', `${id}-cover.jpg`)
          func2.connPool(`UPDATE my_design SET cover='${url}' WHERE id=${id}`, [], () => {})
        }, 1000)
      })
    } else if (title && data && template_id && width && height) {
      const query = `INSERT INTO my_design(${textArr.toString()}) VALUES(?,?,?,?,?)`
      func2.connPool(query, arr, async (rows: any) => {
        const data = await func2.pConnPool('SELECT id,width,height FROM my_design ORDER BY id desc LIMIT 1')
        res.send({ code: 200, msg: '新增作品', id: data[0].id })
        setTimeout(async () => {
          const { url } = await Img2QiNiu(`${screenShotUrl}id=${data[0].id}&width=${data[0].width}&height=${data[0].height}&type=cover`, null, 'cover', 'user', `${data[0].id}-cover.jpg`)
          func2.connPool(`UPDATE my_design SET cover='${url}' WHERE id=${data[0].id}`, [], () => {})
        }, 1000)
      })
    } else {
      res.json({ code: 0, msg: '缺少参数请检查' })
    }
  },
  async deleteUserDesign(req: any, res: any) {
    const { id } = req.body
    if (id) {
      prepareInit(QiNiuData)
      const { delPicForTemp } = require('../qiniu/index.ts')
      func2.connPool(`SELECT cover FROM my_design WHERE id=?`, id, async (rows: any) => {
        if (rows[0].cover) {
          const key = []
          key.push(getQiNiuKey(rows[0].cover))
          await delPicForTemp({ bucket: 'cloud-design', key })
        }
        func2.connPool(`DELETE FROM my_design WHERE id=?`, id, (rows: any) => {
          res.json({ code: 200, msg: 'delete ok !' })
        })
      })
    } else {
      res.json({ code: 200, msg: '没有id' })
    }
  },
}
