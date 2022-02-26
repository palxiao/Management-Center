/*
 * @Author: ShawnPhang
 * @Date: 2021-07-29 09:39:12
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-30 14:58:48
 * @site: book.palxp.com / blog.palxp.com
 */
const { Blog } = require('../../../config.js')

class blogState {
  static prefix: string = Blog.prefix
  static path: string = 'blog/'
  static ResourcePath: string = 'source/_posts/'
  static fullPath: string = blogState.prefix + blogState.path
  static email = 'palxiao@vip.qq.com'
  static gitName = 'ShawnPhang'
  static branch = 'new_blog_2020'
  static git_address = 'git@github.com:palxiao/hexo-blog.git'
}

module.exports = { blogState }

export {}
