<template>
  <div>
    <a-button @click="handlePublishVideo" type="primary" ghost> 一键上传 </a-button>
    <a-modal
      v-model:open="open"
      title="请选择要上传的平台"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
    >
      <div>
        <a-checkbox
          v-model:checked="state.checkAll"
          :indeterminate="state.indeterminate"
          @change="onCheckAllChange"
        >
          Check all
        </a-checkbox>
        <a-divider />
        <a-checkbox-group v-model:value="state.checkedList" :options="plainOptions" />
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, reactive } from 'vue'
import { message } from 'ant-design-vue'
import myAxios from '@/request'

const open = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)

const props = defineProps(['record'])

const plainOptions = [
  { label: '抖音', value: 'douyin' },
  { label: 'B站', value: 'bilibili' },
  { label: '小红书', value: 'xiaohongshu' },
  { label: '视频号', value: 'tencent' },
]
const state = reactive({
  indeterminate: true,
  checkAll: false,
  checkedList: ['douyin', 'bilibili', 'xiaohongshu', 'tencent'],
})

async function handlePublishVideo() {
  open.value = true
}

const handleOk = async () => {
  confirmLoading.value = true
  try {
    const res = await myAxios.post(`/api/video/upload-to-platform/${props.record.id}`, {
      platform: state.checkedList,
    })
    if (res.code === 0) {
      message.success('上传成功')
    }
    open.value = false
  } finally {
    confirmLoading.value = false
  }
}

// 选择要上传的平台
const onCheckAllChange = (e: any) => {
  Object.assign(state, {
    checkedList: e.target.checked ? plainOptions : [],
    indeterminate: false,
  })
}
watch(
  () => state.checkedList,
  (val) => {
    state.indeterminate = !!val.length && val.length < plainOptions.length
    state.checkAll = val.length === plainOptions.length
  }
)
</script>
