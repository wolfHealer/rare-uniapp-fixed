<template>
  <view class="post-card" @click="goToDetail">
    <!-- 用户信息头部 -->
    <view class="card-header">
      <u-avatar :src="post.avatar || '/static/default-avatar.png'" size="60"></u-avatar>
      <view class="user-info">
        <text class="username">{{ post.display_name || '匿名病友' }}</text>
        <text class="time">{{ post.created_at }}</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="card-content">
      <text class="title" v-if="post.title">{{ post.title }}</text>
      <text class="content">{{ truncatedContent }}</text>
      
      <!-- 图片网格 -->
      <view v-if="post.images && post.images.length" class="image-grid">
        <image 
          v-for="(img, index) in post.images.slice(0, 3)" 
          :key="index" 
          :src="img" 
          mode="aspectFill" 
          class="post-image"
          @click.stop="previewImage(img)"
        />
      </view>
    </view>

    <!-- 底部互动栏 (点赞、收藏、评论) -->
    <view class="card-footer" @click.stop>
      <view class="action-item" @click="handleLike">
        <u-icon :name="post.is_liked ? 'heart-fill' : 'heart'" :color="post.is_liked ? '#ff4d4f' : '#909399'" size="18"></u-icon>
        <text class="action-text">{{ post.like_count || 0 }}</text>
      </view>
      
      <view class="action-item" @click="handleCollect">
        <!-- 假设后端有 is_collected 字段 -->
        <u-icon :name="post.is_collected ? 'star-fill' : 'star'" :color="post.is_collected ? '#ff9900' : '#909399'" size="18"></u-icon>
        <text class="action-text">{{ post.collect_count || 0 }}</text>
      </view>

      <view class="action-item" @click="goToDetail">
        <u-icon name="chat" color="#909399" size="18"></u-icon>
        <text class="action-text">{{ post.comment_count || 0 }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import request from '@/utils/request'

const props = defineProps<{
  post: any
}>()

const emit = defineEmits(['refresh']) // 通知父组件刷新列表状态

// 截断内容
const truncatedContent = computed(() => {
  const content = props.post.content || ''
  return content.length > 100 ? content.substring(0, 100) + '...' : content
})

const goToDetail = () => {
  uni.navigateTo({
    url: `/pages/community/PostDetail?id=${props.post.id}`
  })
}

const previewImage = (url: string) => {
  uni.previewImage({ urls: [url] })
}

// 点赞逻辑
const handleLike = async () => {
  try {
    // 乐观更新 UI
    const originalState = { 
      liked: props.post.is_liked, 
      count: props.post.like_count 
    }
    props.post.is_liked = !props.post.is_liked
    props.post.like_count += props.post.is_liked ? 1 : -1

    await request.post(`/api/community/posts/${props.post.id}/like`)
  } catch (error) {
    // 失败回滚
    props.post.is_liked = !props.post.is_liked
    props.post.like_count = originalState.count
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

// 收藏逻辑
const handleCollect = async () => {
  try {
    const originalState = { 
      collected: props.post.is_collected, 
      count: props.post.collect_count 
    }
    props.post.is_collected = !props.post.is_collected
    props.post.collect_count += props.post.is_collected ? 1 : -1

    await request.post(`/api/community/posts/${props.post.id}/collect`)
  } catch (error) {
    props.post.is_collected = !props.post.is_collected
    props.post.collect_count = originalState.count
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}
</script>

<style scoped>
.post-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.user-info {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.time {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
  display: block;
}

.content {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  display: block;
  margin-bottom: 10px;
}

.image-grid {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.post-image {
  width: 100px;
  height: 100px;
  border-radius: 6px;
}

.card-footer {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-text {
  font-size: 12px;
  color: #909399;
}
</style>