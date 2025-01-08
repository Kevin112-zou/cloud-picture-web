<template>
  <div id="userLoginPage">
    <div class="form-container">
      <h2 class="title">智能云图库--用户登录页</h2>
      <div class="desc">智能协同云图库</div>
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

        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%">登录</a-button>
        </a-form-item>

        <div class="tips">
          没有账号？
          <RouterLink to="/user/register">点击注册</RouterLink>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { userLoginUsingPost } from '@/api/userController'
import router from '@/router'
import { useLoginUserStore } from '@/stores/UseLoginUserStore'
import { message } from 'ant-design-vue'
import { reactive } from 'vue'

const formState = reactive({
  userAccount: '',
  userPassword: '',
})

const loginUserStore = useLoginUserStore()

const handleSubmit = async (values: any) => {
  const res = await userLoginUsingPost(values)
  if (res.data.code === 0 && res.data.data) {
    await loginUserStore.fetchLoginUser()
    message.success('登录成功')
    router.push({ path: '/', replace: true })
  } else {
    message.error('登录失败' + res.data.message)
  }
}
</script>

<style scoped>
#userLoginPage {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0); /* 设置透明背景 */
}

.form-container {
  width: 100%;
  max-width: 400px;
  padding: 24px;
  background-color: #fff; /* 表单容器背景色为白色 */
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

</style>
