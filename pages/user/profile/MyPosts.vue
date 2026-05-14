<template>
  <view class="page-container">
    <text class="page-title">我的发布</text>
    
    <view v-if="posts.length === 0" class="empty-box">
      <u-empty mode="data" text="暂无发布内容"></u-empty>
    </view>
    
    <view v-else class="list-box">
      <view
        v-for="(post, index) in posts"
        :key="index"
        class="post-card"
      >
        <text class="post-title">{{ post.title }}</text>
        <text class="post-content">{{ post.content }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 模拟发布数据
const posts = ref([
  { title: '我的第一篇动态', content: '这是我发布的第一个动态...' },
  { title: '我的第二篇动态', content: '继续分享生活点滴...' }
])
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #eff6ff; /* blue-50 */
  padding: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 24px;
  display: block;
}

.empty-box {
  padding: 40px 0;
}

.list-box {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 16px;
  border: 1px solid #bfdbfe; /* blue-200 */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.post-title {
  font-size: 16px;
  font-weight: 600;
  color: #1d4ed8; /* blue-700 */
  display: block;
}

.post-content {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
  display: block;
}
</style>