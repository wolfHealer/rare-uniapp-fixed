<template>
  <view class="list-container">
    <!-- 顶部筛选与搜索区 (固定) -->
    <view class="filter-area">
      <!-- 搜索栏 -->
      <u-search 
        v-model="keyword" 
        placeholder="搜索心理机构名称" 
        shape="round"
        @search="handleSearch"
        @clear="handleClear"
        :show-action="false"
      ></u-search>
      
      <!-- 智能筛选栏 -->
      <SmartFilterBar
        :configs="orgConfigs"
        v-model="filterParams"
        @change="handleFilterChange"
        @reset="handleFilterReset"
      />
    </view>

    <!-- 滚动列表区域 -->
    <scroll-view scroll-y class="scroll-content" enable-flex @scrolltolower="loadMore">
      <view class="org-list">
        <!-- 加载状态 -->
        <view v-if="loading && organizations.length === 0" class="loading-state">
          <u-loading-icon mode="circle"></u-loading-icon>
          <text class="loading-text">加载中...</text>
        </view>

        <!-- 机构卡片列表 -->
        <view 
          v-for="item in organizations" 
          :key="item.id" 
          class="org-card"
          @click="openDetail(item)"
        >
          <view class="card-header">
            <text class="org-name">{{ item.name }}</text>
            <u-tag 
              v-if="item.isFree" 
              text="免费" 
              type="success" 
              size="mini" 
              plain
            ></u-tag>
            <u-tag 
              v-else 
              :text="item.typeName || '机构'" 
              type="primary" 
              size="mini" 
              plain
            ></u-tag>
          </view>
          
          <view class="card-info">
            <view class="info-row">
              <u-icon name="map" size="14" color="#9ca3af"></u-icon>
              <!-- 显示地区名称，如果后端返回了 regionName -->
              <text class="info-text">{{ item.regionName || item.region }} · {{ item.address }}</text>
            </view>
            <view class="info-row" v-if="item.contact">
              <u-icon name="phone" size="14" color="#9ca3af"></u-icon>
              <text class="info-text line-clamp-1">{{ item.contact }}</text>
            </view>
             <view class="info-row" v-if="item.serviceTime">
              <u-icon name="clock" size="14" color="#9ca3af"></u-icon>
              <text class="info-text">{{ item.serviceTime }}</text>
            </view>
          </view>

          <view class="card-desc line-clamp-2" v-if="item.description">
            {{ item.description }}
          </view>

          <view class="card-footer">
            <u-button size="mini" type="primary" plain @click.stop="contactOrg(item)">
              联系咨询
            </u-button>
          </view>
        </view>

        <!-- 加载更多 -->
        <u-loadmore :status="loadStatus" @loadmore="loadMore" />
        
        <!-- 空状态 -->
        <u-empty v-if="!loading && organizations.length === 0" mode="data" text="暂无心理咨询机构" />
        
        <!-- 底部占位 -->
        <view class="bottom-spacer"></view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
// 引入智能筛选组件
import SmartFilterBar from '@/components/filter/SmartFilterBar.vue'
import type { FilterConfigItem } from '@/types/filter'

// --- 类型定义 ---
interface OrganizationItem {
  id: number
  name: string
  type: string
  typeName: string
  region: string // 可能是 Code
  regionName?: string // 可能是名称
  address: string
  contact: string
  phone: string
  isFree: boolean
  serviceTime: string
  description: string
  rating: number
  status: string
  consultWay?: string // 假设后端有咨询方式字段
  [key: string]: any
}

// --- 响应式数据 ---
const keyword = ref('')
const organizations = ref<OrganizationItem[]>([])
const loading = ref(false)
const loadStatus = ref<'loading' | 'loadmore' | 'nomore'>('loadmore')
const page = ref(1)
const pageSize = ref(10)

// 筛选参数状态
const filterParams = ref<Record<string, any>>({
  region: {},      // 地区对象 { provinceCode, ... }
  isFree: '',      // 是否免费: ''(全部), 'true', 'false'
  consultWay: '' // 咨询方式: ''(全部), 'online', 'offline', 'phone'
})

