/*
 * @Author: ShawnPhang
 * @Date: 2022-01-04 09:17:49
 * @Description: 爬取模板/组件
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-03-29 18:33:37
 * @site: book.palxp.com / blog.palxp.com
 */

const downUpdateImage = require('./downUpdateImage.ts')
const tools = require('./index.ts')
let { image: imageDefault, text: textDefault, svg: svgDefault, group: groupDefault, page: pageDefault, fontClass: fontDefault } = require('./data/Default-Data')

const http = require('../../../utils/http.ts')
const url = 'https://bigesj.com/new/design/groupRule/'
const listUrl = 'https://bigesj.com/new/design/groups?published=1'
const { spider: sConfig } = require('../../../configs.ts')
const tempParams = `?cate_id=${sConfig.cate_id}&sort=priority+desc` // '?cate_id=6&industry_id=11&sort=click_nums+desc&limit=4&page=1'
const tempListUrl = 'https://bigesj.com/new/design/lists' + tempParams
const tempUrl = 'https://bigesj.com/new/design/info/'
const headers = {
  referer: 'https://bigesj.com/',
}
// 稿定设计 采集配置
const gaoding: any = {
  url: '',
  // compListUrl: '',
  // tempListUrl: 'https://www.gaoding.com/api/open/editor/gd_web/editor/sim_search?channel_category_id=370&region_id=1&biz_code=1&endpoint=4' + '&page_num=1&page_size=6',
  compMaterialUrl: 'https://www.gaoding.com/api/v2/materials/', // /info
  headers: {
    referer: 'https://www.gaoding.com/',
  },
}

