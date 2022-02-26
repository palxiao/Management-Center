<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-26 09:27:27
 * @Description: 
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-15 19:41:13
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <el-card>
    <el-tabs v-model="tabIndex" @tab-click="TabClick" type="card">
      <el-tab-pane v-for="(b, bi) in buckets" :key="bi + 'b'" :label="b.tbl + ' 空间'" :name="bi + ''"><br /></el-tab-pane>
    </el-tabs>
    <el-space size="large" :spacer="spacer">
      <search-bar v-model="prePath" @search="onSearch" />
      <uploader v-model="percent" @done="onSearch" :options="{ bucket: openBucket.tbl, prePath }" />

      <el-button v-if="!isBatch" @click="isBatch = true" size="mini">批量操作</el-button>
      <div v-else><el-button @click="selectDelete()" size="mini">批量删除</el-button><el-button @click="batchCancel" size="mini">取消</el-button></div>

      <div v-if="percent.ratio" style="width: 200px">
        <span>上传进度: {{ percent.ratio }}</span> <el-progress :percentage="percent.num" status=""></el-progress>
      </div>
    </el-space>
    <el-divider content-position="left">{{ buckets[tabIndex]?.domain }}</el-divider>

    <pic-box v-if="!isEmpty" :isBatch="isBatch" v-model="batchKeys" :listData="list" @delete="deletePic" @rename="reNamePic" />

    <Pagination @prev="prev" @next="load" @change="pageChange" :page="page" />
  </el-card>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, h, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElDivider, ElProgress } from 'element-plus'
import albumApi from '@/api/album'
import Confirm from '@/commons/Confirm'
import Pagination from '@/components/common/Pagination.vue'
// import Pagination from '@/components/common/PaginationElement.vue'
import SearchBar from './components/Search-bar.vue'
import PicBox from './components/PicBox.vue'
import uploader from '@/components/business/Upload.vue'

interface Buckets {
  tbl?: string // 空间名
  domain?: string // 域名
}

export default defineComponent({
  components: { ElProgress, Pagination, SearchBar, PicBox, uploader },
  setup() {
    // const CACHING: boolean = false // 是否开启缓存列表功能
    const route = useRoute()
    const configKeys = JSON.parse(localStorage.getItem('qn_config') || '{}')
    const tabIndex: string = '0' // 默认加载位置
    let collection: any = [] // 列表不参与渲染总集
    let marker: string = '' // 为 lock 时加载到最后一页，锁定分页
    let list: any = []
    const state = reactive({
      tabIndex,
      spacer: h(ElDivider, { direction: 'vertical' }),
      buckets: [{ tbl: '...', domain: '...' }],
      list,
      page: { total: 0, index: 0, totalNum: 0 },
      prePath: route.query.search || '',
      openBucket: { tbl: '', domain: '' },
      percent: { num: 0 }, // 当前上传进度
      isBatch: false, // 是否批量操作
      batchKeys: [], // 批量操作值数组
      isEmpty: false,
    })

    onMounted(async () => {
      const result = await albumApi.init({ params: configKeys })
      state.buckets = result.buckets
      state.openBucket = result.buckets[tabIndex]
      getPicList()
    })

    const getPicList = async (bucket: string | undefined = state.openBucket.tbl, prefix: any = state.prePath) => {
      state.list = []
      const result = await albumApi.getPicList({ bucket, prefix, marker, limit: 20 })
      const picList = result.data.map((key: any) => {
        return { url: `http://${state.openBucket.domain}/${key}`, key }
      })
      collection.push(picList) // 缓存所有数组
      state.list = picList // 当前渲染数组
      marker = result.marker // 下一页逻辑
      if (marker) {
        state.page.total++
      } else {
        marker = 'lock'
      }
      state.page.totalNum = result.total
      state.isEmpty = result.total <= 0
    }
    const prev = () => {
      state.page.index--
      state.list = collection[state.page.index]
    }
    const load = () => {
      state.page.index++
      if (state.page.total === state.page.index && marker !== 'lock') {
        getPicList()
      } else {
        state.list = collection[state.page.index]
      }
    }
    const pageChange = (num: number) => {
      state.page.index = num
      getPicList()
    }

    // 搜索
    const onSearch = () => {
      marker = ''
      batchCancel()
      state.page = Object.assign({}, { total: 0, index: 0, totalNum: 0 })
      getPicList()
    }

    // 删除回调
    const deletePic = async ({ key, index }: any) => {
      await albumApi.deletePic({ bucket: state.openBucket.tbl, key })
      state.list.splice(index, 1)
      if (state.list.length <= 0) {
        onSearch()
      }
    }
    // 重命名
    const reNamePic = async ({ newKey, index }: any) => {
      await albumApi.reName({ bucket: state.openBucket.tbl, key: state.list[index]?.key, name: newKey })
      state.list[index].key = newKey
    }
    // 批量删除
    const selectDelete = async () => {
      if (state.batchKeys.length > 0) {
        await Confirm.open('删除后无法恢复资源')
        console.log(state.openBucket.tbl, state.batchKeys)
        await albumApi.delPics({ bucket: state.openBucket.tbl, key: state.batchKeys })
        onSearch()
      }
    }
    // 取消批量操作
    const batchCancel = () => {
      state.isBatch = false
      state.batchKeys = []
    }

    const TabClick = () => {
      state.openBucket = state.buckets[+state.tabIndex]
      state.prePath = ''
      collection = []
      onSearch()
    }

    return {
      ...toRefs(state),
      TabClick,
      load,
      prev,
      onSearch,
      deletePic,
      reNamePic,
      selectDelete,
      batchCancel,
      pageChange,
    }
  },
})
</script>

<style lang="less" scoped>
</style>