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
      <text class="header-title">医疗资源</text>
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
        <HospitalList v-if="activeTab === 0" />
        <DoctorList v-else-if="activeTab === 1" />
        <ExaminationsList v-else-if="activeTab === 2" />
      </view>
    </scroll-view>

    <!-- 底部导航栏 -->
    <BottomNav />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HospitalList from './HospitalList.vue'
import DoctorList from './DoctorList.vue'
import ExaminationsList from './ExaminationsList.vue'
import BottomNav from '@/components/BottomNav.vue'

const activeTab = ref(0)

// Tab 列表配置
const tabList = ref([
  { name: '医院列表' },
  { name: '医生名录' },
  { name: '检查项目' }
])

// Tab 切换事件
const onTabChange = (item: any) => {
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
  background-color: #1E90FF; /* 深天蓝色 */
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