<!--
 * @Author: ShawnPhang
 * @Date: 2021-07-22 01:09:44
 * @Description: 
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-04-15 18:00:17
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <div class="home">
    <el-card class="item" shadow="never">
      <iframe src="http://101.91.145.2:3001/playlists/play/1?kiosk=tv&theme=light" width="100%" frameborder="0"></iframe>
    </el-card>

    <!-- <div class="head">检视项目情况</div> -->
    <!-- <el-row :gutter="12">
      <el-col :span="8">
        <el-card class="item" shadow="never">
          <iframe scrolling="no" src="http://app.palxp.com/stickyNotes"></iframe>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="item" shadow="hover">
          <iframe src="http://m2.palxp.com"></iframe>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="item frog" shadow="hover">
          <iframe src="http://app.palxp.com"></iframe>
        </el-card>
      </el-col>
    </el-row> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},
  setup() {},
})
</script>

<style lang="less" scoped>
.home {
  margin: -20px 0 -20px -20px;
  width: calc(100% + 40px);
  // display: flex;
  .item {
    height: calc(100vh - 64px);
    :deep(.el-card__body) {
      height: 100%;
    }
    iframe {
      height: 100%;
    }
  }
}
.head {
  color: #666;
  font-size: 16px;
  line-height: 38px;
  padding-left: 20px;
  background-color: #fff;
  height: 40px;
  margin-bottom: 12px;
}
</style>