<template>
  <view
    class="bg-white rounded-xl shadow-sm p-4 text-center active:scale-95"
    @click="$emit('click')"
  >
    <u-icon :name="icon" size="26" class="text-blue-500 mb-2"></u-icon>
    <text class="text-base font-medium text-blue-500">{{ title }}</text>
  </view>
</template>

<script setup lang="ts">
defineEmits(['click'])
defineProps<{ title: string; icon: string }>()
</script>
