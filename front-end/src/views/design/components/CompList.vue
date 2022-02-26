<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-29 15:28:55
 * @Description: 
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-22 14:06:50
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <br />
  <state-choosee @change="typeChange" />
  <div class="imgs__wrap">
    <el-card v-for="(item, i) in listData" :key="i + 'i'" shadow="hover" :body-style="{ padding: '0px', position: 'relative' }">
      <el-image class="cover-box" :src="item.cover" :preview-src-list="[item.cover]" fit="contain"></el-image>
      <div style="padding: 4px 14px">
        <div class="line-clamp-1" v-if="item.title">{{ item.title }}</div>
        <div class="bottom">
          <el-button @click="turnState(item)" type="text" class="button">{{ item.state == 0 ? '启用' : '停用' }}</el-button>
          <el-button @click="reName(item, i)" type="text" class="button">重命名</el-button>
          <el-button @click="open(item, i)" type="text" class="button">编辑</el-button>
          <el-button @click="delPic(item, i)" type="text" class="button">删除</el-button>
        </div>
      </div>
      <!-- <div v-if="isBatch" class="mask">
        <el-checkbox border size="medium" @change="selectChange($event, item.key)"></el-checkbox>
      </div> -->
    </el-card>
  </div>
  <el-skeleton v-show="listData.length <= 0" style="width: 100%" :rows="8" animated />
  <Pagination @prev="prev" @next="next" @change="pageChange" :page="page" />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import Pagination from '@/components/common/PaginationElement.vue'
import Notification from '@/commons/Notification'
import Confirm from '@/commons/Confirm'
import StateChoosee from './comps/StateChoose.vue'
import api from '@/api/design'

export default defineComponent({
  components: { StateChoosee, Pagination },
  props: ['cate'],
  setup(props, context) {
    let deleteKeys: any = []
    const state = reactive({
      listData: [],
      page: { index: 1, totalNum: 0 },
      state: 1,
    })
    watch(
      () => props.cate,
      () => {
        state.page.index = 1
        load()
      },
    )

    const load = async () => {
      state.listData.length = 0
      const res = await api.getTempList({ cate: props.cate, page: state.page.index, state: state.state, type: 1, order: 'asc' })
      state.listData = res.list
      state.page.totalNum = res.total
    }

    load()

    const turnState = async (item: any) => {
      item.state = +item.state == 1 ? 0 : 1
      await api.saveTemp({ id: item.id, state: item.state, type: 1 })
      Notification.success('修改成功')
    }

    const delPic = async ({ id }: any, index: number) => {
      await Confirm.open('删除后不可恢复, 是否继续?')
      await api.removeComp({ id, type: 1 })
      Notification.success('删除成功')
      state.listData.splice(index, 1)
    }

    const reName = async ({ key }: any, index: number) => {
      const newKey = await Confirm.prompt('重命名', '', key)
      context.emit('rename', { newKey, index })
    }

    // const selectChange = (checked: boolean, key: string) => {
    //   if (!checked && deleteKeys.includes(key)) {
    //     const _index = deleteKeys.findIndex((x: any) => x === key)
    //     deleteKeys.splice(_index, 1)
    //   }
    //   if (checked) {
    //     deleteKeys.push(key)
    //   }
    //   context.emit('update:modelValue', deleteKeys)
    // }

    const typeChange = (stat: any) => {
      state.state = stat
      load()
    }
    const prev = () => {
      state.page.index--
      load()
    }
    const next = () => {
      state.page.index++
      load()
    }
    const pageChange = (num: number) => {
      state.page.index = num
      load()
    }

    return {
      ...toRefs(state),
      turnState,
      delPic,
      reName,
      // selectChange,
      typeChange,
      prev,
      next,
      pageChange,
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
  margin-top: 1rem;
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
.cover-box {
  width: 100%;
  height: 20vh;
  padding: 0.5rem 0.2rem 0 0.2rem;
}
</style>