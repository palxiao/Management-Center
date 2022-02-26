<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-26 09:27:27
 * @Description: 
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-11-16 10:34:11
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <el-card shadow="never">
    <el-row>
      <el-col :span="6">
        <ul class="list">
          <li class="list__item" @click="loadMaterials(t._id)" v-for="t in templateList" :key="t._id">{{ t.name }} <span @click.stop="deleteTemplate(t._id)" style="cursor: pointer">删</span></li>
        </ul>
        <div class="button__wrap"><el-input v-model="tempValue" placeholder="Please input" /><el-button @click="addTemplate">添加模板</el-button></div>
      </el-col>
      <el-col :span="18">
        <el-empty v-show="materialList.length <= 0" description="没有素材"></el-empty>
        <ul>
          <li class="list__item" v-for="m in materialList" :key="m._id">{{ m.url }} <span @click.stop="deleteUrl(m._id)">删</span></li>
        </ul>
        <div class="button__wrap"><el-input v-model="addUrlValue" placeholder="Please input" /><el-button @click="addUrl">增加素材</el-button></div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts">
import { ElEmpty } from 'element-plus'
import { defineComponent, toRefs, reactive, onMounted } from 'vue'
import mpApi from '@/api/mp'

export default defineComponent({
  components: { ElEmpty },
  setup() {
    let currentMaterialId: number = 0
    let templateList: any = []
    const state = reactive({
      templateList,
      materialList: [],
      tempValue: '',
      addUrlValue: '',
    })

    onMounted(async () => {
      await mpApi.init()
      await loadTemplate()
    })

    const loadTemplate = async () => {
      const newTemp: any[] = []
      const res = await mpApi.gather('databasequery', { query: 'db.collection("Template").limit(999).get()' })
      res &&
        res.forEach((item: any) => {
          newTemp.push(JSON.parse(item))
        })
      state.templateList = newTemp
    }

    const loadMaterials = async (id: number) => {
      currentMaterialId = id
      state.materialList = []
      const newTemp: any = []
      const res = await mpApi.gather('databasequery', { query: `db.collection("Library").where({template_id:"${id}"}).get()` })
      res &&
        res.forEach((item: string) => {
          newTemp.push(JSON.parse(item))
        })
      state.materialList = newTemp
    }
    // 增加模板
    const addTemplate = async () => {
      if (!state.tempValue) {
        return
      }
      const query = `db.collection("Template").add({data: [{ name: "${state.tempValue}" }] })`
      await mpApi.gather('databaseadd', { query })
      state.tempValue = ''
      loadTemplate()
    }
    // 删除模板
    const deleteTemplate = async (id: number) => {
      const query = `db.collection("Template").doc('${id}').remove()`
      await mpApi.gather('databasedelete', { query })
      loadTemplate()
    }
    // 添加素材
    const addUrl = async () => {
      const query = `db.collection("Library").add({data: [{ url: "${state.addUrlValue}", template_id: "${currentMaterialId}" }] })`
      await mpApi.gather('databaseadd', { query })
      loadMaterials(currentMaterialId)
      state.addUrlValue = ''
    }
    // 删除素材
    const deleteUrl = async (id: number) => {
      const query = `db.collection("Library").doc('${id}').remove()`
      await mpApi.gather('databasedelete', { query })
      loadMaterials(currentMaterialId)
    }
    // 置换图片逻辑
    const getRealImage = async () => {
      const fileList: any = []
      state.materialList.forEach((item) => {
        fileList.push({
          fileid: JSON.parse(item).url,
          max_age: 7200,
        })
      })
      const urls = await mpApi.gather('batchdownloadfile', { file_list: fileList })
      console.log(urls)
    }

    return {
      ...toRefs(state),
      loadMaterials,
      addTemplate,
      deleteTemplate,
      addUrl,
      deleteUrl,
    }
  },
})
</script>

<style lang="less" scoped>
.list {
  &__item {
    padding: 7px 12px;
    display: flex;
    justify-content: space-between;
  }
  &__item:hover {
    background: rgba(0, 0, 0, 0.06);
  }
}
.button__wrap {
  display: flex;
}
</style>