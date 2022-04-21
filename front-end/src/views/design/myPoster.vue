<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-26 09:27:27
 * @Description: 
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-03-01 15:15:46
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <el-card>
    <div class="imgs__wrap">
      <el-card v-for="(item, i) in listData" :key="i + 'i'" shadow="hover" :body-style="{ padding: '0px', position: 'relative' }">
        <el-image class="cover-box" :src="item.cover" :preview-src-list="[item.cover]" fit="contain"></el-image>
        <div style="padding: 4px 14px">
          <div class="line-clamp-1" v-if="item.title">{{ item.title }}</div>
          <div class="bottom">
            <el-button @click="open(item, i)" type="text" class="button">打开</el-button>
            <el-button @click="delPoster(item, i)" type="text" class="button">删除</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <Pagination @prev="prev" @next="next" @change="pageChange" :page="page" />
  </el-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import api from '@/api/design'
import Pagination from '@/components/common/PaginationElement.vue'
import Notification from '@/commons/Notification'
import Confirm from '@/commons/Confirm'

export default defineComponent({
  components: { Pagination },
  setup() {
    const listData = ref([])
    const page = ref({ index: 1, totalNum: 0 })

    const load = () => {
      api.getMyDesign({ page: page.value.index }).then((res: any) => {
        listData.value = res.list.map((x: any) => {
          x.cover += `?r=${Math.random()}`
          return x
        })
        page.value.totalNum = res.total
      })
    }
    load()

    const prev = () => {
      page.value.index--
      load()
    }
    const next = () => {
      page.value.index++
      load()
    }
    const pageChange = (num: number) => {
      page.value.index = num
      load()
    }

    const open = ({ id }: any) => {
      window.open(`https://sudo.palxp.com/home?id=${id}`)
    }
    const delPoster = async ({ id }: any, index: number) => {
      await Confirm.open('删除后不可恢复, 是否继续?')
      await api.deleteMyDesign({ id })
      Notification.success('删除成功')
      listData.value.splice(index, 1)
    }

    return {
      listData,
      page,
      prev,
      next,
      pageChange,
      open,
      delPoster,
    }
  },
})
</script>

<style lang="less" scoped>
.imgs__wrap {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, 195px);
  grid-gap: 1rem;
  // display: flex;
  // justify-content: space-between;
  // flex-wrap: wrap;
}
.cover-box {
  width: 100%;
  height: 32vh;
  padding: 0.5rem 0.2rem 0 0.2rem;
}
</style>