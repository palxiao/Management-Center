/*
 * @Author: ShawnPhang
 * @Date: 2021-08-29 22:10:17
 * @Description: vue指令 - 全局
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-30 00:09:50
 * @site: book.palxp.com / blog.palxp.com
 */
export default {
  clipboard: {
    mounted(el: any, binding: any, vnode: any) {
      const _this = vnode
      // 利用arg用来注入回调函数
      if (binding.arg === 'success') {
        _this.__clipboardSuccess = binding.value
      } else if (binding.arg === 'error') {
        _this.__clipboardError = binding.value
      } else {
        // 正常情况下就将文字缓存起来
        _this.__clipboardValue = binding.value
      }
      el.handler = () => {
        if (!_this.__clipboardValue) {
          _this.__clipboardError && _this.__clipboardError('无内容')
          return
        }
        if (binding.arg) {
          // 这里是因为属性被我们用了多次会多次执行，所以限制了执行次数
          return
        }
        try {
          const textarea: any = document.createElement('textarea')
          textarea.readOnly = 'readonly' // 禁止输入， readonly 防止手机端错误聚焦自动唤起键盘
          textarea.setAttribute('style', 'position:fixed;top:-9999px;left:-9999px;') // 它是可见的，但它又是不可见的
          textarea.value = binding.value
          document.body.appendChild(textarea)
          textarea.select()
          const result = document.execCommand('Copy')
          if (result) {
            _this.__clipboardSuccess && _this.__clipboardSuccess(binding.value) // 这里可以定义成功回调返回的数据
          }
          document.body.removeChild(textarea)
        } catch (e) {
          _this.__clipboardError && _this.__clipboardError(e)
        }
      }
      el.addEventListener('click', el.handler)
    },
    updated(el: any, { arg, value }: any, vnode: any) {
      // 更新值时候触发
      const _this = vnode
      if (!arg) {
        _this.__clipboardValue = value // 注册回调的部分不要赋值
      }
    },
    unmounted(el: any) {
      el.removeEventListener('click', el.handler)
    },
  },
}
