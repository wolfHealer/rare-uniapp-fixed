<!-- components/filter/modules/TagPicker.vue -->
<template>
  <view class="tag-picker">
    <view class="tag-list">
      <view
        v-for="opt in options"
        :key="opt.value"
        class="tag-item"
        :class="{ active: modelValue === opt.value }"
        @click="$emit('update:modelValue', opt.value)"
      >
        {{ opt.label }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { FilterOption } from '@/types/filter'

defineProps<{
  modelValue: any
  options: FilterOption[]
}>()
defineEmits(['update:modelValue'])
</script>

<style scoped lang="scss">
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.tag-item {
  padding: 14rpx 24rpx;
  background: #f5f7fa;
  border-radius: 999rpx;
  font-size: 26rpx;
  color: #606266;
}
.tag-item.active {
  background: #e8f3ff;
  color: #2979ff;
}
</style>