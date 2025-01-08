<template>
  <div id="userRegisterPage">
    <div class="form-container">
      <h2 class="title">智能云图库--用户注册页</h2>
      <div class="desc">智能协同云图库</div>
      <a-form :model="formState" autocomplete="off" @finish="handleSubmit">
        <a-form-item
          label="用户账号"
          name="userAccount"
          :rules="[
            { required: true, message: '请输入账号' },
            { min: 4, message: '账号长度不能小于4' },
          ]"
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

        <a-form-item
          label="确认密码"
          name="checkPassword"
          :rules="[
            { required: true, message: '请输入确认密码' },
            { min: 8, message: '确认密码长度不能小于8' },
          ]"
        >
          <a-input-password v-model:value="formState.checkPassword" placeholder="请输入确认密码" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%">注册</a-button>
        </a-form-item>

        <div class="tips">
          已有账号？
          <RouterLink to="/user/login">点击登录</RouterLink>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { userRegisterUsingPost } from '@/api/userController'
import router from '@/router'
import { message } from 'ant-design-vue'
import { reactive } from 'vue'

const formState = reactive({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})

const handleSubmit = async (values: any) => {
  // 校验密码是否一致
  if (values.userPassword !== values.checkPassword) {
    message.error('两次输入密码不一致')
    return
  }

  const res = await userRegisterUsingPost(values)
  if (res.data.code === 0 && res.data.data) {
    message.success('注册成功')
    // 注册成功后跳转到登录页
    router.push({ path: '/user/login', replace: true })
  } else {
    message.error('注册失败，' + res.data.message)
  }
}
</script>

<style scoped>
#userRegisterPage {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0); /* 背景透明 */
}

.form-container {
  width: 100%;
  max-width: 400px;
  padding: 24px;
  background-color: #fff; /* 白色背景 */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}

.title {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-bottom: 16px;
}

.desc {
  text-align: center;
  color: #888;
  margin-bottom: 24px;
  font-size: 14px;
}

.tips {
  text-align: right;
  color: #888;
  font-size: 13px;
  margin-top: 16px;
}

a-form-item {
  margin-bottom: 16px;
}

a-input,
a-input-password {
  border-radius: 8px;
}

a-button {
  border-radius: 8px;
  font-size: 16px;
  padding: 12px;
}

a-button:hover {
  background-color: #0072ff;
  border-color: #0072ff;
}

a-button:active {
  background-color: #005bb5;
  border-color: #005bb5;
}

.router-link {
  color: #0072ff;
  text-decoration: none;
}

.router-link:hover {
  text-decoration: underline;
}
</style>
