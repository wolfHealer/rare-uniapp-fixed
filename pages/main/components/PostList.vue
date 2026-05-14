<template>
  <view class="post-list-container">
    <scroll-view
      scroll-y
      class="scroll-view"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="handleRefresh"
      @scrolltolower="handleLoadMore"
    >
      <view v-for="(post, index) in posts" :key="index" class="post-item">
        <view class="post-header">
          <image
            :src="post.avatar || '/static/default-avatar.png'"
            class="avatar"
            mode="aspectFill"
          />
          <view class="post-info">
            <text class="author">{{ post.author }}</text>
            <text class="time">{{ post.time }}</text>
          </view>
        </view>
        <text class="content">{{ post.content }}</text>
      </view>
      
      <!-- 使用 u-loadmore 替换简单文本 -->
      <u-loadmore 
        :status="loading ? 'loading' : (finished ? 'nomore' : 'loadmore')" 
        :loading-text="'加载中...'"
        :loadmore-text="'上拉加载更多'"
        :nomore-text="'没有更多了'"
        @loadmore="handleLoadMore"
      />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import type { PostItem } from '../composables/useHome'

interface Props {
  posts: PostItem[]
  loading: boolean
  finished: boolean
  refreshing: boolean
}

interface Emits {
  (e: 'refresh'): void
  (e: 'load-more'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleRefresh = () => {
  emit('refresh')
}

const handleLoadMore = () => {
  if (!props.loading && !props.finished) {
    emit('load-more')
  }
}
</script>

<style scoped lang="scss">
.post-list-container {
  flex: 1;
  overflow: hidden;
  padding: 32rpx;
}

.scroll-view {
  height: 100%;
}

.post-item {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 24rpx;
}

.post-info {
  display: flex;
  flex-direction: column;
}

.author {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.time {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}
</style>