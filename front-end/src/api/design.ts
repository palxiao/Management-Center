/*
 * @Author: ShawnPhang
 * @Date: 2021-08-26 12:47:40
 * @Description: 相册 api 接口
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-25 15:45:38
 * @site: book.palxp.com / blog.palxp.com
 */
import fetch from '@/utils/axios'
import _config from '@/config'
const prefix = _config.API_URL + '/'
const API = {
  getFontList: prefix + 'design/fonts',
  getTempList: prefix + 'design/list',
  getMaterialList: prefix + 'design/material',
  getCateList: prefix + 'design/cate',
  saveTemp: prefix + 'design/edit',
  delTemp: prefix + 'design/del',
  removeMaterial: prefix + 'design/del/material',
  myDesign: prefix + 'design/my',
  updateMaterial: prefix + 'design/edit/material',
  getPhotoList: prefix + 'design/imgs',
  deletePhoto: prefix + 'design/imgs/del',
  deleteMyDesign: prefix + 'design/poster/del',
  // getMyDesignDetail: prefix + 'design/poster',
}

export const getFontList = (params: Type.Object = {}) => fetch(API.getFontList, params)
export const getCateList = (params: Type.Object = {}) => fetch(API.getCateList, params)
export const getTempList = (params: Type.Object = {}) => fetch(API.getTempList, params)
export const getPhotoList = (params: Type.Object = {}) => fetch(API.getPhotoList, params)
export const getMaterialList = (params: Type.Object = {}) => fetch(API.getMaterialList, params)
export const getMyDesign = (params: Type.Object = {}) => fetch(API.myDesign, params)
export const deleteMyDesign = (params: Type.Object = {}) => fetch(API.deleteMyDesign, params, 'post')

// export const getMyDesignDetail = (params: Type.Object = {}) => fetch(API.getMyDesignDetail, params)

export const saveTemp = (params: Type.Object = {}) => fetch(API.saveTemp, params, 'post')
export const updateMaterial = (params: Type.Object = {}) => fetch(API.updateMaterial, params, 'post')

export const removeComp = (params: Type.Object = {}) => fetch(API.delTemp, params, 'post')
export const removeMaterial = (params: Type.Object = {}) => fetch(API.removeMaterial, params, 'post')
export const removePhoto = (params: Type.Object = {}) => fetch(API.deletePhoto, params, 'post')

export default {
  getFontList,
  getTempList,
  saveTemp,
  removeComp,
  removeMaterial,
  getMyDesign,
  getCateList,
  getMaterialList,
  updateMaterial,
  // getMyDesignDetail,
  getPhotoList,
  removePhoto,
  deleteMyDesign,
}
