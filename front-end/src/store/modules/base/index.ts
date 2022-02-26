/*
 * @Author: ShawnPhang
 * @Date: 2021-07-22 01:09:44
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-25 12:59:47
 * @site: book.palxp.com / blog.palxp.com
 */
import mutations from './mutations'
import actions from './actions'
const all = {
  state: {
    loading: null,
    online: true, // 登录状态，
    user: {
      name: localStorage.getItem('username'),
      token: localStorage.getItem('token'),
    }, // 储存用户信息
    scroll: true,
  },
  getters: {
    online: (state: Type.Object) => {
      return state.online
    },
    user: (state: Type.Object) => {
      return state.user
    },
  },
  mutations: {
    ...mutations,
  },
  actions: {
    ...actions,
  },
}
export default all
