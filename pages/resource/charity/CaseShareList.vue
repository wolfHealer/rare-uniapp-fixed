<template>
  <view class="page-container">
    <!-- 顶部固定筛选区 -->
    <view class="filter-area">
      <!-- 1. 搜索框：按案例名称模糊匹配 -->
      <u-search 
        v-model="keyword" 
        placeholder="搜索案例名称" 
        shape="round"
        @search="handleSearch"
        @clear="handleClear"
        :show-action="false"
      ></u-search>

      <!-- 2. 智能筛选栏：按疾病种类筛选 -->
      <SmartFilterBar
        :configs="caseConfigs"
        v-model="filterParams"
        @change="handleFilterChange"
        @reset="handleFilterReset"
      />
    </view>

    <!-- 列表内容区 -->
    <scroll-view scroll-y class="content-scroll" @scrolltolower="onLoadMore">
      <view class="p-4">
        <!-- 列表 -->
        <view
          v-for="item in list"
          :key="item.id"
          class="bg-white rounded-xl shadow-sm p-4 mb-3"
          @click="viewCase(item)"
        >
          <!-- 修改点: 接口无 coverUrl，移除图片展示，或可使用默认占位图 -->
          <!-- <u-image ... ></u-image> -->

          <!-- 修改点: caseTitle 替代 title -->
          <text class="font-semibold block text-base">{{ item.caseTitle }}</text>
          
          <!-- 修改点: diseaseName 替代 disease, actualRelief 替代 amount -->
          <view class="flex items-center gap-2 mt-2">
             <u-tag :text="item.diseaseName" type="primary" size="mini"></u-tag>
             <!-- 如果 actualRelief 较长，可以截断或只显示标签 -->
             <text class="text-xs text-gray-500">援助: {{ item.actualRelief }}</text>
          </view>

          <!-- 修改点: patientDesc 替代 summary -->
          <text class="text-sm text-gray-600 mt-2 line-clamp-2 block">
            {{ item.patientDesc }}
          </text>
          
          <view class="flex gap-2 mt-3" @click.stop>
            <u-button size="mini" plain @click="viewCase(item)">
              查看详情
            </u-button>
            <!-- 修改点: casePdf 替代 pdfUrl -->
            <u-button size="mini" plain @click="downloadCase(item)">
              下载案例
            </u-button>
          </view>
        </view>

        <!-- 空状态 -->
        <u-empty v-if="!loading && list.length === 0" mode="data" text="暂无案例分享"></u-empty>

        <!-- 加载更多 -->
        <u-loadmore 
          :status="loadStatus" 
          :loading-text="'加载中...'"
          :loadmore-text="'上拉加载更多'"
          :nomore-text="'没有更多了'"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { charityApi } from '@/api/charity'
import { usePagedList } from '@/composables/usePagedList'
import SmartFilterBar from '@/components/filter/SmartFilterBar.vue'
import { downloadAndOpenDocument } from '@/utils/download'
import type { FilterConfigItem } from '@/types/filter'
import type { CaseShareItem } from '@/types/charity'
import type { DiseaseFilterValue } from '@/types/common'

const keyword = ref('')
const filterParams = ref<{ disease: DiseaseFilterValue }>({ disease: {} })

const caseConfigs: FilterConfigItem[] = [
  { key: 'disease', label: '疾病', type: 'disease' }
]

const buildQueryParams = (page: number, pageSize: number) => {
  const params: Record<string, unknown> = { page, pageSize }
  if (keyword.value.trim()) params.keyword = keyword.value.trim()
  const diseaseVal = filterParams.value.disease || {}
  if (diseaseVal.diseaseId) params.diseaseId = diseaseVal.diseaseId
  return params
}

const { list, loading, loadStatus, refresh, onLoadMore } = usePagedList<CaseShareItem>({
  pageSize: 10,
  fetchPage: async (page, pageSize) => {
    const res = await charityApi.listCases(buildQueryParams(page, pageSize))
    const records = res.data?.list || []
    return { list: records, hasMore: records.length >= pageSize }
  }
})

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

const viewCase = (item: CaseShareItem) => {
  uni.navigateTo({ url: `/pages/resource/charity/CaseShareDetail?id=${item.id}` })
}

const downloadCase = (item: CaseShareItem) => {
  if (!item.casePdf) {
    uni.showToast({ title: '暂无PDF文件', icon: 'none' })
    return
  }
  downloadAndOpenDocument({ url: String(item.casePdf) })
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
.bg-white { background-color: #ffffff; }
.rounded-xl { border-radius: 12px; }
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.mb-3 { margin-bottom: 12px; }
.rounded-lg { border-radius: 8px; }
.font-semibold { font-weight: 600; }
.block { display: block; }
.text-sm { font-size: 14px; }
.text-xs { font-size: 12px; }
.text-gray-500 { color: #6b7280; }
.text-gray-600 { color: #4b5563; }
.mt-1 { margin-top: 4px; }
.mt-2 { margin-top: 8px; }
.mt-3 { margin-top: 12px; }
.flex { display: flex; }
.items-center { align-items: center; }
.gap-2 { gap: 8px; }
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.text-base { font-size: 16px; }
</style>