<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { checkLocalStorageHasUserToken } from './libs/auth'

const router = useRouter()

onBeforeMount(() => {
  // 检查localStorage中是否含有token，判断用户是否登录，如果没登录要跳转login页面
  if (!checkLocalStorageHasUserToken()) {
    router.push('/login')
  }
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
