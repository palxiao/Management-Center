/*
 * @Author: ShawnPhang
 * @Date: 2022-02-18 16:31:19
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-20 15:36:36
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
            iterator[known[i]].enable &&( obj[known[i]] = iterator[known[i]])
        }
      arr.push(obj)
    }
  } catch (e) {}
  return arr
}
