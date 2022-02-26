/*
 * @Author: ShawnPhang
 * @Date: 2021-07-22 01:09:44
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-25 14:48:27
 * @site: book.palxp.com / blog.palxp.com
 */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import config from '@/config'
import hook from './hook'

import Base from './Base'

export const routes: Array<RouteRecordRaw> = [...Base]

const router = createRouter({
  history: createWebHistory(config.BASE_URL), // import.meta.env.BASE_URL
  routes,
})

hook(router)

export default router
