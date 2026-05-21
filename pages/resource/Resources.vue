<template>
  <view class="page-container">
    <!-- 内容区域 -->
    <scroll-view scroll-y class="content-scroll" enable-back-to-top>
      <!-- 功能入口 -->
      <view class="grid-box">
        <view 
          v-for="(item, index) in entries" 
          :key="index" 
          class="grid-item"
          @click="go(item.path)"
        >
          <view class="icon-box">
            <!-- 图标颜色保持品牌蓝，尺寸稍作调整 -->
            <u-icon :name="item.icon" size="28" color="#2563eb"></u-icon>
          </view>
          <text class="item-title">{{ item.title }}</text>
        </view>
      </view>

      <!-- 推荐资源 -->
      <view class="recommend-section">
        <text class="section-title">推荐资源</text>
        <u-cell-group>
          <u-cell
            v-for="item in recommends"
            :key="item.id"
            :title="item.title"
            is-link
            @click="open(item)"
          />
        </u-cell-group>
      </view>
      
      <view class="bottom-spacer"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import type { RecommendItem } from '@/types/ui'

// 入口配置
// 修改说明：
// 1. '疾病科普' 使用 'file-text' (文档图标)
// 2. '医院&医生' 使用 'map' (地图图标，代表地点/机构) 或 'home'
const entries = [
  { title: '疾病科普', icon: 'file-text', path: '/pages/resource/knowledge/KnowledgeResource' },
  { title: '医院&医生', icon: 'map', path: '/pages/resource/medical/MedicalResource' },
  { title: '救助', icon: 'gift', path: '/pages/resource/charity/CharityResource' },
  { title: '用药', icon: 'bag', path: '/pages/resource/drug/DrugResource' }, 
  { title: '康复', icon: 'car', path: '/pages/resource/rehab/RehabResource' } ,
  { title: '医保', icon: 'gift', path: '/pages/resource/medicare/MedicareResource' },
]

const recommends = [
  { id: 1, title: '罕见病诊疗指南合集' },
  { id: 2, title: '医保报销流程图解' }
]

const go = (path: string) => {
  uni.navigateTo({ url: path })
}

const open = (item: RecommendItem) => {
  uni.showToast({ title: `打开: ${item.title}`, icon: 'none' })
}

</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
}

/* 内容滚动区 */
.content-scroll {
  flex: 1;
  height: 0; /* 配合 flex:1 实现滚动 */
}

/* Grid 布局优化 */
.grid-box {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px; /* 增大间距 */
  padding: 20px 16px; /* 调整内边距 */
}

.grid-item {
  background-color: #ffffff;
  border-radius: 12px; /* 更大圆角 */
  padding: 20px 10px; /* 增加垂直内边距 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* 更柔和、有层次感的阴影 */
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08); 
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

/* 点击态反馈 */
.grid-item:active {
  transform: scale(0.98);
  background-color: #f0f7ff;
}

/* 图标容器美化 */
.icon-box {
  margin-bottom: 10px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eff6ff; /* 浅蓝色背景衬托图标 */
  border-radius: 50%; /* 圆形背景 */
}

.item-title {
  font-size: 14px;
  font-weight: 500; /* 字体加粗 */
  color: #1f2937; /* 深灰色字体 */
  text-align: center;
  line-height: 1.4;
}

/* 推荐资源 */
.recommend-section {
  padding: 0 16px 24px 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  display: block;
  margin-bottom: 12px;
  padding-left: 4px; /* 轻微左对齐视觉修正 */
}

.bottom-spacer {
  height: 20px;
}
</style>