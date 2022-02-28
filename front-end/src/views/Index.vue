<!--
 * @Author: ShawnPhang
 * @Date: 2021-07-22 01:09:44
 * @Description: 
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-27 23:58:41
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <div class="home">
    <div class="head">检视项目情况</div>
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
  width: 100%;
  // display: flex;
  .item {
    height: calc(100vh - 200px);
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