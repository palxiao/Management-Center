/*
 * @Author: ShawnPhang
 * @Date: 2021-12-31 11:09:30
 * @Description: Type: 0 模板，1 文字组件
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-03-05 22:18:08
 * @site: book.palxp.com / blog.palxp.com
 */
const func = require('../../utils/mysql.ts')
const user = require('./user.ts')
// const fontmin = require('./utils/getFont.ts')
const { prepareInit } = require('../qiniu/index.ts')
const { QiNiu: QiNiuData } = require('../../configs.ts')
const screenShotUrl = 'http://app.palxp.com:7001/api/screenshots?'
const Img2QiNiu = require('../spider/utils/downUpdateImage.ts')

function getQiNiuKey(url: string) {
  const arr = url.split('/')
  arr.splice(0, 3)
  return arr.join('/')
}

module.exports = {
  fetchAll(req: any, res: any) {
    const { type = 0, state = 1, page = 1, pageSize = 20, order = 'desc', cate = 0, search } = req.query
    const jumpNum = (+page - 1) * +pageSize
    const Table = type == 0 ? 'template' : 'component'
    func.connPool(`SELECT id,cover,title,width,height,state FROM ${Table} WHERE state=? ${cate != 0 ? 'AND category=' + cate : ''} ${search ? `AND title like '%${search}%'` : ''} order by created_time ${order} LIMIT ${jumpNum},${pageSize}`, [state], async (rows: any) => {
      const total = await func.pConnPool(`select count(id) from ${Table} WHERE state=${state} ${cate != 0 ? 'AND category=' + cate : ''}`)
      res.json({ code: 200, msg: 'ok', result: { list: rows, total: total[0]['count(id)'] } })
    })
  },
  fetchAllMyDesign(req: any, res: any) {
    const { page = 1, pageSize = 20, order = 'desc' } = req.query
    const jumpNum = (+page - 1) * +pageSize
    func.connPool(`SELECT id,cover,title,width,height FROM my_design order by created_time ${order} LIMIT ${jumpNum},${pageSize}`, [], async (rows: any) => {
      const total = await func.pConnPool(`select count(id) from my_design`)
      res.json({ code: 200, msg: 'ok', result: { list: rows, total: total[0]['count(id)'] } })
    })
  },
  fetchAllMaterial(req: any, res: any) {
    const { state = 1, page = 1, pageSize = 20, order = 'desc', cate: category, search } = req.query
    const jumpNum = (+page - 1) * +pageSize
    func.connPool(`SELECT * FROM material WHERE state=? ${category ? 'AND category=' + category : ''} ${search ? `AND title like '%${search}%'` : ''} order by created_time ${order} LIMIT ${jumpNum},${pageSize}`, [state], async (rows: any) => {
      const total = await func.pConnPool(`select count(id) from material WHERE state=${state} ${category ? 'AND category=' + category : ''}`)
      res.json({ code: 200, msg: 'ok', result: { list: rows, total: total[0]['count(id)'] } })
    })
  },
  fetchAllFonts(req: any, res: any) {
    const { page = 1, pageSize = 20, order = 'desc', name } = req.query
    const jumpNum = (+page - 1) * +pageSize
    func.connPool(`SELECT * FROM fonts ${name ? `WHERE name like '%${name}%'` : ''} LIMIT ${jumpNum},${pageSize}`, [], async (rows: any) => {
      const query = 'select count(id) from fonts'
      const total = await func.pConnPool(query)
      res.json({ code: 200, msg: 'ok', result: { list: rows, total: total[0]['count(id)'] } })
    })
  },
  fetchAllImages(req: any, res: any) {
    const { page = 1, pageSize = 20, order = 'desc', cate = 0 } = req.query
    const jumpNum = (+page - 1) * +pageSize
    func.connPool(`SELECT * FROM photo ${cate ? `WHERE category=${cate}` : ''} LIMIT ${jumpNum},${pageSize}`, [], async (rows: any) => {
      const query = `select count(id) from photo ${cate ? `WHERE category=${cate}` : ''}`
      const total = await func.pConnPool(query)
      res.json({ code: 200, msg: 'ok', result: { list: rows, total: total[0]['count(id)'] } })
    })
  },

  getCategory(req: any, res: any) {
    const { type } = req.query
    func.connPool(`SELECT * FROM category ${type ? 'WHERE type = ' + type : ''}`, '', (rows: any) => {
      rows.unshift({ id: 0, name: '全部' })
      res.json({ code: 200, msg: 'ok', result: rows })
    })
  },

  getTemplate(req: any, res: any) {
    const { id, type = 0 } = req.query
    if (id) {
      func.connPool(`SELECT * FROM ${type == 0 ? 'template' : 'component'} WHERE id=?`, id, (rows: any) => {
        res.json({ code: 200, msg: 'ok', result: rows[0] })
      })
    } else {
      res.json({ code: 0, msg: '没有id' })
    }
  },
  getMyDesign(req: any, res: any) {
    const { id } = req.query
    if (id) {
      func.connPool('SELECT * FROM my_design WHERE id=?', id, (rows: any) => {
        res.json({ code: 200, msg: 'ok', result: rows[0] })
      })
    } else {
      res.json({ code: 0, msg: '没有id' })
    }
  },

  async updateTemplate(req: any, res: any) {
    const { id, state, title, content: data, width, height, type = 0 } = req.body
    const paramsArr = []
    const arr = []
    const collecter: any = { state, title, data, width, height }
    for (const key in collecter) {
      if (Object.prototype.hasOwnProperty.call(collecter, key)) {
        if (typeof collecter[key] !== 'undefined' && String(collecter[key])) {
          arr.push(collecter[key])
          paramsArr.push(`${key}=?`)
        }
      }
    }
    arr.push(id)
    const query = `UPDATE ${type == 0 ? 'template' : 'component'} SET ${paramsArr.toString()} WHERE id=?`
    if (id) {
      const data = await func.pConnPool(`SELECT width,height,cover FROM template WHERE id = ${id}`)
      const coverName = data[0].cover.split('/')[data[0].cover.split('/').length - 1]
      const coverGroup = data[0].cover.split('/')[data[0].cover.split('/').length - 2]
      console.log(coverName, coverGroup)
      setTimeout(async () => {
        const { url } = await Img2QiNiu(`${screenShotUrl}tempid=${id}&width=${data[0].width}&height=${data[0].height}&type=cover&size=600&quality=85`, null, 'cover', coverGroup, coverName)
        console.log(url)
      }, 1000)
      func.connPool(query, arr, (rows: any) => {
        res.json({ code: 200, msg: '修改成功' })
      })
    } else {
      res.json({ code: 0, msg: 'id为空或没有data数据' })
    }
  },

  updateMaterial(req: any, res: any) {
    const { id, state, title } = req.body
    const paramsArr = []
    const arr = []
    const collecter: any = { state, title }
    for (const key in collecter) {
      if (Object.prototype.hasOwnProperty.call(collecter, key)) {
        if (typeof collecter[key] !== 'undefined' && String(collecter[key])) {
          arr.push(collecter[key])
          paramsArr.push(`${key}=?`)
        }
      }
    }
    arr.push(id)
    const query = `UPDATE material SET ${paramsArr.toString()} WHERE id=?`
    if (id) {
      func.connPool(query, arr, (rows: any) => {
        res.json({ code: 200, msg: '修改成功' })
      })
    } else {
      res.json({ code: 0, msg: 'id为空或没有data数据' })
    }
  },

  async deleteTemplate(req: any, res: any) {
    const { id, type = 0 } = req.body
    if (id) {
      prepareInit(QiNiuData)
      const { delPicForTemp } = require('../qiniu/index.ts')
      func.connPool(`SELECT resource,cover FROM ${type == 0 ? 'template' : 'component'} WHERE id=?`, id, async (rows: any) => {
        if (rows[0].resource) {
          const key = rows[0].resource.split(',') || []
          // 添加cover进删除队列
          key.push(getQiNiuKey(rows[0].cover))
          await delPicForTemp({ bucket: 'cloud-design', key })
        }
        func.connPool(`DELETE FROM ${type == 0 ? 'template' : 'component'} WHERE id=?`, id, (rows: any) => {
          res.json({ code: 200, msg: 'delete ok !' })
        })
      })
    } else {
      res.json({ code: 200, msg: '没有id' })
    }
  },

  async deleteMaterial(req: any, res: any) {
    const { id } = req.body
    if (id) {
      prepareInit(QiNiuData)
      const { delPicForTemp } = require('../qiniu/index.ts')
      func.connPool('SELECT url,thumb FROM material WHERE id=?', id, async (rows: any) => {
        const key = []
        key.push(getQiNiuKey(rows[0].thumb))
        key.push(getQiNiuKey(rows[0].url))
        await delPicForTemp({ bucket: 'cloud-design', key })
        func.connPool('DELETE FROM material WHERE id=?', id, (rows: any) => {
          res.json({ code: 200, msg: 'delete ok !' })
        })
      })
    } else {
      res.json({ code: 200, msg: '没有id' })
    }
  },

  async deletePhoto(req: any, res: any) {
    const { id } = req.body
    if (id) {
      func.connPool('DELETE FROM photo WHERE id=?', id, (rows: any) => {
        res.json({ code: 200, msg: 'delete ok !' })
      })
    } else {
      res.json({ code: 200, msg: '没有id' })
    }
  },

  getFontSub(req: any, res: any) {
    const { text } = req.query
    res.json({ code: 0, msg: '暂不支持' })
    if (text) {
      // fontmin(text).then((file: any) => {
      //   res.set('Content-Type', 'font/woff')
      //   res.send(file)
      // })
    } else {
      res.json({ code: 0, msg: '缺少参数请检查' })
    }
  },

  ...user,
}

export {}
