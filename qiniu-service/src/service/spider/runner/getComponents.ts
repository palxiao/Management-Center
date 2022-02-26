/*
 * @Author: ShawnPhang
 * @Date: 2022-02-11 18:44:09
 * @Description: 爬取文字组合
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-18 14:39:24
 * @site: book.palxp.com / blog.palxp.com
 */
const { spiderGD: spiderConfigGD } = require('../../../configs.ts')
let pageIndex = spiderConfigGD.start
let maxPageIndex = spiderConfigGD.end
let spiderUrl = `http://localhost:9998/spider/${spiderConfigGD.type}/gaoding?limit=1&page=`
let gdTempTimer: any = null

async function RunGrabGD(url: string, page: number) {
  pageIndex++
  if (pageIndex > maxPageIndex + 1) {
    return
  }
  console.log(page)
  gdTempTimer = setTimeout(() => {
    console.log('任务超时，重新爬取中......')
    pageIndex--
    RunGrabGD(spiderUrl, pageIndex)
  }, 60000)
  // setTemps2({limit: 1, page: pageIndex})

  const axios = require('../../../utils/http.ts')
  axios
    .get(url + page)
    .then((resp: any) => {
      console.log('采集完毕' + resp.msg)
      clearTimeout(gdTempTimer)
      gdTempTimer = null
      RunGrabGD(spiderUrl, pageIndex)
    })
    .catch((e: any) => {
      console.log(e)
    })
}

console.log('开始爬取数据...')
RunGrabGD(spiderUrl, pageIndex)
