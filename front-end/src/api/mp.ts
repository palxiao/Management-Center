/*
 * @Author: ShawnPhang
 * @Date: 2021-08-26 12:56:14
 * @Description: 微信API
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-16 16:00:53
 * @site: book.palxp.com / blog.palxp.com
 */
import fetch from '@/utils/axios'
import _config from '@/config'
const prefix = _config.API_URL + '/mp'
const FP_mp = 'http://' + window.location.host.split(':')[0] + ':9999/mp'
const API = {
  GET_MP_INIT: prefix + '/',
  GET_MP_DOWNLOAD_FILE: prefix + '/download',
  POST_MP_GATHER: prefix + '/gather',
  POST_YAN_YE_ADD: FP_mp + '/yanye/addData',
}

export const init = (params: Type.Object = {}) => fetch(API.GET_MP_INIT, params)

/** 通用接口 */
export const gather = (mpUrl: string, params: Type.Object = {}) => fetch(API.POST_MP_GATHER + '?url=' + mpUrl, params, 'post')

/** 临时储存数据接口 */
export const addData = (params: Type.Object = {}) => fetch(API.POST_YAN_YE_ADD, params, 'post')
/** 下载云图片 */
export const download = (params: Type.Object = {}) => fetch(API.GET_MP_DOWNLOAD_FILE, params)

export default {
  init,
  gather,
  addData,
  download,
}
