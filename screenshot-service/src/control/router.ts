/*
 * @Author: ShawnPhang
 * @Date: 2020-07-22 20:13:14
 * @Description:  
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-12-26 16:57:28
 * @site: book.palxp.com / blog.palxp.com
 */
const rExpress = require('express');
const screenshots = require('../service/screenshots.ts');
const api = require('./api.ts');

const rRouter = rExpress.Router();

rRouter.get(api.SCREENGHOT, screenshots.getImg);
rRouter.get('/test', screenshots.testPath);
// rRouter.post(api.SAVE, screenshots.saveData);
// rRouter.get(api.GET_DATA, screenshots.getData);


module.exports = rRouter;

export default rRouter;
