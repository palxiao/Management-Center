<!--
 * @Author: ShawnPhang
 * @Date: 2022-02-10 21:17:53
 * @Description:  
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-20 22:56:11
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <br />
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="name" label="Font Name" />
    <el-table-column label="Preview">
      <template #default="scope">
        <img style="height: 2em" :src="scope.row.preview" />
      </template>
    </el-table-column>
    <el-table-column label="Size">
      <template #default="scope">
        {{ (scope.row.size / 1024 / 1024).toFixed(2) + ' MB' }} <span style="color: #999999">( {{ (scope.row.size / 1024).toFixed(0) + ' KB' }} )</span>
      </template>
    </el-table-column>
  </el-table>
  <Pagination @prev="prev" @next="load" @change="pageChange" :page="page" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Pagination from '@/components/common/PaginationElement.vue'
import api from '@/api/design'

export default defineComponent({
  components: { Pagination },
  setup() {
    const tableData = ref([])
    const page = ref({ index: 1, totalNum: 0 })

    const getPicList = () => {
      tableData.value.length = 0
      api.getFontList({ page: page.value.index }).then((res: any) => {
        tableData.value = res.list
        page.value.totalNum = res.total
      })
    }
    getPicList()

    const prev = () => {
      page.value.index--
      getPicList()
    }
    const load = () => {
      page.value.index++
      getPicList()
    }
    const pageChange = (num: number) => {
      page.value.index = num
      getPicList()
    }

    return {
      tableData,
      page,
      prev,
      load,
      pageChange,
    }
  },
})
</script>
