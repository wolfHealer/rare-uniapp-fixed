<template>
  <view class="page-container">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <u-loading-icon mode="circle"></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 内容区域 -->
    <view v-else-if="detail" class="content-box">
      
      <!-- 1. 基本信息卡片 -->
      <view class="card">
        <text class="org-name">{{ detail.name }}</text>
        <view class="org-meta">
          <u-tag :text="detail.typeName" type="primary" size="mini" plain></u-tag>
          <u-tag 
            v-if="detail.isFree" 
            text="免费" 
            type="success" 
            size="mini" 
            plain 
            class="ml-2"
          ></u-tag>
          <u-tag 
            :text="detail.status === 'active' ? '服务中' : '已停业'" 
            :type="detail.status === 'active' ? 'success' : 'info'" 
            size="mini" 
            plain
            class="ml-2"
          ></u-tag>
        </view>
        
        <!-- 评分 -->
        <view v-if="detail.rating" class="rating-box mt-2">
          <u-icon name="star-fill" color="#ff976a" size="14"></u-icon>
          <text class="rating-score">{{ detail.rating }}</text>
          <text class="rating-unit">分</text>
        </view>
      </view>

      <!-- 2. 机构介绍 -->
      <view v-if="detail.description" class="card mt-3">
        <text class="card-title">机构介绍</text>
        <text class="card-content desc-text">{{ detail.description }}</text>
      </view>

      <!-- 3. 服务项目 -->
      <view v-if="detail.services && detail.services.length > 0" class="card mt-3">
        <text class="card-title">服务项目</text>
        <view class="tags-wrap">
          <u-tag
            v-for="(service, index) in detail.services"
            :key="index"
            :text="service"
            plain
            size="mini"
            type="primary"
            class="mr-2 mb-2"
          ></u-tag>
        </view>
      </view>

      <!-- 4. 咨询师团队 -->
      <view v-if="detail.counselors && detail.counselors.length > 0" class="card mt-3">
        <text class="card-title">咨询师团队</text>
        <view class="counselor-list">
          <view v-for="(c, index) in detail.counselors" :key="index" class="counselor-item">
            <text class="c-name">{{ c.name }}</text>
            <text class="c-info">{{ c.title }} · {{ c.specialty }}</text>
          </view>
        </view>
      </view>

      <!-- 5. 联系与地址 -->
      <view class="card mt-3">
        <text class="card-title">联系方式</text>
        
        <!-- 电话 -->
        <view v-if="detail.phone" class="contact-row" @click="makePhoneCall(detail.phone)">
          <u-icon name="phone" size="16" color="#3b82f6"></u-icon>
          <text class="contact-text phone-link">{{ detail.phone }}</text>
        </view>
        
        <!-- 服务时间 -->
        <view v-if="detail.serviceTime" class="contact-row">
          <u-icon name="clock" size="16" color="#6b7280"></u-icon>
          <text class="contact-text">{{ detail.serviceTime }}</text>
        </view>

        <!-- 地址 -->
        <view v-if="detail.address" class="contact-row">
          <u-icon name="map" size="16" color="#6b7280"></u-icon>
          <text class="contact-text flex-1">{{ detail.address }}</text>
          <u-button size="mini" plain @click.stop="openMap">导航</u-button>
        </view>

        <!-- 官网 -->
        <view v-if="detail.website" class="contact-row">
          <u-icon name="link" size="16" color="#6b7280"></u-icon>
          <text class="contact-text flex-1 line-clamp-1">官网链接</text>
          <u-button size="mini" plain @click.stop="copyWebsite">复制</u-button>
        </view>
      </view>

      <!-- 底部操作按钮 -->
      <view class="action-buttons">
        <u-button type="primary" block @click="handleConsult">
          在线咨询
        </u-button>
        <u-button plain block @click="goBack">
          返回列表
        </u-button>
      </view>

    </view>

    <!-- 空状态 -->
    <u-empty v-else mode="data" description="机构信息不存在"></u-empty>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { rehabApi } from '@/api/rehab'
import type { PsychologicalOrgDetailData } from '@/types/rehab'

const detail = ref<PsychologicalOrgDetailData | null>(null)
const loading = ref<boolean>(false)
const organizationId = ref<number | null>(null)

