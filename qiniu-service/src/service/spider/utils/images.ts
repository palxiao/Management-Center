/*
 * @Author: ShawnPhang
 * @Date: 2022-01-04 10:04:20
 * @Description: 图片素材爬取
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-21 23:39:33
 * @site: book.palxp.com / blog.palxp.com
 */
const axiosImage = require('../../../utils/http.ts')

function fetch(url: string, params: any) {
  return new Promise((resolve) => {
    axiosImage.get(url).then((resp: any) => {
      resolve(resp)
    })
  })
}

module.exports = {
  getUnsplash(params: any = { page: 1 }, oids: string[], search: string = 'material') {
    const size: string | number = 30
    const url = `https://unsplash.com/napi/search/photos?query=${search}&xp=&per_page=${size}&page=${params.page}`
    return new Promise(async (resolve) => {
      const res: any = await fetch(url)
      const data = res.results
      console.log('资源数: ' + res.total)
      const results: any = []
      for (const x of data) {
        if (!oids.includes(x.id.toString())) {
          results.push({
            // url: x.urls.full,
            category: 17,
            url: x.urls.small,
            thumb: x.urls.thumb,
            original: x.id,
            width: x.width,
            height: x.height,
          })
        }
      }
      resolve(results)
    })
  },
  // getbigeImages(size: string, oids: string[]) {
  //   const headers = {
  //     referer: 'https://bigesj.com/',
  //   }
  //   const downUpdateImage = require('./downUpdateImage.ts')
  //   // https://bigesj.com/new/design/backgrounds?cate_id=2&limit=24&page=1 // cate_id 2 渐变，3纹理材质 4自然风景
  //   const url = 'https://bigesj.com/new/design/backgrounds?cate_id=3&limit=24&page=1'
  //   return new Promise(async (resolve) => {
  //     const res: any = await fetch(url)
  //     const results: any = []
  //     for (const x of res.data.datalist) {
  //       if (!oids.includes(x.id.toString())) {
  //         const { url }: any = await downUpdateImage(x.coverimg, headers, 'bg')
  //         results.push({
  //           url,
  //           original: x.id,
  //           type: 11,
  //         })
  //       }
  //     }
  //     resolve(results)
  //   })
  // },
  getgdBackground(params: any = { page: 1 }, oids: string[]) {
    // const size: string | number = 30
    const url = `https://www.gaoding.com/api/open/editor/gd_web/editor/material?page_num=${params.page}&page_size=200&filter_id=1610349&q=&region_id=1&biz_code=1&endpoint=4&is_free=`
    return new Promise(async (resolve) => {
      const data: any = await fetch(url)
      const results: any = []
      for (const x of data) {
        if (!oids.includes(x.id.toString())) {
          results.push({
            // url: x.urls.full,
            category: 16,
            url: x.preview.url,
            thumb: x.preview.url,
            original: x.id,
            width: x.preview.width,
            height: x.preview.height,
          })
        }
      }
      resolve(results)
    })
  },
  getgdMaterialList(params: any, oids: string[] = []) {
    // page_num=1&page_size=30&filter_id=1609187%2C1609190
    const url = `https://www.gaoding.com/api/open/editor/gd_web/editor/material?${params}&platforms=0&channels=1&q=&region_id=1&biz_code=1&endpoint=4`
    const headers = {
      referer: 'https://www.gaoding.com/',
    }
    const downUpdateImage = require('./downUpdateImage.ts')

    return new Promise(async (resolve) => {
      const res: any = await fetch(url)
      const results: any = []
      for (const x of res) {
        if (!oids.includes(x.id.toString())) {
          const { url }: any = await downUpdateImage(x.preview.url, headers, 'material', 'gd-' + x.id)
          results.push({
            thumb: url,
            title: x.title,
            width: x.preview.width,
            height: x.preview.height,
            original: x.id,
            type: x.type,
          })
        }
      }
      resolve(results)
    })
  },
  getgdMaterial(id: number | string) {
    const url = `https://www.gaoding.com/api/v2/materials/${id}/info?ignore_status=1`
    const downUpdateImage = require('./downUpdateImage.ts')
    const headers = {
      referer: 'https://www.gaoding.com/',
    }
    return new Promise(async (resolve) => {
      const res: any = await fetch(url)
      const results: any = JSON.parse(res.content)
      if (results.model && results.model.url) {
        const { url }: any = await downUpdateImage(results.model.url, headers, 'material', 'gd-' + id)
        resolve(url)
      } else {
        resolve('')
      }
    })
  },
}
