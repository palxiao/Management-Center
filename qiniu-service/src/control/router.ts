/*
 * @Author: ShawnPhang
 * @Date: 2020-09-04 22:01:45
 * @Description: 
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-25 15:44:13
 * @site: book.palxp.com / blog.palxp.com
 */
const rExpress = require('express')
const picService = require('../service/qiniu/index.ts')
const albumService = require('../service/album/index.ts')
const blogService = require('../service/blog/index.ts')
const mpService = require('../service/wxMp/index.ts')
const spiderService = require('../service/spider/index.ts')
const designService = require('../service/design/index.ts')
const api = require('./api.ts')

const rRouter = rExpress.Router()

rRouter.post(api.INIT, picService.init)
rRouter.get(api.GET_LIST, picService.getPicList)
rRouter.post(api.DELETE_ONE, picService.delPic)
rRouter.post(api.DELETE, picService.delPicMulti)
rRouter.get(api.GET_UPLOAD_TOKEN, picService.getToken)
rRouter.post(api.UPDATE_NAME, picService.reName)
rRouter.get(api.GET_GALLERY, albumService.getPicList)

rRouter.get(api.GET_BLOG_LIST, blogService.getList)
rRouter.get(api.GET_BLOG_PULL, blogService.pull)
rRouter.get(api.GET_BLOG_DETAIL, blogService.getDetail)
rRouter.post(api.PUT_BLOG, blogService.save)
rRouter.post(api.UPDATE_BLOG_TITLE, blogService.reName)
rRouter.post(api.DELETE_BLOG, blogService.remove)
rRouter.get(api.GET_MP_INIT, mpService.init)
rRouter.get(api.GET_MP_DOWNLOAD_FILE, mpService.download)
rRouter.post(api.POST_MP_GATHER, mpService.gather)

rRouter.get(api.GRAB_TEMP, spiderService.setTemps)
rRouter.get(api.GRAB_COMP, spiderService.setComps)
rRouter.get(api.GRAB_IMAGES, spiderService.setImages)
rRouter.get(api.GRAB_TEMP_GD, spiderService.setTempsGaoDing)
rRouter.get(api.GRAB_COMP_GD, spiderService.setCompsGaoDing)
rRouter.get(api.PROXY_GET, spiderService.proxyGet)

rRouter.get(api.GET_TEMP_LIST, designService.fetchAll)
rRouter.get(api.GET_IMG_LIST, designService.fetchAllImages)
rRouter.post(api.DELETE_IMG, designService.deletePhoto)
rRouter.get(api.GET_CATE_LIST , designService.getCategory)
rRouter.get(api.GET_TEMP_DETAIL , designService.getTemplate)
rRouter.post(api.DELETE_TEMP, designService.deleteTemplate)
rRouter.post(api.DELETE_MATERIAL, designService.deleteMaterial)
rRouter.post(api.UPDATE_TEMP, designService.updateTemplate)
rRouter.post(api.UPDATE_MATERIAL, designService.updateMaterial)
rRouter.get(api.GET_FONTS_LIST, designService.fetchAllFonts)
rRouter.get(api.GET_FONTS_SUB, designService.getFontSub)
rRouter.get(api.GET_MY_DESIGN, designService.fetchAllMyDesign)
rRouter.get(api.GET_MY_DESIGN_DETAIL, designService.getMyDesign)
rRouter.post(api.SAVE_DESIGN, designService.updateDesign)
rRouter.get(api.GET_USER_IMAGE, designService.fetchUserImages)
rRouter.get(api.GET_MATERIAL_LIST, designService.fetchAllMaterial)
rRouter.get(api.GET_ADD_USER_IMAGE, designService.addUserImages)
rRouter.post(api.DELETE_USER_IMAGE, designService.deleteUserImage)
rRouter.post(api.DELETE_MY_DESIGN, designService.deleteUserDesign)

module.exports = rRouter

export default rRouter
