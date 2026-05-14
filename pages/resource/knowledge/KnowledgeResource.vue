<template>
  <view class="page-container">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <u-search
        v-model="searchKeyword"
        placeholder="搜索病种、症状..."
        :show-action="false"
        shape="round"
        bg-color="#f3f4f6"
        @search="handleSearch"
        @custom="handleSearch"
      ></u-search>
    </view>

    <!-- 内容区域 -->
    <scroll-view scroll-y class="content-scroll" enable-flex>
      
      <!-- ⭐ 推荐入口（可选） -->
      <view class="section-container recommend-section">
        <view class="recommend-grid">
          <!-- 修复：跳转到当前页或有效页面，避免路径错误报错 -->
          <view class="recommend-item" @click="goToCommonDiseases">
            <view class="rec-icon-bg blue">⭐</view>
            <text class="rec-title">常见疾病</text>
          </view>
          <view class="recommend-item" @click="goToHotArticles">
            <view class="rec-icon-bg orange">📚</view>
            <text class="rec-title">热门科普</text>
          </view>
        </view>
      </view>

      <!-- 🧩 核心：12类分类宫格 -->
      <view class="section-container">
        <text class="section-title">疾病分类</text>
        <view class="category-grid">
          <view
            v-for="(category, index) in categories"
            :key="index"
            class="category-card"
            hover-class="category-card-hover"
            @click="goToCategory(category)"
          >
            <!-- 圆形图标背景 -->
            <view class="icon-circle" :style="{ backgroundColor: category.bgColor || '#eff6ff' }">
              <text class="category-emoji">{{ category.icon }}</text>
            </view>
            <!-- 分类名称（粗体） -->
            <text class="category-name">{{ category.name }}</text>
            <!-- 一句话说明（灰色） -->
            <text class="category-desc">{{ category.desc }}</text>
          </view>
        </view>
      </view>

      <!-- [底部提示 / banner] -->
      <view class="bottom-banner">
        <view class="banner-content">
          <text class="banner-text">💡 提示：若未找到对应分类，请使用顶部搜索功能</text>
        </view>
      </view>
      
      <!-- 底部占位，防止被导航栏遮挡 -->
      <view class="bottom-placeholder"></view>
    </scroll-view>

    <!-- 底部导航栏 -->
    <BottomNav />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BottomNav from '@/components/BottomNav.vue'

// 搜索关键词
const searchKeyword = ref('')

// 🧩 12类分类数据 (重点)
const categories = ref([
  { id: 1, name: '神经系统', icon: '🧠', desc: '运动神经元、癫痫等', bgColor: '#e6f3ff' },
  { id: 2, name: '遗传代谢', icon: '🧬', desc: '代谢异常相关罕见病', bgColor: '#fef3c7' },
  { id: 3, name: '心血管系统', icon: '❤️', desc: '心肌病、血管畸形等', bgColor: '#fee2e2' },
  { id: 4, name: '呼吸系统', icon: '🫁', desc: '肺纤维化、气道异常', bgColor: '#dbeafe' },
  { id: 5, name: '免疫风湿', icon: '🛡️', desc: '自身免疫系统疾病', bgColor: '#f3e8ff' },
  { id: 6, name: '血液系统', icon: '🩸', desc: '血友病、贫血等', bgColor: '#ffe4e6' },
  { id: 7, name: '内分泌系统', icon: '🧪', desc: '生长发育、激素异常', bgColor: '#ecfccb' },
  { id: 8, name: '骨骼组织', icon: '🦴', desc: '成骨不全、软骨发育', bgColor: '#f5f5f4' },
  { id: 9, name: '神经肌肉', icon: '💪', desc: '肌营养不良、重症肌无力', bgColor: '#ffedd5' },
  { id: 10, name: '皮肤系统', icon: '🧴', desc: '大疱性表皮松解等', bgColor: '#fae8ff' },
  { id: 11, name: '眼耳鼻喉', icon: '👁️', desc: '视网膜病变、听力障碍', bgColor: '#ccfbf1' },
  { id: 12, name: '儿童发育', icon: '👶', desc: '孤独症、发育迟缓', bgColor: '#e0f2fe' }
])

// 处理搜索
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    uni.navigateTo({
      url: `/pages/search/index?keyword=${encodeURIComponent(searchKeyword.value)}`
    })
  }
}

// ⭐ 推荐入口跳转 - 修复路径
const goToCommonDiseases = () => {
  console.log('点击了常见疾病')
  // 暂时跳转到当前页刷新，或者跳转到一个有效的列表页
  // 如果有专门的常见疾病页，请替换为正确路径
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goToHotArticles = () => {
  console.log('点击了热门科普')
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

// 🧠 点击分类卡片交互逻辑
const goToCategory = (category: any) => {
  console.log('点击分类:', category.name, 'ID:', category.id) // 【关键调试日志】
  
  const name = encodeURIComponent(category.name)
  // 确保路径与 pages.json 完全一致
  const url = `/pages/resource/knowledge/CategoryDetail?id=${category.id}&name=${name}`
  
  console.log('准备跳转 URL:', url)
  
  uni.navigateTo({
    url: url,
    fail: (err) => {
      console.error('跳转失败:', err)
      uni.showToast({ title: '页面跳转失败', icon: 'none' })
    }
  })
}

</script>

<style scoped>
/* 页面容器 */
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9fafb;
}

/* 搜索栏 */
.search-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #ffffff;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* 内容滚动区 */
.content-scroll {
  flex: 1;
  /* overflow-y: auto;  scroll-view 不需要这个，它自己处理滚动 */
}

.section-container {
  padding: 16px;
  /* 确保不会阻挡点击 */
  position: relative; 
  z-index: 1;
}

.section-title {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 16px;
  padding-left: 4px;
}

/* ⭐ 推荐入口样式 */
.recommend-section {
  padding-bottom: 8px;
}
.recommend-grid {
  display: flex;
  gap: 16px;
}
.recommend-item {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
  /* 确保可点击 */
  cursor: pointer; 
}
.rec-icon-bg {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 12px;
}
.rec-icon-bg.blue { background-color: #eff6ff; }
.rec-icon-bg.orange { background-color: #fff7ed; }
.rec-title {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
}

/* 🧩 12类分类宫格样式 (重点) */
.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.category-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 24rpx 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 1px solid #f3f4f6;
  /* 关键：确保点击事件能穿透到 view */
  position: relative;
  z-index: 2;
}

.category-card-hover {
  background-color: #f9fafb;
  transform: scale(0.98);
  transition: all 0.2s;
}

.icon-circle {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.category-emoji {
  font-size: 40rpx;
}

.category-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8rpx;
}

.category-desc {
  font-size: 22rpx;
  color: #9ca3af;
  line-height: 1.4;
}

/* 底部 Banner */
.bottom-banner {
  padding: 0 16px 16px;
}
.banner-content {
  background-color: #f0fdf4;
  border: 1px solid #dcfce7;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
}
.banner-text {
  font-size: 12px;
  color: #166534;
}

/* 底部占位 */
.bottom-placeholder {
  height: 64px;
}
</style>