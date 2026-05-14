<template>
  <view class="container">

    <!-- 搜索栏 -->
    <view class="search-box">
      <u-search 
        v-model="keyword" 
        placeholder="搜索药品名称" 
        shape="round"
        @search="onSearch"
        @clear="onClear"
      ></u-search>
    </view>

    <!-- 智能筛选栏 -->
    <view class="filter-area">
      <SmartFilterBar
        :configs="drugConfigs"
        v-model="filterParams"
        @change="handleFilterChange"
        @reset="handleFilterReset"
      />
    </view>

    <!-- 动态列表 -->
    <scroll-view scroll-y class="list-container" @scrolltolower="loadMore">
      <!-- 加载状态 -->
      <view v-if="loading && drugs.length === 0" class="loading-state">
        <u-loading-icon mode="circle"></u-loading-icon>
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 空状态 -->
      <view v-else-if="drugs.length === 0" class="empty-state">
        <u-empty mode="data" text="暂无数据"></u-empty>
      </view>

      <!-- 药品列表 -->
      <view v-else class="drug-list">
        <view
          v-for="drug in drugs"
          :key="drug.id"
          class="drug-item"
          @click="viewDetails(drug)"
        >
          <view class="item-header">
            <view class="name-group">
              <text class="drug-name">{{ drug.generic_name }}</text>
              <text v-if="drug.brand_name" class="brand-name">({{ drug.brand_name }})</text>
            </view>
            <u-tag 
              :text="drug.is_insurance ? '医保' : '非医保'" 
              :type="drug.is_insurance ? 'success' : 'info'" 
              size="mini"
            ></u-tag>
          </view>

          <view class="item-info">
            <text class="info-text">适应症：{{ drug.indication }}</text>
          </view>
          
          <view class="item-meta">
             <u-tag v-if="drug.drug_type" :text="getDrugTypeText(drug.drug_type)" type="primary" size="mini"></u-tag>
             <text v-if="drug.spec" class="spec-text">{{ drug.spec }}</text>
          </view>

          <!-- 操作按钮 (点击卡片也可跳转，这里保留按钮用于特定操作) -->
          <view class="item-actions" @click.stop>
            <u-button size="mini" type="primary" @click="viewDetails(drug)">
              查看详情
            </u-button>
            <u-button size="mini" plain @click="downloadManual(drug)">
              说明书
            </u-button>
          </view>
        </view>
        
        <!-- 底部加载更多提示 -->
        <u-loadmore 
          :status="loadStatus" 
          :loading-text="'加载中...'"
          :loadmore-text="'上拉加载更多'"
          :nomore-text="'没有更多了'"
          v-if="drugs.length > 0"
        />
      </view>
    </scroll-view>

    <!-- 名录下载 -->
    <view class="footer-action">
      <u-button type="primary" block @click="downloadList" :loading="exporting">
        下载药品名录 Excel 版
      </u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import SmartFilterBar from '@/components/filter/SmartFilterBar.vue'
import type { FilterConfigItem } from '@/types/filter'

// --- 1. 类型定义 ---
interface DrugItem {
  id: number
  generic_name: string
  brand_name?: string
  indication: string
  drug_type: string
  is_insurance: boolean
  dosage_form?: string
  spec?: string
  ref_price?: string
  has_relief?: boolean
  is_launched?: boolean
  need_prescription?: boolean
  manual_original?: string
  manual_popular?: string
}

// --- 2. 状态管理 ---
const keyword = ref('')
const drugs = ref<DrugItem[]>([])
const loading = ref(false)
const exporting = ref(false)
const loadStatus = ref<'loading' | 'loadmore' | 'nomore'>('nomore')

// 筛选参数状态
const filterParams = ref<Record<string, any>>({
  drug_type: '',
  is_insurance: ''
})

// --- 3. 辅助函数：药品类型映射 ---
const DRUG_TYPE_MAP: Record<string, string> = {
  origin_import: '进口原研',
  origin_domestic: '国产原研',
  generic: '仿制药',
  other: '其他'
}

const getDrugTypeText = (type: string) => {
  return DRUG_TYPE_MAP[type] || type
}

// --- 4. 筛选配置 ---
const typeOptions = ref<{ label: string; value: string }[]>([
  { label: '全部类型', value: '' },
  { label: '进口原研', value: 'origin_import' },
  { label: '国产原研', value: 'origin_domestic' },
  { label: '仿制药', value: 'generic' },
  { label: '其他', value: 'other' }
])

const insuranceOptions = ref<{ label: string; value: string }[]>([
  { label: '全部状态', value: '' },
  { label: '医保', value: 'true' },
  { label: '非医保', value: 'false' }
])

const drugConfigs: FilterConfigItem[] = [
  {
    key: 'drug_type', // 注意：这里 key 对应 filterParams 和接口参数
    label: '类型',
    type: 'tags',
    options: typeOptions.value
  },
  {
    key: 'is_insurance',
    label: '医保状态',
    type: 'tags',
    options: insuranceOptions.value
  }
]

