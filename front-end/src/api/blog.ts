/*
 * @Author: ShawnPhang
 * @Date: 2021-08-26 12:52:00
 * @Description: 博客 API
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-26 15:24:31
 * @site: book.palxp.com / blog.palxp.com
 */
import fetch from '@/utils/axios'
import _config from '@/config'
const prefix = _config.API_URL + '/'
const API = {
  GET_BLOG_INIT: prefix + 'blog/init',
  GET_BLOG_LIST: prefix + 'blog/list',
  GET_BLOG_DETAIL: prefix + 'blog/detail',
  PUT_BLOG: prefix + 'blog/save',
  UPDATE_BLOG_TITLE: prefix + 'blog/rename',
  DELETE_BLOG: prefix + 'blog/remove',
}

export const init = (params: Type.Object = {}) => fetch(API.GET_BLOG_INIT, params)

export const getList = (params: Type.Object = {}) => fetch(API.GET_BLOG_LIST, params)

export const getDetail = (params: Type.Object = {}) => fetch(API.GET_BLOG_DETAIL, params)

export const save = (params: Type.Object = {}) => fetch(API.PUT_BLOG, params, 'post')

export const rename = (params: Type.Object = {}) => fetch(API.UPDATE_BLOG_TITLE, params, 'post')

export const remove = (params: Type.Object = {}) => fetch(API.DELETE_BLOG, params, 'post')

export default {
  init,
  getList,
  getDetail,
  save,
  rename,
  remove,
}
