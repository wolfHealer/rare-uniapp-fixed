<template>
  <view class="page-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-content">
        <u-icon name="arrow-left" size="20" color="#ffffff" @click="goBack" class="back-icon"></u-icon>
        <!-- 动态显示分类名称 -->
        <text class="nav-title">{{ categoryName }}</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <scroll-view scroll-y class="content-scroll">
      <view class="p-4">
        <text class="section-title">相关病种</text>
        
        <!-- 加载状态 -->
        <view v-if="loading" class="loading-state">
          <u-loading-icon mode="circle"></u-loading-icon>
          <text class="loading-text">加载中...</text>
        </view>

        <!-- 列表数据 -->
        <view v-else-if="diseases.length > 0" class="disease-list">
          <view
            v-for="(disease, index) in diseases"
            :key="disease.id"
            class="disease-card"
            @click="goToDiseaseDetail(disease.id)"
          >
            <text class="disease-name">{{ disease.name }}</text>
            <text class="disease-intro">{{ disease.introduction || '暂无简介' }}</text>
          </view>
        </view>
        
        <!-- 空状态 -->
        <view v-else class="empty-state">
          <u-empty mode="data" text="暂无相关病种数据"></u-empty>
        </view>
      </view>
    </scroll-view>

    <!-- 底部导航栏 -->
    <BottomNav />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import request from '@/utils/request'
import BottomNav from '@/components/BottomNav.vue'

// 当前分类名称 (默认值)
const categoryName = ref('疾病分类')

// 分类下的病种列表
const diseases = ref<{ id: number; name: string; introduction: string }[]>([])

// 当前分类 ID
const categoryId = ref<number>(0)

// 加载状态
const loading = ref(false)

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 跳转到病种详情页
const goToDiseaseDetail = (diseaseId: number) => {
  // 确保路径与 pages.json 一致
  uni.navigateTo({
    url: `/pages/resource/knowledge/DiseaseDetail?id=${diseaseId}`
  })
}

// 加载病种列表
const loadDiseasesByCategory = async (id: number) => {
  loading.value = true
  try {
    // 调用接口
    const response = await request.get(`/api/knowledge/category/${id}/diseases`)
    
    console.log('接口返回原始数据:', response) // 调试用

    // 【关键修改】根据你提供的 JSON 结构解析数据
    if (response.code === 200 && response.data && response.data.list) {
      const list = response.data.list
      
      // 如果接口也返回了分类名，可以更新标题（可选）
      // if (response.data.categoryName) {
      //   categoryName.value = response.data.categoryName
      // }
      
      if (Array.isArray(list)) {
        diseases.value = list.map((item: any) => ({
          id: item.id,
          name: item.name,
          // 优先使用 introduction，如果没有则使用空字符串
          introduction: item.introduction || ''
        }))
        
        console.log('解析后的疾病列表:', diseases.value)
      } else {
        diseases.value = []
      }
    } else {
      uni.showToast({
        title: response.message || '获取数据失败',
        icon: 'none'
      })
      diseases.value = []
    }
  } catch (error) {
    console.error('加载分类病种失败：', error)
    uni.showToast({
      title: '网络异常，请稍后重试',
      icon: 'none'
    })
    diseases.value = []
  } finally {
    loading.value = false
  }
}

// 页面加载时获取参数并加载数据
onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.options || {}
  
  // 1. 获取 ID
  const id = options.id ? parseInt(options.id, 10) : 0
  
  // 2. 获取名称 (用于显示在标题栏)
  if (options.name) {
    categoryName.value = decodeURIComponent(options.name)
  } else if (options.categoryName) {
     categoryName.value = decodeURIComponent(options.categoryName)
  }
  
  if (id > 0) {
    categoryId.value = id
    loadDiseasesByCategory(id)
  } else {
    uni.showToast({
      title: '分类 ID 无效',
      icon: 'none'
    })
  }
})
</script>

<style scoped>
/* 页面容器 */
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
}

/* 顶部导航栏 */
.nav-bar {
  background-color: #2563eb; /* 医疗蓝 */
  padding-top: var(--status-bar-height);
}

.nav-content {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 16px;
}

.back-icon {
  margin-right: 12px;
}

.nav-title {
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
}

/* 滚动内容区 */
.content-scroll {
  flex: 1;
  overflow-y: auto;
}

.p-4 {
  padding: 16px;
}

.section-title {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 16px;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.loading-text {
  margin-top: 8px;
  font-size: 14px;
  color: #6b7280;
}

/* 病种列表 */
.disease-list {
  display: flex;
  flex-direction: column;
}

.disease-card {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.disease-card:last-child {
  margin-bottom: 0;
}

.disease-name {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #1d4ed8;
  margin-bottom: 8px;
}

.disease-intro {
  display: block;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 空状态 */
.empty-state {
  padding: 40px 0;
}
</style>