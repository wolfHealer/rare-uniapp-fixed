<template>
  <view class="container">
    <!-- 顶部搜索框 -->
    <u-search 
      v-model="keyword" 
      placeholder="搜索医生姓名或医院" 
      shape="round"
      clearable
      @search="handleSearch"
      @clear="handleClear"
    ></u-search>

    <!-- 智能筛选栏 -->
    <view class="filter-area">
      <SmartFilterBar
        :configs="doctorConfigs"
        v-model="filterParams"
        @change="handleFilterChange"
        @reset="handleFilterReset"
      />
    </view>

    <!-- 下载按钮 -->
    <view class="download-row">
      <u-button size="mini" type="primary" @click="handleDownload('excel')">
        <u-icon name="download" size="14"></u-icon>
        <text class="ml-1">下载医生名录</text>
      </u-button>
      <u-button size="mini" plain @click="handleDownload('pdf')">
        <u-icon name="download" size="14"></u-icon>
        <text class="ml-1">下载医院名录</text>
      </u-button>
    </view>

    <!-- 列表区域 -->
    <scroll-view scroll-y class="list-container" @scrolltolower="loadMore">
      <view
        v-for="item in list"
        :key="item.id"
        class="card-item"
        @click="open(item)"
      >
        <view class="card-header">
          <view class="card-info">
            <text class="name">{{ item.name }}</text>
            <text class="sub-info">
              <!-- 由于接口只返回医生，简化判断，直接显示医生信息 -->
              <text v-if="item.hospital">{{ item.hospital }}</text>
              <text v-if="item.department" class="dot">·</text>
              <text v-if="item.department">{{ item.department }}</text>
              <text v-if="item.title" class="dot">·</text>
              <text v-if="item.title">{{ item.title }}</text>
            </text>
            <!-- 使用 goodAt 替换 specialty -->
            <text class="specialty">擅长：{{ item.goodAt }}</text>
            
            <!-- 使用 isRareNetwork 替换 isNetworkMember -->
            <u-tag 
              type="success" 
              size="mini" 
              class="mt-1" 
              v-if="item.isRareNetwork"
            >
              协作网成员
            </u-tag>
          </view>
          <!-- 固定显示为医生，因为这是医生列表接口 -->
          <u-tag type="primary" size="mini">
            医生
          </u-tag>
        </view>

        <!-- 使用 rating 和 reviewCount -->
        <view class="rating-box" v-if="item.rating">
          <u-icon name="star-fill" color="#ff976a" size="12"></u-icon>
          <text class="rating-text">{{ item.rating }} 分 ({{ item.reviewCount }} 条评价)</text>
        </view>
      </view>

      <u-empty v-if="!loading && list.length === 0" text="暂无医生数据"></u-empty>
      <view v-if="loading" class="loading-box">
        <u-loading-icon mode="circle"></u-loading-icon>
        <text class="loading-text">加载中...</text>
      </view>
      <text class="total-text" v-if="total > 0">共 {{ total }} 条记录</text>
      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { medicalApi } from '@/api/medical'
import { usePagedList } from '@/composables/usePagedList'
import SmartFilterBar from '@/components/filter/SmartFilterBar.vue'
import { downloadAndSaveFile } from '@/utils/download'
import type { FilterConfigItem } from '@/types/filter'
import type { DoctorListItem, DoctorFilterParams, DoctorListQuery } from '@/types/medical'

const keyword = ref('')
const total = ref(0)
const filterParams = ref<DoctorFilterParams>({
  disease: {},     // 疾病对象 { diseaseId, diseaseName }
  hospital: {},    // 医院对象 { hospitalId, hospitalName }
  title: ''        // 医生职称/等级
})

// --- 3. 筛选配置 (Core Logic) ---
// 【修改点】配置数组：疾病类型改为 'disease'，移除静态 options
const doctorConfigs: FilterConfigItem[] = [
  {
    key: 'disease',
    label: '疾病',
    type: 'disease' // 使用 DiseasePicker 组件
  },
  {
    key: 'hospital',
    label: '医院',
    type: 'hospital'
  },
  {
    key: 'title',
    label: '职称',
    type: 'tags',
    options: [
      { label: '全部', value: '' },
      { label: '主任医师', value: '主任医师' },
      { label: '副主任医师', value: '副主任医师' },
      { label: '主治医师', value: '主治医师' },
      { label: '住院医师', value: '住院医师' }
    ]
  }
]

const buildQueryParams = (page: number, pageSize: number): DoctorListQuery => {
  const queryParams: DoctorListQuery = { keyword: keyword.value, page, pageSize }
  const diseaseVal = filterParams.value.disease || {}
  if (diseaseVal.diseaseId) queryParams.diseaseId = diseaseVal.diseaseId
  const hospital = filterParams.value.hospital || {}
  if (hospital.hospitalId) queryParams.hospitalId = hospital.hospitalId
  if (filterParams.value.title) queryParams.title = filterParams.value.title
  return queryParams
}

const { list, loading, loadStatus, refresh, onLoadMore } = usePagedList<DoctorListItem>({
  pageSize: 20,
  fetchPage: async (page, pageSize) => {
    const res = await medicalApi.listDoctors(buildQueryParams(page, pageSize))
    const records = res.data?.list || []
    total.value = res.data?.total || 0
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
  filterParams.value = { disease: {}, hospital: {}, title: '' }
  refresh()
}

const open = (item: DoctorListItem) => {
  // 跳转到详情页
  const path = `/pages/resource/medical/DoctorDetail?id=${item.id}`
    
  uni.navigateTo({
    url: path,
    fail: (err) => {
      console.error('跳转详情失败:', err)
      uni.showToast({ title: '页面跳转失败', icon: 'none' })
    }
  })
}

const handleDownload = () => {
  const params: Record<string, unknown> = {}
  if (keyword.value) params.keyword = keyword.value
  const diseaseVal = filterParams.value.disease || {}
  if (diseaseVal.diseaseId) params.diseaseId = diseaseVal.diseaseId
  const hospital = filterParams.value.hospital || {}
  if (hospital.hospitalId) params.hospitalId = hospital.hospitalId
  if (filterParams.value.title) params.title = filterParams.value.title
  downloadAndSaveFile('/api/resource/medical/directory/export/doctors', params)
}

onMounted(() => refresh())
</script>

<style scoped lang="scss">
/* 样式保持不变 */
.container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
}

.filter-area {
  margin-top: 20rpx;
  background: #fff;
  padding: 10rpx 0;
  border-radius: 8rpx;
}

.download-row {
  display: flex;
  gap: 16rpx;
  margin-top: 20rpx;
}

.list-container {
  flex: 1;
  margin-top: 20rpx;
}

.card-item {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
  
  &:active {
    opacity: 0.8;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-info {
  flex: 1;
  margin-right: 20rpx;
}

.name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.sub-info {
  font-size: 26rpx;
  color: #666;
  margin-top: 10rpx;
  display: block;
}

.dot {
  margin: 0 8rpx;
  color: #999;
}

.specialty {
  font-size: 24rpx;
  color: #1E90FF;
  margin-top: 10rpx;
  display: block;
}

.mt-1 {
  margin-top: 10rpx;
}

.rating-box {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
}

.rating-text {
  font-size: 24rpx;
  color: #999;
  margin-left: 10rpx;
}

.loading-box {
  margin-top: 40rpx;
  display: flex;
  justify-content: center;
}

.total-text {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: #999;
  margin-top: 40rpx;
}

.ml-1 {
  margin-left: 8rpx;
}
</style>