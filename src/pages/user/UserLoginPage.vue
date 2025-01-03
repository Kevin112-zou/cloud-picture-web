<template>
  <div id="userLoginPage">
    <h2 class="title">智能云图库--用户登录页</h2>
    <div class="desc">智能协同云图库</div>
    <!-- handleSubmit: 当用户点击按钮提交表单，就会触发调用后端接口 -->
    <a-form :model="formState" autocomplete="off" @finish="handleSubmit">
      <a-form-item
        label="用户账号"
        name="userAccount"
        :rules="[{ required: true, message: '请输入账号' }]"
      >
        <a-input v-model:value="formState.userAccount" placeholder="请输入账号" />
      </a-form-item>

      <a-form-item
        label="用户密码"
        name="userPassword"
        :rules="[
          { required: true, message: '请输入密码' },
          { min: 8, message: '密码长度不能小于8' },
        ]"
      >
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" />
      </a-form-item>
      <!-- <div class="rememberMeWrapper">
        <a-checkbox-group v-model="formState.userPassword">
          <a-checkbox value="true" name="type">记住密码</a-checkbox>
        </a-checkbox-group>
        <a href="">忘记密码</a>
      </div> -->
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">登录</a-button>
      </a-form-item>
      <div class="tips">
        没有账号？
        <RouterLink to="/user/register">点击注册</RouterLink>
      </div>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { userLoginUsingPost } from '@/api/userController'
import router from '@/router'
import { useLoginUserStore } from '@/stores/UseLoginUserStore'
import { message } from 'ant-design-vue'
import { reactive } from 'vue'

interface FormState {
  username: string
  password: string
  remember: boolean
}

// 用于接受表单的输入值
const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})

const loginUserStore = useLoginUserStore()

/**
 * 提交表单
 * @param values 表单输入的值
 */
const handleSubmit = async (values: any) => {
  const res = await userLoginUsingPost(values)
  if (res.data.code === 0 && res.data.data) {
    // 登录成功，把登录状态保存到全局状态中
    await loginUserStore.fetchLoginUser()
    message.success('登录成功')
    // 跳转到首页
    router.push({
      path: '/',
      replace: true, // 替换当前路由
    })
  } else {
    message.error('登录失败' + res.data.message)
  }
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
</script>

<style scoped>
#userLoginPage {
  max-width: 360px;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 16px;
}

.desc {
  text-align: center;
  color: #bbb;
  margin-bottom: 16px;
}

.tips {
  margin-bottom: 16px;
  color: #bbb;
  font-size: 13px;
  text-align: right;
}
</style>
