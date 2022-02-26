<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-29 15:02:34
 * @Description: 分页组件 - element版本
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-21 23:46:10
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <div class="pages">
    <el-pagination :current-page="page.index" @currentChange="pageChange" layout="prev, pager, next" :page-size="20" :total="page.totalNum"></el-pagination>
  </div>
</template>

<script lang="ts">
import { ElPagination } from 'element-plus'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { ElPagination },
  props: {
    page: {
      default: {
        index: 0,
        totalNum: 0,
      },
    },
  },
  emits: ['next', 'prev', 'change'],
  setup(props, context) {
    const pageChange = (num: number) => {
      context.emit('change', num)
    }

    return {
      pageChange,
    }
  },
})
</script>


<style lang="less" scoped>
.pages {
  margin-top: 20px;
}
</style>