// 加载详情
const loadDetail = async (id: number) => {
  loading.value = true
  try {
    // 假设接口路径为 /api/resource/rehab/psychological/orgs/{id}
    const res = await rehabApi.getPsychologicalOrg(id)
    // 适配返回结构: { code: 200, data: {...} }
    detail.value = res.data || null
  } catch (error) {
    console.error('加载机构详情失败:', error)
    detail.value = null
    uni.showToast({ title: '加载失败，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 拨打电话
const makePhoneCall = (phoneNumber: string) => {
  if (!phoneNumber) return
  uni.makePhoneCall({
    phoneNumber: phoneNumber,
    fail: () => {
      uni.showToast({ title: '拨打失败', icon: 'none' })
    }
  })
}

// 打开地图导航
const openMap = () => {
  if (!detail.value) return

  // 优先使用经纬度
  if (detail.value.latitude && detail.value.longitude) {
    uni.openLocation({
      latitude: detail.value.latitude,
      longitude: detail.value.longitude,
      name: detail.value.name,
      address: detail.value.address || '',
      success: () => {},
      fail: () => {
        uni.showToast({ title: '打开地图失败', icon: 'none' })
      }
    })
  } else if (detail.value.address) {
    // 无经纬度则复制地址
    uni.setClipboardData({
      data: detail.value.address,
      success: () => {
        uni.showModal({
          title: '提示',
          content: '地址已复制，请打开地图APP搜索导航',
          showCancel: false
        })
      }
    })
  } else {
    uni.showToast({ title: '暂无地址信息', icon: 'none' })
  }
}

// 复制官网
const copyWebsite = () => {
  if (!detail.value?.website) return
  uni.setClipboardData({
    data: detail.value.website,
    success: () => {
      uni.showToast({ title: '链接已复制', icon: 'success' })
    }
  })
}

// 在线咨询 (示例跳转)
const handleConsult = () => {
  uni.showToast({ title: '咨询功能开发中', icon: 'none' })
}

// 返回
const goBack = () => {
  uni.navigateBack()
}

// 生命周期
onLoad((options) => {
  // 1. 增加对 options 本身的非空判断
  if (!options || !options.id) {
    uni.showToast({ title: '缺少机构ID', icon: 'none' })
    setTimeout(() => {
      goBack()
    }, 1500)
    return
  }

  // 2. 此时 options.id 一定存在且不为 undefined
  organizationId.value = Number(options.id)
  loadDetail(organizationId.value)
})
</script>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 16px;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 0;
}

.loading-text {
  margin-left: 8px;
  color: #6b7280;
}

.content-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 卡片通用样式 */
.card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mt-3 {
  margin-top: 12px;
}

.mt-2 {
  margin-top: 8px;
}

.ml-2 {
  margin-left: 8px;
}

.mr-2 {
  margin-right: 8px;
}

.mb-2 {
  margin-bottom: 8px;
}

/* 标题样式 */
.org-name {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  display: block;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  display: block;
  margin-bottom: 8px;
}

/* 元数据与评分 */
.org-meta {
  display: flex;
  align-items: center;
  margin-top: 8px;
  flex-wrap: wrap;
}

.rating-box {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-score {
  font-size: 16px;
  font-weight: bold;
  color: #ff976a;
}

.rating-unit {
  font-size: 12px;
  color: #9ca3af;
}

/* 内容文本 */
.card-content {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
}

.desc-text {
  white-space: pre-line; /* 保留换行符 */
}

/* 标签容器 */
.tags-wrap {
  display: flex;
  flex-wrap: wrap;
}

/* 咨询师列表 */
.counselor-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.counselor-item {
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
}

.c-name {
  font-size: 15px;
  font-weight: 500;
  color: #1f2937;
  display: block;
  margin-bottom: 4px;
}

.c-info {
  font-size: 13px;
  color: #6b7280;
}

/* 联系行 */
.contact-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #f9fafb;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.contact-text {
  font-size: 14px;
  color: #374151;
}

.phone-link {
  color: #3b82f6;
  font-weight: 500;
}

.flex-1 {
  flex: 1;
}

.line-clamp-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 底部按钮 */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}
</style>