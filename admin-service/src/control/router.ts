const rExpress = require('express');
const auth = require('../service/auth.ts');
const api = require('./api.ts');

const rRouter = rExpress.Router();

rRouter.post(api.LOGIN, auth.login);
rRouter.get(api.USER_INFO, auth.userInfo);

module.exports = rRouter;

export default rRouter;