async function addComponents(arr: any = [], downType: string = 'comp', space: string) {
  let collecter: any = []
  const resKeyCollecter: string[] = []
  for (let i = 0; i < arr.length; i++) {
    let checkComplete = true
    const element = arr[i]
    let { name, type, url: imgUrl = '', color, content: text, fontSize, width, height, left, top, letterSpacing, lineHeight, opacity, textAlign, fontFamily, fontWeight, writingMode, textDecoration, rotate } = element
    let defaultData: any = JSON.parse(JSON.stringify(imageDefault))
    let uploadRes: any = null

    if (type === 'text') {
      defaultData = JSON.parse(JSON.stringify(textDefault))
    } else if (type === 'svg' || type === 'image') {
      if (name === '二维码') {
        imgUrl = 'https://rmt-design-dev.imp360.cn/d/data/images/local/c2f3f57c2069a6e3.png'
      } else {
        imgUrl && (uploadRes = await downUpdateImage(imgUrl, headers, downType, space))
      }
      if (!imgUrl) {
        throwErrorInfo('缺少图片素材: ' + type, element, type)
        checkComplete = false
      }
    } else if (element.isGroup && type === 'com') {
      // 比格组合元素
      const { collecter: childComps } = await addComponents(element.children, downType, space) // 添加子组件
      collecter = collecter.concat(childComps)
      // collecter.push(Object.assign(groupDefault, { width, height, left, top, opacity })) // 塞入组合组件（有问题，因实现方式不同，缺少定位父级id的逻辑）
    } else if (element.groupable && type === 'group') {
      // 稿定组合元素
      const { collecter: childComps } = await addComponents(element.elements, downType, space) // 添加子组件
      collecter = collecter.concat(childComps)
    } else {
      throwErrorInfo('存在未知类型: ' + type, element, type)
    }

    checkComplete &&
      collecter.push(
        Object.assign(defaultData, {
          text: text
            ? encodeURIComponent(
                text
                  .replace('成都', '广州')
                  // .replace('YOUR LOGO', 'ZAKER')
                  .replace('比格', '小云')
                  .replace('比小格', '云设计')
                  .replace('bigesj.com', 'palxiao.com')
                  .replace(/^\s+|\s+$/g, '')
              )
            : text,
          fontSize,
          width: +width + 1,
          height: height,
          left,
          top,
          letterSpacing: (letterSpacing * 100) / fontSize, // 此属性设计方式不同所以转换下
          lineHeight,
          opacity,
          textAlign,
          imgUrl: uploadRes ? uploadRes.url : imgUrl,
          color: color || defaultData.color,
          fontFamily: fontFamily ? fontFamily.split(' ').join('') : fontFamily,
          fontWeight,
          writingMode,
          textDecoration,
          rotate: rotate ? rotate + 'deg' : rotate,
        })
      )

    uploadRes && uploadRes.key && resKeyCollecter.push(uploadRes.key)
  }
  return { collecter, resKeyCollecter }
}
async function addComponentsGD(arr: any = [], downType: string = 'comp', space: string, resKey: any = null) {
  let collecter: any = []
  const resKeyCollecter: any = resKey || []
  for (let i = 0; i < arr.length; i++) {
    let checkComplete = true
    const element = arr[i]
    let { type, url: imgUrl, imgUrl: imageUrl, mask, color, content: text, fontSize, width, height, left, top, letterSpacing, lineHeight, opacity, textAlign, fontFamily, fontWeight, writingMode, textDecoration, transform, textEffects: tEsData, colors } = element
    let defaultData: any = JSON.parse(JSON.stringify(imageDefault))
    let uploadRes: any = null
    let uploadRes2: any = null
    let svgUrl: any = undefined
    !imgUrl && (imgUrl = imageUrl || '')
    // throwErrorInfo('调试数据生成: ' + type, element, type)
    if (type === 'text' || type === 'threeText') {
      defaultData = JSON.parse(JSON.stringify(textDefault))
    } else if (type === 'svg') {
      defaultData = JSON.parse(JSON.stringify(svgDefault))
      svgUrl = imgUrl
    } else if (type === 'image' || type === 'mask' || type === 'ninePatch') {
      imgUrl && (uploadRes = await downUpdateImage(imgUrl, headers, downType, space))
      mask && (uploadRes2 = await downUpdateImage(mask, headers, downType, space))
      if (!imgUrl) {
        throwErrorInfo('缺少图片素材: ' + type, element, type)
        checkComplete = false
      }
    } else if (element.groupable && type === 'group') {
      const { collecter: childComps } = await addComponentsGD(element.elements, downType, space, resKeyCollecter) // 添加子组件
      collecter = collecter.concat(
        childComps.map((x: any) => {
          x.top += element.top
          x.left += element.left
          return x
        })
      )
      checkComplete = false
    } else {
      throwErrorInfo('存在未知类型: ' + type, element, type)
    }
    // 计算角度
    const rotate = tools.matrix2rotate(transform)
    const textEffects = tools.getTextEffects(tEsData)
    // 获取字体
    const fontClass = fontFamily ? await tools.getGDFont(fontFamily.split(' ').join('')) : fontFamily

    checkComplete &&
      collecter.push(
        Object.assign(defaultData, {
          text: text
            ? encodeURIComponent(
                text
                  .replace(/厦门/g, '广州')
                  .replace(/稿定/g, '速图')
                  .replace(/^\s+|\s+$/g, '')
              )
            : text,
          fontSize,
          width: +width + 1,
          height: height,
          left,
          top,
          letterSpacing: (letterSpacing * 100) / fontSize, // 此属性设计方式不同所以转换下
          lineHeight,
          opacity,
          textAlign,
          imgUrl: uploadRes ? uploadRes.url : imgUrl,
          mask: uploadRes2 ? uploadRes2.url : undefined,
          color: color || defaultData.color,
          fontClass,
          fontWeight,
          writingMode,
          textDecoration,
          rotate: rotate ? rotate + 'deg' : rotate,
          transformData: transform,
          textEffects,
          colors,
          svgUrl,
        })
      )
    uploadRes && uploadRes.key && resKeyCollecter.push(uploadRes.key)
    uploadRes2 && uploadRes2.key && resKeyCollecter.push(uploadRes2.key)
  }
  return { collecter, resKeyCollecter }
}
function compFactory(defaultData: any, layouts: any) {
  let { url: imgUrl = '', color, content: text, fontSize, width, height, left, top, letterSpacing, lineHeight, opacity, textAlign, fontFamily, fontWeight, writingMode, textDecoration, transform, textEffects: tEsData } = layouts
  const rotate = tools.matrix2rotate(transform)
  const textEffects = tools.getTextEffects(tEsData)
  return Object.assign(defaultData, {
    text: text ? encodeURIComponent(text.replace('厦门', '广州').replace(/^\s+|\s+$/g, '')) : text,
    fontSize,
    width: +width + 1,
    height: height,
    left,
    top,
    letterSpacing: (letterSpacing * 100) / fontSize, // 此属性设计方式不同所以转换下
    lineHeight,
    opacity,
    textAlign,
    color: color || defaultData.color,
    fontFamily: fontFamily ? fontFamily.split(' ').join('') : fontFamily,
    fontWeight,
    writingMode,
    textDecoration,
    rotate: rotate ? rotate + 'deg' : rotate,
    transformData: transform,
    textEffects,
  })
}

