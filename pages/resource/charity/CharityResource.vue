<template>
  <view class="page-container">
    <!-- 顶部操作栏 -->
    <view class="custom-header">
      <u-icon
        name="arrow-left"
        size="24"
        color="#FFFFFF"
        @click="goBack"
      ></u-icon>
      <text class="header-title">公益救助中心</text>
      <view class="header-placeholder"></view>
    </view>

    <!-- Tabs 标签栏 -->
    <view class="tabs-wrapper">
      <u-tabs
        :list="tabList"
        :current="activeTab"
        @change="onTabChange"
        lineColor="#1E90FF"
        activeStyle="color: #1E90FF; font-weight: bold;"
        inactiveStyle="color: #666;"
      ></u-tabs>
    </view>

    <!-- 内容区域 -->
    <scroll-view scroll-y class="content-scroll">
      <view class="tab-content">
        <!-- 根据当前激活的 Tab 渲染对应组件 -->
        <AidProjectList v-if="activeTab === 0" />
        <CaseShare v-else-if="activeTab === 1" />
        <HelpChannel v-else-if="activeTab === 2" />
      </view>
    </scroll-view>

    <!-- 底部导航栏 -->
    <BottomNav />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AidProjectList from './AidProjectList.vue'
import CaseShare from './CaseShareList.vue'
import HelpChannel from './HelpChannelList.vue'
import BottomNav from '@/components/BottomNav.vue'
import type { TabChangeEvent } from '@/types/ui'

const activeTab = ref(0)

// Tab 列表配置
const tabList = ref([
  { name: '救助项目库' },
  { name: '救助案例分享' },
  { name: '求助通道指引' }
])

const onTabChange = (item: TabChangeEvent) => {
  activeTab.value = item.index
}

// 返回上一级页面
const goBack = () => {
  uni.navigateBack({
    delta: 1
  })
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
}

/* 自定义顶部栏 */
.custom-header {
  background-color: #1E90FF; /* 深天蓝色，与 DrugResource 保持一致 */
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #FFFFFF;
}

.header-placeholder {
  width: 24px; /* 占位，使标题居中 */
}

/* Tabs 包装器 */
.tabs-wrapper {
  background-color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 99;
}

/* 内容滚动区域 */
.content-scroll {
  flex: 1;
  height: 0; /* 配合 flex: 1 使用，确保 scroll-view 正确计算高度 */
  overflow-y: auto;
}

.tab-content {
  min-height: 100%;
}
</style>