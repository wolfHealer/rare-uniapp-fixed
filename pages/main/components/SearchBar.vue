<template>
  <view class="search-bar-container">
    <u-search
      v-model="searchValue"
      placeholder="搜索病种 / 症状"
      :show-action="false"
      shape="round"
      bg-color="#f9f9f9"
      color="#666"
      placeholder-color="#999"
      @search="handleSearch"
      @custom="handleSearch"
    ></u-search>
    
    <view class="message-icon-wrapper" @click="handleMessageClick">
      <u-icon name="bell" size="22" color="#333"></u-icon>
      <view v-if="unreadCount > 0" class="unread-badge">
        <text class="badge-text">{{ unreadCount > 99 ? '99+' : unreadCount }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  searchValue: string
  unreadCount: number
}

interface Emits {
  (e: 'update:searchValue', value: string): void
  (e: 'message-click'): void
  (e: 'search'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchValue = defineModel<string>('searchValue')

const handleMessageClick = () => {
  emit('message-click')
}

const handleSearch = () => {
  emit('search')
}
</script>

<style scoped lang="scss">
.search-bar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 24rpx 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 99;
}

.message-icon-wrapper {
  position: relative;
  padding: 8rpx;
  margin-left: 24rpx;
}

.unread-badge {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
  background-color: #ff4d4f;
  border-radius: 20rpx;
  min-width: 36rpx;
  height: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-text {
  font-size: 20rpx;
  color: #fff;
  padding: 0 8rpx;
}
</style>