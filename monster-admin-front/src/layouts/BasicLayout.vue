<template>
  <div id="basicLayout">
    <a-layout>
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>

      <a-layout-content class="content">
        <router-view></router-view>
      </a-layout-content>

      <a-layout-footer class="footer">
        <h4>丑八怪科技有限公司</h4>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
</script>

<style scoped>
.footer {
  background-color: #efefef;
  text-align: center;
  padding: 10px;
}

.content {
  margin-top: 50px;
  padding: 30px;
  min-height: calc(100vh - 80px);
  background-color: linear-gradient(to right, #efefef, #fff);
}

.header {
  z-index: 1000;
  background-color: #fff;
  color: unset;
  padding-inline: 12px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
</style>
