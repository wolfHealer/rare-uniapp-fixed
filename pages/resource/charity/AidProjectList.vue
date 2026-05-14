<template>
  <view class="list-container">
    <!-- 顶部搜索与筛选区 (固定) -->
    <view class="filter-area">
      <u-search 
        v-model="keyword" 
        placeholder="搜索救助项目名称" 
        shape="round"
        @search="handleSearch"
        @clear="handleClear"
        :show-action="false"
      ></u-search>

      <SmartFilterBar
        :configs="projectConfigs"
        v-model="filterParams"
        @change="handleFilterChange"
        @reset="handleFilterReset"
      />
    </view>

    <!-- 滚动列表区域 -->
    <scroll-view 
      scroll-y 
      class="scroll-content" 
      @scrolltolower="onLoadMore"
    >
      <!-- 加载状态 -->
      <view v-if="loading && list.length === 0" class="loading-state">
        <u-loading-icon mode="circle"></u-loading-icon>
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 项目列表 -->
      <view v-else class="project-list">
        <view
          v-for="item in list"
          :key="item.id"
          class="project-card"
          @click="detail(item)"
        >
          <view class="card-header">
            <!-- 修改点: name 替代 title -->
            <text class="project-title">{{ item.name }}</text>
            <u-tag 
              :text="item.status === 'open' ? '可申请' : '已结束'" 
              :type="item.status === 'open' ? 'success' : 'info'" 
              size="mini"
            ></u-tag>
          </view>

          <view class="card-info">
            <!-- 修改点: organizer 替代 org -->
            <text class="info-item">机构：{{ item.organizer }}</text>
            <!-- 修改点: 接口没有 amount，改为显示 reliefType 或 reliefStandard 简述 -->
            <text class="info-item">类型：{{ getReliefTypeText(item.reliefType) }}</text>
          </view>

          <!-- 修改点: 接口没有 desc，使用 reliefStandard (援助标准) 作为描述展示 -->
          <text class="project-desc line-clamp-2">
            {{ item.reliefStandard || item.applyCondition }}
          </text>

          <!-- 操作按钮 -->
          <view class="card-actions" @click.stop>
            <u-button size="mini" type="primary" @click="apply(item)">
              申请救助
            </u-button>
            <!-- 注意：接口暂无资料下载字段，此处按钮可能无效，建议隐藏或提示 -->
            <u-button size="mini" plain @click="downloadDocs(item)">
              查看详情
            </u-button>
          </view>
        </view>

        <u-loadmore 
          :status="loadStatus" 
          @loadmore="onLoadMore"
        />
        
        <u-empty v-if="!loading && list.length === 0" mode="data" text="暂无救助项目"></u-empty>
      </view>
      
      <view class="bottom-spacer"></view>
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
const currentPage = ref(1)
const pageSize = ref(10)
const loadStatus = ref<'loading' | 'loadmore' | 'nomore'>('loadmore')
// 修改点: 定义更准确的类型结构，避免 any
interface ProjectItem {
  id: number
  name: string
  organizer: string
  applyCondition: string
  status: string
  reliefType: string
  diseaseIds: number[]
  reliefStandard: string
  applyDifficulty: string
  auditStatus: number
  rejectReason: string
  sort: number
  updatedAt: string
}

const list = ref<ProjectItem[]>([])
const loading = ref(false)

const filterParams = ref<Record<string, any>>({
  type: '',       
  disease: {},    
  difficulty: ''  
})

// 筛选项数据
const typeOptions = ref<{ label: string; value: any }[]>([
  { label: '全部类型', value: '' },
  { label: '医疗费用', value: 'medical_cost' },
  { label: '生活补助', value: 'living_support' },
  { label: '康复补贴', value: 'rehab_subsidy' },
  { label: '药品救助', value: 'drug_relief' },
  { label: '其他', value: 'other' }
])

const difficultyOptions = ref<{ label: string; value: any }[]>([
  { label: '全部难度', value: '' },
  { label: '简单', value: 'easy' },
  { label: '中等', value: 'medium' },
  { label: '复杂', value: 'hard' }
])

