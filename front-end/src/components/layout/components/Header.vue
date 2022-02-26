<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-24 21:09:51
 * @Description: 
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-25 14:21:18
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <i @click="collapse" :class="['icon', 'shouqi', { rotate: isCollapse }]"></i>

  <div>
    <el-dropdown>
      <div class="user__box">
        <i class="el-icon-menu" style="margin-right: 15px"></i>
        <span>ShawnPhang</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive } from 'vue'
import { useRouter } from 'vue-router'
import bus from '@/utils/tools/eventBus'

export default defineComponent({
  setup() {
    const state = reactive({
      isCollapse: false,
    })
    const router = useRouter()

    const collapse = () => {
      state.isCollapse = !state.isCollapse
      bus.$emit('changeCollapse', state.isCollapse)
    }

    const loginOut = () => {
      window.localStorage.clear()
      router.push({ name: 'login' })
    }

    return {
      ...toRefs(state),
      collapse,
      loginOut,
    }
  },
})
</script>


<style lang="less" scoped>
.shouqi {
  transition: all 0.1s;
  cursor: pointer;
  font-size: 20px;
}
.rotate {
  transform: rotate(180deg);
}
.user__box {
  user-select: none;
}
</style>