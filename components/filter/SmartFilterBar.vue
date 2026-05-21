<template>
  <view class="smart-filter-bar">
    <!-- 动态生成筛选按钮 -->
    <view 
      v-for="config in configs" 
      :key="config.key" 
      class="filter-item"
      @click="openPopup"
    >
      <text class="filter-text" :class="{ 'active-text': hasValue(config.key) }">
        {{ getDisplayText(config) }}
      </text>
      <u-icon name="arrow-down" size="12" :color="hasValue(config.key) ? '#2979ff' : '#909399'" />
    </view>

    <!-- 统一的智能筛选弹窗 -->
    <SmartFilterPopup
      v-model:show="showPopup"
      v-model="tempParams"
      :configs="configs"
      @confirm="handleConfirm"
      @reset="handleReset"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SmartFilterPopup from './SmartFilterPopup.vue'
import type { FilterConfigItem, FilterParamsMap } from '@/types/filter'

const props = defineProps<{
  configs: FilterConfigItem[]
  modelValue: FilterParamsMap
}>()

const emit = defineEmits(['update:modelValue', 'change', 'reset'])

const showPopup = ref(false)
const tempParams = ref<FilterParamsMap>({})

// 打开弹窗时，深拷贝当前值到临时变量，防止编辑过程中直接影响页面状态
const openPopup = () => {
  tempParams.value = JSON.parse(JSON.stringify(props.modelValue || {}))
  
  // 确保复杂对象类型有初始结构，防止组件报错
  props.configs.forEach(c => {
    if (c.type === 'region' && !tempParams.value[c.key]) {
      tempParams.value[c.key] = {}
    }
    if (c.type === 'hospital' && !tempParams.value[c.key]) {
      tempParams.value[c.key] = {}
    }
  })
  
  showPopup.value = true
}

// components/filter/SmartFilterBar.vue script 部分修改

// components/filter/SmartFilterBar.vue script 部分

// 判断某个筛选项是否有有效值
const hasValue = (key: string) => {
  const val = props.modelValue[key]
  if (!val) return false
  
  const config = props.configs.find(c => c.key === key)
  if (!config) return false

  if (config.type === 'region') {
    return !!(val.provinceCode || val.cityCode || val.districtCode)
  }
  // 新增省市判断
  if (config.type === 'provinceCity') {
    return !!(val.provinceCode || val.cityCode)
  }
  if (config.type === 'hospital') {
    return !!(val.hospitalId)
  }
  if (config.type === 'disease') {
    return !!(val.diseaseId)
  }
  if (config.type === 'tags') {
    return val !== '' && val !== null && val !== undefined && val !== 'all'
  }
  return false
}

// 获取按钮显示的文本
const getDisplayText = (config: FilterConfigItem) => {
  const val = props.modelValue[config.key]
  
  // 1. 地区类型 (三级)
  if (config.type === 'region') {
    if (!val) return config.label
    return val.districtName || val.cityName || val.provinceName || config.label
  }

  // 2. 省市类型 (二级) - 新增
  if (config.type === 'provinceCity') {
    if (!val) return config.label
    // 优先显示城市，如果没有城市则显示省份
    return val.cityName || val.provinceName || config.label
  }
  
  // 3. 医院类型
  if (config.type === 'hospital') {
    return val?.hospitalName || config.label
  }

  // 4. 疾病类型
  if (config.type === 'disease') {
    return val?.diseaseName || config.label
  }
  
  // 5. 标签类型
  if (config.type === 'tags') {
    if (!val || val === 'all') return config.label
    const option = config.options?.find((opt) => opt.value === val)
    return option ? option.label : config.label
  }
  
  return config.label
}


// 确认筛选
const handleConfirm = (val: FilterParamsMap) => {
  // 更新父组件的 v-model
  emit('update:modelValue', val)
  // 触发 change 事件，通知父组件重新加载数据
  emit('change')
}

// 重置筛选
const handleReset = () => {
  // 这里可以选择是否立即清空父组件状态，或者由父组件监听 reset 事件自行处理
  // 通常 SmartFilterPopup 内部已经清空了 tempParams，我们这里 emit reset 让父组件知道用户点了重置
  emit('reset')
}
</script>

<style scoped lang="scss">
.smart-filter-bar {
  display: flex;
  gap: 12rpx;
  margin-top: 8px;
  width: 100%;
}

.filter-item {
  flex: 1;
  height: 56rpx;
  padding: 0 12rpx;
  box-sizing: border-box;
  background: #fff;
  border: 1rpx solid #dcdfe6;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0; // 防止文字溢出撑开
  
  &:active {
    background-color: #f5f7fa;
  }
}

.filter-text {
  max-width: 120rpx;
  font-size: 24rpx;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 6rpx;
}

.active-text {
  color: #2979ff;
  font-weight: 500;
}
</style>