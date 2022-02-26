<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-29 15:02:34
 * @Description: 分页组件
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-08 22:48:34
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <div class="pages">
    <div @click="prev" :class="['pages__item', { 'pages__item--disable': page.total <= 0 || page.index === 0 }]">
      <span class="pages__text">
        <i class="el-icon-arrow-left"></i>
      </span>
    </div>
    <div class="pages__count">{{ page.totalNum ? page.index + 1 : 0 }} / {{ Math.ceil(page.totalNum / 20) }}</div>
    <div @click="next" :class="['pages__item', { 'pages__item--disable': page.total <= 0 || page.total === page.index }]">
      <span class="pages__text">
        <i class="el-icon-arrow-right"></i>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  props: {
    page: {
      default: {
        index: 0,
        total: 0,
      },
    },
  },
  emits: ['next', 'prev'],
  setup(props, context) {
    // const state = reactive({
    //   currentPage: 0,
    // })

    const next = () => {
      if (props.page.index < props.page.total) {
        // state.currentPage += 1
        context.emit('next')
      }
    }
    const prev = () => {
      if (props.page.index > 0) {
        // state.currentPage -= 1
        context.emit('prev')
      }
    }

    return {
      // ...toRefs(state),
      prev,
      next,
    }
  },
})
</script>


<style lang="less" scoped>
.pages {
  margin-top: 20px;
  display: flex;
  &__item {
    // margin-right: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    min-width: 32px;
    font-family: Arial;
    text-align: center;
    list-style: none;
    background-color: #fff;
    color: rgba(0, 0, 0, 0.65);
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    outline: 0;
    cursor: pointer;
    user-select: none;
    &--disable {
      color: rgba(0, 0, 0, 0.25);
      cursor: not-allowed;
    }
  }
  &__item:not(.pages__item--disable):hover {
    font-weight: 500;
    background: #fff;
    border-color: #1890ff;
  }
  &__count {
    display: flex;
    align-items: center;
    margin: 0 12px;
    color: #888888;
  }
}
</style>