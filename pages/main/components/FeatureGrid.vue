<template>
  <view class="feature-grid">
    <view
      v-for="(item, index) in features"
      :key="index"
      class="feature-item"
      @click="handleClick(item.path)"
    >
      <view class="feature-icon-wrapper">
        <!-- 如果需要 u-icon，可以取消注释下面这行，并修改 getIconName -->
        <!-- <u-icon :name="getIconName(item.icon)" size="24" color="#3b82f6"></u-icon> -->
        <text class="feature-icon">{{ getIconEmoji(item.icon) }}</text>
      </view>
      <text class="feature-title">{{ item.title }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { FeatureItem } from '../composables/useHome'

interface Props {
  features: FeatureItem[]
}

interface Emits {
  (e: 'feature-click', path: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const getIconEmoji = (icon: string) => {
  const iconMap: Record<string, string> = {
    'notes-o': '📝',
    'friends-o': '👥',
    'question-o': '❓',
    'down': '📥'
  }
  return iconMap[icon] || '📌'
}


const handleClick = (path: string) => {
  emit('feature-click', path)
}
</script>

<style scoped lang="scss">
.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32rpx;
  padding: 32rpx;
  background-color: #f9fafb;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.feature-icon-wrapper {
  width: 96rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e6f3ff;
  border-radius: 50%;
  margin-bottom: 16rpx;
}

.feature-icon {
  font-size: 48rpx;
}

.feature-title {
  font-size: 28rpx;
  color: #333;
}
</style>