<template>
  <view class="page-container">
    <!-- 顶部标题栏 -->
    <view class="nav-bar">
      <u-icon name="arrow-left" size="24" color="#000000" @click="goBack"></u-icon>
      <text class="nav-title">项目详情</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <u-loading-icon mode="circle"></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 内容区域 -->
    <scroll-view v-else-if="detail" scroll-y class="content-scroll">
      
      <!-- 项目基本信息卡片 -->
      <view class="card">
        <text class="project-name">{{ detail.name }}</text>
        
        <view class="tags-row">
          <!-- 疾病标签 -->
          <u-tag :text="detail.diseaseName" type="primary" size="mini"></u-tag>
          <!-- 状态标签 -->
          <u-tag 
            :text="detail.auditStatus === 1 ? '进行中' : '已暂停'" 
            :type="detail.auditStatus === 1 ? 'success' : 'info'" 
            size="mini"
          ></u-tag>
        </view>

        <view class="info-list">
          <view class="info-item">
            <text class="info-label">主办机构</text>
            <text class="info-value">{{ detail.organizer || '暂无' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">援助周期</text>
            <text class="info-value">{{ detail.period || '暂无' }}</text>
          </view>
          <view class="info-item no-border">
            <text class="info-label">援助方案</text>
            <text class="info-value">{{ detail.dosage || '暂无' }}</text>
          </view>
        </view>
      </view>

      <!-- 申请条件 -->
      <view class="card" v-if="detail.condition">
        <text class="section-header">申请条件</text>
        <text class="section-content">{{ detail.condition }}</text>
      </view>

      <!-- 进度查询方式 -->
      <view class="card" v-if="detail.progressQuery">
        <text class="section-header">进度查询</text>
        <view class="service-time">
          <u-icon name="info-circle" size="16" class="time-icon"></u-icon>
          <text>{{ detail.progressQuery }}</text>
        </view>
      </view>

      <!-- 资料下载区 -->
      <view class="card" v-if="hasDownloads">
        <text class="section-header">相关资料下载</text>
        <view class="resource-list">
          <u-button 
            v-if="detail.applyGuide"
            size="small" 
            plain 
            type="primary"
            customStyle="width: 100%; margin-bottom: 8px;"
            @click="downloadFile(detail.applyGuide, '申请指南')"
          >
            下载申请指南
          </u-button>
          <u-button 
            v-if="detail.applyForm"
            size="small" 
            plain 
            type="warning"
            customStyle="width: 100%; margin-bottom: 8px;"
            @click="downloadFile(detail.applyForm, '申请表')"
          >
            下载申请表
          </u-button>
          <u-button 
            v-if="detail.materialList"
            size="small" 
            plain 
            type="info"
            customStyle="width: 100%;"
            @click="downloadFile(detail.materialList, '材料清单')"
          >
            下载材料清单
          </u-button>
        </view>
      </view>

      <!-- 底部占位，防止内容被按钮遮挡 -->
      <view class="bottom-safe-area"></view>
    </scroll-view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <u-empty mode="page" text="项目不存在或已下架"></u-empty>
    </view>

    <!-- 底部固定操作栏 -->
    <view class="action-bar" v-if="detail">
      <u-button 
        plain 
        customStyle="flex: 1; margin-right: 8px;"
        @click="checkProgress"
      >
        查询进度
      </u-button>
      <u-button 
        type="primary" 
        customStyle="flex: 2;"
        :disabled="detail.auditStatus !== 1"
        @click="handleApply"
      >
        {{ detail.auditStatus === 1 ? '立即申请' : '暂不可申请' }}
      </u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { drugApi } from '@/api/drug'
import type { DonationProjectDetailData } from '@/types/drug'
import { downloadAndOpenDocument } from '@/utils/download'

const detail = ref<DonationProjectDetailData | null>(null)
const loading = ref<boolean>(false)
const projectId = ref<number | string>('')

// 计算是否有可下载文件
const hasDownloads = computed(() => {
  return detail.value && (detail.value.applyGuide || detail.value.applyForm || detail.value.materialList)
})

// 获取页面参数
onLoad((options) => {
  if (options && options.projectId) {
    // 兼容列表页传参 projectId 或 id
    projectId.value = options.projectId
    loadDetail()
  } else if (options && options.id) {
    projectId.value = options.id
    loadDetail()
  } else {
    uni.showToast({ title: '缺少项目ID', icon: 'none' })
    goBack()
  }
})

// 加载详情
const loadDetail = async () => {
  if (!projectId.value) return
  
  loading.value = true
  try {
    const res = await drugApi.getDonation(projectId.value)
    detail.value = res.data || null
  } catch (error) {
    console.error('加载项目详情失败:', error)
    detail.value = null
    uni.showToast({ title: '加载失败，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 申请援助
const handleApply = () => {
  if (!detail.value) return
  if (detail.value.auditStatus !== 1) {
    uni.showToast({ title: '该项目暂不可申请', icon: 'none' })
    return
  }
  
  // 跳转到申请填写页面，携带项目ID
  uni.navigateTo({
    url: `/pages/resource/drug/DonationApply?projectId=${detail.value.id}`
  })
}

// 查询进度
const checkProgress = () => {
  if (!detail.value?.progressQuery) {
    uni.showToast({ title: '暂无进度查询说明', icon: 'none' })
    return
  }
  uni.showModal({
    title: '进度查询方式',
    content: detail.value.progressQuery,
    showCancel: false
  })
}

// 通用文件下载
const downloadFile = async (url: string, _fileName: string) => {
  if (!url) {
    uni.showToast({ title: '链接无效', icon: 'none' })
    return
  }

  downloadAndOpenDocument({ url: String(url) })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
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

/* 顶部导航 */
.nav-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #ffffff;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.nav-title {
  font-size: 18px;
  font-weight: bold;
}

.nav-placeholder {
  width: 24px;
}

/* 加载状态 */
.loading-state {
  margin-top: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-text {
  margin-left: 8px;
  font-size: 14px;
  color: #6b7280;
}

/* 滚动内容 */
.content-scroll {
  flex: 1;
  overflow-y: auto;
}

/* 卡片样式 */
.card {
  background-color: #ffffff;
  padding: 16px;
  margin-top: 12px;
}

.project-name {
  font-size: 20px;
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
  color: #1f2937;
}

.tags-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.info-list {
  margin-top: 12px;
  font-size: 14px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.info-item.no-border {
  border-bottom: none;
}

.info-label {
  color: #6b7280;
}

.info-value {
  color: #374151;
  font-weight: 500;
}

.section-header {
  font-weight: 600;
  font-size: 16px;
  display: block;
  margin-bottom: 8px;
  color: #1f2937;
}

.section-content {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  white-space: pre-line;
  display: block;
}

.service-time {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #374151;
}

.time-icon {
  margin-right: 4px;
  color: #6b7280;
}

/* 资源列表 */
.resource-list {
  display: flex;
  flex-direction: column;
}

/* 底部操作栏 */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 12px 16px;
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  z-index: 20;
}

.bottom-safe-area {
  height: 80px; /* 为底部固定按钮留出空间 */
}

/* 空状态 */
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>