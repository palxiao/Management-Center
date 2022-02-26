<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-29 15:28:55
 * @Description: 
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-30 17:46:01
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <div class="imgs__wrap">
    <el-card v-for="(img, i) in listData" :key="i + 'i'" shadow="hover" :body-style="{ padding: '0px', position: 'relative' }">
      <el-image style="width: 100%; height: 20vh" :src="img.url + thin" :preview-src-list="[img.url]" fit="cover"></el-image>
      <div style="padding: 4px 14px">
        <span v-if="img.title">{{ img.title }}</span>
        <div class="bottom">
          <el-button v-clipboard="img.url" v-clipboard:success="copySuccess" type="text" class="button">复制</el-button>
          <el-button @click="reName(img, i)" type="text" class="button">重命名</el-button>
          <el-button @click="delPic(img, i)" type="text" class="button">删除</el-button>
        </div>
      </div>
      <div v-if="isBatch" class="mask">
        <el-checkbox border size="medium" @change="selectChange($event, img.key)"></el-checkbox>
      </div>
    </el-card>
  </div>
  <el-skeleton v-show="listData.length <= 0" style="width: 100%" :rows="8" animated />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import Notification from '@/commons/Notification'
import Confirm from '@/commons/Confirm'

const thin: string = '?imageMogr2/auto-orient/thumbnail/180x180>/blur/1x0/quality/75'
export default defineComponent({
  props: ['listData', 'isBatch', 'modelValue'],
  emits: ['delete', 'rename', 'update:modelValue'],
  setup(props, context) {
    let deleteKeys: any = []
    const state = reactive({
      thin,
    })

    watch(
      () => props.modelValue,
      (val: any) => {
        deleteKeys = val
      },
    )

    const copySuccess = () => {
      Notification.success('复制成功')
    }

    const delPic = async ({ key }: any, index: number) => {
      await Confirm.open('此操作将永久删除该文件, 是否继续?')
      context.emit('delete', { key, index })
    }

    const reName = async ({ key }: any, index: number) => {
      const newKey = await Confirm.prompt('重命名', '', key)
      context.emit('rename', { newKey, index })
    }

    const selectChange = (checked: boolean, key: string) => {
      if (!checked && deleteKeys.includes(key)) {
        const _index = deleteKeys.findIndex((x: any) => x === key)
        deleteKeys.splice(_index, 1)
      }
      if (checked) {
        deleteKeys.push(key)
      }
      context.emit('update:modelValue', deleteKeys)
    }

    return {
      ...toRefs(state),
      copySuccess,
      delPic,
      reName,
      selectChange,
    }
  },
})
</script>

<style lang="less" scoped>
:deep(.el-checkbox.is-bordered.is-checked) {
  border-color: transparent;
}
:deep(.el-checkbox.is-bordered) {
  border-color: transparent;
}
.imgs__wrap {
  display: grid;
  grid-template-columns: repeat(auto-fill, 195px);
  grid-gap: 1rem;
  // display: flex;
  // justify-content: space-between;
  // flex-wrap: wrap;
}
.mask {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>