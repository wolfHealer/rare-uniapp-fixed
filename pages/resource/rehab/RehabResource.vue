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
      <text class="header-title">康复支持专区</text>
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
        <RehabGuide v-if="activeTab === 0" />
        <PsychologicalOrgList v-else-if="activeTab === 1" />
        <RehabInstitutionList v-else-if="activeTab === 2" />
      </view>
    </scroll-view>

    <!-- 底部导航栏 -->
    <BottomNav />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RehabGuide from './RehabGuideList.vue'
import PsychologicalOrgList from './PsychologicalOrgList.vue'
import RehabInstitutionList from './RehabInstitutionList.vue'
import BottomNav from '@/components/BottomNav.vue'
import type { TabChangeEvent } from '@/types/ui'

const activeTab = ref(0)

const tabList = ref([
  { name: '康复训练指南' },
  { name: '心理咨询机构' },
  { name: '康复机构对接' }
])

const onTabChange = (item: TabChangeEvent) => {
  activeTab.value = item.index
}

const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
}

.custom-header {
  background-color: #1E90FF;
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
  width: 24px;
}

.tabs-wrapper {
  background-color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 99;
}

.content-scroll {
  flex: 1;
  height: 0;
  overflow-y: auto;
}

.tab-content {
  min-height: 100%;
}
</style>