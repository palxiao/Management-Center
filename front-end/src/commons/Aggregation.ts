/*
 * @Author: ShawnPhang
 * @Date: 2021-08-26 17:05:45
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-29 15:56:31
 * @site: book.palxp.com / blog.palxp.com
 */
import albumApi from '@/api/album'

export default {
  getDomain: async (openBucket: string) => {
    const qn_config = localStorage.getItem('qn_config')
    const res = await albumApi.init({ params: JSON.parse(qn_config || '{}') })
    return new Promise((resolve) => {
      res?.buckets.forEach((item: Type.Object) => {
        const { tbl: key, domain: title } = item
        if (key === openBucket) {
          resolve(title)
        }
      })
    })
  },
}