// --- 辅助函数：翻译援助类型 ---
const getReliefTypeText = (type: string) => {
  const map: Record<string, string> = {
    'medical_cost': '医疗费用',
    'living_support': '生活补助',
    'rehab_subsidy': '康复补贴',
    'drug_relief': '药品救助',
    'other': '其他'
  }
  return map[type] || '未知类型'
}

// --- 2. 筛选配置 ---
const projectConfigs: FilterConfigItem[] = [
  {
    key: 'type',
    label: '类型',
    type: 'tags',
    options: typeOptions.value
  },
  {
    key: 'disease',
    label: '疾病',
    type: 'disease' 
  },
  {
    key: 'difficulty',
    label: '难度',
    type: 'tags',
    options: difficultyOptions.value
  }
]

const fetchProjects = async (isRefresh = false) => {
  if (isRefresh) {
    currentPage.value = 1
    list.value = []
    loadStatus.value = 'loading'
  }
  
  if (loadStatus.value === 'nomore' && !isRefresh) return
  
  loading.value = true
  try {
    const params: any = { 
      page: currentPage.value, 
      pageSize: pageSize.value 
    }

    if (keyword.value && keyword.value.trim() !== '') {
      params.keyword = keyword.value.trim()
    }

    if (filterParams.value.type) {
      params.reliefType = filterParams.value.type // 注意：后端参数名可能是 reliefType 而不是 type，需根据后端实际调整，这里假设后端接收 type 或 reliefType
    }

    const diseaseVal = filterParams.value.disease || {}
    if (diseaseVal.diseaseId) {
      params.diseaseId = diseaseVal.diseaseId
    }

    if (filterParams.value.difficulty) {
      params.applyDifficulty = filterParams.value.difficulty // 注意：后端参数名可能是 applyDifficulty
    }
    
    const res = await request.get('/api/resource/charity/projects', params)
    // 接口返回结构: res.data.list
    const records = res.data?.list || []
    list.value.push(...records)
    
    if (records.length < pageSize.value) {
      loadStatus.value = 'nomore'
    } else {
      loadStatus.value = 'loadmore'
      currentPage.value++
    }
  } catch (error) {
    loadStatus.value = 'loadmore'
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// --- 4. 事件处理 ---
const onLoadMore = () => fetchProjects()

const handleSearch = () => {
  fetchProjects(true)
}

const handleClear = () => {
  keyword.value = ''
  fetchProjects(true)
}

const handleFilterChange = () => {
  fetchProjects(true)
}

const handleFilterReset = () => {
  filterParams.value = {
    type: '',
    disease: {},
    difficulty: ''
  }
  fetchProjects(true)
}

const apply = async (item: ProjectItem) => {
  try {
    await request.post('/api/resource/charity/apply', { projectId: item.id })
    uni.showToast({ title: '申请提交成功', icon: 'success' })
  } catch (e) {
    uni.showToast({ title: '申请失败', icon: 'none' })
  }
}

const detail = (item: ProjectItem) => {
  if (!item?.id) return
  uni.navigateTo({ url: `/pages/resource/charity/AidProjectDetail?id=${item.id}` })
}

const downloadDocs = (item: ProjectItem) => {
  // 由于接口暂无资料字段，这里直接跳转详情，让用户在详情页查看是否有资料
  detail(item)
}

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped lang="scss">
/* 样式保持不变 */
.list-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
}

.filter-area {
  flex-shrink: 0;
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  z-index: 10;
}

.scroll-content {
  flex: 1;
  height: 0;
}

.project-list {
  padding: 16px;
}

.project-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.project-title {
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
  flex: 1;
  margin-right: 8px;
}

.card-info {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #6b7280;
}

.project-desc {
  font-size: 14px;
  color: #374151;
  margin-bottom: 12px;
  display: block;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.loading-state {
  padding: 32px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-text {
  margin-top: 8px;
  font-size: 14px;
  color: #9ca3af;
}

.bottom-spacer {
  height: 20px;
}
</style>