// --- 筛选配置 (Core Logic) ---
const orgConfigs: FilterConfigItem[] = [
  {
    key: 'region',
    label: '地区',
    type: 'region' // 使用 RegionPicker
  },
  {
    key: 'isFree',
    label: '费用',
    type: 'tags',
    options: [
      { label: '全部', value: '' },
      { label: '免费', value: 'true' },
      { label: '收费', value: 'false' }
    ]
  },
  {
    key: 'consultWay',
    label: '咨询方式',
    type: 'tags',
    options: [
      { label: '全部', value: '' },
      { label: '线上', value: 'online' },
      { label: '线下', value: 'offline' },
      { label: '线下&线下', value: 'both' }
    ]
  }
]

// --- 业务逻辑 ---

const fetchOrganizations = async (isRefresh = false) => {
  if (isRefresh) {
    page.value = 1
    organizations.value = []
    loadStatus.value = 'loading'
  }
  
  if (loadStatus.value === 'nomore' && !isRefresh) return

  loading.value = true
  try {
    const params: any = { 
      page: page.value, 
      pageSize: pageSize.value 
    }
    
    // 1. 关键词
    if (keyword.value) params.keyword = keyword.value

    // 2. 地区映射
    // 处理地区筛选
    const regionData = filterParams.value.region || {}
    if (regionData.provinceCode) params.provinceCode = regionData.provinceCode
    if (regionData.cityCode) params.cityCode = regionData.cityCode
    if (regionData.districtCode) params.districtCode = regionData.districtCode
    
    
    // 3. 是否免费映射
    if (filterParams.value.isFree) {
      params.isFree = filterParams.value.isFree
    }

    // 4. 咨询方式映射
    if (filterParams.value.consultWay) {
      params.consultWay = filterParams.value.consultWay
    }

    const res = await request.get('/api/resource/rehab/psychological/orgs', params)
    
 const responseData = res.data || {}
    const list = responseData.list || []
    
    organizations.value.push(...list)
    
    // 判断是否还有更多数据
    if (list.length < pageSize.value) {
      loadStatus.value = 'nomore'
    } else {
      loadStatus.value = 'loadmore'
      page.value++
    }
  } catch (error) {
    console.error('获取机构列表失败:', error)
    loadStatus.value = 'loadmore'
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 事件处理
const loadMore = () => fetchOrganizations()

const handleSearch = () => fetchOrganizations(true)

const handleClear = () => {
  keyword.value = ''
  fetchOrganizations(true)
}

// 当 SmartFilterBar 触发 change 事件
const handleFilterChange = () => {
  fetchOrganizations(true)
}

// 当 SmartFilterBar 触发 reset 事件
const handleFilterReset = () => {
  filterParams.value = {
    region: {},
    isFree: '',
    consultWay: ''
  }
  fetchOrganizations(true)
}

const openDetail = (item: OrganizationItem) => {
  if (!item?.id) return
  uni.navigateTo({
    url: `/pages/resource/rehab/PsychologicalOrgDetail?id=${item.id}`
  })
}

const contactOrg = (item: OrganizationItem) => {
  if (item.phone) {
    uni.makePhoneCall({ phoneNumber: item.phone })
  } else if (item.contact) {
    uni.setClipboardData({
      data: item.contact,
      success: () => uni.showToast({ title: '联系方式已复制', icon: 'success' })
    })
  } else {
    uni.showToast({ title: '暂无联系方式', icon: 'none' })
  }
}

onMounted(() => {
  fetchOrganizations()
})
</script>

<style scoped lang="scss">
/* 容器布局：Flex 列，占满全屏 */
.list-container {
  height: 100vh; /* 或者 100% 如果父容器有高度 */
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

.org-list {
  padding: 16px;
}

/* 卡片样式 */
.org-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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

.org-name {
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
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 6px;
}

.info-text {
  font-size: 13px;
  color: #6b7280;
  flex: 1;
}

.line-clamp-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-desc {
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 12px;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f3f4f6;
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