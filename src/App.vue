<template>
  <div id="app">
    <BasicLayout />
  </div>
</template>

<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import {healthCheckUsingGet} from "@/api/mainController.ts";
import {useLoginUserStore} from "@/stores/UseLoginUserStore.ts";

const loginUserStore = useLoginUserStore()
loginUserStore.fetchLoginUser()

healthCheckUsingGet().then(res => {
  console.log(res)
})
</script>

<style scoped></style>
