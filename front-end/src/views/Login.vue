<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-25 11:35:19
 * @Description: 
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-25 22:10:27
 * @site: book.palxp.com / blog.palxp.com
-->
<template>
  <div class="wrap">
    <el-card class="box-card">
      <div class="title">Pnt Design</div>
      <div class="text item">
        <el-input placeholder="账号" v-model="user.username"></el-input>
      </div>
      <div class="text item">
        <el-input placeholder="请输入密码" v-model="user.password" show-password></el-input>
      </div>
      <el-button :loading="loading" @click="login" class="btn" type="primary" size="small">登 陆</el-button>
    </el-card>
  </div>
</template>

<script type="ts">
import Api from '@/api'
import md5 from 'md5'
import { toRefs, reactive, onMounted, nextTick, getCurrentInstance, defineComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default defineComponent({
  // -- > Components Api
  setup() {
    const state = reactive({
      user: {
        username: '',
        password: '',
      },
      loading: false,
    })
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    onMounted(() => {
      // const { proxy } = getCurrentInstance();
      // console.log(internalInstance.appContext.config.globalProperties);
      // console.log('is ios ? :', proxy.$utils.isIOS());
    })

    const login = () => {
      state.loading = true
      const loginParams = Object.assign({}, state.user)
      loginParams.password = md5(state.user.password)
      Api.home
        .login(loginParams)
        .then((res) => {
          store.commit('setToken', res.token)
          setTimeout(() => {
            const path = route.query.redirect ? route.query.redirect : '/home'
            router.push({ path })
          }, 1000)
        })
        .catch(e => {
          state.loading = false
        })
        .finally(() => {
          // state.loading = false
        })
    }

    return {
      ...toRefs(state),
      login,
    }
  },
  async created() {
    // -- > Options Api
    await nextTick()
    // console.log('Vue3 Setup 写法', this);
  },
  methods: {},
})
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0 0 0;
}

.box-card {
  padding: 0 0 18px 0;
  width: 480px;
  .btn {
    margin-top: 40px;
    width: 100%;
  }
  .title {
    font-family: monospace;
    font-size: 20px;
    margin-bottom: 20px;
    text-align: center;
    color: rgba(0, 0, 0, 0.7);
  }
}
</style>
