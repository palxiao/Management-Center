<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-29 18:17:13
 * @Description: 二次封装上传组件
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-13 21:33:02
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <el-upload action="" :http-request="upload" :show-file-list="false" multiple>
    <el-button size="mini">上传图片<i class="el-icon-upload el-icon--right"></i></el-button>
  </el-upload>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElUpload } from 'element-plus'
import Qiniu from '@/commons/QiNiu'

export default defineComponent({
  components: { ElUpload },
  props: ['options', 'modelValue'],
  emits: ['done', 'update:modelValue'],
  setup(props, context) {
    let uploading: boolean = false // 上传状态Flag
    let timer: any = null

    let uploadList: any[] = [] // 上传队列
    let index: number = 0 // 当前上传的脚标
    let count: number = 0 // 当前上传总数

    const upload = ({ file }: any) => {
      uploadList.push(file)
      clearTimeout(timer)
      count++
      updatePercent(null)
      uploadQueue()
    }
    //上传队列
    const uploadQueue = async () => {
      if (!uploading) {
        uploading = true
        if (uploadList[0]) {
          await qiNiuUpload(uploadList[0]) // 队列有文件，执行上传
          uploading = false
          handleRemove() // 移除已上传文件
          index++
          updatePercent(null)
          uploadQueue()
        } else {
          uploading = false
          timer = setTimeout(() => {
            index = count = 0
            updatePercent(0)
          }, 3000)
          context.emit('done')
        }
      }
    }
    const qiNiuUpload = async (file: File) => {
      updatePercent(0)
      return new Promise(async (resolve: Function) => {
        await Qiniu.upload(file, props.options, (res: Type.Object) => {
          updatePercent(res.total.percent)
        })
        resolve()
      })
    }
    // 更新视图
    const updatePercent = (p?: number | null) => {
      const num = typeof p === 'number' ? p + '' : p
      const percent = Object.assign({}, props.modelValue)
      percent.num = num ? (+num).toFixed(0) : percent.num
      percent.ratio = count ? `${index} / ${count}` : ''
      context.emit('update:modelValue', percent)
    }
    const handleRemove = () => {
      if (uploadList.length <= 0) {
        return
      }
      uploadList.splice(0, 1)
    }

    return {
      upload,
    }
  },
})
</script>
