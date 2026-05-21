<template>
  <view class="list-container">
    <!-- 顶部筛选与搜索区 (固定) -->
    <view class="filter-area">
      <!-- 1. 搜索栏 -->
      <u-search 
        v-model="keyword" 
        placeholder="搜索康复机构名称" 
        shape="round"
        @search="handleSearch"
        @clear="handleClear"
        :show-action="false"
      ></u-search>
      
      <!-- 2. 智能筛选栏 -->
      <SmartFilterBar
        :configs="institutionConfigs"
        v-model="filterParams"
        @change="handleFilterChange"
        @reset="handleFilterReset"
      />
    </view>

    <!-- 滚动列表区域 -->
    <scroll-view scroll-y class="scroll-content" @scrolltolower="loadMore">
      <view class="institution-list">
        
        <!-- 加载状态 (仅首次加载显示) -->
        <view v-if="loading && institutions.length === 0" class="loading-state">
          <u-loading-icon mode="circle"></u-loading-icon>
          <text class="loading-text">加载中...</text>
        </view>

        <!-- 机构卡片列表 -->
        <view 
          v-for="item in institutions" 
          :key="item.id" 
          class="rehab-card"
          @click="openDetail(item)"
        >
          <view class="card-header">
            <text class="inst-name">{{ item.name }}</text>
            <!-- 修改点: 接口无 isInsurance/typeName，使用 rating 或 status 替代展示，或仅显示名称 -->
            <u-tag 
              v-if="item.rating"
              :text="'评分 ' + item.rating" 
              type="warning" 
              size="mini"
              plain
            ></u-tag>
          </view>
          
          <view class="card-info">
            <view class="info-row">
              <u-icon name="map" size="14" color="#9ca3af"></u-icon>
              <!-- 修改点: 组合显示省市区 + 详细地址 -->
              <text class="info-text">{{ getFullAddress(item) }}</text>
            </view>
            <view class="info-row">
              <u-icon name="phone" size="14" color="#9ca3af"></u-icon>
              <!-- 修改点: contactPhone 替代 contact -->
              <text class="info-text">{{ item.contactPhone || '暂无联系方式' }}</text>
            </view>
            
            <!-- 修改点: 接口未返回疾病名称列表，仅显示 rehabProjects 摘要或隐藏 -->
            <view class="info-row" v-if="item.rehabProjects">
              <u-icon name="star" size="14" color="#9ca3af"></u-icon>
              <text class="info-text line-clamp-1">{{ item.rehabProjects }}</text>
            </view>
          </view>

          <view class="card-footer">
            <u-button size="mini" type="primary" plain @click.stop="viewDetails(item)">
              查看详情
            </u-button>
          </view>
        </view>

        <!-- 加载更多 -->
        <u-loadmore :status="institutionLoadStatus" @loadmore="loadMore" />
        
        <!-- 空状态 -->
        <u-empty v-if="!loading && institutions.length === 0" mode="data" text="暂无康复机构" />
        
        <!-- 底部占位 -->
        <view class="bottom-spacer"></view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { rehabApi } from '@/api/rehab'
import { usePagedList } from '@/composables/usePagedList'
import SmartFilterBar from '@/components/filter/SmartFilterBar.vue'
import type { FilterConfigItem } from '@/types/filter'
import type {
  RehabInstitutionItem,
  RehabInstitutionFilterParams,
  RehabListQuery
} from '@/types/rehab'

const keyword = ref('')
const filterParams = ref<RehabInstitutionFilterParams>({
  disease: {},     
  region: {}       
})

// 筛选配置
const institutionConfigs: FilterConfigItem[] = [
  {
    key: 'disease',
    label: '疾病',
    type: 'disease' 
  },
  {
    key: 'region',
    label: '地区',
    type: 'region' 
  }
]

// --- 辅助函数 ---

// 组合地址显示
const getFullAddress = (item: RehabInstitutionItem) => {
  const parts = [item.provinceName, item.cityName, item.districtName, item.address].filter(Boolean)
  return parts.join('') || '地址不详'
}

const buildQueryParams = (page: number, pageSize: number): RehabListQuery => {
  const params: RehabListQuery = { page, pageSize }
  if (keyword.value) params.keyword = keyword.value
  const diseaseVal = filterParams.value.disease || {}
  if (diseaseVal.diseaseId) params.diseaseId = diseaseVal.diseaseId
  const regionData = filterParams.value.region || {}
  if (regionData.provinceCode) params.provinceCode = regionData.provinceCode
  if (regionData.cityCode) params.cityCode = regionData.cityCode
  if (regionData.districtCode) params.districtCode = regionData.districtCode
  return params
}

const {
  list: institutions,
  loading,
  loadStatus: institutionLoadStatus,
  refresh,
  onLoadMore
} = usePagedList<RehabInstitutionItem>({
  pageSize: 10,
  fetchPage: async (page, pageSize) => {
    const res = await rehabApi.listInstitutions(buildQueryParams(page, pageSize))
    const records = res.data?.list || []
    return { list: records, hasMore: records.length >= pageSize }
  }
})

const loadMore = () => onLoadMore()
const handleSearch = () => refresh()
const handleClear = () => {
  keyword.value = ''
  refresh()
}
const handleFilterChange = () => refresh()
const handleFilterReset = () => {
  filterParams.value = { disease: {}, region: {} }
  refresh()
}

const openDetail = (item: RehabInstitutionItem) => {
  if (!item?.id) return
  uni.navigateTo({ url: `/pages/resource/rehab/RehabInstitutionDetail?id=${item.id}` })
}

const viewDetails = (item: RehabInstitutionItem) => {
  openDetail(item)
}

onMounted(() => refresh())
</script>

<style scoped lang="scss">
/* 容器布局：Flex 列，占满全屏 */
.list-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
}

/* 顶部固定区域 */
.filter-area {
  flex-shrink: 0;
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  z-index: 10;
}

/* 滚动内容区域 */
.scroll-content {
  flex: 1;
  height: 0; /* 关键：配合 flex:1 实现内部滚动 */
}

.institution-list {
  padding: 16px;
}

/* 卡片样式 */
.rehab-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.2s;

  &:active {
    opacity: 0.9;
    transform: scale(0.98);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.inst-name {
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
  flex: 1;
  margin-right: 8px;
}

.card-info {
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  align-items: flex-start; /* 改为 flex-start 以支持多行文本对齐 */
  gap: 6px;
  margin-bottom: 6px;
}

.info-text {
  font-size: 13px;
  color: #6b7280;
  flex: 1;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f9fafb;
  padding-top: 12px;
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