/*
 * @Author: ShawnPhang
 * @Date: 2021-12-31 11:09:30
 * @Description: Type: 0 模板，1 文字组件
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-21 23:34:56
 * @site: book.palxp.com / blog.palxp.com
 */
const func = require('../../utils/mysql.ts')
const { getComponent, getTempList, getTemplate, getCompList, getTempListGaoding, getComponentGaoding, getTemplateGaoding } = require('./utils/template.ts')
const { getUnsplash, getgdBackground } = require('./utils/images.ts')
const http = require('../../utils/http.ts')

async function spiderTemp(setType: string | number = 0, params: any = { limit: 1, page: 1 }) {
  let original = await func.pConnPool(`SELECT original FROM ${setType == 0 ? 'template' : 'component'}`)
  original = original.map((x: any) => x.original)
  const list = setType == 0 ? await getTempList(params, original) : await getCompList(params, original)
  const { spider: sConfig } = require('../../configs.ts')
  for (let i = 0; i < list.length; i++) {
    const collecter = setType == 0 ? await getTemplate(list[i].id) : await getComponent(list[i].id)
    const resource = collecter.resKeyCollecter
    delete collecter.resKeyCollecter
    const title = collecter.title
    delete collecter.title
    const tag = collecter.tags
    delete collecter.tags
    const query = `INSERT INTO ${setType == 0 ? 'template' : 'component'} (cover, data, original, resource, title, tag, category) VALUES(?,?,?,?,?,?,?)` // type
    const arr = [list[i].cover, JSON.stringify(collecter), list[i].id, resource + '', title, tag, sConfig.category_id]
    await func.pConnPool(query, arr)
  }
}
async function spiderTempGD(setType: string | number = 0, params: any = { limit: 1, page: 1 }) {
  let original = await func.pConnPool(`SELECT original FROM ${setType == 0 ? 'template' : 'component'}`)
  original = original.map((x: any) => x.original)
  const { spiderGD: gdConfig } = require('../../configs.ts')
  params.filter_id = gdConfig.filter_id
  const list = await getTempListGaoding(setType, params, original)
  for (let i = 0; i < list.length; i++) {
    const { collecter, title, resKeyCollecter: resource = '', width, height } = setType == 0 ? await getTemplateGaoding(list[i].id) : await getComponentGaoding(list[i].id)
    const query = `INSERT INTO ${setType == 0 ? 'template' : 'component'} (cover, data, original, resource, title, category, width, height) VALUES(?,?,?,?,?,?,?,?)`
    const arr = [list[i].cover, JSON.stringify(collecter), list[i].id, resource + '', title, gdConfig.category_id, width, height]
    await func.pConnPool(query, arr)
  }
}

module.exports = {
  async setTemps(req: any, res: any) {
    await spiderTemp(0, req.query)
    console.log('--> 采集结束，参数: ' + JSON.stringify(req.query))
    res.json({ code: 200, msg: req.query.page + '---' + new Date() })
  },
  async setComps(req: any, res: any) {
    await spiderTemp(1, req.query)
    console.log('采集结束，新增组件 - 个')
    res.json({ code: 200, msg: '运行结束' + new Date() })
  },
  async setTempsGaoDing(req: any, res: any) {
    await spiderTempGD(0, req.query)
    res.json({ code: 200, msg: '运行结束' + new Date() })
  },
  async setCompsGaoDing(req: any, res: any) {
    await spiderTempGD(1, req.query)
    res.json({ code: 200, msg: '运行结束' + new Date() })
  },

  async setImages(req: any, res: any) {
    let original = await func.pConnPool('SELECT original FROM photo')
    original = original.map((x: any) => x.original)

    // const images = await getUnsplash(req.query, original)
    const images = await getgdBackground(req.query, original)
    let values: any = []
    images.forEach((item: any) => {
      const { url, thumb, original, width, height, category } = item
      values.push(`("${url}","${thumb || ''}","${original}","${width || 0}","${height || 0}","${category || 0}")`)
    })
    if (values.length > 0) {
      const query = `INSERT INTO photo(url, thumb, original, width, height, category) VALUES ${values.toString()}`
      await func.pConnPool(query)
    }
    res.json({ code: 200, msg: '运行结束' + new Date() })
  },

  proxyGet(req: any, res: any) {
    let url = req.query.url
    delete req.query.url
    http.get(url, { params: req.query }).then((resp: any) => {
      res.json(resp)
    })
  },
}

export {}
