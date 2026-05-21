<template>
  <view class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 顶部标题栏 -->
    <view class="sticky top-0 z-10 bg-white shadow-sm p-4 w-full flex items-center justify-between">
      <u-icon
        name="arrow-left"
        size="24"
        color="#000000"
        class="cursor-pointer"
        @click="goBack"
      ></u-icon>
      <text class="text-lg font-bold">药品详情</text>
      <view class="w-6"></view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="mt-8 flex justify-center items-center">
      <u-loading-icon mode="circle"></u-loading-icon>
      <text class="ml-2 text-gray-500">加载中...</text>
    </view>

    <!-- 内容区域 -->
    <scroll-view v-else-if="detail" scroll-y class="flex-1">
      <!-- 药品基本信息 -->
      <view class="p-4 bg-white mt-3">
        <text class="text-xl font-bold block">{{ detail.genericName }}</text>
        <text v-if="detail.brandName" class="text-sm text-gray-500 block mt-1">商品名：{{ detail.brandName }}</text>
        
        <view class="flex items-center gap-2 mt-3">
          <u-tag 
            :text="detail.isInsurance ? '医保' : '非医保'" 
            :type="detail.isInsurance ? 'success' : 'info'" 
            size="mini"
          ></u-tag>
          <u-tag 
            v-if="detail.drugType"
            :text="getDrugTypeText(detail.drugType)" 
            type="primary" 
            size="mini"
          ></u-tag>
          <u-tag 
            v-if="detail.needPrescription"
            text="处方药" 
            type="warning" 
            size="mini"
          ></u-tag>
        </view>

        <view class="text-sm text-gray-500 mt-4">
          <!-- 新增：关联疾病展示 -->
          <view v-if="detail.diseases && detail.diseases.length > 0" class="flex justify-between py-2 border-b">
            <text>关联疾病</text>
            <view class="text-right flex-1 ml-4">
              <text 
                v-for="(disease, index) in detail.diseases" 
                :key="disease.id"
                class="text-gray-700"
              >
                {{ disease.name }}<span v-if="index < detail.diseases.length - 1">、</span>
              </text>
            </view>
          </view>

          <view class="flex justify-between py-2 border-b">
            <text>适应症</text>
            <text class="text-gray-700 text-right flex-1 ml-4">{{ detail.indication }}</text>
          </view>
          <view class="flex justify-between py-2 border-b">
            <text>剂型</text>
            <text class="text-gray-700">{{ detail.dosageForm || '-' }}</text>
          </view>
          <view class="flex justify-between py-2 border-b">
            <text>规格</text>
            <text class="text-gray-700">{{ detail.spec || '-' }}</text>
          </view>
          <view class="flex justify-between py-2 border-b">
            <text>参考价格</text>
            <text class="text-red-500 font-medium">¥ {{ detail.refPrice || '0.00' }}</text>
          </view>
          <view class="flex justify-between py-2">
            <text>慈善赠药</text>
            <text class="text-gray-700">{{ detail.hasRelief ? '有' : '无' }}</text>
          </view>
        </view>
      </view>

      <!-- 详细说明 (如果有额外字段) -->
      <view class="p-4 bg-white mt-3" v-if="detail.indication">
        <text class="font-semibold mb-2 block">适应症详情</text>
        <text class="text-sm text-gray-700 leading-relaxed">
          {{ detail.indication }}
        </text>
      </view>

      <!-- 操作按钮 -->
      <view class="p-4 bg-white mt-3">
        <u-button 
          type="primary" 
          customStyle="width: 100%; margin-bottom: 8px;"
          @click="handleDownload"
          :loading="downloading"
        >
          {{ downloading ? '下载中...' : '查看说明书' }}
        </u-button>
        <u-button 
          plain 
          customStyle="width: 100%;"
          @click="goBack"
        >
          返回列表
        </u-button>
      </view>
    </scroll-view>

    <!-- 空状态 -->
    <view v-else class="flex-1 flex items-center justify-center">
      <u-empty mode="page" text="药品不存在或已下架"></u-empty>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { drugApi } from '@/api/drug'
import type { DrugDetailData } from '@/types/drug'
import { downloadAndOpenDocument } from '@/utils/download'

const detail = ref<DrugDetailData | null>(null)
const loading = ref<boolean>(false)
const downloading = ref<boolean>(false)
const drugId = ref<number | null>(null)

// 药品类型映射
const DRUG_TYPE_MAP: Record<string, string> = {
  origin_import: '进口原研',
  origin_domestic: '国产原研',
  generic: '仿制药',
  other: '其他'
}

const getDrugTypeText = (type: string) => {
  return DRUG_TYPE_MAP[type] || type
}

// 加载详情
const loadDetail = async (id: number) => {
  loading.value = true
  try {
    const res = await drugApi.getDrug(id)
    // 接口返回结构: { code: 200, data: {...}, message: "success" }
    detail.value = res.data
  } catch (error) {
    console.error('加载药品详情失败:', error)
    detail.value = null
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 下载/查看说明书
const handleDownload = async () => {
  if (!detail.value?.id) return

  const url = detail.value.manualPopular || detail.value.manualOriginal
  if (!url) {
    uni.showToast({ title: '暂无说明书链接', icon: 'none' })
    return
  }

  downloading.value = true

  // #ifdef H5
  window.open(url, '_blank')
  downloading.value = false
  // #endif

  // #ifndef H5
  try {
    await downloadAndOpenDocument({ url: String(url) })
  } finally {
    downloading.value = false
  }
  // #endif
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 生命周期
onLoad((options) => {
  if (options.id) {
    drugId.value = Number(options.id)
    loadDetail(drugId.value)
  } else {
    uni.showToast({ title: '缺少药品ID', icon: 'none' })
    setTimeout(() => {
      goBack()
    }, 1500)
  }
})
</script>

<style scoped>
.min-h-screen {
  background-color: #f9fafb;
  min-height: 100vh;
}
.flex {
  display: flex;
}
.flex-col {
  flex-direction: column;
}
.sticky {
  position: sticky;
}
.top-0 {
  top: 0;
}
.z-10 {
  z-index: 10;
}
.bg-white {
  background-color: #ffffff;
}
.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.p-4 {
  padding: 16px;
}
.w-full {
  width: 100%;
}
.items-center {
  align-items: center;
}
.justify-between {
  justify-content: space-between;
}
.text-lg {
  font-size: 18px;
}
.font-bold {
  font-weight: 700;
}
.w-6 {
  width: 24px;
}
.mt-8 {
  margin-top: 32px;
}
.justify-center {
  justify-content: center;
}
.ml-2 {
  margin-left: 8px;
}
.flex-1 {
  flex: 1;
}
.mt-3 {
  margin-top: 12px;
}
.text-xl {
  font-size: 20px;
}
.block {
  display: block;
}
.gap-2 {
  gap: 8px;
}
.text-sm {
  font-size: 14px;
}
.text-gray-500 {
  color: #6b7280;
}
.py-2 {
  padding-top: 8px;
  padding-bottom: 8px;
}
.border-b {
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #e5e7eb;
}
.text-gray-700 {
  color: #374151;
}
.cursor-pointer {
  cursor: pointer;
}
.font-semibold {
  font-weight: 600;
}
.mb-2 {
  margin-bottom: 8px;
}
.leading-relaxed {
  line-height: 1.625;
}
.text-right {
  text-align: right;
}
.ml-4 {
  margin-left: 16px;
}
.text-red-500 {
  color: #ef4444;
}
.font-medium {
  font-weight: 500;
}
</style>