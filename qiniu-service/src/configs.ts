/*
 * @Author: ShawnPhang
 * @Date: 2020-07-24 21:43:00
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-22 14:24:12
 * @site: book.palxp.com / blog.palxp.com
 */
/**
 *   0 本地数据库   1 线上数据库
 */

const isDev = process.env.NODE_ENV === 'development'
const switchOne: number = isDev ? 0 : 1
// const switchOne: number = 1

const _config = require('../config.json')
let db = {
  host: '${host}',
  port: 3306,
  user: '${user}',
  password: '${password}',
  database: 'spider',
}
isDev && (db = Object.assign(db, _config))

exports.db = db

exports.wx = {
  APPID: '${APPID}',
  APPSECRET: '${APPSECRET}',
}

exports.QiNiu = {
  AK: isDev ? _config.AK : '${AK}',
  SK: isDev ? _config.SK : '${SK}',
}

exports.spider = {
  type: 'temp',
  cate_id: 12, // 比格设计分类id 3 手机海报 1 公众号封面 12	视频封面 8	文章长图
  category_id: 3, // 我的id 1	手机海报 2	公众号封面 3	视频封面 4	文章长图 5	电商海报
  StartNumber: 1,
  EndNumber: 2,
}

exports.spiderGD = {
  // 稿定Temp分类 4812636 手机海报 4812613|4812617 公众号封面 4812678	视频封面 4812624	文章长图 4812652	电商海报
  // 我的Temp 1	手机海报 2	公众号封面 3	视频封面 4	文章长图 5	电商海报
  // 稿定Comp分类 12-1609221,1617537 13-1609221,1614416 14-1609221,1618449 15-1609221,1614415 18-1609221,1614959
  // 我的Comp 12-基础文字 13-节日热点 14-电商文字 15-晒图标记 18-按钮素材
  type: 'comp',
  filter_id: '1609221,1614959',
  category_id: 16,
  start: 1,
  end: 10,
}
