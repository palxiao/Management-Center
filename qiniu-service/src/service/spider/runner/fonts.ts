/*
 * @Author: ShawnPhang
 * @Date: 2022-01-06 11:50:34
 * @Description: 测试
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-03-30 13:56:17
 * @site: book.palxp.com / blog.palxp.com
 */
function Temp() {
  // const url = `https://www.gaoding.com/api/v2/materials/${CompId}/info`
  const url = `https://www.gaoding.com/api/v2/fonts?type=font&page_size=400&page_num=1&region_id=1&biz_code=1&endpoint=4&is_free=`
  // const url = 'https://www.gaoding.com/api/open/editor/gd_web/editor/sim_search?page_num=1&page_size=20&channel_category_id=370&region_id=1&biz_code=1&endpoint=4'
  // const fs = require('fs')
  // const path = require('path')
  const func = require('../../../utils/mysql.ts')
  const axios = require('../../../utils/http.ts')
  // const axios = require('axios')
  const { Upload: Uploader } = require('../../../utils/upload.ts')
  const { QiNiu } = require('../../../../config.js')
  const uploader = new Uploader(QiNiu) // 临时操作
  let count = 0
  let timer: any = null
  axios.get(url).then(async (list: any) => {
    for (const item of list) {
      // const { name, fonturl, coverimg, copy_right } = item
      // if (original.length <= 0) {
      //   console.log('字体不存在，正在上传..')
      //   const preview = await getResourse(axios, uploader, coverimg)
      //   const url = await getResourse(axios, uploader, fonturl)
        // await sleep(1000)
      //   const query = 'INSERT INTO fonts(name, url, preview, copy_right) VALUES(?,?,?,?)'
      //   const arr = [name, url, preview, copy_right]
      //   await func.pConnPool(query, arr)
      //   console.log(name + ' -> 已录入')
      // }

      // const { name, content, preview } = item
      // const { alias, family, lang } = content
      // const query = 'INSERT INTO fonts(name, ttf, woff, preview,value, font_family, size) VALUES(?,?,?,?,?,?,?)'
      // const arr = [alias, content.ttf, content.woff, preview.url, name, family, content.ttf_size]
      // await func.pConnPool(query, arr)
      // console.log(name + ' -> 已录入')

      const { name, content, preview, id } = item
      const { alias, family, lang } = content
      console.log(`第 ${count++} 个 执行中... id ${id}`)
      // const json = { name, alias, family, lang }
      // setJson(json, name)
      // await getResourse(axios, uploader, preview.url, name + '.svg')
      // await getResourse(axios, uploader, content.ttf, name + '.ttf')
      // timer = setTimeout(() => {
      //   Temp()
      //   clearTimeout(timer)
      // }, 30000);
      let f = await func.pConnPool(`SELECT version FROM fonts where value='${name}'`)
      if (f[0].version != 3) {
        // const woffUrl: any = await getResourse(axios, uploader, content.woff, name + '.woff')
        const query = `UPDATE fonts SET lang='${lang}',version=3 WHERE value='${name}'`
        await func.pConnPool(query, [])
        console.log(name + ' -> 已修改')
      } else {
        console.log('<< 跳过');
      }
      // clearTimeout(timer)
    }
  })
}
function getResourse(axios: any, uploader: any, url: string, name: string) {
  const qiniuPrefix = 'http://font.palxp.com/'
  return new Promise(async (resolve) => {
    const resab = await axios.get(url, {
      responseType: 'arraybuffer',
    })
    // let name = url.split('?')[0].split('/').pop()
    // ;(name?.split('.') || []).length <= 1 && (name += '.woff')
    console.log('download..');
    const buffer = Buffer.from(resab, 'binary')
    const result = await uploader.uploadFileByBuffer('cloud-fonts', `${name}`, buffer)
    console.log('upload..');
    resolve(qiniuPrefix + result.key)
  })
  // const fs = require('fs')
  // const path = require('path')
  // return new Promise(async (resolve) => {
  //   const resab = await axios.get(url, {
  //     headers: {},
  //     responseType: 'arraybuffer',
  //   })
  //   const dir = path.resolve(__dirname, `./fonts/`)
  //   if (!fs.existsSync(dir)) fs.mkdirSync(dir)
  //   const buffer = Buffer.from(resab, 'binary')
  //   fs.writeFileSync(path.resolve(__dirname, `./fonts/${name}`), buffer)
  //   resolve('')
  // })
}

function setJson(data: any, name: any) {
  const fs = require('fs')
  const path = require('path')
  fs.writeFile(path.resolve(__dirname, `./fonts/${name}.json`), JSON.stringify(data), (e: any) => {})
}

function sleep(time: any = 1000) {
  return new Promise((resolve: Function) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

Temp()
