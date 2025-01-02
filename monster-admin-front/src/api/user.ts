import myAxios from '@/request'

interface LoginParams {
  username: string
  password: string
}

// 登录
export const login = async (data: LoginParams) => {
  return myAxios.request({
    url: '/api/user/login',
    method: 'post',
    data,
  })
}

// 获取当前用户信息
export const getCurrentUser = async () => {
  return myAxios.request({
    url: '/api/user/current',
    method: 'get',
  })
}

// 获取视频列表
export const getVideoList = async () => {
  return myAxios.request({
    url: '/api/video',
    method: 'get',
  })
}

// 上传视频
// export const uploadVideo = async (data: ) => {
//   return myAxios.request({
//     url: '/api/video/upload',
//     method: 'post',
//     data,
//   })
// }

// 删除视频
export const deleteVideo = async (id: string) => {
  return myAxios.request({
    url: `/api/video/${id}`,
    method: 'delete',
  })
}
