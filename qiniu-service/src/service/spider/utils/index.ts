/*
 * @Author: ShawnPhang
 * @Date: 2022-02-18 16:31:19
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-04-06 23:30:34
 * @site: book.palxp.com / blog.palxp.com
 */
interface Matrix {
  a: number
  b: number
  c: number
  d: number
  tx: number
  ty: number
}

exports.matrix2rotate = (params: Matrix) => {
  const aa = Math.round((180 * Math.asin(params.a)) / Math.PI)
  const bb = Math.round((180 * Math.acos(params.b)) / Math.PI)
  const cc = Math.round((180 * Math.asin(params.c)) / Math.PI)
  const dd = Math.round((180 * Math.acos(params.d)) / Math.PI)
  let deg = 0
  if (aa == bb || -aa == bb) {
    deg = dd
  } else if (-aa + bb == 180) {
    deg = 180 + cc
  } else if (aa + bb == 180) {
    deg = 360 - cc || 360 - dd
  }
  return deg >= 360 ? 0 : deg
  //return (aa+','+bb+','+cc+','+dd);
}

exports.getTextEffects = (data: any = []) => {
  const arr = []
  try {
    for (const iterator of data) {
      const known = ['stroke', 'shadow', 'filling']
      const obj: any = {}
      for (let i = 0; i < known.length; i++) {
        iterator[known[i]].enable && (obj[known[i]] = iterator[known[i]])
      }
      arr.unshift(obj)
    }
  } catch (e) {}
  return arr.length > 0 ? arr : undefined
}

const { fonts: FONTS } = require('./data/Fonts-Data.js')
const { fontClass } = require('./data/Default-Font.js')
exports.getGDFont = async (fontFamily: any) => {
  const localFonts = FONTS || []
  const font = JSON.parse(JSON.stringify(fontClass))
  let gdFont = localFonts.find((font: any) => font.value == fontFamily)
  if (!gdFont) {
    const searchFallback: any = await searchFonts(fontFamily)
    for (let i = 0; i < searchFallback.length; i++) {
      const { dest } = searchFallback[i]
      gdFont = localFonts.find((font: any) => font.value === dest)
      if (gdFont) {
        break
      }
    }
  }
  if (gdFont) {
    font.id = gdFont.id
    font.value = gdFont.value
    font.url = gdFont.url
    font.alias = gdFont.alias
  }
  return font
}

// 请求稿定不知名接口获得字体
function searchFonts(fontFamily: any) {
  const http = require('../../../utils/http.ts')
  return new Promise((resolve) => {
    http.get('https://www.gaoding.com/api/v2/font-fallbacks', { params: { font_name: fontFamily } }).then((resp: any) => {
      resolve(resp)
    })
  })
}
