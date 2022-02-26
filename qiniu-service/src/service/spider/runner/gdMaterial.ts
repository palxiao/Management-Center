/*
 * @Author: ShawnPhang
 * @Date: 2022-02-17 12:31:57
 * @Description: 采集稿定素材
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-20 16:27:48
 * @site: book.palxp.com / blog.palxp.com
 */
const func = require('../../../utils/mysql.ts')
const { getgdMaterialList, getgdMaterial } = require('../utils/images.ts')

let original: any = []
const materialConfig: any = {
  //   cate_id: 7,
  //   filter_id: '1609187%2C1609190',
  //   cate_id: 6,
  //   filter_id: '1609187%2C1616127%2C1616128',
  //   cate_id: 9,
  //   filter_id: '1609187%2C1614954',
  //   cate_id: 10,
  //   filter_id: '1609187%2C1614389',
  //   cate_id: 11,
  //   filter_id: '1609187%2C4794000',
  cate_id: 8,
  filter_id: '1609187,1609191,1609219',
  start: 1,
  end: 5,
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
        item.url = await getgdMaterial(item.original)
        if (item.url) {
          const query = `INSERT INTO material (title, thumb, width, height, original, type, url, category) VALUES(?,?,?,?,?,?,?,?)` // type
          const arr = [item.title, item.thumb, item.width, item.height, item.original, item.type, item.url, category]
          await func.pConnPool(query, arr)
          console.log('已录入素材')
        } else {
          const { prepareInit, delPicForTemp } = require('../../qiniu/index.ts')
          const { QiNiu: QiNiuData } = require('../../../configs.ts')
          prepareInit(QiNiuData)
          await delPicForTemp({ bucket: 'cloud-design', key: [item.thumb] })
        }
      }
      run()
    })
  }
  run()
})
