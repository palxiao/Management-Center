<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-26 09:27:27
 * @Description: Blog
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-10-12 11:26:49
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <el-card shadow="never">
    <b-alert v-model="initDone" />
    <el-button @click="loadBlogs()" size="small" icon="el-icon-folder">打开文件</el-button>
    <el-button v-show="title" @click="newBlog()" size="small" icon="el-icon-edit">新建文章</el-button>
    <el-button type="text" style="float: right" @click="jumpPics()" size="small" icon="el-icon-paperclip">打开图片管理</el-button>
    <br />
    <br />

    <v-md-editor v-bind="editor" @save="save" @change="textChange" v-model="content" @upload-image="handleUploadImage"></v-md-editor>

    <!-- <confirm v-model="showFiles" :control="false">
      <div v-for="(item, bi) in blogs" :key="item?.path + bi">
        <a @click="openBlog(item)">{{ item?.time }} - {{ item?.name }}</a> .
        <a @click="reName(item)">重命名</a>
      </div>
    </confirm> -->
    <Finder v-model="showFiles" :data="blogs" @operation="finderOpera" :breadcrumb="breadcrumb" />

    <confirm @ok="setNameDone" @close="closeTitle" :title="showRename === 'setName' ? '新建文章' : '重命名'" v-model="showRename">
      <el-input v-model="title" placeholder="输入标题" />
    </confirm>
  </el-card>
</template>

<script lang="ts">
import '@kangc/v-md-editor/lib/style/base-editor.css'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import blogApi from '@/api/blog'
import dayjs from 'dayjs'
import Qiniu from '@/commons/QiNiu'
import confirm from '@/components/business/Dialog.vue'
import bAlert from './components/Alert.vue'
import Notification from '@/commons/Notification'
import Aggregation from '@/commons/Aggregation'
import Finder from '../blog/components/Finder.vue'

export default defineComponent({
  components: { confirm, bAlert, Finder },
  setup() {
    const router = useRouter()
    const breadcrumb: any = []
    const state = reactive({
      editor: {
        disabledMenus: [],
        height: '70vh',
      },
      content: '',
      title: '',
      editPath: '',
      showFiles: false,
      showRename: '',
      initDone: false,
      blogs: [],
      breadcrumb,
    })
    let domain: any = null
    let temp: any = null

    onMounted(() => {
      init()
    })
    // 初始化
    const init = async () => {
      const res: Ajax.Result = await blogApi.init()
      if (res.code === 200) {
        state.initDone = true
        domain = await Aggregation.getDomain('blog')
      }
    }
    // 加载博客列表
    const loadBlogs = async (path: string = '') => {
      if (domain) {
        state.showFiles = true
        state.blogs = await blogApi.getList({ path })
      } else {
        Notification.warning('请确认操作正确', '没有权限')
      }
    }
    // 打开博客
    const openBlog = async (item: Type.Object) => {
      const { path, isdir, name } = item
      if (isdir) {
        state.breadcrumb.push(path)
        loadBlogs(path)
      } else {
        state.editPath = path
        state.title = name
        state.content = await blogApi.getDetail({ path })
        state.showFiles = false
      }
    }
    // 新建文章
    const newBlog = () => {
      state.title = ''
      state.content = ''
    }
    // 重命名
    const reName = (item: Type.Object) => {
      temp = state
      state.title = item.name
      state.editPath = item.path
      state.showRename = 'reName'
    }
    // 关闭弹窗回调
    const closeTitle = () => {
      if (state.showRename === 'reName') {
        state.title = temp.name
        state.editPath = temp.path
        temp = null
      }
    }
    // 保存操作
    const save = async (text?: any) => {
      if (!text && !state.content) {
        return
      }
      if (!state.title) {
        state.showRename = 'setName'
        return
      }
      if (!state.content) {
        Notification.warning('缺少文章内容', '保存失败')
        newBlog() // 重置
        return
      }
      const { editPath: path, title, content } = state
      await blogApi.save({ path, title, content })
      Notification.success('保存成功')
    }
    // 设置完毕
    const setNameDone = () => {
      if (state.showRename === 'setName') {
        state.title += '.md'
        save()
      } else {
        blogApi.rename({ path: state.editPath, title: state.title })
      }
      state.showRename = ''
    }
    // 自动保存
    let updateTimer: any = undefined
    const textChange = () => {
      if (updateTimer) {
        clearTimeout(updateTimer)
      }
      updateTimer = setTimeout(() => {
        save()
        updateTimer = undefined
      }, 10000)
    }
    // 上传图片
    const handleUploadImage = async (event: any, insertImage: any, files: any) => {
      // console.log(files, domain)
      const options = {
        bucket: 'blog',
      }
      const res: any = await Qiniu.upload(files[0], options, (res: Type.Object) => {
        // updatePercent(res.total.percent) // 上传进度回调
      })
      Notification.success('图片上传成功')
      insertImage({
        url: `http://${domain}/${res.key}`,
        desc: res.key,
      })
    }
    // 快捷进入图片管理
    const jumpPics = () => {
      let routeUrl = router.resolve({
        path: '/album-manage',
        query: { search: dayjs(new Date()).format('YYYY/MM') },
      })
      window.open(routeUrl.href, '_blank')
    }
    // 文件操作
    const finderOpera = ({ fn, item }: any) => {
      const fns: any = {
        openBlog,
        reName,
        goBack,
      }
      fns[fn](item)
    }
    // 返回博客列表上一页
    function goBack() {
      state.breadcrumb.pop()
      loadBlogs(state.breadcrumb[state.breadcrumb.length - 1])
    }

    return {
      ...toRefs(state),
      loadBlogs,
      openBlog,
      newBlog,
      handleUploadImage,
      save,
      setNameDone,
      reName,
      closeTitle,
      textChange,
      jumpPics,
      finderOpera,
    }
  },
})
</script>

<style lang="less" scoped>
</style>