// --- 5. 数据加载逻辑 ---

const fetchOptions = async () => {
  try {
    const res = await request.get('/api/resource/drug/drugs/options')
    const data = res.data || {}
    
    if (data.types && Array.isArray(data.types)) {
      typeOptions.value = [
        { label: '全部类型', value: '' },
        ...data.types.map((item: any) => ({
          label: item.label,
          value: item.value
        }))
      ]
    }
    
    if (data.insurances && Array.isArray(data.insurances)) {
      insuranceOptions.value = [
        { label: '全部状态', value: '' },
        ...data.insurances.map((item: any) => ({
          label: item.label,
          value: item.value
        }))
      ]
    }
  } catch (error) {
    console.error('获取筛选选项失败:', error)
  }
}

const fetchDrugs = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {}
    
    if (keyword.value && keyword.value.trim() !== '') {
      params.keyword = keyword.value
    }
    
    // 映射筛选参数到接口期望的参数名
    if (filterParams.value.drug_type) {
      params.drug_type = filterParams.value.drug_type
    }
    
    if (filterParams.value.is_insurance) {
      params.is_insurance = filterParams.value.is_insurance
    }

    const res = await request.get('/api/resource/drug/drugs', { params })
    
    // 处理返回数据结构: { code: 200, data: { list: [], total: 4 ... } }
    let resultList: DrugItem[] = []
    if (res.data && res.data.list) {
        resultList = res.data.list
    } else if (Array.isArray(res.data)) {
        resultList = res.data
    }
    
    drugs.value = resultList
    loadStatus.value = 'nomore' // 当前未实现分页加载，暂定为 nomore
  } catch (error) {
    console.error('获取药品列表失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
    drugs.value = []
  } finally {
    loading.value = false
  }
}

// --- 6. 事件处理 ---

const onSearch = () => {
  fetchDrugs()
}

const onClear = () => {
  keyword.value = ''
  fetchDrugs()
}

const loadMore = () => {
  // 预留分页接口
}

const handleFilterChange = () => {
  fetchDrugs()
}

const handleFilterReset = () => {
  filterParams.value = {
    drug_type: '',
    is_insurance: ''
  }
  fetchDrugs()
}

const viewDetails = (drug: DrugItem) => {
  uni.navigateTo({
    url: `/pages/resource/drug/DrugDetail?id=${drug.id}`
  })
}

const downloadManual = async (drug: DrugItem) => {
  const url = drug.manual_popular || drug.manual_original
  if (!url) {
    uni.showToast({ title: '暂无说明书', icon: 'none' })
    return
  }

  // #ifdef H5
  window.open(url, '_blank')
  // #endif
  
  // #ifndef H5
  uni.downloadFile({
    url: url,
    success: (res) => {
      if (res.statusCode === 200) {
        uni.openDocument({
          filePath: res.tempFilePath,
          showMenu: true,
          fail: (err) => {
             console.error(err)
             uni.showToast({ title: '打开失败', icon: 'none' })
          }
        })
      }
    },
    fail: (err) => {
      console.error(err)
      uni.showToast({ title: '下载失败', icon: 'none' })
    }
  })
  // #endif
}

const downloadList = async () => {
  exporting.value = true
  try {
    const params: Record<string, any> = {}
    if (keyword.value) params.keyword = keyword.value
    if (filterParams.value.drug_type) params.drug_type = filterParams.value.drug_type
    if (filterParams.value.is_insurance) params.is_insurance = filterParams.value.is_insurance

    // #ifdef H5
    const res = await request.get('/api/resource/drug/drugs/export', {
      params,
      responseType: 'blob'
    })
    const blob = new Blob([res.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `药品名录_${new Date().toLocaleDateString()}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
    uni.showToast({ title: '下载成功', icon: 'success' })
    // #endif

    // #ifndef H5
    uni.showToast({ title: '请在H5端导出Excel', icon: 'none' })
    // #endif
  } catch (error) {
    console.error('导出名录失败:', error)
    uni.showToast({ title: '导出失败', icon: 'none' })
  } finally {
    exporting.value = false
  }
}

onMounted(() => {
  fetchOptions()
  fetchDrugs()
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
}

.search-box {
  padding: 16px;
  background-color: #ffffff;
}

.filter-area {
  padding: 0 16px 8px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #f3f4f6;
}

.list-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px; 
}

.loading-state {
  padding: 32px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-text {
  margin-left: 8px;
  color: #6b7280;
}

.empty-state {
  padding: 32px 0;
}

.drug-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.drug-item {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.name-group {
  flex: 1;
  margin-right: 8px;
}

.drug-name {
  font-weight: 600;
  font-size: 16px;
  color: #111827;
}

.brand-name {
  font-size: 12px;
  color: #6b7280;
  margin-left: 4px;
}

.item-info {
  margin-top: 8px;
}

.info-text {
  font-size: 14px;
  color: #374151;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-meta {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.spec-text {
  font-size: 12px;
  color: #6b7280;
}

.item-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.footer-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: #ffffff;
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.05);
  z-index: 9;
}
</style>