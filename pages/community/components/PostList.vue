<template>
  <view class="post-list-container">
    <PostCard
      v-for="item in list"
      :key="item.id"
      :post="item"
      @comment="onComment"
      @preview-image="onPreviewImage"
    />
    
    <u-loadmore 
      :status="loadStatus" 
      :loading-text="'加载中...'"
      :loadmore-text="'上拉加载更多'"
      :nomore-text="'没有更多了'"
      @loadmore="onLoadMore"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import PostCard from './PostCard.vue'
import { communityApi } from '@/api/community'
import type { CommunityPost, PostCommentEmitPayload } from '@/types/community'

const props = defineProps<{
  diseaseId: number | null
  type: string
  sort: string
}>()

const emit = defineEmits(['comment', 'preview-image'])

const list = ref<CommunityPost[]>([])
const loading = ref(false)
const finished = ref(false)
const loadStatus = ref<'loading' | 'loadmore' | 'nomore'>('loadmore')
let page = 1

// 用于取消重复请求的标记（简单版防抖）
let lastRequestId = 0

const fetchPosts = async (isRefresh = false) => {
  // 每次请求生成一个新ID
  const currentRequestId = ++lastRequestId
  
  if (isRefresh) {
    page = 1
    list.value = []
    finished.value = false
    loadStatus.value = 'loading'
  }
  
  if (finished.value && !isRefresh) return
  if (loading.value) return // 防止并发请求

  loading.value = true
  
  try {
    const res = await communityApi.listPosts({
      disease_id: props.diseaseId,
      type: props.type === 'all' ? undefined : props.type,
      sort: props.sort,
      page,
      limit: 10
    })

    // 检查是否是最新的请求，如果不是则丢弃结果
    if (currentRequestId !== lastRequestId) {
      return
    }

    const records = res.data.list || []
    
    if (isRefresh) {
      list.value = records
    } else {
      list.value.push(...records)
    }
    
    if (records.length < 10) {
      finished.value = true
      loadStatus.value = 'nomore'
    } else {
      loadStatus.value = 'loadmore'
      page++
    }
  } catch (error) {
    console.error('获取动态失败:', error)
    // 只有最新请求出错才更新状态
    if (currentRequestId === lastRequestId) {
      loadStatus.value = 'loadmore' 
    }
  } finally {
    if (currentRequestId === lastRequestId) {
      loading.value = false
    }
  }
}

const resetAndReload = () => {
  // 增加请求ID，使之前的 pending 请求失效
  lastRequestId++
  fetchPosts(true)
}

const onLoadMore = () => {
  if (!finished.value && !loading.value) {
    fetchPosts()
  }
}

const onComment = (data: PostCommentEmitPayload) => {
  emit('comment', data)
}

const onPreviewImage = (url: string) => {
  emit('preview-image', url)
}

// 监听 Props 变化
watch(
  () => [props.diseaseId, props.type, props.sort],
  () => {
    resetAndReload()
  },
  { deep: true }
)

onMounted(() => {
  fetchPosts()
})

defineExpose({
  refresh: () => {
    resetAndReload()
  }
})
</script>

<style scoped>
.post-list-container {
  min-height: 100%;
}
</style>