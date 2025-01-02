<template>
  <div class="table-container">
    <div class="addVideoBtn">
      <AddVedioModal :refresh="fetchVideoList" />
    </div>
    <a-table
      :columns="columns"
      :data-source="videoList"
      :loading="loading"
      :scroll="{ x: 1000, y: 500 }"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'id'">
          <span> Id </span>
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'id'">
          <a-button type="primary" @click="handleVideoDetail(record.id)" ghost>
            {{ record.id }}
          </a-button>
        </template>
        <template v-else-if="column.key === 'title'">
          <span>
            {{ record.title }}
          </span>
        </template>
        <template v-else-if="column.key === 'url'">
          <span>
            <a :href="record.url" target="_blank">{{ record.url }}</a>
          </span>
        </template>
        <template v-else-if="column.key === 'action'">
          <div class="actionBtn">
            <!-- 一键上传 -->
            <!-- <a-button @click="handlePublishVideo(record.id)" type="primary" ghost>
              一键上传
            </a-button> -->
            <PublishVideoModal :record="record" />

            <a-button @click="handleDeleteVideo(record.id)" type="primary" danger>删除</a-button>
          </div>
        </template>
      </template>
    </a-table>

    <!-- 添加视频详情modal框 -->
    <a-modal v-model:open="detailModalVisible" title="视频详情" :footer="null">
      <template v-if="currentVideo">
        <video :src="currentVideo.url" controls style="width: 100%; margin-bottom: 10px"></video>
        <div>
          <p>视频ID: {{ currentVideo.id }}</p>
          <p>视频标题: {{ currentVideo.title }}</p>
          <p>视频URL:</p>
          <a :href="currentVideo.url" target="_blank" style="color: #1890ff">{{
            currentVideo.url
          }}</a>
          <p></p>
          <p>视频文件名: {{ currentVideo.filename }}</p>
          <p>视频上传时间: {{ currentVideo.createdAt }}</p>
          <p>视频修改时间: {{ currentVideo.updatedAt }}</p>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, createVNode } from 'vue'
import { getVideoList } from '@/api/user'
import { message, Modal } from 'ant-design-vue'
import AddVedioModal from '@/components/AddVedioModal.vue'
import { deleteVideo } from '@/api/user'
import myAxios from '@/request'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import PublishVideoModal from '@/components/PublishVideoModal.vue'

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    fixed: 'left',
    width: 200,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    width: 200,
  },
  {
    title: 'URL',
    dataIndex: 'url',
    key: 'url',
    width: 300,
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    width: 100,
  },
]

const videoList = ref([])
const loading = ref(false)
const detailModalVisible = ref(false)
const currentVideo = ref<any>(null)

onMounted(() => {
  fetchVideoList()
})

// 获取视频列表
async function fetchVideoList() {
  loading.value = true
  try {
    const res = await getVideoList()
    if (res.code === 0) {
      videoList.value = res.data || []
    }
  } finally {
    loading.value = false
  }
}

// 删除视频
async function handleDeleteVideo(id: string) {
  try {
    Modal.confirm({
      title: '确认要删除该视频吗？',
      icon: createVNode(ExclamationCircleOutlined),
      content: '点击OK按钮后, 该视频将被删除!!',
      onOk: async () => {
        const res = await deleteVideo(id)
        if (res.code === 0) {
          await fetchVideoList()
          message.success('删除成功')
        }
      },
      onCancel() {},
    })
  } catch (error) {}
}

// 查看视频详情
async function handleVideoDetail(id: string) {
  try {
    const res = await myAxios.get(`/api/video/${id}`)
    if (res.code === 0) {
      console.log(res.data)
      detailModalVisible.value = true
      currentVideo.value = res.data
    }
  } catch (error) {}
}

// 一键上传
// async function handlePublishVideo(id: string) {
//   try {
//     const res = await myAxios.post(`/api/video/${id}`)
//     if (res.code === 0) {
//       message.success('上传成功')
//     }
//   } catch (error) {}
// }
</script>

<style scoped>
.table-container {
  width: 100%;
  overflow: auto;
}

.addVideoBtn {
  margin-bottom: 10px;
}

a {
  color: black;
}

a:hover {
  color: #1890ff;
}

.actionBtn {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 60%;
  align-items: center;
  justify-content: center;
  margin-left: 20%;
}
</style>
