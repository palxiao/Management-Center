/*
 * @Author: ShawnPhang
 * @Date: 2021-07-22 01:09:44
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-26 11:04:30
 * @site: book.palxp.com / blog.palxp.com
 */
import Vue, { VNode } from 'vue'

declare global {
  namespace Type {
    export interface Object {
      [propName: string]: any
    }
  }
  namespace Ajax {
    // axios return data
    export interface Gql {
      [field: string]: GqlResult
    }

    // reqposne interface
    export interface GqlResult {
      [field: string]: any
    }

    export interface Result {
      [field: string]: any
    }
  }
}

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'vue'
declare module '@antv/f2/*'

declare module 'vue/types/vue' {
  interface Vue {
    $utils: Type.Object
    $nextTick: any
  }
}