function throwErrorInfo(text: string, data: any, type: any) {
  const fs = require('fs')
  const path = require('path')
  console.error(text + ' --> 日志已生成 ')
  fs.writeFile(path.resolve(__dirname, `./logs/${type}-${Math.random()}.json`), JSON.stringify(data), (e: any) => {})
}

module.exports = {
  getComponent(CompId: string = '0') {
    return new Promise((resolve) => {
      http.get(url + CompId).then(async (resp: any) => {
        let data = null
        let layouts = null
        let pass = true
        try {
          data = resp.data
          layouts = data.content.layouts[0]
        } catch (error) {
          console.log(data.content)
          pass = false
        }
        if (!pass) {
          return
        }
        // 添加各种组件
        const { collecter, resKeyCollecter } = await addComponents(layouts.elements, 'comp', `bg-${CompId}`)
        collecter.resKeyCollecter = resKeyCollecter
        // 塞入默认组件
        collecter.push(
          Object.assign(groupDefault, {
            width: layouts.width,
            height: layouts.height,
          })
        )
        resolve(collecter)
      })
    })
  },
  getTemplate(tempId: string = '0') {
    return new Promise((resolve) => {
      console.log(`! 开始获取模板: ${tempId}`)
      http.get(tempUrl + tempId).then(async (resp: any) => {
        let data = null
        let layouts = null
        let pass = true
        let title = ''
        let tags = ''
        try {
          data = JSON.parse(resp.data.content)
          tags = resp.data.tag
          title = resp.data.name
          layouts = data.layouts[0]
        } catch (error) {
          console.log(data)
          pass = false
        }
        if (!pass) {
          return
        }
        const result: any = {}
        try {
          const { backgroundColor, backgroundUrl, imageTransform: backgroundTransform, width, height } = layouts

          const { collecter, resKeyCollecter } = await addComponents(layouts.elements, 'template', `bg-${tempId}`)
          result.widgets = collecter
          result.resKeyCollecter = resKeyCollecter

          let backgroundImage = ''
          if (backgroundUrl) {
            const { url, key }: any = await downUpdateImage(backgroundUrl, headers, 'template', `bg-${tempId}`)
            result.resKeyCollecter.push(key)
            backgroundImage = url
          }
          const defaultData = JSON.parse(JSON.stringify(pageDefault))
          result.page = Object.assign(defaultData, { backgroundColor, backgroundImage, backgroundTransform, width, height })
          result.title = title
          result.tags = tags
        } catch (e) {
          console.log('添加组件出现问题：', e)
        }
        resolve(result)
      })
    })
  },
  getCompList(params: any = {}, oids: string[] = []) {
    params = Object.assign({ limit: 1, page: 1 }, params) // &limit=5&page=1
    let url_params = ''
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        url_params += `&${key}=${params[key]}`
      }
    }
    return new Promise(async (resolve) => {
      http.get(listUrl + url_params).then(async (resp: any) => {
        const datalist = resp.data.datalist
        const result: any = []
        for (let i = 0; i < datalist.length; i++) {
          if (!oids.includes(datalist[i].id.toString())) {
            const uploadRes: any = await downUpdateImage(datalist[i].coverimg, headers, 'cover', `bg-${datalist[i].id}`)
            result.push({ id: datalist[i].id, cover: uploadRes.url })
          }
        }
        resolve(result)
      })
    })
  },
  getTempList(params: any = {}, oids: string[] = []) {
    params = Object.assign({ limit: 1, page: 1 }, params) // &limit=5&page=1
    let url_params = ''
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        url_params += `&${key}=${params[key]}`
      }
    }
    console.log(`! 采集第 ${params.page} 页`)
    return new Promise(async (resolve) => {
      http.get(tempListUrl + url_params).then(async (resp: any) => {
        const datalist = resp.data.datalist
        const result: any = []
        for (let i = 0; i < datalist.length; i++) {
          if (!oids.includes(datalist[i].id.toString()) && datalist[i].coverimg.indexOf('.gif') === -1) {
            // 暂不支持gif，所以过滤掉
            const { url: cover }: any = await downUpdateImage(datalist[i].coverimg, headers, 'cover', `bg-${datalist[i].id}`)
            result.push({ id: datalist[i].id, cover })
          }
        }
        resolve(result)
      })
    })
  },
  getTemplateGaoding(tempId: string = '0') {
    const url = 'https://www.gaoding.com/api/v2/materials/'
    return new Promise((resolve) => {
      http.get(url + tempId + '/info').then(async (resp: any) => {
        let pass = true
        let layouts = null
        let title = ''
        let elements = null
        try {
          const data = JSON.parse(resp.content)
          // throwErrorInfo('调试 ', data, 'data')
          layouts = data.layouts[0] // data.global.layout
          elements = data.layouts[0].elements
          title = resp.title
        } catch (error) {
          console.log('请求失败')
          pass = false
        }
        if (!pass) {
          return
        }
        const result: any = {}
        const { backgroundColor, backgroundImage: backgroundUrl, width, height } = layouts

        const { collecter, resKeyCollecter } = await addComponentsGD(elements, 'template', `gd-${tempId}`)
        result.collecter = { widgets: collecter }
        result.resKeyCollecter = resKeyCollecter

        let backgroundImage = ''
        if (backgroundUrl) {
          const { url, key }: any = await downUpdateImage(backgroundUrl, headers, 'template', `gd-${tempId}`)
          result.resKeyCollecter.push(key)
          backgroundImage = url
        }
        const defaultData = JSON.parse(JSON.stringify(pageDefault))
        result.collecter.page = Object.assign(defaultData, { backgroundColor, backgroundImage, width, height })
        result.title = title
        result.width = width
        result.height = height
        resolve(result)
      })
    })
  },
  getComponentGaoding(CompId: string = '0') {
    return new Promise((resolve) => {
      http.get(gaoding.compMaterialUrl + CompId + '/info').then(async (resp: any) => {
        let pass = true
        let layouts = null
        let title = ''
        try {
          const data = JSON.parse(resp.content)
          title = resp.title
          layouts = data.model
        } catch (error) {
          console.log(resp)
          pass = false
        }
        if (!pass) {
          return
        }
        const result: any = {}
        if (layouts.type === 'group') {
          const { collecter, resKeyCollecter } = await addComponentsGD(layouts.elements, 'comp', `gd-${CompId}`)
          result.collecter = collecter
          result.resKeyCollecter = resKeyCollecter
          result.title = title
          result.width = layouts.width
          result.height = layouts.height
          result.collecter.push(
            Object.assign(groupDefault, {
              width: layouts.width,
              height: layouts.height,
            })
          )
          resolve(result)
        } else if (layouts.type === 'text') {
          let defaultData = JSON.parse(JSON.stringify(textDefault))
          result.collecter = compFactory(defaultData, layouts)
          resolve(result)
        }
      })
    })
  },
  getTempListGaoding(setType: any, params: any, oids: string[] = []) {
    const { filter_id, page, limit }: any = params
    const prefix = 'https://www.gaoding.com/api/open/editor/gd_web/editor/'
    const tempListUrl = `${prefix}sim_search?page_num=${page}&page_size=${limit}&q=&sort=&filter_id=${filter_id}&region_id=1&biz_code=1&endpoint=4&is_free=&similar_mid=101094664`
    const compListUrl = `${prefix}material?platforms=0&channels=1&filter_id=${filter_id}&q=&region_id=1&biz_code=1&endpoint=4&page_size=${limit}&page_num=${page}`
    const url = setType == 1 ? compListUrl : tempListUrl
    // console.log('list url = ', url);
    return new Promise(async (resolve) => {
      http.get(url).then(async (resp: any) => {
        const datalist = resp
        const result: any = []
        for (let i = 0; i < datalist.length; i++) {
          if (!oids.includes(datalist[i].id.toString())) {
            const { url: cover }: any = await downUpdateImage(datalist[i].preview.url, gaoding.headers, 'cover', `gd-${datalist[i].id}`)
            result.push({ id: datalist[i].id, cover })
          }
        }
        resolve(result)
      })
    })
  },
}
