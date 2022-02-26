<!--
 * @Author: ShawnPhang
 * @Date: 2022-02-08 22:54:45
 * @Description: 管理
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-21 22:50:21
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <el-card>
    <my-menu @onChange="menuChange" />

    <font-list v-if="tabIndex == 1" />
    <temp-list v-if="tabIndex == 2" :cate="cateId" />
    <material-list v-if="tabIndex == 3" :cate="cateId" />
    <comp-list v-if="tabIndex == 4" :cate="cateId" />
    <photo-list v-if="tabIndex == 5" :cate="cateId" />
  </el-card>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import myMenu from './components/Menu.vue'
import CompList from './components/CompList.vue'
import TempList from './components/TempList.vue'
import MaterialList from './components/MaterialList.vue'
import FontList from './components/FontList.vue'
import PhotoList from './components/PhotoList.vue'

export default defineComponent({
  components: { CompList, FontList, myMenu, TempList, MaterialList, PhotoList },
  setup() {
    const tabIndex = ref('1')
    const cateId = ref('')

    const menuChange = ({ key, keyPath }: any) => {
      tabIndex.value = keyPath[0]
      cateId.value = key.split('-')[1]
    }

    return {
      menuChange,
      tabIndex,
      cateId,
    }
  },
})
</script>
