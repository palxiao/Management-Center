/*
 * @Author: ShawnPhang
 * @Date: 2022-02-01 13:41:59
 * @Description: 配置文件
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-28 15:28:59
 * @site: book.palxp.com / blog.palxp.com
 */

exports.servicePort = 7001

exports.executablePath = '/opt/google/chrome-unstable/chrome',

exports.maxNum = 2 // 截图队列并发数(阈值)

exports.filePath = process.env.NODE_ENV === 'development' ? process.cwd() + `/static/` : '/cache/'
// exports.filePath = process.cwd() + `/static/`