/*
 * @Author: ShawnPhang
 * @Date: 2020-08-27 22:27:48
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-07-29 15:35:19
 * @site: book.palxp.com / blog.palxp.com
 */

const nshell = require('../../utils/widget/node-shell.ts')
const mfs = require('../../utils/widget/fs.ts')

module.exports = {
  async getList(req: any, res: any) {
    /**
     * @api {get} blog/list 获取博客目录列表
     * @apiVersion 1.0.0
     * @apiGroup 博客 - Hexo
     * @apiDescription 操作博客目录，从github拉取
     *
     * @apiParam {String} path (可选) 追加路径，访问下一级
     *
     * @apiSuccess (result) {String} name 文件/文件名
     * @apiSuccess (result) {String} path 文件/文件路径
     * @apiSuccess (result) {String} size 文件大小，单位 kb ，为目录时不要使用
     * @apiSuccess (result) {Boolean} isdir 是否文件夹，否则为文件
     */
    const { path } = req.query
    const hasBlog = await nshell.checkPath()
    if (!hasBlog) {
      await nshell.init()
    }
    let result = await mfs.readdirSync(path)
    res.json({ code: 200, result })
  },

  async getDetail(req: any, res: any) {
    /**
     * @api {get} blog/detail 获取文章详情
     * @apiVersion 1.0.0
     * @apiGroup 博客 - Hexo
     * @apiDescription 传完整路径
     *
     * @apiParam {String} path 路径
     *
     * @apiSuccess (data) {String} result 内容文本
     *
     */
    const result = await mfs.readFileSync(req.query.path)
    res.json({ code: 200, result })
  },

  async save(req: any, res: any) {
    /**
    * @api {post} blog/save 保存文章
    * @apiVersion 1.0.0
    * @apiGroup 博客 - Hexo
    * @apiDescription 保存文章，不存在路径为新建文章。之后会自动同步到Git仓库。
    * 
    * @apiParam {String} title 文章标题
    * @apiParam {String} path (选填) 完整路径，不填为新建
    * @apiParam {String} content 内容
    */
    const { path, title, content } = req.body
    await mfs.writeFileSync(path, title, content)
    const result = await nshell.push()
    res.json({ code: 200, msg: 'save the blog !', result })
  },

  async reName(req: any, res: any) {
    /**
    * @api {post} blog/rename 重命名
    * @apiVersion 1.0.0
    * @apiGroup 博客 - Hexo
    * @apiDescription 重命名文件 / 文件夹
    * 
    * @apiParam {String} path 完整路径
    * @apiParam {String} title 文章标题
    */
    await mfs.rename(req.body.path, req.body.title)
    res.json({ code: 200, msg: 'change the blog title !' })
  },

  async remove(req: any, res: any) {
    await mfs.remove(req.body.path)
    res.json({ code: 200, msg: 'delete the article !' })
  },

  async pull(req: any, res: any) {
    /**
     * @api {get} blog/init 强制拉取git文章
     * @apiVersion 1.0.0
     * @apiGroup 博客 - Hexo
     * @apiDescription 拉取仓库的 new_blog_2020 分支，第一次请求list时会自动拉取，后续需要强制同步时使用，建议还是在页面每次进入时都强制拉取
     */
    await nshell.init()
    res.json({ code: 200, msg: 'done' })
  },
}

export {}
