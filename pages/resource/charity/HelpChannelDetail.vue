<template>
  <view class="page-container">
    <!-- 顶部标题栏 -->
    <view class="nav-bar">
      <u-icon name="arrow-left" size="24" color="#000000" @click="goBack"></u-icon>
      <text class="nav-title">求助渠道详情</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <u-loading-icon mode="circle"></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 内容区域 -->
    <scroll-view v-else-if="detail" scroll-y class="content-scroll">
      <!-- 渠道基本信息 -->
      <view class="card">
        <text class="channel-name">{{ detail.name }}</text>
        
        <view class="tags-row">
          <!-- 修改点: channelType 替代 type -->
          <u-tag 
            :text="getChannelTypeLabel(detail.channelType)" 
            :type="getChannelTypeTag(detail.channelType)" 
            size="mini"
          ></u-tag>
          <!-- 修改点: 使用 auditStatus 判断状态 -->
          <u-tag 
            :text="detail.auditStatus === 1 ? '正常' : '审核中'" 
            :type="detail.auditStatus === 1 ? 'success' : 'info'" 
            size="mini"
          ></u-tag>
        </view>
      </view>

      <!-- 联系方式 -->
      <view class="card">
        <text class="section-header">联系方式</text>
        
        <!-- 电话 -->
        <view class="contact-info" v-if="detail.contactPhone">
          <u-icon name="phone" size="18" color="#6b7280" class="contact-icon"></u-icon>
          <text>{{ detail.contactPhone }}</text>
        </view>
        
        <!-- 网址 -->
        <view class="contact-info" v-if="detail.contactUrl">
          <u-icon name="link" size="18" color="#6b7280" class="contact-icon"></u-icon>
          <text class="link-text">{{ detail.contactUrl }}</text>
        </view>

        <!-- 操作按钮 -->
        <view class="action-buttons">
          <u-button 
            v-if="detail.contactPhone"
            size="small" 
            type="primary" 
            customStyle="flex: 1;"
            @click="makeCall"
          >
            立即拨打
          </u-button>
          <u-button 
            v-if="detail.contactUrl"
            size="small" 
            type="primary" 
            customStyle="flex: 1;"
            @click="openUrl"
          >
            访问网站
          </u-button>
        </view>
      </view>

      <!-- 响应时间/说明 -->
      <view class="card" v-if="detail.responseTime">
        <text class="section-header">响应时间/说明</text>
        <view class="service-time">
          <u-icon name="clock" size="16" class="time-icon"></u-icon>
          <text>{{ detail.responseTime }}</text>
        </view>
      </view>

      <!-- 申请条件 -->
      <view class="card" v-if="detail.applyCondition">
        <text class="section-header">申请条件</text>
        <text class="section-content">{{ detail.applyCondition }}</text>
      </view>

      <!-- 相关模板/资源 -->
      <view class="card" v-if="hasTemplates">
        <text class="section-header">相关模板</text>
        <view class="resource-list">
          <u-button 
            v-if="detail.helpLetterTemplate"
            size="small" 
            plain 
            customStyle="width: 100%; margin-bottom: 8px;"
            @click="downloadResource(detail.helpLetterTemplate, '求助信模板')"
          >
            下载求助信模板
          </u-button>
          <u-button 
            v-if="detail.crowdfundingTemplate"
            size="small" 
            plain 
            customStyle="width: 100%;"
            @click="downloadResource(detail.crowdfundingTemplate, '众筹材料模板')"
          >
            下载众筹材料模板
          </u-button>
        </view>
      </view>

      <!-- 返回按钮 -->
      <view class="card action-card">
        <u-button 
          plain 
          customStyle="width: 100%;"
          @click="goBack"
        >
          返回列表
        </u-button>
      </view>
      
      <!-- 底部占位 -->
      <view class="bottom-safe-area"></view>
    </scroll-view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <u-empty mode="page" text="渠道不存在或已下架"></u-empty>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import request from '@/utils/request'

// 类型定义更新
interface ChannelDetail {
  id: number
  channelType: string
  name: string
  applyCondition: string
  responseTime: string
  contactPhone: string
  contactUrl: string
  helpLetterTemplate: string
  crowdfundingTemplate: string
  auditStatus: number
  rejectReason: string
  sort: number
  createdAt: string
  updatedAt: string
}

