<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-24 20:53:21
 * @Description: 侧边栏
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-08 23:08:29
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <el-scrollbar class="scrollbar">
    <Logo v-show="!isCollapse" />
    <el-menu class="el-menu-vertical-demo" v-bind="menuOptions" @open="handleOpen" @close="handleClose">
      <template v-for="(r, ri) in routes" :key="ri">
        <el-submenu v-if="r.meta" :index="r.name">
          <template #title>
            <i :class="r.meta.icon"></i>
            <span class="title">{{ r.meta.title }}</span>
          </template>
          <el-menu-item @click="routeLink(item)" v-for="(item, i) in r.children" :key="i + 'i'" :index="item.name">
            <span class="children">{{ item?.meta?.title }}</span>
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts">
import Logo from './Logo.vue'
import { defineComponent, ref, reactive, toRefs, onBeforeMount } from 'vue'
import bus from '@/utils/tools/eventBus'
import { routes } from '@/router'
import { useRoute, useRouter } from 'vue-router'
const menuOptions = {
  defaultActive: 'home',
  textColor: '#999999',
}

export default defineComponent({
  components: { Logo },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isCollapse = ref(false)
    const state = reactive({
      routes,
      menuOptions: Object.assign(menuOptions, {
        collapse: isCollapse,
      }),
    })

    onBeforeMount(() => {
      state.menuOptions.defaultActive = route.name as any
    })

    const handleOpen = (key: any, keyPath: any) => {
      console.log(key, keyPath)
    }
    const handleClose = (key: any, keyPath: any) => {
      console.log(key, keyPath)
    }
    bus.$on('changeCollapse', (val: boolean) => {
      isCollapse.value = val
    })

    const routeLink = (item: Type.Object) => {
      if (item.link) {
        window.open(item.link, '_blank')
      } else {
        router.push({ path: item.path })
      }
    }

    return {
      ...toRefs(state),
      isCollapse,
      handleOpen,
      handleClose,
      routeLink,
    }
  },
})
</script>

<style lang="less" scoped>
.scrollbar {
  box-shadow: 1px 0 4px rgb(0 21 41 / 2%);
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 242px;
}
.el-menu-vertical-demo {
  min-height: 100vh;
}
.title {
  color: #333;
}
.children {
  padding-left: 9px;
}
</style>