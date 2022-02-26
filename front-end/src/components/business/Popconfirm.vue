<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-29 15:40:37
 * @Description: 弹出提示式确认框
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-29 15:42:51
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <el-popconfirm @confirm="confirm" title="这是一段内容确定删除吗？">
    <template #reference>
      <slot />
    </template>
  </el-popconfirm>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const confirm = () => {
      // confirm
    }

    return {
      confirm,
    }
  },
})
</script>
