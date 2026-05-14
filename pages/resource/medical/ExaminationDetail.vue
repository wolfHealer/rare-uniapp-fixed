<template>
  <view class="page-container">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <u-loading-icon mode="circle"></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 内容区域 -->
    <view v-else-if="detail" class="content-box">
      <view class="header-section">
        <text class="title">{{ detail.examName }}</text>
        <view class="sub-info">
<text v-if="detail.examType">类型：{{ getExamTypeText(detail.examType) }}</text>          <text v-if="detail.duration" class="separator"> · </text>
          <text v-if="detail.duration">周期：{{ detail.duration }}</text>
        </view>
      </view>

      <!-- 价格信息 -->
      <view v-if="detail.price" class="price-section">
        <text class="price-text">¥ {{ detail.price }}</text>
      </view>

      <!-- 操作 -->
      <view class="action-buttons">
        <u-button size="mini" type="primary" @click="handleBooking">
          预约检测
        </u-button>
        <u-button size="mini" plain @click="handleConsult">
          在线咨询
        </u-button>
      </view>

      <!-- 检查目的 (原 desc) -->
      <view class="desc-section">
        <text class="section-title">检查目的</text>
        <text class="desc-text">{{ detail.examPurpose }}</text>
      </view>

      <!-- 样本须知 (原 preparation，对应接口 sampleNotes) -->
      <view v-if="detail.sampleNotes" class="prep-section">
        <text class="section-title">样本须知</text>
        <text class="prep-text">{{ detail.sampleNotes }}</text>
      </view>

      <!-- 检测机构 (新增，对应接口 institution) -->
      <view v-if="detail.institution" class="prep-section">
        <text class="section-title">检测机构</text>
        <text class="prep-text">{{ detail.institution }}</text>
      </view>
    </view>

    <!-- 空状态 -->
    <u-empty v-else mode="data" description="检查项目不存在或已下架"></u-empty>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import request from '@/utils/request'


// 在 ExaminationDetail.vue 的 script 中添加
const EXAM_TYPE_MAP: Record<string, string> = {
  lab: '实验室检查',
  metabolic: '代谢筛查',
  imaging: '影像学检查',
  genetic: '基因检测',
  pathology: '病理检查',
  functional: '功能检查',
  scale: '量表评估',
  special: '专科专项检查',
  other: '其他'
}

const getExamTypeText = (type: string) => {
  return EXAM_TYPE_MAP[type] || type
}

// 类型定义：匹配接口返回字段
interface ExaminationDetail {
  id: number
  examName: string
  examPurpose: string
  examType?: string
  price?: number
  duration?: string
  sampleNotes?: string
  institution?: string
  diseaseIds?: number[]
  createdAt?: string
  updatedAt?: string
}

// 响应式数据
const detail = ref<ExaminationDetail | null>(null)
const loading = ref<boolean>(false)
const examId = ref<number | null>(null)

// 加载详情
const loadDetail = async (id: number) => {
  loading.value = true
  try {
    // 假设详情接口返回结构: { code: 200, data: { ...单个对象... }, message: "success" }
    const res = await request.get(`/api/resource/medical/examinations/${id}`)
    detail.value = res.data
  } catch (error) {
    console.error('加载检查项目详情失败:', error)
    detail.value = null
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 预约检测
const handleBooking = () => {
  if (examId.value) {
    uni.navigateTo({
      url: `/pages/resource/medical/booking/index?id=${examId.value}`
    })
  }
}

// 在线咨询
const handleConsult = () => {
  if (examId.value) {
    uni.navigateTo({
      url: `/pages/resource/medical/consult/index?id=${examId.value}`
    })
  }
}



// 生命周期：页面加载时获取参数
onLoad((options) => {
  if (options.id) {
    examId.value = Number(options.id)
    loadDetail(examId.value)
  } else {
    uni.showToast({ title: '缺少项目ID', icon: 'none' })
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

.header-section {
  margin-bottom: 8px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  display: block;
}

.sub-info {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
  display: block;
}

.separator {
  margin: 0 4px;
}

.price-section {
  margin-top: 12px;
}

.price-text {
  font-size: 14px;
  color: #ef4444;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.desc-section {
  margin-top: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
  color: #374151;
}

.desc-text {
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
}

.prep-section {
  margin-top: 16px;
}

.prep-text {
  font-size: 14px;
  color: #374151;
}
</style>