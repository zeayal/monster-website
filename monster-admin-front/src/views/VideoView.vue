<template>
  <!-- <a-button class="upload-btn" type="primary" ghost>+ 上传视频</a-button> -->
  <AddVedioModal :refresh="fetchVideoList" />
  <a-table
    :columns="columns"
    :data-source="videoList"
    :loading="loading"
    :scroll="{ x: 800, y: 500 }"
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
        <a-button @click="handleDeleteVideo(record.id)" type="primary" danger>删除</a-button>
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
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getVideoList } from '@/api/user'
import { message } from 'ant-design-vue'
import AddVedioModal from '@/components/AddVedioModal.vue'
import { deleteVideo } from '@/api/user'
import myAxios from '@/request'

const columns = [
  {
    name: 'Id',
    dataIndex: 'id',
    key: 'id',
    fixed: 'left',
    width: 20,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    fixed: 'left',
    width: 80,
  },
  {
    title: 'URL',
    dataIndex: 'url',
    key: 'url',
    fixed: 'left',
    width: 100,
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    width: 30,
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
    } else {
      message.error('获取视频列表失败')
    }
  } catch (error) {
    message.error('网络请求失败')
  } finally {
    loading.value = false
  }
}

// 删除视频
async function handleDeleteVideo(id: string) {
  try {
    const res = await deleteVideo(id)
    if (res.code === 0) {
      message.success('删除成功')
      await fetchVideoList()
    } else {
      message.error(res.msg || '删除失败')
    }
  } catch (error) {
    message.error('删除失败')
  }
}

// 查看视频详情
async function handleVideoDetail(id: string) {
  const res = await myAxios.get(`/api/video/${id}`)
  try {
    if (res.code === 0) {
      console.log(res.data)
      detailModalVisible.value = true
      currentVideo.value = res.data
    } else {
      message.error('获取视频详情失败', res.msg)
    }
  } catch (error) {
    message.error('获取视频详情失败', error)
  }
}
</script>

<style scoped>
.upload-btn {
  margin-bottom: 10px;
}

a {
  color: black;
}

a:hover {
  color: #1890ff;
}
</style>
