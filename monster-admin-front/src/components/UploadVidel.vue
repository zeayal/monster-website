<template>
  <a-upload
    v-model:file-list="fileList"
    name="file"
    :custom-request="customRequest"
    @change="handleChange"
  >
    <a-button>
      <upload-outlined></upload-outlined>
      Click to Upload
    </a-button>
  </a-upload>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import type { UploadChangeParam } from 'ant-design-vue'
import myAxios from '@/request'
import type { AnyObject } from 'ant-design-vue/es/_util/type'

const fileList = ref([])

const handleChange = (info: UploadChangeParam) => {
  console.log(fileList.value, 1111)
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList)
  }
  if (info.file.status === 'done') {
    console.log('上传成功')
    message.success(`${info.file.name} file uploaded successfully`)
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`)
  }
}

const customRequest = async (options: AnyObject) => {
  const formData = new FormData()
  formData.append('file', options.file)
  const res = await myAxios.request({
    url: '/api/video/upload',
    method: 'post',
    data: formData,
  })

  if (res.code === 0) {
    options.onSuccess(res, options.file)
  } else {
    options.onError(new Error(res.msg))
  }
}
</script>
