/*
 * @Author: ShawnPhang
 * @Date: 2021-08-24 11:54:27
 * @Description: 
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-03-02 23:34:26
 * @site: book.palxp.com / blog.palxp.com
 */
// const sql = require('../utils/widget/sql.ts')
// const func = require('../utils/mysql.ts')
// const $utils = require('../utils/index.ts')

module.exports = {
  login(req: any, res: any) {
    /**
     * @api {get} api/--- 示例
     * @apiVersion 1.0.0
     * @apiGroup test
     *
     * @apiParam {String} none none
     */
    if (req.body.password === '76cd438bd0e8899a61aff632ace54dbb' && req.body.username === 'admin') {
      res.json({
        code: 200,
        result: {
          id: 1,
          name: 'name',
          username: 'admin',
          password: '',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
          status: 1,
          telephone: '',
          lastLoginIp: '27.154.74.117',
          lastLoginTime: 1534837621348,
          creatorId: 'admin',
          createTime: 1497160610259,
          deleted: 0,
          roleId: 'admin',
          lang: 'zh-CN',
          token: '4291d7da9005377ec9aec4a71ea837f',
        },
      })
    } else {
      res.json({code: -1})
    }
  },
  userInfo(req: any, res: any) {
    /**
     * @api {get} api/--- 示例
     * @apiVersion 1.0.0
     * @apiGroup test
     *
     * @apiParam {String} none none
     */
    res.json({})
  },
}

export {}
