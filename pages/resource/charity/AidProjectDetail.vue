<template>
  <view class="page-container">
    <!-- 顶部标题栏 -->
    <view class="nav-bar">
      <u-icon name="arrow-left" size="24" @click="goBack"></u-icon>
      <text class="nav-title">项目详情</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <u-loading-icon mode="circle"></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 内容区域 -->
    <scroll-view v-else-if="detail" scroll-y class="content-scroll">
      <!-- 项目基本信息 -->
      <view class="card">
        <!-- 修改点: name 替代 title -->
        <text class="project-title">{{ detail.name }}</text>
        
        <view class="info-row">
          <text class="info-label">援助类型</text>
          <!-- 修改点: 显示 reliefType -->
          <text class="info-value">{{ getReliefTypeText(detail.reliefType) }}</text>
        </view>
        
        <view class="info-row">
          <text class="info-label">申请难度</text>
          <!-- 修改点: 显示 applyDifficulty -->
          <text class="info-value">{{ getDifficultyText(detail.applyDifficulty) }}</text>
        </view>

        <view class="info-row">
          <text class="info-label">组织机构</text>
          <!-- 修改点: 显示 organizer -->
          <text class="info-value">{{ detail.organizer }}</text>
        </view>
        
        <!-- 接口无 deadline，若有 updatedAt 可显示最后更新时间，否则隐藏 -->
        <view class="info-row" v-if="detail.updatedAt">
          <text class="info-label">更新时间</text>
          <text class="info-value">{{ formatDate(detail.updatedAt) }}</text>
        </view>
      </view>

      <!-- 项目内容/援助标准 -->
      <!-- 修改点: 使用 reliefStandard 作为主要内容展示 -->
      <view class="card" v-if="detail.reliefStandard">
        <text class="section-header">援助标准</text>
        <text class="section-content">{{ detail.reliefStandard }}</text>
      </view>

      <!-- 申请条件 -->
      <!-- 修改点: applyCondition 替代 requirements -->
      <view class="card" v-if="detail.applyCondition">
        <text class="section-header">申请条件</text>
        <text class="section-content">{{ detail.applyCondition }}</text>
      </view>

      <!-- 联系方式 -->
      <!-- 接口无 contact 字段，暂时隐藏或显示默认提示 -->
      <!-- <view class="card" v-if="detail.contact">
        <text class="section-header">联系方式</text>
        <text class="section-content">{{ detail.contact }}</text>
      </view> -->

      <!-- 资料下载 -->
      <!-- 接口无 applyForm/applyGuide/materialList 字段，该区域将自动隐藏 -->
      <view class="card" v-if="hasDownloadableFiles">
        <text class="section-header">资料下载</text>
        <view class="download-list">
          <u-button 
            v-if="detail.applyForm"
            size="small" 
            plain 
            customStyle="width: 100%; margin-bottom: 8px;"
            @click="downloadFile(detail.applyForm, '申请表')"
          >
            下载申请表
          </u-button>
          <u-button 
            v-if="detail.applyGuide"
            size="small" 
            plain 
            customStyle="width: 100%; margin-bottom: 8px;"
            @click="downloadFile(detail.applyGuide, '申请指南')"
          >
            下载申请指南
          </u-button>
          <u-button 
            v-if="detail.materialList"
            size="small" 
            plain 
            customStyle="width: 100%;"
            @click="downloadFile(detail.materialList, '材料清单')"
          >
            下载材料清单
          </u-button>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="card action-card">
        <u-button 
          type="primary" 
          customStyle="width: 100%; margin-bottom: 8px;"
          @click="handleApply"
        >
          申请救助
        </u-button>
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
      <u-empty mode="page" text="项目不存在或已下架"></u-empty>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import request from '@/utils/request'

