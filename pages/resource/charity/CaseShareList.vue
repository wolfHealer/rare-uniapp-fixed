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
import request from '@/utils/request'
import SmartFilterBar from '@/components/filter/SmartFilterBar.vue'
import type { FilterConfigItem } from '@/types/filter'

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const loadStatus = ref<'loading' | 'loadmore' | 'nomore'>('loadmore')

// 列表数据
const list = ref<any[]>([])
const loading = ref(false)

// 搜索关键词
const keyword = ref('')

// 筛选参数状态
const filterParams = ref<Record<string, any>>({
  disease: {} 
})

// 筛选配置
const caseConfigs: FilterConfigItem[] = [
  {
    key: 'disease',
    label: '疾病',
    type: 'disease'
  }
]

const fetchCases = async (isRefresh = false) => {
  if (isRefresh) {
    currentPage.value = 1
    list.value = []
  }
  
  if (loadStatus.value === 'nomore' && !isRefresh) return

  loading.value = true
  if (isRefresh) {
    loadStatus.value = 'loading'
  }
  
  try {
    const params: Record<string, any> = {
      page: currentPage.value,
      pageSize: pageSize.value // 注意：接口参数通常是 pageSize 或 limit，根据之前 AidProject 接口推测是 pageSize
    }

    if (keyword.value && keyword.value.trim() !== '') {
      params.keyword = keyword.value.trim()
    }

    const diseaseVal = filterParams.value.disease || {}
    if (diseaseVal.diseaseId) {
      params.diseaseId = diseaseVal.diseaseId
    }

    const res = await request.get('/api/resource/charity/cases', params)
    
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
    console.error('获取案例失败:', error)
    loadStatus.value = 'loadmore'
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const onLoadMore = () => {
  fetchCases()
}

const handleSearch = () => {
  fetchCases(true)
}

const handleClear = () => {
  keyword.value = ''
  fetchCases(true)
}

const handleFilterChange = () => {
  fetchCases(true)
}

const handleFilterReset = () => {
  filterParams.value = {
    disease: {}
  }
  fetchCases(true)
}

const viewCase = (item: any) => {
  uni.navigateTo({
    url: `/pages/resource/charity/CaseShareDetail?id=${item.id}`
  })
}

const downloadCase = (item: any) => {
  // 修改点: casePdf 替代 pdfUrl
  if (item.casePdf) {
    uni.showLoading({ title: '下载中...' })
    uni.downloadFile({
      url: item.casePdf,
      success: (res) => {
        uni.hideLoading()
        if (res.statusCode === 200) {
          uni.openDocument({
            filePath: res.tempFilePath,
            showMenu: true
          })
        } else {
          uni.showToast({ title: '下载失败', icon: 'none' })
        }
      },
      fail: () => {
        uni.hideLoading()
        uni.showToast({ title: '下载失败', icon: 'none' })
      }
    })
  } else {
    uni.showToast({ title: '暂无PDF文件', icon: 'none' })
  }
}

onMounted(() => {
  fetchCases(true)
})
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