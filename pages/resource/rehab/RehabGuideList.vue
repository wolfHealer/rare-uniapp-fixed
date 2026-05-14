<template>
  <view class="page-container">
    <!-- 顶部筛选区域 -->
    <view class="filter-area">
      <!-- 1. 搜索框 -->
      <u-search 
        v-model="keyword" 
        placeholder="搜索指南名称" 
        shape="round"
        @search="handleSearch"
        @clear="handleClear"
        :show-action="false"
      ></u-search>

      <!-- 2. 智能筛选栏 -->
      <SmartFilterBar
        :configs="rehabConfigs"
        v-model="filterParams"
        @change="handleFilterChange"
        @reset="handleFilterReset"
      />
    </view>

    <!-- 加载状态 -->
    <view v-if="loading && list.length === 0" class="loading-state">
      <u-loading-icon mode="circle"></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 训练列表 -->
    <scroll-view scroll-y class="list-box" @scrolltolower="onLoadMore">
      <view
        v-for="item in list"
        :key="item.id"
        class="guide-item"
        @click="viewDetails(item)"
      >
        <text class="item-title">{{ item.title }}</text>

        <view class="item-meta">
          <!-- 修改点: 显示疾病标签 -->
          <u-tag 
            v-for="(disease, index) in item.diseases" 
            :key="index"
            :text="disease.name" 
            type="primary" 
            size="mini"
            customStyle="margin-right: 4px;"
          ></u-tag>
          <!-- 修改点: rehabStage 替代 stage -->
          <u-tag 
            :text="getStageLabel(item.rehabStage)" 
            plain 
            size="mini"
          ></u-tag>
        </view>

        <!-- 修改点: trainPurpose 替代 desc -->
        <text class="item-desc">{{ item.trainPurpose }}</text>

        <!-- 操作按钮 -->
        <view class="item-actions" @click.stop>
          <u-button size="mini" type="primary" plain @click="viewDetails(item)">
            查看详情
          </u-button>
          <u-button size="mini" plain @click="downloadGuide(item)">
            下载 PDF
          </u-button>
        </view>
      </view>

      <!-- 空状态 -->
      <u-empty v-if="!loading && list.length === 0" mode="data" description="暂无训练指南"></u-empty>

      <!-- 加载更多 -->
      <u-loadmore 
        :status="loadStatus" 
        :loading-text="'加载中...'"
        :loadmore-text="'上拉加载更多'"
        :nomore-text="'没有更多了'"
        v-if="list.length > 0"
      />
      
      <!-- 底部占位 -->
      <view style="height: 20px;"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import SmartFilterBar from '@/components/filter/SmartFilterBar.vue'
import type { FilterConfigItem } from '@/types/filter'

// --- 1. 状态管理 ---
const keyword = ref('')
const list = ref<any[]>([])
const loading = ref(false)
const loadStatus = ref<'loading' | 'loadmore' | 'nomore'>('loadmore')
const currentPage = ref(1)
const pageSize = ref(10)

// 筛选参数状态
const filterParams = ref<Record<string, any>>({
  disease: {},   
  stage: ''      
})

const stageOptions = ref<{ label: string; value: any }[]>([
  { label: '全部阶段', value: '' },
  { label: '早期', value: 'early' },
  { label: '中期', value: 'middle' }, // 注意：接口示例中未出现 middle，但保留以防万一
  { label: '晚期', value: 'late' },
  { label: '稳定期', value: 'stable' },
  { label: '渐进期', value: 'progressive' },
])

// --- 2. 筛选配置 ---
const rehabConfigs: FilterConfigItem[] = [
  {
    key: 'disease',
    label: '疾病',
    type: 'disease' 
  },
  {
    key: 'stage',
    label: '阶段',
    type: 'tags',
    options: stageOptions.value
  }
]

// --- 3. 辅助函数 ---
const stageLabels: Record<string, string> = {
  early: '早期',
  middle: '中期',
  late: '晚期',
  stable: '稳定期',
  progressive: '渐进期'
}

const getStageLabel = (stage: string) => {
  return stageLabels[stage] || stage || '未知阶段'
}

// --- 4. 数据加载逻辑 ---
const fetchTrainings = async (isRefresh = false) => {
  if (isRefresh) {
    currentPage.value = 1
    list.value = []
    loadStatus.value = 'loading'
  }
  
  if (loadStatus.value === 'nomore' && !isRefresh) return

  loading.value = true
  
  try {
    const params: Record<string, any> = {
      page: currentPage.value,
      pageSize: pageSize.value
    }

    if (keyword.value) {
      params.keyword = keyword.value
    }

    const diseaseVal = filterParams.value.disease || {}
    if (diseaseVal.diseaseId) {
      params.diseaseId = diseaseVal.diseaseId
    }
    
    if (filterParams.value.stage) {
      params.rehabStage = filterParams.value.stage // 注意：后端参数名可能是 rehabStage
    }

    const res = await request.get('/api/resource/rehab/trainings', params)
    const responseData = res.data || {}
    const records = responseData.list || []
    
    list.value.push(...records)
    
    if (records.length < pageSize.value) {
      loadStatus.value = 'nomore'
    } else {
      loadStatus.value = 'loadmore'
      currentPage.value++
    }
  } catch (error) {
    console.error('获取列表失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
    loadStatus.value = 'loadmore'
  } finally {
    loading.value = false
  }
}

// --- 5. 事件处理 ---
const onLoadMore = () => {
  if (!loading.value) fetchTrainings()
}

const handleSearch = () => {
  fetchTrainings(true)
}

const handleClear = () => {
  keyword.value = ''
  fetchTrainings(true)
}

const handleFilterChange = () => {
  fetchTrainings(true)
}

const handleFilterReset = () => {
  filterParams.value = {
    disease: {},
    stage: ''
  }
  fetchTrainings(true)
}

const viewDetails = (item: any) => {
  if (!item?.id) return
  uni.navigateTo({
    url: `/pages/resource/rehab/RehabGuideDetail?id=${item.id}`
  })
}

const downloadGuide = async (item: any) => {
  if (!item.guidePdf) {
    uni.showToast({ title: '暂无PDF文件', icon: 'none' })
    return
  }

  uni.showLoading({ title: '下载中...' })
  
  let pdfUrl = item.guidePdf
  if (!pdfUrl.startsWith('http')) {
     const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
     pdfUrl = BASE_URL + pdfUrl
  }

  uni.downloadFile({
    url: pdfUrl,
    success: (res) => {
      uni.hideLoading()
      if (res.statusCode === 200) {
        uni.openDocument({
          filePath: res.tempFilePath,
          fileType: 'pdf',
          showMenu: true,
          success: () => {},
          fail: () => uni.showToast({ title: '打开失败', icon: 'none' })
        })
      } else {
        uni.showToast({ title: '下载失败', icon: 'none' })
      }
    },
    fail: () => {
      uni.hideLoading()
      uni.showToast({ title: '网络错误', icon: 'none' })
    }
  })
}

onMounted(() => {
  fetchTrainings()
})
</script>

<style scoped>
.page-container {
  padding: 16px;
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
}

.filter-area {
  margin-bottom: 12px;
  background: #fff;
  padding: 8px 0;
  border-radius: 8px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
}

.loading-text {
  margin-top: 8px;
  color: #6b7280;
}

.list-box {
  flex: 1;
  height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.guide-item {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.item-title {
  font-size: 16px;
  font-weight: 600;
  display: block;
  color: #1f2937;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 8px;
  gap: 4px;
}

.item-desc {
  font-size: 14px;
  color: #374151;
  margin-top: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.item-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
</style>