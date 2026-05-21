<template>
  <view class="page-container">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <u-loading-icon mode="circle"></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 内容区域 -->
    <view v-else-if="detail" class="content-box">
      <!-- 基本信息 -->
      <view class="card">
        <text class="doctor-name">{{ detail.name }}</text>
        <view class="doctor-info">
          <text>{{ detail.hospitalName }} · {{ detail.department }} · {{ detail.title }}</text>
        </view>
        
        <!-- 擅长领域 -->
        <view class="doctor-specialty mt-2">
          <text class="label">擅长：</text>
          <text class="content">{{ detail.goodAt }}</text>
        </view>

        <!-- 【新增】擅长疾病标签 -->
        <view v-if="detail.diseases && detail.diseases.length > 0" class="disease-tags mt-2">
          <text class="label">擅长疾病：</text>
          <view class="tags-wrapper">
            <u-tag 
              v-for="disease in detail.diseases" 
              :key="disease.id"
              :text="disease.name" 
              type="primary" 
              size="mini" 
              shape="circle"
              plain
              class="mr-2 mb-2"
            />
          </view>
        </view>
        
        <!-- 地址信息 -->
        <view v-if="detail.address" class="doctor-address mt-2">
          <u-icon name="map" size="14" color="#999"></u-icon>
          <text class="address-text">{{ detail.address }}</text>
        </view>

        <!-- 协作网成员标签 -->
        <u-tag 
          v-if="detail.isRareNetwork" 
          type="success" 
          size="mini" 
          class="mt-2"
        >
          罕见病协作网成员
        </u-tag>
      </view>

      <!-- 出诊信息 -->
      <view v-if="detail.clinicTime" class="card mt-3">
        <text class="card-title">出诊时间</text>
        <text class="card-content">{{ detail.clinicTime }}</text>
      </view>

      <!-- 联系方式 -->
      <view v-if="detail.contact" class="card mt-3">
        <text class="card-title">联系方式</text>
        <view class="phone-row">
          <text class="phone-text">{{ maskPhone(detail.contact) }}</text>
          <u-button size="mini" plain @click="togglePhone">
            {{ showPhone ? '隐藏' : '查看' }}
          </u-button>
        </view>
      </view>

      <!-- 患者评价 -->
      <view v-if="detail.commentNum && detail.commentNum > 0" class="card mt-3">
        <text class="card-title">患者评价 ({{ detail.commentNum }})</text>
        <view class="rating-summary">
          <u-icon name="star-fill" color="#ff976a" size="18"></u-icon>
          <text class="rating-score">{{ detail.score }}</text>
          <text class="rating-unit">分</text>
        </view>
        <text class="no-reviews-tip" v-if="!detail.reviews || detail.reviews.length === 0">
          暂无详细评价内容
        </text>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <u-button type="primary" block @click="handleBooking">
          预约就诊
        </u-button>
        <u-button plain block @click="handleConsult">
          在线咨询
        </u-button>
      </view>
    </view>

    <!-- 空状态 -->
    <u-empty v-else mode="data" description="医生信息不存在"></u-empty>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { medicalApi } from '@/api/medical'
import type { DoctorDetailData } from '@/types/medical'

const detail = ref<DoctorDetailData | null>(null)
const loading = ref<boolean>(false)
const showPhone = ref<boolean>(false)
const doctorId = ref<number | null>(null)

// 加载详情
const loadDetail = async (id: number) => {
  loading.value = true
  try {
    const res = await medicalApi.getDoctor(id)
    detail.value = res.data
  } catch (error) {
    console.error('加载医生详情失败:', error)
    detail.value = null
    uni.showToast({ title: '加载医生信息失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 手机号脱敏
const maskPhone = (phone: string) => {
  if (!phone) return ''
  if (!showPhone.value) {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }
  return phone
}

// 切换手机显示
const togglePhone = () => {
  showPhone.value = !showPhone.value
}

// 预约就诊
const handleBooking = () => {
  if (doctorId.value) {
    uni.navigateTo({
      url: `/pages/resource/medical/booking/doctor?id=${doctorId.value}`
    })
  }
}

// 在线咨询
const handleConsult = () => {
  if (doctorId.value) {
    uni.navigateTo({
      url: `/pages/resource/medical/consult/doctor?id=${doctorId.value}`
    })
  }
}

// 生命周期
onLoad((options) => {
  if (options.id) {
    doctorId.value = Number(options.id)
    loadDetail(doctorId.value)
  } else {
    uni.showToast({ title: '缺少医生ID', icon: 'none' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
})
</script>

<style scoped>
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

.doctor-name {
  font-size: 18px;
  font-weight: bold;
  display: block;
}

.doctor-info {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
  display: block;
}

.doctor-specialty {
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
}

.doctor-specialty .label {
  color: #6b7280;
  font-weight: 500;
}

/* 【新增】疾病标签样式 */
.disease-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.disease-tags .label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  margin-right: 8px;
  margin-top: 4px; /* 对齐标签高度 */
}

.tags-wrapper {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
}

.mr-2 {
  margin-right: 8px;
}

.mb-2 {
  margin-bottom: 8px;
}

.doctor-address {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.address-text {
  margin-left: 4px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  display: block;
  margin-bottom: 8px;
}

.card-content {
  font-size: 14px;
  color: #374151;
}

.phone-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.phone-text {
  font-size: 14px;
  color: #374151;
}

.rating-summary {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
}

.rating-score {
  font-size: 18px;
  font-weight: bold;
}

.rating-unit {
  font-size: 14px;
  color: #6b7280;
}

.no-reviews-tip {
  font-size: 12px;
  color: #9ca3af;
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}
</style>