// 修改点: 更新类型定义以匹配后端接口
interface ProjectDetail {
  id: number
  name: string             // 原 title
  organizer: string        // 原 org (如果有)
  applyCondition: string   // 原 requirements
  reliefStandard: string   // 新增，用于展示主要内容
  reliefType: string       // 新增
  applyDifficulty: string  // 新增
  status: string
  diseaseIds: number[]
  auditStatus: number
  rejectReason: string
  sort: number
  updatedAt: string        // 原 deadline (如果没有则用这个)
  // 以下字段接口暂未返回，保留以防后续扩展
  applyForm?: string
  applyGuide?: string
  materialList?: string
  contact?: string
}

// 响应式数据
const detail = ref<ProjectDetail | null>(null)
const loading = ref<boolean>(false)
const projectId = ref<number | string>('')

// 计算是否有可下载文件
const hasDownloadableFiles = computed(() => {
  return detail.value && (detail.value.applyForm || detail.value.applyGuide || detail.value.materialList)
})

// 辅助函数：翻译援助类型
const getReliefTypeText = (type: string) => {
  if (!type) return '-'
  const map: Record<string, string> = {
    'medical_cost': '医疗费用',
    'living_support': '生活补助',
    'rehab_subsidy': '康复补贴',
    'drug_relief': '药品救助',
    'other': '其他'
  }
  return map[type] || type
}

// 辅助函数：翻译难度
const getDifficultyText = (diff: string) => {
  if (!diff) return '-'
  const map: Record<string, string> = {
    'easy': '简单',
    'medium': '中等',
    'hard': '复杂'
  }
  return map[diff] || diff
}

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// 获取页面参数
onLoad((options) => {
  if (options && options.id) {
    projectId.value = options.id
    loadDetail()
  } else {
    uni.showToast({ title: '缺少项目ID', icon: 'none' })
    goBack()
  }
})

// 加载详情
const loadDetail = async () => {
  if (!projectId.value) return
  
  loading.value = true
  try {
    // 假设后端详情接口也是 /api/resource/charity/projects/{id}
    const res = await request.get(`/api/resource/charity/projects/${projectId.value}`)
    // 后端返回结构 { code: 200, data: {...} }
    // 注意：如果后端详情接口返回的是单个对象而不是 { data: object }，则需要调整为 res.data
    // 根据列表接口推测，详情接口通常也是包裹在 data 中，或者是直接返回对象。
    // 这里假设 res.data 就是项目对象，因为列表接口是 res.data.list
    // 如果后端详情接口返回 { code: 200, data: { id: 1... } }，则取 res.data
    // 如果后端详情接口返回 { code: 200, data: { data: { id: 1... } } } (嵌套)，则取 res.data.data
    // 通常 RESTful 风格详情接口直接返回对象在 data 字段下
    detail.value = res.data || null
  } catch (error) {
    console.error('加载项目详情失败:', error)
    detail.value = null
    uni.showToast({ title: '加载失败，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 申请救助
const handleApply = async () => {
  if (!detail.value?.id) return
  
  try {
    const res = await request.post('/api/resource/charity/apply', {
      projectId: detail.value.id
    })
    if (res.code === 200) {
      uni.showToast({ title: '申请提交成功', icon: 'success' })
      setTimeout(() => goBack(), 1500)
    } else {
      uni.showToast({ title: res.message || '申请失败', icon: 'none' })
    }
  } catch (error) {
    console.error('申请失败:', error)
    uni.showToast({ title: '申请失败，请重试', icon: 'none' })
  }
}

// 下载文件 (保持原逻辑，但因接口无字段，暂不会被触发)
const downloadFile = async (url: string, fileName: string) => {
  uni.showLoading({ title: '下载中...' })
  
  try {
    let downloadUrl = url
    if (!url.startsWith('http')) {
       const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-api-domain.com'
       downloadUrl = BASE_URL.replace(/\/+$/, '') + url 
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
              uni.showToast({ title: `${fileName}已打开`, icon: 'success' })
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
        console.error('下载失败:', err)
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
/* 样式保持不变 */
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

.project-title {
  font-size: 20px;
  font-weight: bold;
  display: block;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
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
  white-space: pre-line;
  display: block;
}

.download-list {
  display: flex;
  flex-direction: column;
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