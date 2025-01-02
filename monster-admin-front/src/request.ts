import axios from 'axios'

const myAxios = axios.create({
  baseURL: 'http://192.168.38.160:3000',
  timeout: 5000,
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
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default myAxios
