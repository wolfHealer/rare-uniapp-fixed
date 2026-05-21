<!-- components/filter/SmartFilterPopup.vue -->
<template>
  <u-popup :show="show" mode="bottom" round="20" @close="handleClose">
    <view class="popup-wrap">
      <view class="popup-header"><text class="popup-title">筛选</text></view>
      
      <scroll-view scroll-y class="popup-content">
        <view v-for="config in configs" :key="config.key" class="section">
          <view class="section-title">{{ config.label }}</view>
          
          <!-- 1. 地区选择 (三级) -->
          <RegionPicker 
            v-if="config.type === 'region'" 
            v-model="formData[config.key]" 
            :placeholder="config.placeholder"
          />

          <!-- 2. 省市选择 (二级) -->
          <ProvinceCityPicker
            v-else-if="config.type === 'provinceCity'"
            v-model="formData[config.key]"
            :placeholder="config.placeholder"
          />
          
          <!-- 3. 医院搜索选择 -->
          <HospitalPicker 
            v-else-if="config.type === 'hospital'" 
            v-model="formData[config.key]" 
          />

          <!-- 4. 疾病搜索选择 -->
          <DiseasePicker
            v-else-if="config.type === 'disease'"
            v-model="formData[config.key]"
          />
          
          <!-- 5. 通用标签选择 -->
          <TagPicker 
            v-else-if="config.type === 'tags'"
            v-model="formData[config.key]"
            :options="config.options || []"
          />
        </view>
      </scroll-view>

      <view class="popup-footer">
        <u-button text="重置" shape="circle" color="#f3f4f6" customStyle="color:#606266" @click="handleReset" />
        <u-button text="确定" type="primary" shape="circle" @click="handleConfirm" />
      </view>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import RegionPicker from '@/components/RegionPicker.vue'
import ProvinceCityPicker from '@/components/ProvinceCityPicker.vue' // 引入新组件
import HospitalPicker from './modules/HospitalPicker.vue'
import DiseasePicker from './modules/DiseasePicker.vue'
import TagPicker from './modules/TagPicker.vue'
import type { FilterConfigItem, FilterParamsMap } from '@/types/filter'

const props = defineProps<{
  show: boolean
  modelValue: FilterParamsMap
  configs: FilterConfigItem[]
}>()

const emit = defineEmits(['update:show', 'update:modelValue', 'confirm', 'reset'])

const formData = ref<FilterParamsMap>({})

// 初始化表单数据
watch(() => props.show, (val) => {
  if (val) {
    formData.value = JSON.parse(JSON.stringify(props.modelValue || {}))
    props.configs.forEach(c => {
      // 增加 provinceCity 的初始化判断
      if ((c.type === 'region' || c.type === 'provinceCity') && !formData.value[c.key]) {
        formData.value[c.key] = {}
      }
      if (c.type === 'hospital' && !formData.value[c.key]) {
        formData.value[c.key] = {}
      }
      if (c.type === 'disease' && !formData.value[c.key]) {
        formData.value[c.key] = {}
      }
    })
  }
}, { immediate: true })

const handleClose = () => emit('update:show', false)

const handleReset = () => {
  const emptyData: FilterParamsMap = {}
  props.configs.forEach(c => {
    // 增加 provinceCity 的重置逻辑
    if (c.type === 'region' || c.type === 'provinceCity' || c.type === 'hospital' || c.type === 'disease') {
      emptyData[c.key] = {}
    } else {
      emptyData[c.key] = ''
    }
  })
  formData.value = emptyData
  emit('reset')
}

const handleConfirm = () => {
  emit('update:modelValue', formData.value)
  emit('confirm', formData.value)
  emit('update:show', false)
}
</script>

<style scoped lang="scss">
.popup-wrap { height: 78vh; display: flex; flex-direction: column; background: #fff; }
.popup-header { flex-shrink: 0; padding: 28rpx 32rpx 20rpx; text-align: center; border-bottom: 1rpx solid #f3f4f6; }
.popup-title { font-size: 32rpx; font-weight: 600; color: #303133; }
.popup-content { flex: 1; padding: 24rpx 32rpx; box-sizing: border-box; }
.section { margin-bottom: 36rpx; }
.section-title { font-size: 28rpx; font-weight: 600; color: #303133; margin-bottom: 16rpx; }
.popup-footer { flex-shrink: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 24rpx; padding: 20rpx 32rpx calc(20rpx + env(safe-area-inset-bottom)); border-top: 1rpx solid #f3f4f6; background: #fff; }
</style>