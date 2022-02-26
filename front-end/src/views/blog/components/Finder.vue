<!--
 * @Author: ShawnPhang
 * @Date: 2021-10-11 18:21:09
 * @Description: File manage
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-10-12 10:43:08
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <confirm v-model="show" width="50%" :control="false">
    <template v-slot:title>
      <i @click="operation('goBack')" class="icon fanhui"></i>
    </template>
    <div @mouseover="hover = bi" @mouseleave="hover = -1" class="file__item" v-for="(item, bi) in data" :key="item?.path + bi">
      <i v-if="item?.isdir" :class="['icon', hover === bi ? 'file-open' : 'file']"></i>
      <i v-else class="icon file-markdown"></i>
      <a class="file__item__name" @click="operation('openBlog', item)">{{ item?.name }}</a>
      <el-button type="text" @click="operation('reName', item)">重命名</el-button>
    </div>
  </confirm>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import confirm from '@/components/business/Dialog.vue'
// import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'

export default defineComponent({
  components: { confirm },
  props: {
    modelValue: {},
    data: {},
    breadcrumb: {
      default: () => [],
    },
  },
  emits: ['operation', 'update:modelValue'],
  setup(props, context) {
    const state = reactive({
      hover: -1,
      show: undefined,
    })
    watch(
      () => props.modelValue,
      (val: any) => {
        state.show != val && (state.show = val)
      },
    )
    watch(
      () => state.show,
      (val: any) => {
        context.emit('update:modelValue', val)
      },
    )
    const operation = (fn: string, item: Type.Object) => {
      context.emit('operation', { fn, item })
    }
    return {
      ...toRefs(state),
      operation,
    }
  },
})
</script>

<style lang="less" scoped>
.file__item {
  cursor: pointer;
  display: flex;
  align-items: center;
  .icon {
    font-size: 20px;
    margin-right: 12px;
  }
  &__name {
    flex: 1;
  }
}
.file__item:hover {
  font-weight: bold;
  color: #409eff;
}
.fanhui {
  font-size: 18px;
}
.fanhui:hover {
  font-weight: bold;
  color: #409eff;
  cursor: pointer;
}
</style>