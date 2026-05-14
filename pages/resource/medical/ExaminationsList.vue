<template>
  <view class="page-container">
    <!-- 搜索框 -->
    <view class="search-box">
      <u-search 
        v-model="keyword" 
        placeholder="搜索检查项目" 
        shape="round"
        clearable
        @search="onSearch"
        @clear="onClear"
      ></u-search>
    </view>

    <!-- 列表 -->
    <view class="list-box">
      <u-cell-group>
        <u-cell
          v-for="item in list"
          :key="item.id"
          :title="item.examName"
          :label="item.examPurpose"
          is-link
          @click="open(item)"
        >
          <template #value>
            <u-tag 
              v-if="item.examType" 
              :text="getExamTypeText(item.examType)" 
              type="primary" 
              size="mini"
            ></u-tag>
          </template>
        </u-cell>
      </u-cell-group>

      <!-- 空状态 -->
      <u-empty 
        v-if="!loading && list.length === 0" 
        mode="data" 
        text="暂无检查项目数据"
      ></u-empty>

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-more">
        <u-loading-icon mode="circle"></u-loading-icon>
      </view>

      <!-- 分页信息 -->
      <view v-if="total > 0" class="pagination-info">
        <text>共 {{ total }} 条记录</text>
      </view>
      
      <!-- 加载更多 -->
      <u-loadmore 
        :status="loadStatus" 
        v-if="list.length > 0"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

// 类型定义：匹配接口返回字段
interface InspectionItem {
  id: number
  examName: string
  examPurpose: string
  examType?: string
  price?: number
  duration?: string
  sampleNotes?: string
  institution?: string
  diseaseIds?: number[]
  sort?: number
  createdAt?: string
  updatedAt?: string
}

// 检查类型映射表
const EXAM_TYPE_MAP: Record<string, string> = {
  lab: '实验室检查',
  metabolic: '代谢筛查',
  imaging: '影像学检查',
  genetic: '基因检测',
  pathology: '病理检查',
  functional: '功能检查',
  scale: '量表评估',
  special: '专科专项检查',
  other: '其他'
}

// 响应式数据
const keyword = ref('')
const list = ref<InspectionItem[]>([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const loadStatus = ref<'loading' | 'loadmore' | 'nomore'>('loadmore')

// 获取检查类型的中文文本
const getExamTypeText = (type: string) => {
  return EXAM_TYPE_MAP[type] || type
}

// 加载检查项目列表
const loadInspectionList = async (isRefresh = false) => {
  if (isRefresh) {
    page.value = 1
    list.value = []
  }
  
  if (loadStatus.value === 'nomore' && !isRefresh) return

  loading.value = true
  loadStatus.value = 'loading'
  
  try {
    const res = await request.get('/api/resource/medical/examinations', {
      params: {
        keyword: keyword.value,
        page: page.value,
        pageSize: pageSize.value
      }
    })
    
    // 接口返回结构: { code: 200, data: { list: [], total: 5 }, message: "success" }
    const responseData = res.data || {}
    const records = responseData.list || []
    
    if (isRefresh) {
      list.value = records
    } else {
      list.value.push(...records)
    }
    
    total.value = responseData.total || 0
    
    if (records.length < pageSize.value) {
      loadStatus.value = 'nomore'
    } else {
      loadStatus.value = 'loadmore'
      page.value++
    }
  } catch (error) {
    console.error('加载检查项目列表失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
    loadStatus.value = 'loadmore'
  } finally {
    loading.value = false
  }
}

// 打开详情页
const open = (item: InspectionItem) => {
  uni.navigateTo({
    url: `/pages/resource/medical/ExaminationDetail?id=${item.id}`
  })
}

// 搜索处理
const onSearch = () => {
  loadInspectionList(true)
}

const onClear = () => {
  keyword.value = ''
  loadInspectionList(true)
}

onMounted(() => {
  loadInspectionList()
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 16px;
}

.search-box {
  margin-bottom: 12px;
}

.loading-more {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

.pagination-info {
  text-align: center;
  font-size: 12px;
  color: #6b7280;
  margin-top: 16px;
}
</style>