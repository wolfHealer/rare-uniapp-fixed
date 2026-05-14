<template>
  <view class="page-container">
    <text class="page-title">我的收藏</text>
    
    <view v-if="favorites.length === 0" class="empty-box">
      <u-empty mode="data" text="暂无收藏内容"></u-empty>
    </view>
    
    <view v-else class="list-box">
      <view
        v-for="(item, index) in favorites"
        :key="index"
        class="item-card"
      >
        <text class="item-title">{{ item.title }}</text>
        <text class="item-desc">{{ item.description }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 模拟收藏数据
const favorites = ref([
  { title: '收藏的文章1', description: '这是一篇很棒的文章...' },
  { title: '收藏的文章2', description: '值得反复阅读的内容...' }
])
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #eff6ff;
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

.item-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 16px;
  border: 1px solid #bfdbfe;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.item-title {
  font-size: 16px;
  font-weight: 600;
  color: #1d4ed8;
  display: block;
}

.item-desc {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
  display: block;
}
</style>