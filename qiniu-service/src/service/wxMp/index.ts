/*
 * @Author: ShawnPhang
 * @Date: 2022-02-08 11:42:39
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-11 14:15:30
 * @site: book.palxp.com / blog.palxp.com
 */
const request = require('../../utils/http.ts')
const { wx } = require('../../configs.ts')

let wxToken = ''
const env = 'daka'
module.exports = {
  async init(req: any, res: any) {
    const APPID = wx.APPID
    const APPSECRET = wx.APPSECRET
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
    const result = await request({
      url,
      headers: {
        'content-type': 'application/json',
      },
    })
    wxToken = result.access_token
    const url2 = `https://api.weixin.qq.com/tcb/databasecollectionget?access_token=${wxToken}`
    const result2 = await request.post(url2, JSON.stringify({ env }), {
      headers: {
        'content-type': 'application/json',
      },
    })
    res.json(result2)
  },
  /**
   * 聚合接口
   * @param req
   * @param res
   */
  async gather(req: any, res: any) {
    const url = `https://api.weixin.qq.com/tcb/${req.query.url}?access_token=${wxToken}`
    const result = await request.post(url, JSON.stringify(Object.assign({ env }, req.body)), {
      headers: {
        'content-type': 'application/json',
      },
    })
    res.json(result)
  },
  /**
   * 获取下载链接
   */
  async download(req: any, res: any) {
    const url = `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${wxToken}`
    const result = await request.post(
      url,
      JSON.stringify({
        env,
        file_list: [
          {
            fileid: req.query.file,
            max_age: 7200,
          },
        ],
      }),
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    )
    res.json(result)
  },
}

export {}
