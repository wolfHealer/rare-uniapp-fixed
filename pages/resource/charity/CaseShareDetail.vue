<template>
  <view class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 顶部标题栏 -->
    <view class="sticky top-0 z-10 bg-white shadow-sm p-4 w-full flex items-center justify-between">
      <u-icon name="arrow-left" size="24" @click="goBack"></u-icon>
      <text class="text-lg font-bold">案例详情</text>
      <view class="w-6"></view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="mt-8 flex justify-center">
      <u-loading-icon mode="circle"></u-loading-icon>
      <text class="ml-2">加载中...</text>
    </view>

    <!-- 内容区域 -->
    <scroll-view v-else-if="detail" scroll-y class="flex-1">
      
      <!-- 案例基本信息卡片 -->
      <view class="p-4 bg-white mt-3">
        <!-- 修改点: caseTitle 替代 title -->
        <text class="text-xl font-bold block">{{ detail.caseTitle }}</text>
        
        <view class="flex items-center gap-2 mt-2 flex-wrap">
          <!-- 修改点: diseaseName 替代 disease -->
          <u-tag :text="detail.diseaseName" type="primary" size="mini"></u-tag>
          <!-- 新增: 显示关联的项目名称 -->
          <u-tag :text="detail.projectName" plain size="mini" type="warning"></u-tag>
        </view>

        <view class="text-sm text-gray-500 mt-3">
          <view class="flex justify-between py-2 border-b">
            <text>发布时间</text>
            <!-- 修改点: createdAt 替代 publishDate -->
            <text class="text-gray-700">{{ formatDate(detail.createdAt) }}</text>
          </view>
          <view class="flex justify-between py-2 border-b">
            <text>申请周期</text>
            <!-- 新增: applyCycle -->
            <text class="text-gray-700">{{ detail.applyCycle || '-' }}</text>
          </view>
          <view class="flex justify-between py-2">
            <text>实际援助</text>
            <!-- 新增: actualRelief -->
            <text class="text-gray-700">{{ detail.actualRelief || '-' }}</text>
          </view>
        </view>
      </view>

      <!-- 患者情况描述 -->
      <!-- 修改点: patientDesc 替代 summary -->
      <view class="p-4 bg-white mt-3" v-if="detail.patientDesc">
        <text class="font-semibold mb-2 block">患者情况</text>
        <text class="text-sm text-gray-700 leading-relaxed">
          {{ detail.patientDesc }}
        </text>
      </view>

      <!-- 申请经验 -->
      <!-- 新增: experience -->
      <view class="p-4 bg-white mt-3" v-if="detail.experience">
        <text class="font-semibold mb-2 block text-green-600">申请经验</text>
        <text class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {{ detail.experience }}
        </text>
      </view>

      <!-- 避坑指南 -->
      <!-- 新增: pitfallGuide -->
      <view class="p-4 bg-white mt-3" v-if="detail.pitfallGuide">
        <text class="font-semibold mb-2 block text-red-500">避坑指南</text>
        <text class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {{ detail.pitfallGuide }}
        </text>
      </view>

      <!-- 资料下载区 -->
      <view class="p-4 bg-white mt-3">
        <text class="font-semibold mb-2 block">相关资料下载</text>
        <view class="flex flex-col gap-2">
          <!-- 修改点: casePdf 替代 pdfUrl -->
          <u-button 
            v-if="detail.casePdf"
            size="small" 
            plain 
            type="primary"
            icon="file-text"
            @click="downloadFile(detail.casePdf, '案例详情PDF')"
          >
            下载案例详情 PDF
          </u-button>
          
          <!-- 新增: materialTemplate -->
          <u-button 
            v-if="detail.materialTemplate"
            size="small" 
            plain 
            type="warning"
            icon="file-text"
            @click="downloadFile(detail.materialTemplate, '材料模板')"
          >
            下载申请材料模板
          </u-button>

          <view v-if="!detail.casePdf && !detail.materialTemplate" class="text-sm text-gray-400 text-center py-2">
            暂无可下载资料
          </view>
        </view>
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
      <u-empty mode="page" text="案例不存在或已下架"></u-empty>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import request from '@/utils/request'

// 类型定义：根据接口返回结构更新
interface CaseDetail {
  id: number
  diseaseId: number
  diseaseName: string
  projectId: number
  projectName: string
  caseTitle: string
  patientDesc: string
  applyCycle: string
  actualRelief: string
  experience: string
  pitfallGuide: string
  casePdf: string
  materialTemplate: string
  auditStatus: number
  rejectReason: string
  createdAt: string
  updatedAt: string
}

// 响应式数据
const detail = ref<CaseDetail | null>(null)
const loading = ref<boolean>(false)
const caseId = ref<number | string>('')

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  // 兼容 "2026-04-15 22:56:35" 格式，部分环境 new Date 可能不支持 '-'
  const date = new Date(dateStr.replace(/-/g, '/'))
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('zh-CN')
}

// 获取参数
onLoad((options) => {
  if (options && options.id) {
    caseId.value = options.id
    loadDetail()
  } else {
    uni.showToast({ title: '缺少案例ID', icon: 'none' })
    goBack()
  }
})

// 加载详情
const loadDetail = async () => {
  if (!caseId.value) return

  loading.value = true
  try {
    const res = await request.get(`/api/resource/charity/cases/${caseId.value}`)
    // 假设返回结构 { code: 200, data: {...} }
    detail.value = res.data || null
  } catch (error) {
    console.error('加载案例详情失败:', error)
    detail.value = null
    uni.showToast({ title: '加载失败，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 通用文件下载方法
const downloadFile = async (url: string, fileName: string) => {
  if (!url) {
    uni.showToast({ title: '链接无效', icon: 'none' })
    return
  }
  
  uni.showLoading({ title: '下载中...' })

  try {
    let downloadUrl = url
    // 如果是相对路径，拼接域名
    if (!url.startsWith('http')) {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
      downloadUrl = BASE_URL + url
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
            },
            fail: (err) => {
              uni.hideLoading()
              console.error('打开文档失败', err)
              uni.showToast({ title: '打开文档失败', icon: 'none' })
            }
          })
        } else {
          uni.hideLoading()
          uni.showToast({ title: '下载失败', icon: 'none' })
        }
      },
      fail: (err) => {
        uni.hideLoading()
        console.error('下载文件失败', err)
        uni.showToast({ title: '下载失败，请检查网络', icon: 'none' })
      }
    })

  } catch (error) {
    uni.hideLoading()
    console.error('下载异常:', error)
    uni.showToast({ title: '下载异常', icon: 'none' })
  }
}

// 返回上一页
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
.text-green-600 {
  color: #16a34a;
}
.text-red-500 {
  color: #ef4444;
}
.text-gray-400 {
  color: #9ca3af;
}
.text-center {
  text-align: center;
}
.flex-wrap {
  flex-wrap: wrap;
}
</style>