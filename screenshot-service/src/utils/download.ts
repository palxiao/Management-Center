/*
 * @Author: ShawnPhang
 * @Date: 2021-09-30 14:47:22
 * @Description:  下载图片
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-03-05 21:32:15
 * @site: book.palxp.com / blog.palxp.com
 */
const puppeteer = require('puppeteer')
const images = require('images')
const { executablePath } = require('../configs.ts')
const forceTimeOut = 60000 // 强制超时时间

const saveScreenshot = async (url: string, { path, width, height, thumbPath, size, quality }: any) => {
  return new Promise(async (resolve: Function) => {
    // 启动浏览器
    const browser = await puppeteer.launch({
      // headless: false,
      executablePath,
      ignoreHTTPSErrors: true, // 忽略https安全提示
      args: ['–no-first-run', '–single-process', '–disable-gpu', '–no-zygote', '–disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox', `--window-size=${width},${height}`],
      defaultViewport: null,
    })

    // 打开页面
    const page = await browser.newPage()
    // await page._client.send('Emulation.clearDeviceMetricsOverride')
    // 设置浏览器视窗
    page.setViewport({
      width: Number(width),
      height: Number(height),
      deviceScaleFactor: 1,
    })
    await page.exposeFunction('loadFinishToInject', async () => {
      // console.log('-> 开始截图')
      await page.screenshot({ path })
      // 关闭浏览器
      await browser.close()
      // 压缩图片
      try {
        // 在(10,10)处绘制Logo
        //.draw(images('logo.png'), 10, 10) //Drawn logo at coordinates (10,10)
        // let tinyJpg = images(path).encode('jpg', { quality: 50 })
        // images(tinyJpg).save(path)
        thumbPath &&
          images(path)
            .size(size || 300)
            .save(thumbPath, { quality: quality || 70 })
        // tinyJpg = null
      } catch (err) {
        console.log(err)
      }
      // console.log('浏览器已释放');
      clearTimeout(regulators)
      resolve()
    })
    // 地址栏输入网页地址
    await page.goto(url)
    // 截图: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagescreenshotoptions
    const regulators = setTimeout(() => {
      browser && browser.close()
      console.log('强制释放浏览器')
      resolve()
    }, forceTimeOut)
  })
}

module.exports = { saveScreenshot }

export {}
