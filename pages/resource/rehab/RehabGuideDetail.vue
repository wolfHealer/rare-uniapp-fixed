<template>
  <view class="page-container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <u-icon name="arrow-left" size="24" color="#000000" @click="goBack"></u-icon>
      <text class="title">训练指南详情</text>
      <view class="placeholder"></view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <u-loading-icon mode="circle"></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 内容区域 -->
    <scroll-view v-else-if="detail" scroll-y class="content-scroll">
      <!-- 基本信息卡片 -->
      <view class="card">
        <text class="guide-title">{{ detail.title }}</text>
        
        <view class="tags-box">
          <!-- 显示关联疾病 -->
          <u-tag 
            v-for="(disease, index) in (detail.diseases || [])" 
            :key="index"
            :text="disease.name" 
            type="primary" 
            size="mini"
            customStyle="margin-right: 4px;"
          ></u-tag>
          <!-- 显示康复阶段 -->
          <u-tag 
            :text="getStageLabel(detail.rehabStage)" 
            plain 
            size="mini"
          ></u-tag>
        </view>
      </view>

      <!-- 训练图示 -->
      <!-- 注意：接口返回 picUrls 为数组，若为空则不显示 -->
      <view v-if="detail.picUrls && detail.picUrls.length > 0" class="card mt-3">
        <text class="section-title">训练图示</text>
        <view class="images-list">
          <u-image
            v-for="(img, index) in detail.picUrls"
            :key="index"
            :src="img"
            width="100%"
            height="200px"
            mode="aspectFill"
            @click="previewImage(index)"
            class="mb-2 rounded-lg"
          ></u-image>
        </view>
      </view>

      <!-- 训练目的 -->
      <view v-if="detail.trainPurpose" class="card mt-3">
        <text class="section-title">训练目的</text>
        <text class="content-text">{{ detail.trainPurpose }}</text>
      </view>

      <!-- 训练内容 -->
      <view v-if="detail.trainContent" class="card mt-3">
        <text class="section-title">训练内容</text>
        <text class="content-text">{{ detail.trainContent }}</text>
      </view>

      <!-- 禁忌事项 -->
      <view v-if="detail.forbiddenAction" class="card mt-3">
        <text class="section-title forbidden-title">禁忌事项</text>
        <text class="content-text forbidden-text">{{ detail.forbiddenAction }}</text>
      </view>

      <!-- 操作按钮 -->
      <view class="card mt-3">
        <u-button 
          v-if="detail.guidePdf"
          plain 
          block 
          @click="downloadGuide"
          class="mb-2"
          :loading="downloading"
        >
          {{ downloading ? '下载中...' : '查看/下载 PDF 版' }}
        </u-button>
        
        <!-- 如果有 Word 文档也可以添加，这里暂只展示 PDF -->
        <!-- <u-button 
          v-if="detail.guideWord"
          plain 
          block 
          @click="downloadWord"
          class="mb-2"
        >
          下载 Word 版
        </u-button> -->

        <u-button 
          plain 
          block 
          @click="goBack"
        >
          返回列表
        </u-button>
      </view>
      
      <view class="bottom-spacer"></view>
    </scroll-view>

    <!-- 空状态 -->
    <u-empty v-else mode="data" description="指南不存在或已下架"></u-empty>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import request from '@/utils/request'

// 类型定义
interface Disease {
  id: number
  name: string
  alias: string
}

interface GuideDetail {
  id: number
  title: string
  rehabStage: string
  trainPurpose: string
  trainContent: string
  forbiddenAction: string
  picUrls: string[] 
  guidePdf: string
  guideWord?: string // 可选
  diseases: Disease[]
  auditStatus: number
  createdAt: string
  updatedAt: string
}

// 响应式数据
const detail = ref<GuideDetail | null>(null)
const loading = ref<boolean>(false)
const downloading = ref<boolean>(false)
const guideId = ref<number | null>(null)

// 辅助函数：转换阶段标签
const getStageLabel = (stage: string) => {
  if (!stage) return '未知'
  const map: Record<string, string> = {
    early: '早期',
    middle: '中期',
    late: '晚期',
    stable: '稳定期',
    progressive: '渐进期'
  }
  return map[stage] || stage
}

// 加载详情
const loadDetail = async (id: number) => {
  loading.value = true
  try {
    const res = await request.get(`/api/resource/rehab/trainings/${id}`)
    // 确保赋值的是 data 部分
    detail.value = res.data || null
  } catch (error) {
    console.error('加载指南详情失败:', error)
    detail.value = null
    uni.showToast({ title: '加载失败，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 预览图片
const previewImage = (currentIndex: number) => {
  if (!detail.value?.picUrls || detail.value.picUrls.length === 0) return
  
  uni.previewImage({
    urls: detail.value.picUrls,
    current: currentIndex
  })
}

// 下载/查看 PDF 版
const downloadGuide = async () => {
  if (!detail.value?.guidePdf) {
    uni.showToast({ title: '暂无PDF文件', icon: 'none' })
    return
  }
  
  downloading.value = true
  
  let pdfUrl = detail.value.guidePdf
  // 处理相对路径
  if (!pdfUrl.startsWith('http')) {
     const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
     pdfUrl = BASE_URL + pdfUrl
  }

  uni.showLoading({ title: '加载中...' })
  
  uni.downloadFile({
    url: pdfUrl,
    success: (res) => {
      uni.hideLoading()
      if (res.statusCode === 200) {
        uni.openDocument({
          filePath: res.tempFilePath,
          fileType: 'pdf',
          showMenu: true,
          success: () => {},
          fail: (err) => {
            console.error(err)
            uni.showToast({ title: '打开文件失败', icon: 'none' })
          }
        })
      } else {
        uni.showToast({ title: '下载失败', icon: 'none' })
      }
    },
    fail: (err) => {
      uni.hideLoading()
      console.error(err)
      uni.showToast({ title: '网络请求失败', icon: 'none' })
    },
    complete: () => {
      downloading.value = false
    }
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 生命周期
onLoad((options) => {
  if (options.id) {
    guideId.value = Number(options.id)
    loadDetail(guideId.value)
  } else {
    uni.showToast({ title: '缺少指南ID', icon: 'none' })
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
  height: 0; /* 关键：配合 flex:1 实现内部滚动 */
}

.card {
  background-color: #ffffff;
  padding: 16px;
  margin-top: 12px;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.mt-3 {
  margin-top: 12px;
}

.mb-2 {
  margin-bottom: 8px;
}

.guide-title {
  font-size: 20px;
  font-weight: bold;
  display: block;
  color: #1f2937;
  line-height: 1.4;
}

.tags-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 12px;
  gap: 6px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  display: block;
  margin-bottom: 12px;
  color: #1f2937;
  border-left: 4px solid #3b82f6;
  padding-left: 8px;
}

.forbidden-title {
  border-left-color: #ef4444;
  color: #dc2626; 
}

.content-text {
  font-size: 15px;
  color: #374151;
  line-height: 1.6;
  white-space: pre-line; /* 保留换行符 */
  display: block;
}

.forbidden-text {
  color: #b91c1c; 
  background-color: #fef2f2;
  padding: 8px;
  border-radius: 4px;
}

.images-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rounded-lg {
  border-radius: 8px;
  overflow: hidden;
}

.bottom-spacer {
  height: 20px;
}
</style>