/*
 * @Author: ShawnPhang
 * @Date: 2022-02-17 12:31:57
 * @Description: 采集稿定素材
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-04-21 23:04:45
 * @site: book.palxp.com / blog.palxp.com
 */
const func = require('../../../utils/mysql.ts')
const { getgdMaterialList, getgdMaterial } = require('../utils/images.ts')

let original: any = []
const materialConfig: any = {
    // cate_id: 7, // 箭头线条
    // filter_id: '1609187%2C1609190',
    // cate_id: 6, // 形状笔刷
    // filter_id: '1609187%2C1616127%2C1616128',
    // cate_id: 9, // 图标
    // filter_id: '1609187%2C1614954',
    // cate_id: 10, // 装饰
    // filter_id: '1609187%2C1614389',
    // cate_id: 11, // 便签
    // filter_id: '1609187%2C4794000',
  // cate_id: 8, // 容器
  // filter_id: '1609187,1609191,1609219',
  //   cate_id: 19, // 形状
  // filter_id: '1609187,1616127',
  //   cate_id: 20, // 手账元素
  // filter_id: '1609187,1614910',
  // cate_id: 21, // 文字元素
  // filter_id: '1609187,4791173',
    cate_id: 22, // 插画
  filter_id: '1609187,3966904',
  
  start: 1,
  end: 40,
}
func.pConnPool('SELECT original FROM material').then((res: any) => {
  original = res.map((x: any) => x.original)
  const category = materialConfig.cate_id
  let page: any = materialConfig.start - 1
  function run() {
    page++
    if (page > materialConfig.end) {
      return
    }
    console.log(page)
    getgdMaterialList(`page_num=${page}&page_size=1&filter_id=${materialConfig.filter_id}`, original).then(async (list: any) => {
      for (const item of list) {
        const {url, type, width, height, model} = await getgdMaterial(item.original)
        if (url) {
          const query = `INSERT INTO material (title, thumb, width, height, original, type, url, category, model) VALUES(?,?,?,?,?,?,?,?,?)` // type
          const arr = [item.title, item.thumb, width, height, item.original, type, url, category, model]
          await func.pConnPool(query, arr)
          console.log('已录入素材')
        } else {
          const { prepareInit, delPicForTemp } = require('../../qiniu/index.ts')
          const { QiNiu: QiNiuData } = require('../../../configs.ts')
          prepareInit(QiNiuData)
          await delPicForTemp({ bucket: 'cloud-design', key: [item.thumb.replace('http://store.palxp.com/', '').replace('https://design.palxp.com/', '')] })
          console.log('识别失败，删除封面');
        }
      }
      run()
    })
  }
  run()
})
