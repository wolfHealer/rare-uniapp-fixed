<template>
  <view class="page-container">
    <!-- 顶部搜索与筛选区 -->
    <view class="filter-area">
      <!-- 1. 搜索框：按项目名称模糊搜索 -->
      <u-search 
        v-model="keyword" 
        placeholder="搜索援助项目名称" 
        shape="round"
        @search="handleSearch"
        @clear="handleClear"
        :show-action="false"
      ></u-search>

      <!-- 2. 智能筛选栏：按疾病筛选 -->
      <SmartFilterBar
        :configs="projectConfigs"
        v-model="filterParams"
        @change="handleFilterChange"
        @reset="handleFilterReset"
      />
    </view>

    <!-- 列表内容 -->
    <scroll-view scroll-y class="content-scroll" @scrolltolower="onLoadMore">
      <view v-if="loading && projects.length === 0" class="loading-state">
        <u-loading-icon mode="circle"></u-loading-icon>
        <text class="loading-text">加载中...</text>
      </view>

      <view v-else-if="projects.length === 0" class="empty-state">
        <u-empty mode="data" text="暂无援助项目"></u-empty>
      </view>

      <view v-else class="project-list">
        <view
          v-for="project in projects"
          :key="project.id"
          class="project-card"
          @click="viewDetail(project)"
        >
          <!-- 项目名称 -->
          <text class="project-name">{{ project.name }}</text>

          <!-- 元信息：疾病标签 + 主办方 -->
          <view class="project-meta">
             <u-tag :text="project.diseaseName" type="primary" size="mini"></u-tag>
             <text class="organizer-text">主办: {{ project.organizer }}</text>
          </view>

          <!-- 关键信息：条件 + 周期 -->
          <text class="project-info">
            条件: {{ project.applyCondition }} | 周期: {{ project.reliefCycle }}
          </text>

          <!-- 描述：援助方案/剂量说明 -->
          <text class="project-desc" v-if="project.reliefDosageDesc">
            方案: {{ project.reliefDosageDesc }}
          </text>

          <!-- 状态行 -->
          <view class="status-row">
            <u-tag 
              :text="project.auditStatus === 1 ? '进行中' : '审核中'" 
              :type="project.auditStatus === 1 ? 'success' : 'warning'" 
              size="mini"
            ></u-tag>
            <text class="deadline-text">更新: {{ formatDate(project.updatedAt) }}</text>
          </view>
          
          <!-- 提示用户点击查看详情 (可选，通过样式体现即可) -->
          <view class="click-hint">
            <text>点击查看详情及申请</text>
            <u-icon name="arrow-right" size="14" color="#9ca3af"></u-icon>
          </view>
        </view>

        <u-loadmore :status="loadStatus" @loadmore="onLoadMore" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { drugApi } from '@/api/drug'
import { usePagedList } from '@/composables/usePagedList'
import SmartFilterBar from '@/components/filter/SmartFilterBar.vue'
import type { FilterConfigItem } from '@/types/filter'
import type { DonationProjectFilterParams, DrugListQuery, DonationProjectItem } from '@/types/drug'

const keyword = ref('')
const filterParams = ref<DonationProjectFilterParams>({
  disease: {}
})

const buildQueryParams = (page: number, pageSize: number): DrugListQuery => {
  const params: DrugListQuery = { page, pageSize }
  if (keyword.value.trim()) params.keyword = keyword.value.trim()
  const diseaseVal = filterParams.value.disease || {}
  if (diseaseVal.diseaseId) params.diseaseId = diseaseVal.diseaseId
  return params
}

const { list: projects, loading, loadStatus, refresh, onLoadMore } = usePagedList<DonationProjectItem>({
  pageSize: 10,
  fetchPage: async (page, pageSize) => {
    const res = await drugApi.listDonations(buildQueryParams(page, pageSize))
    const records = res.data?.list || []
    return { list: records, hasMore: records.length >= pageSize }
  }
})

const viewDetail = (project: DonationProjectItem) => {
  uni.navigateTo({
    url: `/pages/resource/drug/DonationProjectDetail?projectId=${project.id}`
  })
}

// --- 2. 筛选配置 ---
const projectConfigs: FilterConfigItem[] = [
  {
    key: 'disease',
    label: '疾病',
    type: 'disease'
  }
]

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('zh-CN')
}

const handleSearch = () => refresh()
const handleClear = () => {
  keyword.value = ''
  refresh()
}
const handleFilterChange = () => refresh()
const handleFilterReset = () => {
  filterParams.value = { disease: {} }
  refresh()
}

onMounted(() => refresh())
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9fafb;
}

.filter-area {
  flex-shrink: 0;
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  z-index: 10;
}

.loading-state {
  padding: 32px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-text {
  margin-left: 8px;
  font-size: 14px;
  color: #6b7280;
}

.empty-state {
  padding: 32px 0;
  text-align: center;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
}

.project-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  /* 增加点击态反馈 */
  transition: background-color 0.2s;
}

.project-card:active {
  background-color: #f3f4f6;
}

.project-name {
  font-weight: 600;
  font-size: 16px;
  display: block;
  color: #1f2937;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.organizer-text {
  font-size: 12px;
  color: #6b7280;
}

.project-info {
  font-size: 14px;
  color: #6b7280;
  display: block;
  margin-top: 8px;
}

.project-desc {
  font-size: 14px;
  color: #374151;
  display: block;
  margin-top: 4px;
}

.status-row {
  margin-top: 12px;
  display: flex;
  align-items: center;
}

.deadline-text {
  font-size: 12px;
  color: #9ca3af;
  margin-left: 8px;
}

/* 新增：点击提示样式 */
.click-hint {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #9ca3af;
}
</style>