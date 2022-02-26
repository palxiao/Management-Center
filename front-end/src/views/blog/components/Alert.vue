<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-26 15:33:03
 * @Description: 
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-26 16:33:44
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <el-alert :type="type" @close="close" :closable="closeText ? true : false" :close-text="closeText">
    <template #title>
      <i :class="icon"></i><span> {{ tips }}</span>
    </template>
  </el-alert>
  <br v-if="show" />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'

export default defineComponent({
  props: { modelValue: {} },
  setup(props) {
    const state = reactive({
      show: true,
      closeText: '',
      type: 'warning',
      icon: 'el-icon-loading',
      tips: ' 博客正在初始化中 ...',
    })

    watch(
      () => props.modelValue,
      (done: any) => {
        if (done) {
          state.closeText = '知道了'
          state.type = 'success'
          state.icon = 'el-icon-unlock'
          state.tips = ' 初始化完毕'
        }
      },
    )

    const close = () => {
      state.show = false
    }

    return {
      ...toRefs(state),
      close,
    }
  },
})
</script>
