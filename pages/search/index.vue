<template>
  <view class="search-page">
    <u-search
      v-model="keyword"
      placeholder="搜疾病、症状、医院、医生"
      shape="round"
      show-action
      action-text="搜索"
      @search="onSearch"
      @custom="onSearch"
    />

    <view class="hint-area">
      <u-empty
        v-if="!keyword.trim()"
        mode="search"
        text="输入关键词开始搜索"
      />
      <view v-else class="result-hint">
        <text class="hint-text">关键词「{{ keyword }}」</text>
        <text class="hint-sub">全局搜索能力完善中，可先使用各资源模块内的搜索</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const keyword = ref('')

onLoad((options) => {
  if (options?.keyword) {
    keyword.value = decodeURIComponent(String(options.keyword))
  }
})

const onSearch = () => {
  if (!keyword.value.trim()) {
    uni.showToast({ title: '请输入关键词', icon: 'none' })
  }
}
</script>

<style scoped lang="scss">
.search-page {
  min-height: 100vh;
  padding: 24rpx;
  background-color: #f9fafb;
}

.hint-area {
  margin-top: 48rpx;
}

.result-hint {
  padding: 32rpx;
  background: #fff;
  border-radius: 16rpx;
}

.hint-text {
  display: block;
  font-size: 30rpx;
  color: #1f2937;
  font-weight: 500;
}

.hint-sub {
  display: block;
  margin-top: 16rpx;
  font-size: 26rpx;
  color: #6b7280;
  line-height: 1.5;
}
</style>
