/*
 * @Author: ShawnPhang
 * @Date: 2022-02-09 17:38:51
 * @Description: 抽取字体文件，只能处理未经压缩的 TTF OTF 文件，web使用的 WOFF类型是压缩过的
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-11 14:06:59
 * @site: book.palxp.com / blog.palxp.com
 */
var Fontmin = require('fontmin')
const nPath = require('path')

module.exports = function (text: string, url: string = 'http://store.palxp.com/fonts/2cZUUGe6_bU8h.woff') {
  const axios = require('../../../utils/http.ts')
  return new Promise((resolve) => {
    // 文字去重
    var textArr = Array.from(new Set(text.split('')))
    text = textArr.join('')

    // 初始化
    var font = nPath.join(__dirname, './t2.ttf')
    var fontmin = new Fontmin().src(font).use(
      // 字型提取插件
      Fontmin.glyph({ text: text, hinting: false })
    )

    fontmin.run(function (err: any, files: any, stream: any) {
      if (err) {
        console.error(err)
      }
      resolve(files[0].contents)
    })
    // axios
    //   .get(url, {
    //     responseType: 'arraybuffer',
    //   })
    //   .then((font: any) => {
    //     // 文字去重
    //     var textArr = Array.from(new Set(text.split('')))
    //     text = textArr.join('')

    //     // 初始化
    //     var font = nPath.join(__dirname, '../../static/huiwenmingchao.otf');
    //     var fontmin = new Fontmin().src(font).use(
    //       // 字型提取插件
    //       Fontmin.glyph({ text: text, hinting: false })
    //     )

    //     fontmin.run(function (err: any, files: any, stream: any) {
    //       if (err) {
    //         console.error(err)
    //       }
    //       resolve(files[0].contents)
    //     })
    //   })
  })
}
