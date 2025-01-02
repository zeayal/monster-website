<template>
  <a-row :wrap="false">
    <a-col flex="200px">
      <div class="header-left">
        <img class="logo" src="@/assets/logo.png" alt="logo" />
        <div class="title">MonsterStudio</div>
      </div>
    </a-col>

    <a-col flex="auto">
      <a-menu
        v-model:selectedKeys="current"
        mode="horizontal"
        :items="items"
        @click="handleClick"
      />
    </a-col>

    <a-col flex="80px">
      <div>
        <a-button type="primary" href="/login">登录</a-button>
      </div>
    </a-col>
  </a-row>
</template>
<script lang="ts" setup>
import { h, ref } from 'vue'
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const current = ref<string[]>(['mail'])
const items = ref<MenuProps['items']>([
  {
    key: '/video',
    label: '视频列表',
    title: '视频列表',
  },
  {
    key: 'app',
    icon: () => h(AppstoreOutlined),
    label: 'Navigation Two',
    title: 'Navigation Two',
  },
  {
    key: 'sub1',
    icon: () => h(SettingOutlined),
    label: 'Navigation Three - Submenu',
    title: 'Navigation Three - Submenu',
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          {
            label: 'Option 1',
            key: 'setting:1',
          },
          {
            label: 'Option 2',
            key: 'setting:2',
          },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          {
            label: 'Option 3',
            key: 'setting:3',
          },
          {
            label: 'Option 4',
            key: 'setting:4',
          },
        ],
      },
    ],
  },
  {
    key: 'alipay',
    label: h('a', { href: 'https://antdv.com', target: '_blank' }, 'Navigation Four - Link'),
    title: 'Navigation Four - Link',
  },
])

function handleClick({ key }: { key: string }) {
  router.push(key)
}
</script>

<style scoped>
.header-left {
  display: flex;
  align-items: center;
  margin-right: 30px;
}

.logo {
  width: 60px;
  height: 50px;
}

.title {
  /* font-size: 18px; */
  font-weight: 600;
}
</style>
