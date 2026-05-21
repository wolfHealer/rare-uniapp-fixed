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
      <text class="text-lg font-bold">政策详情</text>
      <view class="w-6"></view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="mt-8 flex justify-center items-center">
      <u-loading-icon mode="circle"></u-loading-icon>
      <text class="ml-2 text-gray-500">加载中...</text>
    </view>

    <!-- 内容区域 -->
    <scroll-view v-else-if="detail" scroll-y class="flex-1">
      <!-- 政策基本信息 -->
      <view class="p-4 bg-white mt-3">
        <text class="text-xl font-bold block">{{ detail.title }}</text>
        
        <view class="flex items-center gap-2 mt-2">
          <u-tag :text="detail.category" type="primary" size="mini"></u-tag>
          <u-tag :text="detail.region" plain size="mini"></u-tag>
        </view>

        <view class="text-sm text-gray-500 mt-3">
          <view class="flex justify-between py-2 border-b">
            <text>发布地区</text>
            <text class="text-gray-700">{{ detail.region }}</text>
          </view>
          <view class="flex justify-between py-2 border-b">
            <text>发布日期</text>
            <text class="text-gray-700">{{ formatDate(detail.publishDate) }}</text>
          </view>
          <view class="flex justify-between py-2">
            <text>政策类别</text>
            <text class="text-gray-700">{{ detail.category }}</text>
          </view>
        </view>
      </view>

      <!-- 政策内容 -->
      <view class="p-4 bg-white mt-3" v-if="detail.content">
        <text class="font-semibold mb-2 block">政策解读</text>
        <text class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {{ detail.content }}
        </text>
      </view>

      <!-- 相关文件 -->
      <view class="p-4 bg-white mt-3" v-if="detail.fileUrl">
        <text class="font-semibold mb-2 block">政策文件</text>
        <u-button 
          size="small" 
          plain 
          customStyle="width: 100%;"
          @click="downloadFile(detail.fileUrl, '政策文件')"
        >
          下载政策原文
        </u-button>
      </view>

      <!-- 相关政策 -->
      <view class="p-4 bg-white mt-3" v-if="detail.relatedPolicies && detail.relatedPolicies.length > 0">
        <text class="font-semibold mb-2 block">相关政策</text>
        <u-cell-group>
          <u-cell
            v-for="policy in detail.relatedPolicies"
            :key="policy.id"
            :title="policy.title"
            is-link
            @click="viewRelated(policy.id)"
          />
        </u-cell-group>
      </view>

      <!-- 操作按钮 -->
      <view class="p-4 bg-white mt-3">
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
      <u-empty mode="page" text="政策不存在或已下架"></u-empty>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// 1. 引入 uni-app 的 onLoad
import { onLoad } from '@dcloudio/uni-app'
import { medicareApi } from '@/api/medicare'
import { downloadAndOpenDocument } from '@/utils/download'
import type { PolicyDetailData } from '@/types/medicare'

const detail = ref<PolicyDetailData | null>(null)
const loading = ref<boolean>(false)
// 2. 定义 policyId 用于存储页面参数
const policyId = ref<number | string>('')

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

// 3. 使用 onLoad 获取参数
onLoad((options) => {
  if (options && options.id) {
    policyId.value = options.id
    loadDetail()
  } else {
    uni.showToast({ title: '缺少政策ID', icon: 'none' })
    goBack()
  }
})

// 加载详情
const loadDetail = async () => {
  if (!policyId.value) return

  loading.value = true
  try {
    // 4. 使用 policyId.value 替换 route.params.id
    const res = await medicareApi.getPolicy(policyId.value)
    detail.value = res.data || res.data
  } catch (error) {
    console.error('加载政策详情失败:', error)
    detail.value = null
    uni.showToast({ title: '加载失败，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const downloadFile = (url: string, _fileName?: string) => {
  if (!url) {
    uni.showToast({ title: '文件链接无效', icon: 'none' })
    return
  }
  downloadAndOpenDocument({ url: String(url) })
}

// 查看相关政策 - 替换 router.push 为 uni.navigateTo
const viewRelated = (id: number) => {
  // 注意：路径需要根据你实际的项目目录结构调整
  uni.navigateTo({
    url: `/pages/resource/medicare/PolicyDetail?id=${id}`
  })
}

// 返回上一页 - 替换 router.back 为 uni.navigateBack
const goBack = () => {
  uni.navigateBack()
}
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
.whitespace-pre-line {
  white-space: pre-line;
}
</style>