/*
 * @Author: ShawnPhang
 * @Date: 2021-07-22 01:09:44
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-04-15 17:44:19
 * @site: book.palxp.com / blog.palxp.com
 */
export default [
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/',
    name: 'layout',
    redirect: 'home',
    component: () => import('@/components/layout/Basic.vue'),
    meta: { title: '工作空间', icon: 'el-icon-data-analysis', permission: [] },
    children: [
      {
        name: 'home',
        path: '/home',
        component: () => import(/* webpackChunkName: 'base' */ '@/views/Index.vue'),
        meta: { title: '数据监控', permission: [] },
      },
    ],
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/components/layout/Basic.vue'),
    meta: { title: '博客管理', icon: 'el-icon-reading', permission: [] },
    children: [
      {
        name: 'blog-edit',
        path: '/write',
        component: () => import(/* webpackChunkName: 'md' */ '@/views/blog/md-write.vue'),
        meta: { title: '在线编辑器', permission: [] },
      },
    ],
  },
  {
    path: '/resources',
    name: 'resources',
    component: () => import('@/components/layout/Basic.vue'),
    meta: { title: '资源管理', icon: 'el-icon-crop', permission: [] },
    children: [
      {
        name: 'manager',
        path: '/manager',
        component: () => import(/* webpackChunkName: 'p' */ '@/views/design/manager.vue'),
        meta: { title: '设计器管理', permission: [] },
      },
      {
        name: 'AlbumManage',
        path: '/album-manage',
        component: () => import(/* webpackChunkName: 'pic' */ '@/views/album/Manage.vue'),
        meta: { title: '七牛图库', permission: [] },
      },
      {
        name: 'material',
        path: '/material',
        component: () => import(/* webpackChunkName: 's' */ '@/views/design/material.vue'),
        meta: { title: '微信素材库', permission: [] },
      },
    ],
  },
  {
    path: '/artist',
    name: 'artist',
    component: () => import('@/components/layout/Basic.vue'),
    meta: { title: '可视化', icon: 'el-icon-crop', permission: [] },
    children: [
      {
        name: 'poster',
        path: '/poster',
        link: 'http://sudo.palxp.com/home',
        meta: { title: '海报设计', permission: [] },
      },
      {
        name: 'myDesign',
        path: '/my-design',
        component: () => import(/* webpackChunkName: 's' */ '@/views/design/myPoster.vue'),
        meta: { title: '我的作品', permission: [] },
      },
    ],
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@/components/layout/Basic.vue'),
    meta: { title: '系统设置', icon: 'el-icon-s-operation', permission: [] },
    children: [
      {
        name: 'base',
        path: '/base',
        component: () => import(/* webpackChunkName: 's' */ '@/views/setting/base.vue'),
        meta: { title: '基础参数', permission: [] },
      },
    ],
  },
]
