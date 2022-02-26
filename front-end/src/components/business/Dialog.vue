<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-26 13:58:57
 * @Description: 封装 el DiaLog
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-10-11 20:01:42
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <el-dialog :title="title" v-model="dialogVisible" :width="width" :before-close="handleClose">
    <slot></slot>
    <template #footer>
      <span v-show="control" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </span>
    </template>
    <template #title>
      <slot name="title"></slot>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Boolean],
      default: false,
    },
    title: {},
    width: {
      default: '30%',
    },
    control: {
      default: true,
    },
  },
  emits: ['ok', 'update:modelValue', 'close'],
  setup(props, context) {
    const state = reactive({
      dialogVisible: false,
    })
    const handleClose = () => {
      context.emit('close')
      state.dialogVisible = false
      context.emit('update:modelValue', false)
    }

    watch(
      () => props.modelValue,
      (val: any) => {
        state.dialogVisible = val ? true : false
      },
    )
    // watch(
    //   () => state.dialogVisible,
    //   (val: any) => {
    //     context.emit('update:modelValue', val)
    //   },
    // )

    const ok = () => {
      context.emit('ok')
    }

    return {
      ...toRefs(state),
      handleClose,
      ok,
    }
  },
})
</script>
