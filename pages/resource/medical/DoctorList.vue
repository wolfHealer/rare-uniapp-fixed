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
import request from '@/utils/request'
import SmartFilterBar from '@/components/filter/SmartFilterBar.vue'
import type { FilterConfigItem } from '@/types/filter'

// --- 1. 类型定义 ---
// 【修改】更新接口定义以匹配后端返回
interface DirectoryItem {
  id: number
  // type: 'doctor' | 'hospital' // 后端未返回此字段，暂不需要，或在赋值时手动添加
  name: string
  hospital?: string
  department?: string
  title?: string
  goodAt: string       // 原 specialty，对应后端的 goodAt
  region?: string
  level?: string
  address?: string     // 后端未返回 address，但保留了以防万一
  contact?: string     // 原 phone，对应后端的 contact
  rating?: number
  reviewCount?: number
  isRareNetwork?: boolean // 原 isNetworkMember，对应后端的 isRareNetwork
  
  // 其他后端返回但未使用的字段
  auditStatus?: number
  cityCode?: string
  cityName?: string
  clinicTime?: string
  diseaseIds?: number[]
  districtCode?: string
  districtName?: string
  hospitalId?: number
  provinceCode?: string
  provinceName?: string
}

// --- 2. 状态管理 ---
const keyword = ref('')
const list = ref<DirectoryItem[]>([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)

// 【修改点】筛选参数状态：disease 改为对象类型，以适配 DiseasePicker
const filterParams = ref<Record<string, any>>({
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

// --- 4. 数据加载逻辑 ---

const loadList = async (isRefresh = false) => {
  if (isRefresh) {
    page.value = 1
    list.value = []
    loading.value = true
  }
  
  try {
    const queryParams: any = {
      keyword: keyword.value,
      page: page.value,
      pageSize: pageSize.value
    }

    // 1. 疾病筛选 (从对象中取值)
    const diseaseVal = filterParams.value.disease || {}
    if (diseaseVal.diseaseId) {
      queryParams.diseaseId = diseaseVal.diseaseId
    }

    // 2. 医院筛选
    const hospital = filterParams.value.hospital || {}
    if (hospital.hospitalId) {
      queryParams.hospitalId = hospital.hospitalId
    }

    // 3. 职称/等级筛选
    if (filterParams.value.title) {
      queryParams.title = filterParams.value.title
    }

    const res = await request.get('/api/resource/medical/doctors', queryParams)
    
    const apiData = res.data || {}
    // 后端结构: { list: [], total: 5 }
    const newList = apiData.list || []
    const newTotal = apiData.total || 0

    // 【可选】如果后续逻辑强依赖 type 字段，可以在这里补全
    // const processedList = newList.map((item: any) => ({ ...item, type: 'doctor' }))

    if (isRefresh) {
      list.value = newList
    } else {
      list.value = [...list.value, ...newList]
    }
    total.value = newTotal
    
    if (newList.length < pageSize.value) {
      // 没有更多了
    } else {
      page.value++
    }
  } catch (error) {
    console.error('加载名录数据失败:', error)
    uni.showToast({ title: '网络错误', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// --- 5. 事件处理 ---

const loadMore = () => {
  if (!loading.value) loadList()
}

const handleSearch = () => loadList(true)

const handleClear = () => {
  keyword.value = ''
  loadList(true)
}

const handleFilterChange = () => {
  loadList(true)
}

// 【修改点】重置逻辑：disease 重置为空对象
const handleFilterReset = () => {
  filterParams.value = {
    disease: {},
    hospital: {},
    title: ''
  }
  loadList(true)
}

const open = (item: DirectoryItem) => {
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
  const url = '/api/resource/medical/directory/export/doctors'
  
  const params = new URLSearchParams()
  if (keyword.value) params.append('keyword', keyword.value)
  
  // 下载参数映射
  const diseaseVal = filterParams.value.disease || {}
  if (diseaseVal.diseaseId) params.append('diseaseId', String(diseaseVal.diseaseId))
  
  const hospital = filterParams.value.hospital || {}
  if (hospital.hospitalId) params.append('hospitalId', String(hospital.hospitalId))
  
  if (filterParams.value.title) params.append('title', filterParams.value.title)

  const fullUrl = `${url}?${params.toString()}`
  
  uni.showLoading({ title: '下载中...' })
  uni.downloadFile({
    url: fullUrl,
    success: (res) => {
      if (res.statusCode === 200) {
        uni.saveFile({
          tempFilePath: res.tempFilePath,
          success: (saveRes) => {
            uni.hideLoading()
            uni.showToast({ title: '下载成功', icon: 'none' })
          },
          fail: () => {
             uni.hideLoading()
             uni.showToast({ title: '保存失败', icon: 'none' })
          }
        })
      } else {
        uni.hideLoading()
        uni.showToast({ title: '下载失败', icon: 'none' })
      }
    },
    fail: () => {
      uni.hideLoading()
      uni.showToast({ title: '网络错误', icon: 'none' })
    }
  })
}

onMounted(() => {
  // 移除 loadDiseaseOptions，因为 DiseasePicker 内部会处理搜索
  loadList()
})
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