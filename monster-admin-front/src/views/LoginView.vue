<template>
  <div class="login-container">
    <div class="login-title">
      <h2>欢迎登录Monster</h2>
    </div>
    <div class="login-form">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="Username"
          name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
          <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/user'
import { message } from 'ant-design-vue'

const router = useRouter()

interface FormState {
  username: string
  password: string
  remember: boolean
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
})
const onFinish = async (values: FormState) => {
  try {
    const res = await login(values)
    console.log(res)
    if (res.code === 0) {
      // 登录成功，保存token，并跳转至主页
      localStorage.setItem('token', res.data.token)
      router.push('/')
    } else {
      // 登录失败，显示错误信息
      message.error(res.data.message || '登录失败')
    }
  } catch (error) {
    console.log(error)
    message.error('登录失败')
  }
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-title {
  margin-top: 40px;
  margin-bottom: 20px;
}
</style>
