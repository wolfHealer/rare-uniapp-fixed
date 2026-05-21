<template>
  <view class="page-container">
    <!-- 顶部固定筛选区 -->
    <view class="filter-area">
      <!-- 智能筛选栏：疾病、医保范围、地区 -->
      <SmartFilterBar
        :configs="policyConfigs"
        v-model="filterParams"
        @change="handleFilterChange"
        @reset="handleFilterReset"
      />
    </view>

    <!-- 列表内容区 -->
    <scroll-view scroll-y class="content-scroll" @scrolltolower="onLoadMore">
      <view class="p-4">
        <!-- 加载状态 -->
        <view v-if="loading" class="mt-4 flex justify-center items-center">
          <u-loading-icon mode="circle"></u-loading-icon>
          <text class="ml-2 text-gray-500">加载中...</text>
        </view>

        <!-- 政策列表 -->
        <view v-else>
          <u-cell-group class="mt-3">
            <u-cell
              v-for="item in list"
              :key="item.id"
              :title="item.title"
              :label="getDisplayRegion(item) + ' · ' + item.date"
              is-link
              @click="open(item)"
            >
              <template #value>
                <u-tag text="政策" type="primary" size="mini"></u-tag>
              </template>
            </u-cell>
          </u-cell-group>

          <!-- 空状态 -->
          <u-empty v-if="list.length === 0" mode="data" text="暂无政策解读"></u-empty>

          <!-- 加载更多 -->
          <u-loadmore 
            :status="loadStatus" 
            :loading-text="'加载中...'"
            :loadmore-text="'上拉加载更多'"
            :nomore-text="'没有更多了'"
          />
        </view>

        <!-- 下载资料 -->
        <view class="mt-4 text-center">
          <u-button type="primary" @click="downloadMaterials" :loading="downloading">
            下载医保报销流程图解
          </u-button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { medicareApi } from '@/api/medicare'
import { usePagedList } from '@/composables/usePagedList'
import SmartFilterBar from '@/components/filter/SmartFilterBar.vue'
import type { FilterConfigItem } from '@/types/filter'
import type { PolicyItem } from '@/types/medicare'
import type { DiseaseFilterValue, RegionSelection } from '@/types/common'

const downloading = ref(false)

const filterParams = ref<{
  disease: DiseaseFilterValue
  region: RegionSelection
}>({
  disease: {},
  region: {}
})

// 筛选配置 (Core Logic)
const policyConfigs: FilterConfigItem[] = [
  {
    key: 'region',
    label: '选择地区',
    type: 'provinceCity' // 使用 RegionPicker 组件
  },
  {
    key: 'disease', // 修改 key
    label: '选择疾病',
    type: 'disease' // 修改 type 为 disease，这将触发 SmartFilterPopup 使用 DiseasePicker
  }
]

const buildQueryParams = (page: number, pageSize: number) => {
  const params: Record<string, unknown> = { page, pageSize }
  const diseaseVal = filterParams.value.disease || {}
  if (diseaseVal.diseaseId) params.disease_id = diseaseVal.diseaseId
  const region = filterParams.value.region || {}
  if (region.provinceCode) params.province_code = region.provinceCode
  if (region.cityCode) params.city_code = region.cityCode
  return params
}

const { list, loading, loadStatus, refresh, onLoadMore } = usePagedList<PolicyItem>({
  pageSize: 10,
  fetchPage: async (page, pageSize) => {
    const res = await medicareApi.listPolicies(buildQueryParams(page, pageSize))
    const apiData = res.data || {}
    const policiesObj = apiData.policies || {}
    const newRecords = [
      ...(policiesObj.national || []),
      ...(policiesObj.province || []),
      ...(policiesObj.city || [])
    ]
    const total = apiData.total || 0
    const loadedCount = (page - 1) * pageSize + newRecords.length
    const hasMore = newRecords.length > 0 && loadedCount < total
    return { list: newRecords, hasMore }
  }
})

const handleFilterChange = () => refresh()
const handleFilterReset = () => {
  filterParams.value = { disease: {}, region: {} }
  refresh()
}

const open = (item: PolicyItem) => {
  uni.navigateTo({
    url: `/pages/resource/medicare/PolicyDetail?id=${item.id}`
  })
}

// 辅助函数：显示地区名称
const getDisplayRegion = (item: PolicyItem) => {
  return item.region || '全国'
}

const downloadMaterials = async () => {
  downloading.value = true
  try {
    // 模拟下载
    await new Promise(resolve => setTimeout(resolve, 1000))
    uni.showToast({ title: '下载已开始', icon: 'success' })
  } catch (error) {
    uni.showToast({ title: '下载失败', icon: 'none' })
  } finally {
    downloading.value = false
  }
}

onMounted(() => refresh())
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
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

.content-scroll {
  flex: 1;
  overflow-y: auto;
}

.p-4 { padding: 16px; }
.text-lg { font-size: 18px; }
.font-bold { font-weight: 700; }
.mb-3 { margin-bottom: 12px; }
.block { display: block; }
.mt-4 { margin-top: 16px; }
.flex { display: flex; }
.justify-center { justify-content: center; }
.items-center { align-items: center; }
.ml-2 { margin-left: 8px; }
.mt-3 { margin-top: 12px; }
.text-center { text-align: center; }
.text-gray-500 { color: #6b7280; }
</style>