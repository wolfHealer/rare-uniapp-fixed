<template>
  <view class="community-page">
    <!-- 顶部智能筛选栏 -->
    <view class="filter-bar">
      <SmartFilterBar
        :configs="communityConfigs"
        v-model="filterParams"
        @change="handleFilterChange"
        @reset="handleFilterReset"
      />
    </view>

    <!-- 动态列表区域 -->
    <scroll-view 
      scroll-y 
      class="post-list-scroll" 
      enable-back-to-top
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <view class="p-4">
        <!-- 
          注意：这里直接绑定响应式变量。
          当 filterParams 变化时，我们通过计算属性或直接赋值更新下面的变量，
          PostList 监听到 Props 变化会自动重新加载。
        -->
        <PostList
          ref="postListRef"
          :category-id="categoryId"
          :disease-id="diseaseId"
          :type="type"
          :sort="sort"
          @comment="handleComment"
        />
      </view>
    </scroll-view>

    <!-- 右下角悬浮发帖按钮 -->
    <view class="fab-post-btn" @click="goToPost">
      <u-icon name="plus" color="#fff" size="24"></u-icon>
    </view>
    
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import PostList from './components/PostList.vue'
import { useUserStore } from '@/stores/modules/user'
// 引入智能筛选组件
import SmartFilterBar from '@/components/filter/SmartFilterBar.vue'
import type { FilterConfigItem } from '@/types/filter'
import type {
  CommunityFilterParams,
  PostCommentEmitPayload,
  PostListExpose
} from '@/types/community'

const userStore = useUserStore()
const postListRef = ref<PostListExpose | null>(null)
const refreshing = ref(false)

// --- 原有业务状态 ---
const categoryId = ref<number | null>(null)
const diseaseId = ref<number | null>(null)
const type = ref<string>('all')
const sort = ref<string>('latest')

// --- 智能筛选状态 ---
const filterParams = ref<CommunityFilterParams>({
  disease: {},      
  postType: 'all',  
  sortOrder: 'latest' 
})

// --- 筛选配置 ---
const typeOptions = [
  { label: '全部类型', value: 'all' },
  { label: '求助', value: 'help' },
  { label: '经验', value: 'experience' },
  { label: '情绪', value: 'emotion' }
]

const sortOptions = [
  { label: '最新', value: 'latest' },
  { label: '热门', value: 'hot' }
]

const communityConfigs: FilterConfigItem[] = [
  {
    key: 'disease',
    label: '疾病',
    type: 'disease' 
  },
  {
    key: 'postType',
    label: '类型',
    type: 'tags',
    options: typeOptions
  },
  {
    key: 'sortOrder',
    label: '排序',
    type: 'tags',
    options: sortOptions
  }
]

// --- 核心修改：使用 Watch 同步状态，但不手动调用 refresh ---
// 当 filterParams 变化时，更新本地的 diseaseId, type, sort
// PostList 组件内部 watch 了这些 Props，会自动触发重新加载
watch(
  () => filterParams.value,
  (newVal) => {
    // 1. 同步疾病 ID
    const diseaseVal = newVal.disease || {}
    diseaseId.value = diseaseVal.diseaseId ? Number(diseaseVal.diseaseId) : null
    
    // 2. 同步类型
    if (newVal.postType) {
      type.value = newVal.postType
    }
    
    // 3. 同步排序
    if (newVal.sortOrder) {
      sort.value = newVal.sortOrder
    }
    
    // 【重要】不要在这里调用 postListRef.value.refresh()
    // 因为改变 diseaseId/type/sort 会触发 PostList 内部的 watch，从而自动刷新
    // 手动调用会导致双重刷新
  },
  { deep: true }
)

const handleFilterChange = () => {
  // 空实现，逻辑已在 watch 中处理
}

const handleFilterReset = () => {
  // 空实现，逻辑已在 watch 中处理
}

const handleComment = async (data: PostCommentEmitPayload) => {
  console.log('接收到评论事件:', data)
  if (data.newComment) {
    uni.showToast({
      title: '评论成功',
      icon: 'success'
    })
  }
}

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true
  if (postListRef.value) {
    await postListRef.value.refresh()
  }
  refreshing.value = false
  uni.stopPullDownRefresh()
}

onPullDownRefresh(() => {
  onRefresh()
})

const goToPost = () => {
  if (!userStore.isLoggedIn()) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/user/login/Login' })
    }, 1500)
    return
  }
  uni.navigateTo({ url: '/pages/community/PostEdit' })
}

onMounted(() => {
  // 初始化
})
</script>

<style scoped>
/* 样式保持不变 */
.community-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9fafb;
  position: relative;
}

.filter-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 10px 16px;
}

.post-list-scroll {
  flex: 1;
  height: 0;
}

.p-4 {
  padding: 16px;
}

.fab-post-btn {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 56px;
  height: 56px;
  background-color: #2563eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
  z-index: 99;
  transition: all 0.2s ease;
}

.fab-post-btn:active {
  transform: scale(0.95);
  background-color: #1d4ed8;
}
</style>