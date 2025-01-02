<template>
  <div>
    <a-button type="primary" @click="showModal">+ 点击上传视频</a-button>
    <a-modal
      v-model:open="open"
      title="选择一个视频"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
    >
      <!-- 上传视频 -->
      <UploadVideoModal />
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import UploadVideoModal from './UploadVidel.vue'

const open = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)

const showModal = () => {
  open.value = true
}

const props = defineProps(['refresh'])

const handleOk = async () => {
  confirmLoading.value = true
  await props.refresh()
  open.value = false
  confirmLoading.value = false
}
</script>
