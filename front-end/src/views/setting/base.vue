<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-26 20:47:45
 * @Description: 
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-26 21:11:35
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <el-card style="width: 600px">
    <el-form label-position="right" label-width="120px" :model="Keys">
      <el-form-item v-for="(k, i) in Keys" :key="i" :label="i">
        <el-input v-model="Keys[i]"></el-input>
      </el-form-item>
    </el-form>
    <el-button @click="setConfig">确 认</el-button>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
const tempKeys = { AK: '', SK: '', Alias: '', DefaultSpace: '' }
const localKeys = localStorage.getItem('qn_config')

export default defineComponent({
  setup() {
    const state = reactive({
      Keys: localKeys ? JSON.parse(localKeys) : tempKeys,
    })
    console.log(state)

    const setConfig = () => {
      localStorage.setItem('qn_config', JSON.stringify(state.Keys))
      location.reload()
    }

    return {
      ...toRefs(state),
      setConfig,
    }
  },
})
</script>
