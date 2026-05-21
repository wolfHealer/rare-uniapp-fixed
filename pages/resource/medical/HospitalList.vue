<template>
  <view class="list-container">
    <!-- 顶部搜索与智能筛选栏 -->
    <view class="filter-area">
      <u-search
        v-model="keyword"
        placeholder="搜索医院名称"
        shape="round"
        @search="handleSearch"
        @clear="handleClear"
      />
      
      <!-- 
        智能筛选栏：
        传入 hospitalConfigs，它会自动生成“地区”和“医院等级”两个按钮
      -->
      <SmartFilterBar
        :configs="hospitalConfigs"
        v-model="filterParams"
        @change="handleFilterChange"
        @reset="handleFilterReset"
      />
    </view>

    <!-- 滚动列表 -->
    <scroll-view scroll-y class="scroll-content" @scrolltolower="loadMore">
      <view class="hospital-list">
        <view
          v-for="item in hospitals"
          :key="item.id"
          class="hospital-card"
          @click="open(item)"
        >
          <view class="card-header">
            <text class="hosp-name">{{ item.name }}</text>
            <!-- 修改：使用 levelName 显示中文等级，如果没有则 fallback 到原始 level -->
            <u-tag :text="item.levelName || getLevelText(item.level)" type="primary" size="mini" />
          </view>

          <view class="card-info">
            <view class="info-row">
              <u-icon name="map" size="14" color="#9ca3af" />
              <text class="info-text">{{ item.address }}</text>
            </view>
            <view class="info-row">
              <u-icon name="phone" size="14" color="#9ca3af" />
              <text class="info-text">{{ item.phone || '暂无电话' }}</text>
            </view>
          </view>

          <view class="card-footer">
            <u-button size="mini" type="primary" plain @click.stop="handleDownload">导出名录</u-button>
          </view>
        </view>

        <u-loadmore :status="loadStatus" @loadmore="loadMore" />
        <u-empty v-if="!loading && hospitals.length === 0" mode="data" text="暂无医院数据" />
        <view class="bottom-spacer"></view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { medicalApi } from '@/api/medical'
import { usePagedList } from '@/composables/usePagedList'
import SmartFilterBar from '@/components/filter/SmartFilterBar.vue'
import type { FilterConfigItem } from '@/types/filter'
import type { HospitalListItem, HospitalFilterParams, HospitalListQuery } from '@/types/medical'

// --- 1. 定义筛选配置 (Core Logic) ---
const hospitalConfigs: FilterConfigItem[] = [
  {
    key: 'region',
    label: '地区',
    type: 'region' // 特殊类型，内部会渲染 RegionPicker
  },
  {
    key: 'level',
    label: '医院等级',
    type: 'tags',
    options: [
      { label: '全部', value: '' },
      { label: '三级甲等', value: '1' },
      { label: '三级乙等', value: '2' },
      { label: '三级丙等', value: '3' },
      { label: '二级甲等', value: '4' },
      { label: '二级乙等', value: '5' },
      { label: '二级丙等', value: '6' },
      { label: '其他', value: '7' }
    ]
  }
]

// --- 2. 等级映射字典 ---
const levelMap: Record<string, string> = {
  '1': '三级甲等',
  '2': '三级乙等',
  '3': '三级丙等',
  '4': '二级甲等',
  '5': '二级乙等',
  '6': '二级丙等',
  '7': '其他'
}

// 辅助函数：获取等级文本
const getLevelText = (level: string | number) => {
  return levelMap[String(level)] || '未知等级'
}

// --- 3. 状态管理 ---
const keyword = ref('')

// 筛选参数状态，初始值只包含配置中定义的 key
const filterParams = ref<HospitalFilterParams>({
  region: {},
  level: ''
})

const buildQueryParams = (page: number, pageSize: number): HospitalListQuery => {
  const queryParams: HospitalListQuery = { page, pageSize }
  if (keyword.value) queryParams.keyword = keyword.value
  const region = filterParams.value.region || {}
  if (region.provinceCode) queryParams.provinceCode = region.provinceCode
  if (region.cityCode) queryParams.cityCode = region.cityCode
  if (region.districtCode) queryParams.districtCode = region.districtCode
  if (filterParams.value.level) queryParams.level = filterParams.value.level
  return queryParams
}

const { list: hospitals, loading, loadStatus, refresh, onLoadMore } = usePagedList<HospitalListItem>({
  pageSize: 10,
  fetchPage: async (page, pageSize) => {
    const res = await medicalApi.listHospitals(buildQueryParams(page, pageSize))
    const rawList = res.data?.list || []
    const processedList = rawList.map((item) => ({
      ...item,
      levelName: levelMap[String(item.level)] || '未知等级'
    }))
    return { list: processedList, hasMore: processedList.length >= pageSize }
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
  filterParams.value = { region: {}, level: '' }
  refresh()
}

const open = (item: HospitalListItem) => {
  uni.navigateTo({ url: `/pages/resource/medical/HospitalDetail?id=${item.id}` })
}

const handleDownload = () => {
  uni.showToast({ title: '下载功能开发中', icon: 'none' })
}

onMounted(() => refresh())
</script>

<style scoped lang="scss">
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
}

.scroll-content {
  flex: 1;
  height: 0;
}

.hospital-list {
  padding: 16px;
}

.hospital-card {
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hosp-name {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-right: 8px;
}

.card-info {
  margin-top: 10px;
}

.info-row {
  display: flex;
  align-items: center;
  margin-top: 6px;
}

.info-text {
  margin-left: 6px;
  color: #606266;
  font-size: 13px;
  line-height: 1.5;
}

.card-footer {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.bottom-spacer {
  height: 20px;
}
</style>