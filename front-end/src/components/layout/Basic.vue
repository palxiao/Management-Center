<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-24 14:50:21
 * @Description: 
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-25 22:06:25
 * @site: book.palxp.com / blog.palxp.com
-->

<template>
  <el-container class="container">
    <Aside />
    <el-container>
      <el-header class="header">
        <Header />
      </el-header>
      <el-main class="main"> <router-view /><!-- content --> </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Aside from './components/Aside.vue'
import Header from './components/Header.vue'

export default defineComponent({
  components: { Aside, Header },
  setup() {},
})
</script>

<style lang="less" scoped>
.container {
  height: 100vh;
  border: 1px solid #eee;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  line-height: 60px;
  position: relative;
  color: #333;
  background: #ffffff;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}
.header::after {
  position: absolute;
  content: '';
  left: 0;
  height: 1px;
  width: 100%;
  background: rgba(0, 0, 0, 0.1);
}
.main {
  background-color: #f0f2f5;
}
</style>