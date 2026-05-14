# 8 软件架构设计
## 8.1 软件架构概述
软件架构是软件抽象发展到一定阶段的产物，从编程的角度，可以清晰的看到软件抽象层次和表达工具的发展历史。
### 8.1.1. 软件架构的定义
定义1:
定义2:


# 20 信息系统基础知识
## 20.1 信息系统概述
### 20.1.1. 信息系统的发展阶段
第一阶段：电子数据处理阶段 
电子数据处理：Electronic Data Processing,EDP
第二阶段：事务处理阶段 
事务处理系统:Transaction Process System,TPS
第三阶段：管理信息系统阶段
管理信息系统：Management Information System,MIS
第四阶段：决策支持系统阶段
决策支持系统：Decision Support System,DSS



HospitalList.vue


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import request from '@/utils/request'
import RegionPicker from './components/RegionPicker.vue'
import type { RegionValue } from './components/RegionPicker.vue'

const keyword = ref('')
const regionValue = ref<Partial<RegionValue>>({})
const levelId = ref<string | number | null>(null) // 改为 string | number 以兼容可能的字符串ID
const showLevelPicker = ref(false)

// 修改 levelOptions 为 7 种等级
// 注意：value 的值需要与后端数据库或枚举定义保持一致。
// 这里假设后端使用数字 1-7 或对应的字符串标识。如果后端使用特定 ID，请替换 value 的值。
const levelOptions = ref([
  { text: '全部等级', value: null },
  { text: '三级甲等', value: 1 },
  { text: '三级乙等', value: 2 },
  { text: '三级丙等', value: 3 },
  { text: '二级甲等', value: 4 },
  { text: '二级乙等', value: 5 },
  { text: '二级丙等', value: 6 },
  { text: '其他', value: 7 }
])

const hospitals = ref<any[]>([])
const loading = ref(false)
const loadStatus = ref<'loading' | 'loadmore' | 'nomore'>('loadmore')
const page = ref(1)

// 计算显示标签
const regionLabel = computed(() => {
  const v = regionValue.value
  if (v.districtName) return v.districtName
  if (v.cityName) return v.cityName
  if (v.provinceName) return v.provinceName
  return '全部地区'
})

const levelLabel = computed(() => {
  const opt = levelOptions.value.find(l => l.value === levelId.value)
  return opt ? opt.text : '全部等级'
})

const loadList = async (isRefresh = false) => {
  if (isRefresh) {
    page.value = 1
    hospitals.value = []
    loadStatus.value = 'loading'
  }
  if (loadStatus.value === 'nomore' && !isRefresh) return

  loading.value = true
  try {
    const queryParams: any = { 
      page: page.value, 
      pageSize: 10 
    }
    
    // 处理地区筛选参数 (拆解 regionValue)
    const v = regionValue.value
    if (v.provinceCode) queryParams.provinceCode = v.provinceCode
    if (v.cityCode) queryParams.cityCode = v.cityCode
    if (v.districtCode) queryParams.districtCode = v.districtCode
    
    // 处理等级筛选参数
    if (levelId.value !== null && levelId.value !== undefined) {
      queryParams.level = levelId.value 
    }
    
    if (keyword.value) queryParams.keyword = keyword.value


    const res = await request.get('/api/resource/medical/hospitals', queryParams)

    
    const apiData = res.data || {} // 这里取 ApiResponse 中的 data 字段
    const list = apiData.list || []
    
    hospitals.value.push(...list)

    if (list.length < 10) {
      loadStatus.value = 'nomore'
    } else {
      loadStatus.value = 'loadmore'
      page.value++
    }
  } catch (e) {
    console.error('加载医院列表失败', e)
    loadStatus.value = 'loadmore'
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}
const loadMore = () => loadList()
const handleSearch = () => loadList(true)
const handleClear = () => {
  keyword.value = ''
  loadList(true)
}

const resetFilters = () => {
  keyword.value = ''
  regionValue.value = {}
  levelId.value = null
  loadList(true)
}

const onRegionChange = (value: RegionValue) => {
  loadList(true)
}

const onLevelConfirm = (e: any) => {
  // u-picker confirm 事件返回的结构通常是 { value: [selectedItem] }
  const selectedItem = e.value ? e.value[0] : e[0]
  levelId.value = selectedItem.value
  showLevelPicker.value = false
  loadList(true)
}

const open = (item: any) => {
  uni.navigateTo({ url: `/pages/resource/medical/HospitalDetail?id=${item.id}` })
}

const handleDownload = (type: string) => {
  uni.showToast({ title: '下载功能开发中', icon: 'none' })
}

onMounted(() => loadList())
</script>

<!-- template 和 style 部分保持不变 -->
<template>
  <view class="list-container">
    <!-- 搜索与筛选 -->
    <view class="filter-area">
      <u-search 
        v-model="keyword" 
        placeholder="搜索医院名称" 
        shape="round"
        @search="handleSearch"
        @clear="handleClear"
      ></u-search>
      
      <view class="filter-row">
        <!-- 使用 RegionPicker 组件 -->
        <RegionPicker 
          v-model="regionValue" 
          placeholder="全部地区"
          @change="onRegionChange"
        >
          <!-- 自定义触发器样式，保持与原 u-button 一致 -->
          <template #default>
            <view class="custom-filter-btn">
              {{ regionLabel }} <u-icon name="arrow-down" size="12"></u-icon>
            </view>
          </template>
        </RegionPicker>

        <u-button size="mini" plain @click="showLevelPicker = true">
          {{ levelLabel }} <u-icon name="arrow-down" size="12"></u-icon>
        </u-button>
        <u-button size="mini" plain @click="resetFilters">重置</u-button>
      </view>
    </view>

    <!-- 等级 Picker -->
    <u-picker 
      :show="showLevelPicker" 
      :columns="[levelOptions]" 
      keyName="text" 
      bgColor="#ffffff"
      @confirm="onLevelConfirm" 
      @close="showLevelPicker = false" 
    />

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
            <u-tag :text="item.levelName" type="primary" size="mini"></u-tag>
          </view>
          
          <view class="card-info">
            <view class="info-row">
              <u-icon name="map" size="14" color="#9ca3af"></u-icon>
              <text class="info-text">{{ item.address }}</text>
            </view>
            <view class="info-row">
              <u-icon name="phone" size="14" color="#9ca3af"></u-icon>
              <text class="info-text">{{ item.phone || '暂无电话' }}</text>
            </view>
          </view>

          <view class="card-footer">
            <u-button size="mini" type="primary" plain @click.stop="handleDownload('excel')">导出名录</u-button>
          </view>
        </view>

        <u-loadmore :status="loadStatus" @loadmore="loadMore" />
        <u-empty v-if="!loading && hospitals.length === 0" mode="data" text="暂无医院数据" />
        <view class="bottom-spacer"></view>
      </view>
    </scroll-view>
  </view>
</template>

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

.filter-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  align-items: center;
}

.custom-filter-btn {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  height: 24px;
  min-width: 60px;
  line-height: 1;
  background-color: #ffffff !important;
  opacity: 1 !important;
  color: #303133 !important;
  font-size: 12px;
  border: 1px solid #dcdfe6 !important;
  border-radius: 4px;
  white-space: nowrap;
  box-sizing: border-box;
  cursor: pointer;
}

.custom-filter-btn :deep(.u-icon) {
  color: #909399 !important;
  margin-left: 4px;
  display: inline-flex;
  align-items: center;
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
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.hosp-name {
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
}

.card-info {
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.info-text {
  font-size: 13px;
  color: #6b7280;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.bottom-spacer {
  height: 20px;
}
</style> 



