<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-29 15:25:20
 * @Description: 
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-29 18:07:11
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <el-input size="small" placeholder="筛选或上传时都会生效" clearable @clear="search" v-model="searchValue" class="input-search">
    <template #prepend>输入前缀</template>
    <template #append>
      <el-button @click="search" icon="el-icon-search"></el-button>
    </template>
  </el-input>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  emits: ['search'],
  setup(props, context) {
    const state = reactive({
      searchValue: '',
    })
    const search = () => {
      context.emit('search')
    }
    return {
      ...toRefs(state),
      search,
    }
  },
})
</script>

<style lang="less" scoped>
.input-search {
  width: 360px;
}
</style>