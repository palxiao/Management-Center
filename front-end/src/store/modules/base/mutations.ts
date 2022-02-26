/*
 * @Author: ShawnPhang
 * @Date: 2021-07-22 01:09:44
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-25 14:37:11
 * @site: book.palxp.com / blog.palxp.com
 */
/**
 * 同步操作 store.commit() 调用
 */
// import { Toast } from 'vant'
export default {
  setToken(state: Type.Object, token: any) {
    state.user.token = token
    localStorage.setItem('token', token)
  },
  loading(state: Type.Object, data: any) {
    // Toast.clear();
    // let msg = ''
    // if (typeof data === 'string') {
    //     msg = data
    // } else {
    //     Toast.clear();
    //     return false
    // }
    // Toast.loading({
    //     duration: 0,       // 持续展示 toast
    //     loadingType: 'spinner',
    //     message: msg
    // });
  },
  changeRoute(state: Type.Object, from: string) {
    state.routeFrom = from
  },
  changeOnline(state: Type.Object, status: string) {
    state.online = status
  },
  changeUser(state: Type.Object, name: string) {
    state.user.name = name
    state.user = Object.assign({}, state.user)
    localStorage.setItem('username', name)
  },
}
