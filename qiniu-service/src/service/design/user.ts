/*
 * @Author: ShawnPhang
 * @Date: 2022-02-13 21:18:01
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-25 15:38:10
 * @site: book.palxp.com / blog.palxp.com
 */
const { getPics, prepareInit } = require('../qiniu/index.ts')
const { QiNiu: QiNiuData } = require('../../configs.ts')
const func2 = require('../../utils/mysql.ts')

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
