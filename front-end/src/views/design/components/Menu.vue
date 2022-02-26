<!--
 * @Author: ShawnPhang
 * @Date: 2022-02-16 11:30:39
 * @Description: 管理菜单
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-21 23:02:33
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
    <el-menu-item index="1">字体库</el-menu-item>
    <el-submenu index="2">
      <template #title>模板管理</template>
      <el-menu-item v-for="hb in listData.temp" :key="hb.id + 'hb'" :index="'2-' + hb.id">{{ hb.name }}</el-menu-item>
      <!-- <el-submenu index="2-4">
        <template #title>公众号封面</template>
        <el-menu-item index="2-4-1">公众号首图</el-menu-item>
        <el-menu-item index="2-4-2">公众号次图</el-menu-item>
      </el-submenu> -->
    </el-submenu>
    <el-submenu index="3">
      <template #title>素材管理</template>
      <el-menu-item v-for="sc in listData.material" :key="sc.id + 'hb'" :index="'3-' + sc.id">{{ sc.name }}</el-menu-item>
    </el-submenu>
    <el-submenu index="4">
      <template #title>文字组件</template>
      <el-menu-item v-for="wz in listData.text" :key="wz.id + 'hb'" :index="'4-' + wz.id">{{ wz.name }}</el-menu-item>
    </el-submenu>
    <el-submenu index="5">
      <template #title>图库管理</template>
      <el-menu-item v-for="tk in listData.photo" :key="tk.id + 'tk'" :index="'5-' + tk.id">{{ tk.name }}</el-menu-item>
    </el-submenu>
  </el-menu>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import api from '@/api/design'

export default defineComponent({
  setup(props, context) {
    const activeIndex = ref('1')
    const listData: any = ref({
      temp: [],
      material: [],
      text: [],
      photo: [],
    })

    api.getCateList().then((list: Ajax.Result) => {
      listData.value.temp = list.filter((x: any) => x.type === 1)
      listData.value.material = list.filter((x: any) => x.type === 2)
      listData.value.text = list.filter((x: any) => x.type === 3)
      listData.value.photo = list.filter((x: any) => x.type === 4)
    })

    const handleSelect = (key: string, keyPath: string[]) => {
      context.emit('onChange', { key, keyPath })
    }

    return {
      activeIndex,
      handleSelect,
      listData,
    }
  },
})
</script>

