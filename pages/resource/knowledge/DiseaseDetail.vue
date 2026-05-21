<template>
  <view class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 顶部导航栏 -->
    <view class="sticky top-0 z-10 bg-white shadow-sm p-4 flex items-center justify-between">
      <u-icon name="arrow-left" size="20" @click="goBack"></u-icon>
      <text class="font-bold text-lg">病种详情</text>
      <view class="w-5"></view> <!-- 占位保持居中 -->
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="flex-1 flex items-center justify-center">
      <u-loading-icon mode="circle"></u-loading-icon>
    </view>

    <!-- 内容区域 -->
    <view v-else-if="disease" class="flex-1 overflow-y-auto p-4">
      
      <!-- 标题与基本信息 -->
      <view class="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <text class="text-xl font-bold text-gray-800 block mb-2">{{ disease.name }}</text>
        
        <!-- 显示别名 -->
        <text v-if="disease.alias" class="text-xs text-gray-500 block mb-3">别名：{{ disease.alias }}</text>

        <view class="flex flex-wrap gap-2 mb-3">
          <!-- 显示主分类 -->
          <u-tag 
            v-if="disease.primaryCategoryName" 
            :text="disease.primaryCategoryName" 
            type="primary" 
            plain 
            size="mini"
          ></u-tag>
        </view>
        
        <!-- 简介 -->
        <text class="text-sm text-gray-600 block leading-relaxed">{{ disease.introduction || '暂无简介' }}</text>
      </view>

      <!-- 症状描述 -->
      <view v-if="disease.symptoms" class="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <text class="text-lg font-bold text-gray-800 block mb-3">主要症状</text>
        <text class="text-sm text-gray-700 leading-relaxed">{{ disease.symptoms }}</text>
      </view>

      <!-- 相关分类 -->
      <view v-if="disease.categories && disease.categories.length > 0" class="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <text class="text-lg font-bold text-gray-800 block mb-3">疾病分类</text>
        <view class="flex flex-wrap gap-2">
          <u-tag 
            v-for="(cat, index) in disease.categories" 
            :key="index"
            :text="cat.name" 
            plain 
            size="mini"
            type="info"
          ></u-tag>
        </view>
      </view>

      <!-- 相关标签 -->
      <view v-if="disease.tags && disease.tags.length > 0" class="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <text class="text-lg font-bold text-gray-800 block mb-3">疾病标签</text>
        <view class="flex flex-wrap gap-2">
          <u-tag 
            v-for="(tag, index) in disease.tags" 
            :key="index"
            :text="tag.name" 
            plain 
            size="mini"
            type="warning"
          ></u-tag>
        </view>
      </view>

      <!-- 相关图片 -->
      <view v-if="disease.images && disease.images.length > 0" class="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <text class="text-lg font-bold text-gray-800 block mb-3">相关图片</text>
        <scroll-view scroll-x class="flex whitespace-nowrap">
          <image 
            v-for="(img, index) in disease.images" 
            :key="index"
            :src="img" 
            mode="aspectFill"
            class="disease-image"
            @click="previewImage(index)"
          ></image>
        </scroll-view>
      </view>

      <!-- 相关文章 (新增) -->
      <view v-if="disease.articles && disease.articles.length > 0" class="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <text class="text-lg font-bold text-gray-800 block mb-3">相关文章</text>
        <view class="article-list">
          <view 
            v-for="(article, index) in disease.articles" 
            :key="index"
            class="article-item"
            @click="goToArticle(article.id)"
          >
            <image 
              v-if="article.coverImage" 
              :src="article.coverImage" 
              mode="aspectFill"
              class="article-cover"
            ></image>
            <view class="article-content">
              <text class="article-title">{{ article.title }}</text>
              <text class="article-summary">{{ article.summary }}</text>
              <view class="article-meta">
                <text class="meta-text">{{ article.sourceName }}</text>
                <text class="meta-text">{{ formatTime(article.publishTime) }}</text>
                <text class="meta-text">👁 {{ article.viewCount }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 兼容旧的 content 富文本字段 -->
      <view v-if="disease.content" class="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <text class="text-lg font-bold text-gray-800 block mb-3">详细介绍</text>
        <view class="prose prose-sm max-w-none text-gray-700">
          <rich-text :nodes="disease.content"></rich-text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="flex-1 flex items-center justify-center">
      <u-empty mode="page" text="未找到相关病种信息"></u-empty>
    </view>
    
    <!-- 底部占位 -->
    <view class="h-16"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { knowledgeApi } from '@/api/knowledge'
import type { DiseaseDetailData } from '@/types/knowledge'

const disease = ref<DiseaseDetailData | null>(null)
const loading = ref(false)
const diseaseId = ref<number | null>(null)

const goBack = () => {
  uni.navigateBack()
}

// 预览图片
const previewImage = (currentIndex: number) => {
  if (!disease.value?.images || disease.value.images.length === 0) return
  
  uni.previewImage({
    urls: disease.value.images,
    current: currentIndex
  })
}

// 跳转到文章详情
const goToArticle = (articleId: number) => {
  uni.navigateTo({ 
    url: `/pages/resource/knowledge/ArticleDetail?id=${articleId}`,
    fail: (err) => {
      console.error('跳转文章失败:', err)
      uni.showToast({ title: '页面跳转失败', icon: 'none' })
    }
  })
}

// 格式化时间
const formatTime = (timeStr: string) => {
  if (!timeStr) return ''
  // 简单截取日期部分
  return timeStr.split(' ')[0]
}

const fetchDiseaseDetail = async (id: number) => {
  loading.value = true
  try {
    // 调用接口
    const res = await knowledgeApi.getDisease(id)
    
    console.log('病种详情原始数据:', res.data) 

    if (res.code === 200 && res.data) {
      disease.value = res.data
    } else {
      uni.showToast({ title: res.message || '获取详情失败', icon: 'none' })
    }
  } catch (error) {
    console.error('获取病种详情失败:', error)
    uni.showToast({ title: '网络异常，加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  // @ts-ignore
  const options = currentPage.options || {}
  const id = options.id ? parseInt(options.id) : null
  
  if (id) {
    diseaseId.value = id
    fetchDiseaseDetail(id)
  } else {
    uni.showToast({ title: '缺少病种ID', icon: 'none' })
  }
})
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
}

.sticky {
  position: sticky;
  top: 0;
  z-index: 10;
}

.bg-white {
  background-color: #ffffff;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.p-4 {
  padding: 16px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-3 {
  margin-bottom: 12px;
}

.mb-2 {
  margin-bottom: 8px;
}

.rounded-lg {
  border-radius: 8px;
}

.text-xl {
  font-size: 20px;
}

.text-lg {
  font-size: 18px;
}

.text-sm {
  font-size: 14px;
}

.text-xs {
  font-size: 12px;
}

.font-bold {
  font-weight: 700;
}

.text-gray-800 {
  color: #1f2937;
}

.text-gray-700 {
  color: #374151;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-500 {
  color: #6b7280;
}

.leading-relaxed {
  line-height: 1.625;
}

.block {
  display: block;
}

.flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.gap-2 {
  gap: 8px;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.flex-1 {
  flex: 1;
}

.overflow-y-auto {
  overflow-y: auto;
}

.w-5 {
  width: 20px;
}

.prose {
  line-height: 1.6;
}

/* 图片样式 */
.disease-image {
  width: 200px;
  height: 150px;
  margin-right: 10px;
  border-radius: 8px;
  background-color: #f3f4f6;
}

/* 文章列表样式 */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-item {
  display: flex;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 8px;
  cursor: pointer;
}

.article-item:active {
  background-color: #f3f4f6;
}

.article-cover {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  margin-right: 12px;
  flex-shrink: 0;
}

.article-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.article-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-summary {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #9ca3af;
}

.meta-text {
  font-size: 12px;
  color: #9ca3af;
}

.whitespace-nowrap {
  white-space: nowrap;
}
</style>