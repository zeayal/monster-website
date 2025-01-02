<template>
  <a-upload
    v-model:file-list="fileList"
    enctype="multipart/form-data"
    name="file"
    action="http://192.168.38.160:3000/api/video/upload"
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

const fileList = ref([])

const handleChange = (info: UploadChangeParam) => {
  console.log(fileList.value, 1111)
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList)
  }
  if (info.file.status === 'done') {
    message.success(`${info.file.name} file uploaded successfully`)
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`)
  }
}

const headers = {
  'Content-Type': 'multipart/form-data',
}
</script>
