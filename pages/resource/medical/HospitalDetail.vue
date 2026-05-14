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
        <text class="hospital-name">{{ detail.name }}</text>
        <view class="hospital-level">
          <!-- 显示中文等级 -->
          <text>{{ detail.levelText }}</text>
          <u-tag 
            v-if="detail.isNetworkMember" 
            text="协作网成员" 
            type="success" 
            size="mini"
            class="ml-2"
          ></u-tag>
        </view>
        <view class="hospital-specialty mt-2">
          <text class="label">诊疗范围：</text>{{ detail.specialty }}
        </view>
      </view>

      <!-- 新增：擅长疾病模块 -->
      <view v-if="detail.diseases && detail.diseases.length > 0" class="card mt-3">
        <text class="card-title">擅长疾病</text>
        <view class="disease-tags">
          <u-tag 
            v-for="(item, index) in detail.diseases" 
            :key="item.id || index"
            :text="item.name" 
            type="info" 
            size="mini"
            class="disease-tag-item"
            plain
          ></u-tag>
        </view>
      </view>

      <!-- 地址信息 -->
      <view v-if="detail.address" class="card mt-3">
        <text class="card-title">医院地址</text>
        <text class="card-content">{{ detail.address }}</text>
        <u-button size="mini" plain class="mt-2" @click="openMap">
          <u-icon name="map" size="14"></u-icon> 导航
        </u-button>
      </view>

      <!-- 咨询电话 -->
      <view v-if="detail.phone" class="card mt-3">
        <text class="card-title">咨询电话</text>
        <text class="phone-link" @click="makePhoneCall(detail.phone)">
          {{ detail.phone }}
        </text>
      </view>

      <!-- 患者评价 (接口暂无此数据，暂时隐藏或显示默认值，这里保留结构但做非空判断) -->
      <view v-if="detail.reviews && detail.reviews.length > 0" class="card mt-3">
        <text class="card-title">患者评价 ({{ detail.reviewCount }})</text>
        <view class="rating-summary">
          <u-icon name="star" color="#ff976a" size="18"></u-icon>
          <text class="rating-score">{{ detail.rating }}</text>
          <text class="rating-unit">分</text>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <u-button type="primary" block @click="handleBooking">
          预约挂号
        </u-button>
        <u-button plain block @click="handleNavigate">
          导航到医院
        </u-button>
      </view>
    </view>

    <!-- 空状态 -->
    <u-empty v-else mode="data" description="医院信息不存在"></u-empty>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import request from '@/utils/request'

// 类型定义
interface DiseaseItem {
  id: number;
  name: string;
  alias?: string;
}

interface HospitalDetail {
  id: number
  name: string
  level: string       // 原始等级代码 "1", "2"...
  levelText: string   // 显示用的中文等级
  specialty: string   // 诊疗范围
  address?: string
  phone?: string
  rating?: number
  reviewCount?: number
  reviews?: any[]
  isNetworkMember?: boolean
  latitude?: number
  longitude?: number
  diseases?: DiseaseItem[] // 新增：擅长疾病列表
}

// 等级映射字典
const levelMap: Record<string, string> = {
  '1': '三级甲等',
  '2': '三级乙等',
  '3': '三级丙等',
  '4': '二级甲等',
  '5': '二级乙等',
  '6': '二级丙等',
  '7': '其他'
}

// 响应式数据
const detail = ref<HospitalDetail | null>(null)
const loading = ref<boolean>(false)
const hospitalId = ref<number | null>(null)

// 辅助函数：转换后端数据为前端格式
const transformHospitalData = (apiData: any): HospitalDetail => {
  return {
    id: apiData.id,
    name: apiData.name,
    level: apiData.level,
    levelText: levelMap[apiData.level] || '未知等级',
    specialty: apiData.treatScope || '', // 映射 treatScope -> specialty
    address: apiData.address,
    phone: apiData.phone,
    isNetworkMember: apiData.isRareNetwork === true, // 映射 isRareNetwork -> isNetworkMember
    // 新增：映射 diseases 字段，确保是数组
    diseases: Array.isArray(apiData.diseases) ? apiData.diseases : [],
    // 接口暂无以下字段，设默认值
    rating: 0,
    reviewCount: 0,
    reviews: [],
    latitude: undefined,
    longitude: undefined
  }
}

// 加载详情
const loadDetail = async (id: number) => {
  loading.value = true
  try {
    const res = await request.get(`/api/resource/medical/hospitals/${id}`)
    if (res.data) {
      // 【关键修改】使用转换函数处理数据
      detail.value = transformHospitalData(res.data)
    } else {
      detail.value = null
    }
  } catch (error) {
    console.error('加载医院详情失败:', error)
    detail.value = null
    uni.showToast({ title: '加载医院信息失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 拨打电话
const makePhoneCall = (phoneNumber: string) => {
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

  // 优先使用经纬度导航
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
    // 如果没有经纬度，复制地址
    uni.setClipboardData({
      data: detail.value.address,
      success: () => {
        uni.showModal({
          title: '提示',
          content: '医院地址已复制，请打开地图APP搜索导航',
          showCancel: false,
          confirmText: '知道了'
        })
      }
    })
  } else {
    uni.showToast({ title: '暂无地址信息', icon: 'none' })
  }
}

// 预约挂号
const handleBooking = () => {
  if (hospitalId.value) {
    uni.navigateTo({
      url: `/pages/resource/medical/booking/hospital?id=${hospitalId.value}`
    })
  }
}

// 导航到医院
const handleNavigate = () => {
  openMap()
}

// 生命周期：页面加载时获取参数
onLoad((options) => {
  // options 可能为 undefined，先提供默认值 {}
  const id = options?.id; 
  
  if (id) {
    hospitalId.value = Number(id);
    loadDetail(hospitalId.value);
  } else {
    uni.showToast({ title: '缺少医院ID', icon: 'none' });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }
});
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

.ml-2 {
  margin-left: 8px;
}

.hospital-name {
  font-size: 18px;
  font-weight: bold;
  display: block;
}

.hospital-level {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
  display: flex;
  align-items: center;
}

.hospital-specialty {
  font-size: 12px;
  color: #3b82f6;
  margin-top: 4px;
  display: block;
}

.hospital-specialty .label {
  color: #6b7280;
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
  display: block;
}

.phone-link {
  font-size: 14px;
  color: #3b82f6;
  display: block;
}

.rating-summary {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-score {
  font-size: 18px;
  font-weight: bold;
}

.rating-unit {
  font-size: 14px;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

/* 新增：疾病标签容器样式 */
.disease-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.disease-tag-item {
  /* u-tag 组件自带样式，此处可根据需要微调 */
}
</style>