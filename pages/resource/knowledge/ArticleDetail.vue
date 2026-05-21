<template>
  <view class="page-container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <u-icon name="arrow-left" size="24" @click="goBack"></u-icon>
      <text class="title">文章详情</text>
      <view class="placeholder"></view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <u-loading-icon mode="circle"></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 内容区域 -->
    <scroll-view v-else-if="article" scroll-y class="content-scroll">
      
      <!-- 封面图 -->
      <view v-if="article.coverImage" class="cover-section">
        <image 
          :src="article.coverImage" 
          mode="aspectFill"
          class="cover-image"
        ></image>
      </view>

      <!-- 文章标题与元信息 -->
      <view class="card">
        <text class="article-title">{{ article.title }}</text>
        
        <view class="meta-row">
          <text class="meta-text">{{ article.sourceName }}</text>
          <text class="meta-divider">·</text>
          <text class="meta-text">{{ formatTime(article.publishTime) }}</text>
          <text class="meta-divider">·</text>
          <text class="meta-text">👁 {{ article.viewCount }}</text>
        </view>

        <!-- 标签 -->
        <view v-if="article.tags && article.tags.length > 0" class="tags-box">
          <u-tag 
            v-for="(tag, index) in article.tags" 
            :key="index"
            :text="tag.name" 
            plain 
            size="mini"
            type="primary"
            customStyle="margin-right: 8px;"
          ></u-tag>
        </view>
      </view>

      <!-- 摘要 -->
      <view v-if="article.summary" class="card mt-3">
        <text class="section-title">摘要</text>
        <text class="summary-text">{{ article.summary }}</text>
      </view>

      <!-- 文章内容块 -->
      <view class="card mt-3">
        <view 
          v-for="(block, index) in sortedBlocks" 
          :key="block.id"
          class="block-item"
        >
          <!-- 文本块 -->
          <view v-if="block.blockType === 'text'" class="text-block">
            <text v-if="block.title" class="block-title">{{ block.title }}</text>
            <text class="block-content">{{ block.content }}</text>
          </view>

          <!-- 图片块 -->
          <view v-else-if="block.blockType === 'image'" class="image-block">
            <text v-if="block.title" class="block-title">{{ block.title }}</text>
            <image 
              :src="block.extra?.url" 
              mode="widthFix"
              class="block-image"
              @click="previewImage(block.extra?.url)"
            ></image>
          </view>

          <!-- FAQ块 -->
          <view v-else-if="block.blockType === 'faq'" class="faq-block">
            <text v-if="block.title" class="block-title">{{ block.title }}</text>
            <view class="faq-item">
              <text class="faq-question">❓ {{ block.extra?.question }}</text>
              <text class="faq-answer">💡 {{ block.extra?.answer }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 来源链接 -->
      <view v-if="article.sourceUrl" class="card mt-3">
        <text class="section-title">原文链接</text>
        <u-button 
          size="small" 
          plain 
          type="primary"
          @click="openSourceUrl"
        >
          查看原文
        </u-button>
      </view>

      <!-- 底部操作栏 -->
      <view class="action-bar">
        <view class="action-item" @click="handleLike">
          <u-icon name="thumb-up" size="20" :color="liked ? '#ef4444' : '#6b7280'"></u-icon>
          <text class="action-text">{{ article.likeCount }}</text>
        </view>
        <view class="action-item" @click="handleFavorite">
          <u-icon name="star" size="20" :color="favorited ? '#f59e0b' : '#6b7280'"></u-icon>
          <text class="action-text">{{ article.favoriteCount }}</text>
        </view>
        <view class="action-item" @click="handleShare">
          <u-icon name="share" size="20" color="#6b7280"></u-icon>
          <text class="action-text">分享</text>
        </view>
      </view>

      <!-- 底部占位 -->
      <view class="bottom-spacer"></view>
    </scroll-view>

    <!-- 空状态 -->
    <u-empty v-else mode="data" description="文章不存在或已下架"></u-empty>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { knowledgeApi } from '@/api/knowledge'
import type { ArticleDetailData } from '@/types/knowledge'

const article = ref<ArticleDetailData | null>(null)
const loading = ref(false)
const articleId = ref<number | null>(null)
const liked = ref(false)
const favorited = ref(false)

// 按排序号排序的内容块
const sortedBlocks = computed(() => {
  if (!article.value?.blocks) return []
  return [...article.value.blocks].sort((a, b) => a.sortNo - b.sortNo)
})

// 格式化时间
const formatTime = (timeStr: string) => {
  if (!timeStr) return ''
  return timeStr.split(' ')[0]
}

// 预览图片
const previewImage = (url: string) => {
  if (!url) return
  uni.previewImage({
    urls: [url],
    current: url
  })
}

// 打开原文链接
const openSourceUrl = () => {
  if (!article.value?.sourceUrl) return
  
  // #ifdef H5
  window.open(article.value.sourceUrl, '_blank')
  // #endif
  
  // #ifndef H5
  uni.setClipboardData({
    data: article.value.sourceUrl,
    success: () => {
      uni.showToast({ title: '链接已复制', icon: 'success' })
    }
  })
  // #endif
}

// 点赞
const handleLike = async () => {
  if (!article.value) return
  
  try {
    // TODO: 调用点赞接口
    // await request.post(`/api/knowledge/article/${article.value.id}/like`)
    
    liked.value = !liked.value
    article.value.likeCount += liked.value ? 1 : -1
    
    uni.showToast({ 
      title: liked.value ? '点赞成功' : '已取消点赞', 
      icon: 'success' 
    })
  } catch (error) {
    console.error('点赞失败:', error)
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

// 收藏
const handleFavorite = async () => {
  if (!article.value) return
  
  try {
    // TODO: 调用收藏接口
    // await request.post(`/api/knowledge/article/${article.value.id}/favorite`)
    
    favorited.value = !favorited.value
    article.value.favoriteCount += favorited.value ? 1 : -1
    
    uni.showToast({ 
      title: favorited.value ? '收藏成功' : '已取消收藏', 
      icon: 'success' 
    })
  } catch (error) {
    console.error('收藏失败:', error)
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

// 分享
const handleShare = () => {
  if (!article.value) return
  
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
  
  uni.showToast({ title: '请点击右上角分享', icon: 'none' })
}

// 返回
const goBack = () => {
  uni.navigateBack()
}

// 加载文章详情
const loadArticleDetail = async (id: number) => {
  loading.value = true
  try {
    const res = await knowledgeApi.getArticle(id)
    
    console.log('=== 文章详情接口完整响应 ===')
    console.log('res:', res)
    console.log('res.code:', res.code)
    console.log('res.data:', res.data)
    console.log('res.data.blocks:', res.data?.blocks)
    console.log('res.data.tags:', res.data?.tags)
    
    if (res.code === 200 && res.data) {
      article.value = res.data
      console.log('文章数据已设置:', article.value)
    } else {
      uni.showToast({ title: res.message || '获取文章失败', icon: 'none' })
    }
  } catch (error) {
    console.error('加载文章详情失败:', error)
    uni.showToast({ title: '网络异常，加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  // @ts-ignore
  const options = currentPage.options || {}
  const id = options?.id ? parseInt(options.id) : null
  
  if (id) {
    articleId.value = id
    loadArticleDetail(id)
  } else {
    uni.showToast({ title: '缺少文章ID', icon: 'none' })
    setTimeout(() => {
      goBack()
    }, 1500)
  }
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
}

.placeholder {
  width: 24px;
}

.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 32px;
}

.loading-text {
  margin-top: 8px;
  color: #6b7280;
}

.content-scroll {
  flex: 1;
  height: 0;
}

/* 封面图 */
.cover-section {
  width: 100%;
  height: 220px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
}

/* 卡片样式 */
.card {
  background-color: #ffffff;
  padding: 16px;
  margin-top: 12px;
}

.mt-3 {
  margin-top: 12px;
}

.article-title {
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  line-height: 1.5;
  display: block;
  margin-bottom: 12px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.meta-text {
  font-size: 13px;
  color: #6b7280;
}

.meta-divider {
  color: #d1d5db;
}

.tags-box {
  display: flex;
  flex-wrap: wrap;
  margin-top: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  display: block;
  margin-bottom: 12px;
  border-left: 4px solid #3b82f6;
  padding-left: 8px;
}

.summary-text {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  display: block;
  background-color: #f9fafb;
  padding: 12px;
  border-radius: 8px;
}

/* 内容块样式 */
.block-item {
  margin-bottom: 20px;
}

.block-item:last-child {
  margin-bottom: 0;
}

.block-title {
  font-size: 17px;
  font-weight: 600;
  color: #1f2937;
  display: block;
  margin-bottom: 8px;
}

.block-content {
  font-size: 15px;
  color: #374151;
  line-height: 1.8;
  display: block;
  white-space: pre-line;
}

.block-image {
  width: 100%;
  border-radius: 8px;
  margin-top: 8px;
}

/* FAQ样式 */
.faq-item {
  background-color: #f9fafb;
  padding: 12px;
  border-radius: 8px;
}

.faq-question {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
  display: block;
  margin-bottom: 8px;
}

.faq-answer {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  display: block;
}

/* 底部操作栏 */
.action-bar {
  position: sticky;
  bottom: 0;
  background-color: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding: 12px 16px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 10;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.action-text {
  font-size: 12px;
  color: #6b7280;
}

.bottom-spacer {
  height: 20px;
}
</style>
