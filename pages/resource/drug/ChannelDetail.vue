<template>
  <view class="page-container">
    <!-- 顶部标题栏 -->
    <view class="nav-bar">
      <u-icon name="arrow-left" size="24" color="#000000" @click="goBack"></u-icon>
      <text class="nav-title">渠道详情</text>
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
          <!-- 修改点: channelType -->
          <u-tag :text="getChannelTypeText(detail.channelType)" type="primary" size="mini"></u-tag>
          <!-- 修改点: auditStatus -->
          <u-tag 
            :text="detail.auditStatus === 1 ? '已认证' : '审核中'" 
            :type="detail.auditStatus === 1 ? 'success' : 'info'" 
            size="mini"
          ></u-tag>
        </view>

        <view class="info-list">
          <view class="info-item">
            <text class="info-label">所在地区</text>
            <!-- 修改点: 组合显示省市区 -->
            <text class="info-value">{{ getFullRegion() }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">配送范围</text>
            <!-- 修改点: deliveryScope -->
            <text class="info-value">{{ detail.deliveryScope || '暂无' }}</text>
          </view>
          <view class="info-item no-border">
            <text class="info-label">详细地址</text>
            <text class="info-value">{{ detail.address || '暂无' }}</text>
          </view>
        </view>
      </view>

      <!-- 渠道描述 -->
      <view class="card" v-if="detail.desc">
        <text class="section-header">渠道说明</text>
        <text class="section-content">{{ detail.desc }}</text>
      </view>

      <!-- 关联药品 -->
      <view class="card" v-if="detail.drugs && detail.drugs.length > 0">
        <text class="section-header">覆盖药品</text>
        <view class="drug-list">
          <view v-for="(drug, index) in detail.drugs" :key="index" class="drug-item">
            <text class="drug-brand">{{ drug.brandName }}</text>
            <text class="drug-generic">({{ drug.genericName }})</text>
          </view>
        </view>
      </view>

      <!-- 资质信息 -->
      <view class="card" v-if="detail.qualification">
        <text class="section-header">资质说明</text>
        <text class="section-content">{{ detail.qualification }}</text>
      </view>

      <!-- 联系方式 -->
      <view class="card">
        <text class="section-header">联系方式</text>
        <view class="contact-list">
          <!-- 电话 -->
          <view class="contact-item" v-if="detail.contactPhone">
            <view class="contact-left">
              <u-icon name="phone" size="20" color="#1989fa"></u-icon>
              <text class="contact-type">电话</text>
            </view>
            <text class="contact-value">{{ detail.contactPhone }}</text>
          </view>
          
          <!-- 网址/链接 -->
          <view class="contact-item" v-if="detail.contactUrl">
            <view class="contact-left">
              <u-icon name="link" size="20" color="#1989fa"></u-icon>
              <text class="contact-type">官网/链接</text>
            </view>
            <text class="contact-value link-text" @click="openUrl">{{ detail.contactUrl }}</text>
          </view>

          <view v-if="!detail.contactPhone && !detail.contactUrl" class="text-gray-400 text-sm p-2">
            暂无公开联系方式
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="card action-card">
        <u-button 
          v-if="detail.contactPhone"
          type="primary" 
          customStyle="width: 100%; margin-bottom: 8px;"
          @click="makeCall"
        >
          拨打电话
        </u-button>
        <u-button 
          plain 
          customStyle="width: 100%;"
          @click="goBack"
        >
          返回列表
        </u-button>
      </view>
      
      <view class="bottom-safe-area"></view>
    </scroll-view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <u-empty mode="page" text="渠道不存在或已下架"></u-empty>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { drugApi } from '@/api/drug'
import type { DrugChannelDetailData } from '@/types/drug'

const detail = ref<DrugChannelDetailData | null>(null)
const loading = ref<boolean>(false)
const channelId = ref<number | null>(null)

// 辅助函数: 转换渠道类型文本
const getChannelTypeText = (type: string) => {
  const map: Record<string, string> = {
    'hospital_pharmacy': '医院药房',
    'retail_pharmacy': '连锁药店',
    'e_pharmacy': '医药电商',
    'compliant_agent': '合规代购'
  }
  return map[type] || '其他渠道'
}

// 辅助函数: 组合地区名称
const getFullRegion = () => {
  if (!detail.value) return '暂无'
  const parts = [detail.value.provinceName, detail.value.cityName, detail.value.districtName].filter(Boolean)
  return parts.join('') || '暂无'
}

const loadDetail = async () => {
  if (!channelId.value) return
  
  loading.value = true
  try {
    const res = await drugApi.getChannel(channelId.value)
    detail.value = res.data || null
  } catch (error) {
    console.error('加载渠道详情失败:', error)
    detail.value = null
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const makeCall = () => {
  if (!detail.value?.contactPhone) return
  uni.makePhoneCall({
    phoneNumber: detail.value.contactPhone
  })
}

const openUrl = () => {
  if (!detail.value?.contactUrl) return
  // #ifdef H5
  window.open(detail.value.contactUrl, '_blank')
  // #endif
  // #ifndef H5
  uni.setClipboardData({
    data: detail.value.contactUrl,
    success: () => uni.showToast({ title: '链接已复制', icon: 'success' })
  })
  // #endif
}

const goBack = () => {
  uni.navigateBack()
}

onLoad((options) => {
  if (options.id) {
    channelId.value = Number(options.id)
    loadDetail()
  } else {
    uni.showToast({ title: '缺少渠道ID', icon: 'none' })
    setTimeout(() => {
      goBack()
    }, 1500)
  }
})
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9fafb;
}

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

.content-scroll {
  flex: 1;
  overflow-y: auto;
}

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
  display: block;
}

/* 新增: 药品列表样式 */
.drug-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.drug-item {
  background-color: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
}

.drug-brand {
  font-weight: 500;
  color: #1f2937;
}

.drug-generic {
  color: #6b7280;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 8px;
}

.contact-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.contact-type {
  font-size: 14px;
  color: #4b5563;
}

.contact-value {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.link-text {
  color: #2563eb;
  word-break: break-all;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-sm {
  font-size: 12px;
}

.p-2 {
  padding: 8px;
}

.action-card {
  margin-bottom: 0;
}

.bottom-safe-area {
  height: 20px;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>