/*
 * @Author: ShawnPhang
 * @Date: 2020-09-04 22:01:45
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-25 15:44:02
 * @site: book.palxp.com / blog.palxp.com
 */
const path = '/pic'
const client = '/album'
const blog = '/blog'
const mp = '/mp'
const spider = '/spider/'
const design = '/design/'

module.exports = {
  INIT: path + '/init',
  GET_LIST: path + '/list',
  DELETE_ONE: path + '/delOne',
  DELETE: path + '/del',
  GET_UPLOAD_TOKEN: path + '/getToken',
  UPDATE_NAME: path + '/rename',
  GET_GALLERY: client + '',
  /** BLOG 管理 */
  GET_BLOG_PULL: blog + '/init',
  GET_BLOG_LIST: blog + '/list',
  GET_BLOG_DETAIL: blog + '/detail',
  PUT_BLOG: blog + '/save',
  UPDATE_BLOG_TITLE: blog + '/rename',
  DELETE_BLOG: blog + '/remove',
  /** 微信小程序云开发 */
  GET_MP_INIT: mp + '/',
  GET_MP_DOWNLOAD_FILE: mp + '/download',
  POST_MP_GATHER: mp + '/gather',
  // 爬虫程序
  GRAB_TEMP: spider + 'temp',
  GRAB_COMP: spider + 'comp',
  GRAB_IMAGES: spider + 'img',
  GRAB_TEMP_GD: spider + 'temp/gaoding',
  GRAB_COMP_GD: spider + 'comp/gaoding',
  PROXY_GET: spider + 'cors',
  // 设计器接口
  GET_TEMP_LIST: design + 'list',
  GET_MATERIAL_LIST: design + 'material',
  GET_IMG_LIST: design + 'imgs',
  DELETE_IMG: design + 'imgs/del',
  DELETE_TEMP: design + 'del',
  DELETE_MATERIAL: design + 'del/material',
  GET_CATE_LIST: design + 'cate',
  UPDATE_TEMP: design + 'edit',
  UPDATE_MATERIAL: design + 'edit/material',
  GET_TEMP_DETAIL: design + 'temp',
  GET_FONTS_LIST: design + 'fonts',
  GET_FONTS_SUB: design + 'fontSub',
  GET_MY_DESIGN: design + 'my',
  GET_MY_DESIGN_DETAIL: design + 'poster',
  DELETE_MY_DESIGN: design + 'poster/del',
  SAVE_DESIGN: design + 'save',
  GET_USER_IMAGE: design + 'user/image',
  DELETE_USER_IMAGE: design + 'user/image/del',
  GET_ADD_USER_IMAGE: design + 'user/add_image',
}