// 响应式数据
const detail = ref<ChannelDetail | null>(null)
const loading = ref<boolean>(false)
const channelId = ref<number | string>('')

// 计算是否有模板
const hasTemplates = computed(() => {
  return detail.value && (detail.value.helpLetterTemplate || detail.value.crowdfundingTemplate)
})

// 获取渠道类型标签样式
const getChannelTypeTag = (type: string) => {
  const tagMap: Record<string, any> = {
    emergency_help: 'success',
    crowdfunding: 'primary',
    charity_consulting: 'warning',
    foundation_support: 'info',
    other: 'info'
  }
  return tagMap[type] || 'info'
}

// 获取渠道类型标签文字
const getChannelTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    emergency_help: '紧急求助',
    crowdfunding: '众筹求助',
    charity_consulting: '慈善咨询',
    foundation_support: '基金会支持',
    other: '其他'
  }
  return labelMap[type] || '其他'
}

// 获取页面参数
onLoad((options) => {
  if (options && options.id) {
    channelId.value = options.id
    loadDetail()
  } else {
    uni.showToast({ title: '缺少渠道ID', icon: 'none' })
    goBack()
  }
})

// 加载详情
const loadDetail = async () => {
  if (!channelId.value) return

  loading.value = true
  try {
    const res = await request.get(`/api/resource/charity/channels/${channelId.value}`)
    detail.value = res.data || null
  } catch (error) {
    console.error('加载渠道详情失败:', error)
    detail.value = null
    uni.showToast({ title: '加载失败，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 拨打电话
const makeCall = () => {
  if (!detail.value?.contactPhone) return
  
  uni.makePhoneCall({
    phoneNumber: detail.value.contactPhone,
    fail: () => {
      uni.showToast({ title: '拨打失败', icon: 'none' })
    }
  })
}

// 打开网址
const openUrl = () => {
  if (!detail.value?.contactUrl) return
  
  // #ifdef H5
  window.open(detail.value.contactUrl, '_blank')
  // #endif
  
  // #ifndef H5
  uni.setClipboardData({
    data: detail.value.contactUrl,
    success: () => {
      uni.showToast({ title: '链接已复制，请在浏览器中打开', icon: 'none' })
    }
  })
  // #endif
}

// 下载资源
const downloadResource = async (url: string, name: string) => {
  if (!url) {
    uni.showToast({ title: '资源链接无效', icon: 'none' })
    return
  }

  uni.showLoading({ title: '下载中...' })

  try {
    let downloadUrl = url
    
    if (!downloadUrl.startsWith('http')) {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
      downloadUrl = BASE_URL + downloadUrl
    }

    uni.downloadFile({
      url: downloadUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          uni.openDocument({
            filePath: res.tempFilePath,
            showMenu: true,
            success: () => {
              uni.hideLoading()
              uni.showToast({ title: `${name}已打开`, icon: 'success' })
            },
            fail: () => {
              uni.hideLoading()
              uni.showToast({ title: '打开文件失败', icon: 'none' })
            }
          })
        } else {
          uni.hideLoading()
          uni.showToast({ title: '下载失败', icon: 'none' })
        }
      },
      fail: (err) => {
        uni.hideLoading()
        console.error('下载失败', err)
        uni.showToast({ title: '下载失败，请检查网络', icon: 'none' })
      }
    })

  } catch (error) {
    uni.hideLoading()
    console.error('下载异常', error)
    uni.showToast({ title: '下载异常', icon: 'none' })
  }
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

.channel-name {
  font-size: 20px;
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
}

.tags-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.section-header {
  font-weight: 600;
  font-size: 16px;
  display: block;
  margin-bottom: 8px;
  color: #1f2937;
}

.warning-header {
  color: #ea580c;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  color: #374151;
}

.contact-icon {
  margin-right: 4px;
}

.link-text {
  word-break: break-all;
  color: #2563eb;
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.service-time {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #374151;
}

.time-icon {
  margin-right: 4px;
}

.section-content {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  white-space: pre-line;
  display: block;
}

.warning-content {
  color: #c2410c;
}

/* 资源列表 */
.resource-list {
  display: flex;
  flex-direction: column;
}

/* 底部操作区 */
.action-card {
  margin-bottom: 0;
}

.bottom-safe-area {
  height: 20px;
}

/* 空状态 */
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>