<!--
 * @Author: ShawnPhang
 * @Date: 2022-01-11 10:20:09
 * @Description:  
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-11 10:12:23
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <div class="choose__wrap">
    <el-radio-group v-model="select" size="mini">
      <el-radio-button v-for="i in types" :key="i.key" :label="i.key">{{ i.value }}</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { ElRadioButton, ElRadioGroup } from 'element-plus'

export default defineComponent({
  components: { ElRadioButton, ElRadioGroup },
  emits: ['change'],
  setup(props, context) {
    const state = reactive({
      select: '1',
      types: [
        { key: '1', value: '已启用' },
        { key: '0', value: '停用中' },
      ],
    })

    watch(
      () => state.select,
      (val) => {
        context.emit('change', val)
      },
    )

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="less" scoped>
</style>