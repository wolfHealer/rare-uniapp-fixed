<template>
  <view class="province-city-picker">
    <view class="picker-trigger" @click="openPicker">
      <slot>
        <view class="trigger-inner">
          <text
            class="trigger-text"
            :class="{ 'placeholder': !displayText }"
          >
            {{ displayText || placeholder }}
          </text>
          <u-icon name="arrow-down" size="16" color="#999999" />
        </view>
      </slot>
    </view>

    <u-picker
      :show="show"
      :columns="columns"
      keyName="name"
      :loading="loading"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @close="handleCancel"
      @change="handleChange"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import request from '@/utils/request'

// 定义地区节点类型
interface RegionNode {
  code: string
  name: string
  level: number
  children?: RegionNode[]
}

// 定义绑定值接口：只包含省和市
export interface ProvinceCityValue {
  provinceCode: string
  provinceName: string
  cityCode: string
  cityName: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: Partial<ProvinceCityValue>
    placeholder?: string
    autoLoad?: boolean
  }>(),
  {
    modelValue: () => ({}),
    placeholder: '请选择省市',
    autoLoad: true
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: ProvinceCityValue): void
  (e: 'change', value: ProvinceCityValue): void
}>()

const show = ref(false)
const loading = ref(false)

const regionTree = ref<RegionNode[]>([])
const columns = ref<any[][]>([])

// 当前选中的索引
const currentProvinceIndex = ref(0)
const currentCityIndex = ref(0)

// 标准化当前值，防止 undefined 报错
const normalizedValue = computed<ProvinceCityValue>(() => ({
  provinceCode: props.modelValue?.provinceCode || '',
  provinceName: props.modelValue?.provinceName || '',
  cityCode: props.modelValue?.cityCode || '',
  cityName: props.modelValue?.cityName || ''
}))

// 显示文本：例如 "浙江 / 杭州"
const displayText = computed(() => {
  const value = normalizedValue.value
  const parts = [value.provinceName, value.cityName].filter(Boolean)
  return parts.length > 0 ? parts.join(' / ') : ''
})

// 获取省份列表
const getProvinceList = () => {
  return regionTree.value || []
}

// 获取城市列表
const getCityList = (provinceIndex: number) => {
  return getProvinceList()[provinceIndex]?.children || []
}

// 构建 Picker 的列数据
const buildColumns = (
  provinceIndex = 0,
  cityIndex = 0
) => {
  const provinceList = getProvinceList()
  const cityList = getCityList(provinceIndex)

  currentProvinceIndex.value = provinceIndex
  currentCityIndex.value = cityIndex

  // 只有两列：省、市
  columns.value = [
    provinceList,
    // 如果当前省份没有城市数据，提供一个空占位或默认项，防止 u-picker 报错
    cityList.length ? cityList : [{ code: '', name: '暂无数据', level: 2 }]
  ]
}

// 根据当前值查找索引
const findIndexesByValue = (value: ProvinceCityValue) => {
  const provinceList = getProvinceList()
  let provinceIndex = 0
  let cityIndex = 0

  // 查找省份索引
  if (value.provinceCode) {
    const pIndex = provinceList.findIndex(item => item.code === value.provinceCode)
    provinceIndex = pIndex >= 0 ? pIndex : 0
  }

  // 查找城市索引
  const cityList = getCityList(provinceIndex)
  if (value.cityCode && cityList.length) {
    const cIndex = cityList.findIndex(item => item.code === value.cityCode)
    cityIndex = cIndex >= 0 ? cIndex : 0
  }

  return { provinceIndex, cityIndex }
}

// 加载数据
const loadRegionData = async () => {
  try {
    loading.value = true
    const res = await request.get('/api/region/province-city-tree')
    
    let treeData: RegionNode[] = []
    // 适配返回结构 { code: 200, data: [...] }
    if (res.code === 200 || res.code === 0) {
      treeData = res.data || []
    } else if (Array.isArray(res)) {
      treeData = res
    } else if (res.data && Array.isArray(res.data)) {
      treeData = res.data
    }

    regionTree.value = treeData

    // 数据加载完成后，根据当前 modelValue 构建列
    const indexes = findIndexesByValue(normalizedValue.value)
    buildColumns(indexes.provinceIndex, indexes.cityIndex)
  } catch (error) {
    console.error('获取省市数据失败', error)
    uni.showToast({ title: '地区数据加载失败', icon: 'none' })
    regionTree.value = []
    columns.value = [[], []]
  } finally {
    loading.value = false
  }
}

// 打开 Picker
const openPicker = async () => {
  if (!regionTree.value.length) {
    await loadRegionData()
  } else {
    // 如果数据已存在，重新构建列以同步可能的 modelValue 变化
    const indexes = findIndexesByValue(normalizedValue.value)
    buildColumns(indexes.provinceIndex, indexes.cityIndex)
  }
  show.value = true
}

const handleCancel = () => {
  show.value = false
}

// 处理列变化联动
const handleChange = (e: any) => {
  const { columnIndex, index, indexs } = e

  // 如果改变的是第一列（省份）
  if (columnIndex === 0) {
    const provinceIndex = index
    const cityList = getCityList(provinceIndex)
    
    currentProvinceIndex.value = provinceIndex
    currentCityIndex.value = 0 // 重置城市索引为0

    columns.value = [
      getProvinceList(),
      cityList.length ? cityList : [{ code: '', name: '暂无数据', level: 2 }]
    ]
  } 
  // 如果改变的是第二列（城市）
  else if (columnIndex === 1) {
    currentProvinceIndex.value = indexs[0]
    currentCityIndex.value = index
  }
}

// 确认选择
const handleConfirm = (e: any) => {
  const values = e.value || []
  const province = values[0] || {}
  const city = values[1] || {}

  // 如果选中的是“暂无数据”或空对象，则不更新城市信息
  const result: ProvinceCityValue = {
    provinceCode: province.code || '',
    provinceName: province.name || '',
    cityCode: city.code && city.name !== '暂无数据' ? city.code : '',
    cityName: city.name !== '暂无数据' ? (city.name || '') : ''
  }

  emit('update:modelValue', result)
  emit('change', result)
  show.value = false
}

// 监听外部 modelValue 变化，同步内部状态
watch(
  () => props.modelValue,
  () => {
    if (regionTree.value.length) {
      const indexes = findIndexesByValue(normalizedValue.value)
      buildColumns(indexes.provinceIndex, indexes.cityIndex)
    }
  },
  { deep: true }
)

onMounted(() => {
  if (props.autoLoad) {
    loadRegionData()
  }
})
</script>

<style scoped lang="scss">
.province-city-picker {
  width: 100%;
}

.picker-trigger {
  width: 100%;
}

.trigger-inner {
  min-height: 72rpx;
  padding: 16rpx 20rpx;
  box-sizing: border-box;
  background-color: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.trigger-text {
  flex: 1;
  font-size: 28rpx;
  color: #303133;
  line-height: 40rpx;
  padding-right: 12rpx;
}

.placeholder {
  color: #909399;
}
</style>