<template>
  <view class="page-container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <u-icon name="arrow-left" size="24" @click="goBack"></u-icon>
      <text class="title">机构详情</text>
      <view class="placeholder"></view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <u-loading-icon mode="circle"></u-loading-icon>
    </view>

    <!-- 内容区域 -->
    <scroll-view v-else-if="detail" scroll-y class="content-scroll">
      
      <!-- 封面图 (如果有) -->
      <u-image 
        v-if="detail.coverUrl"
        :src="detail.coverUrl" 
        width="100%" 
        height="200px" 
        mode="aspectFill"
      ></u-image>

      <!-- 基本信息 -->
      <view class="card">
        <view class="name-row">
          <text class="inst-name">{{ detail.name }}</text>
          <u-tag 
            v-if="detail.isInsurance" 
            text="医保定点" 
            type="success" 
            size="mini"
            customStyle="margin-left: 8px;"
          ></u-tag>
        </view>
        
        <view class="tags-box">
          <u-tag :text="detail.typeName || '康复机构'" type="primary" size="mini"></u-tag>
          <!-- 修改点: 组合显示地区 -->
          <u-tag :text="getFullRegion()" plain size="mini" class="ml-2"></u-tag>
          <u-tag 
            v-if="detail.rating" 
            :text="'评分 ' + detail.rating" 
            type="warning" 
            size="mini" 
            plain
            class="ml-2"
          ></u-tag>
        </view>
        
        <view class="address-row">
          <u-icon name="map" size="14" color="#9ca3af"></u-icon>
          <text class="address-text">{{ detail.address }}</text>
        </view>
      </view>

      <!-- 擅长疾病 -->
      <view v-if="detail.diseases && detail.diseases.length > 0" class="card mt-3">
        <text class="section-title">擅长领域/疾病</text>
        <view class="tag-cloud">
          <u-tag 
            v-for="(disease, index) in detail.diseases" 
            :key="index"
            :text="disease.name" 
            plain 
            size="mini"
            customStyle="margin-right: 8px; margin-bottom: 8px;"
          ></u-tag>
        </view>
      </view>

      <!-- 康复项目 -->
      <view v-if="detail.rehabProjects" class="card mt-3">
        <text class="section-title">康复项目</text>
        <text class="content-text">{{ detail.rehabProjects }}</text>
      </view>

      <!-- 医生团队 -->
      <view v-if="detail.doctors && detail.doctors.length > 0" class="card mt-3">
        <text class="section-title">医生团队</text>
        <u-cell-group>
          <u-cell
            v-for="(doctor, index) in detail.doctors"
            :key="index"
            :title="doctor.name"
            :label="`${doctor.title} · ${doctor.specialty}`"
          />
        </u-cell-group>
      </view>

      <!-- 服务设施 -->
      <view v-if="detail.facilities && detail.facilities.length > 0" class="card mt-3">
        <text class="section-title">服务设施</text>
        <view class="facility-list">
          <view v-for="(item, index) in detail.facilities" :key="index" class="facility-item">
            <u-icon name="checkmark-circle" size="14" color="#10b981"></u-icon>
            <text>{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- 营业时间与费用 -->
      <view class="card mt-3">
        <text class="section-title">服务信息</text>
        <view class="info-row" v-if="detail.businessHours">
          <text class="info-label">营业时间：</text>
          <text class="info-value">{{ detail.businessHours }}</text>
        </view>
        <view class="info-row" v-if="detail.feeStandard">
          <text class="info-label">费用说明：</text>
          <text class="info-value">{{ detail.feeStandard }}</text>
        </view>
      </view>

      <!-- 联系方式 -->
      <view class="card mt-3">
        <text class="section-title">联系方式</text>
        <view class="btn-group">
          <u-button 
            v-if="detail.contactPhone"
            size="small" 
            type="primary" 
            customStyle="width: 100%; margin-bottom: 8px;"
            @click="makeCall"
          >
            拨打电话
          </u-button>
          <u-button 
            v-if="detail.contactUrl"
            size="small" 
            plain 
            customStyle="width: 100%; margin-bottom: 8px;"
            @click="openWebsite"
          >
            访问官网/复制链接
          </u-button>
          <u-button 
            size="small" 
            plain 
            customStyle="width: 100%;"
            @click="copyAddress"
          >
            复制地址
          </u-button>
        </view>
      </view>

      <!-- 资质证明 (如果有) -->
      <view v-if="detail.qualification" class="card mt-3">
         <text class="section-title">资质证明</text>
         <u-button size="small" plain type="info" @click="openQualification">查看资质证书</u-button>
      </view>

      <!-- 操作按钮 -->
      <view class="card mt-3">
        <u-button 
          plain 
          customStyle="width: 100%;"
          @click="goBack"
        >
          返回列表
        </u-button>
      </view>
      
      <view class="bottom-spacer"></view>
    </scroll-view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <u-empty mode="page" text="机构不存在或已停业"></u-empty>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import request from '@/utils/request'

// 类型定义更新
interface Doctor {
  name: string
  title: string
  specialty: string
}

interface Disease {
  id: number
  name: string
  alias: string
}

interface InstitutionDetail {
  id: number
  name: string
  typeName: string
  provinceName: string
  cityName: string
  districtName: string
  address: string
  contactPhone: string
  contactUrl: string
  qualification?: string
  rehabProjects: string
  feeStandard: string
  diseases: Disease[]
  auditStatus: number
  rating: number
  status: string
  coverUrl?: string
  images?: string[]
  businessHours?: string
  facilities?: string[]
  doctors: Doctor[]
  isInsurance: boolean
}

// 响应式数据
const detail = ref<InstitutionDetail | null>(null)
const loading = ref<boolean>(false)
const institutionId = ref<number | null>(null)

// 辅助函数：组合地区名称
const getFullRegion = () => {
  if (!detail.value) return ''
  const parts = [detail.value.provinceName, detail.value.cityName, detail.value.districtName].filter(Boolean)
  return parts.join('')
}

// 加载详情
const loadDetail = async (id: number) => {
  loading.value = true
  try {
    const res = await request.get(`/api/resource/rehab/institutions/${id}`)
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
const makeCall = () => {
  if (detail.value?.contactPhone) {
    uni.makePhoneCall({
      phoneNumber: detail.value.contactPhone
    })
  }
}

// 访问官网/复制链接
const openWebsite = () => {
  if (detail.value?.contactUrl) {
    // #ifdef H5
    window.open(detail.value.contactUrl, '_blank')
    // #endif
    // #ifndef H5
    uni.setClipboardData({
      data: detail.value.contactUrl,
      success: () => {
        uni.showToast({ title: '链接已复制', icon: 'success' })
      }
    })
    // #endif
  }
}

// 查看资质
const openQualification = () => {
  if (detail.value?.qualification) {
     // #ifdef H5
     window.open(detail.value.qualification, '_blank')
     // #endif
     // #ifndef H5
     uni.setClipboardData({
      data: detail.value.qualification,
      success: () => {
        uni.showToast({ title: '资质链接已复制', icon: 'success' })
      }
    })
    // #endif
  }
}

// 复制地址
const copyAddress = () => {
  if (detail.value?.address) {
    const fullAddress = `${getFullRegion()}${detail.value.address}`
    uni.setClipboardData({
      data: fullAddress,
      success: () => {
        uni.showToast({ title: '地址已复制', icon: 'success' })
      }
    })
  }
}

// 返回
const goBack = () => {
  uni.navigateBack()
}

// 生命周期
onLoad((options) => {
  if (options.id) {
    institutionId.value = Number(options.id)
    loadDetail(institutionId.value)
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
}

.placeholder {
  width: 24px;
}

.loading-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-scroll {
  flex: 1;
  height: 0;
}

.card {
  background-color: #ffffff;
  padding: 16px;
  margin-top: 12px;
}

.mt-3 {
  margin-top: 12px;
}

.ml-2 {
  margin-left: 8px;
}

.name-row {
  display: flex;
  align-items: center;
}

.inst-name {
  font-size: 20px;
  font-weight: bold;
  display: block;
  color: #1f2937;
}

.tags-box {
  display: flex;
  align-items: center;
  margin-top: 8px;
  flex-wrap: wrap;
}

.address-row {
  display: flex;
  align-items: flex-start;
  margin-top: 8px;
  gap: 6px;
}

.address-text {
  font-size: 14px;
  color: #4b5563;
  flex: 1;
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

.content-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  display: block;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
}

.facility-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.facility-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #374151;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-label {
  color: #6b7280;
  width: 80px;
  flex-shrink: 0;
}

.info-value {
  color: #374151;
  flex: 1;
}

.btn-group {
  display: flex;
  flex-direction: column;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-spacer {
  height: 20px;
}
</style>