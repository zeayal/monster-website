import axios from 'axios'
import { message } from 'ant-design-vue'

const myAxios = axios.create({
  baseURL: 'http://192.168.38.160:3000',
  timeout: 60000,
})

// 请求拦截器
myAxios.interceptors.request.use(
  (config) => {
    // 获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
myAxios.interceptors.response.use(
  (response) => {
    if (response.data.code != 0) {
      message.error(response.data.msg || '网络请求失败')
    }
    return response.data
  },
  (error) => {
    message.error(error.response.data.msg || '网络请求失败')
    return Promise.reject(error)
  }
)

export default myAxios
