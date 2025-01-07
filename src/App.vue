<template>
  <a-config-provider :locale="zhCN">
    <div id="app">
      <BasicLayout />
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import { useLoginUserStore } from '@/stores/UseLoginUserStore.ts'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

// 初始化用户信息
const loginUserStore = useLoginUserStore()
let res = loginUserStore.fetchLoginUser()

// healthCheckUsingGet().then((res) => {
//   console.log(res)
// })
</script>

<style scoped></style>
