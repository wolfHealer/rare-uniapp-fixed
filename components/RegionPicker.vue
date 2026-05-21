<template>
  <view class="region-picker">
    <view class="region-trigger" @click="openPicker">
      <slot>
        <view class="region-trigger-inner">
          <text
            class="region-text"
            :class="{ 'region-placeholder': !displayText }"
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
// 1. 引入 request 工具，替换原有的 api 导入
import { regionApi } from '@/api/region'
import type { RegionNode } from '@/types/common'
import type { PickerChangeEvent, PickerConfirmEvent } from '@/types/ui'

export interface RegionValue {
  provinceCode: string
  provinceName: string
  cityCode: string
  cityName: string
  districtCode: string
  districtName: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: Partial<RegionValue>
    placeholder?: string
    autoLoad?: boolean
  }>(),
  {
    modelValue: () => ({}),
    placeholder: '请选择地区',
    autoLoad: true
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: RegionValue): void
  (e: 'change', value: RegionValue): void
}>()

const show = ref(false)
const loading = ref(false)

const regionTree = ref<RegionNode[]>([])
const columns = ref<RegionNode[][]>([])

const currentProvinceIndex = ref(0)
const currentCityIndex = ref(0)
const currentDistrictIndex = ref(0)

const normalizedValue = computed<RegionValue>(() => ({
  provinceCode: props.modelValue?.provinceCode || '',
  provinceName: props.modelValue?.provinceName || '',
  cityCode: props.modelValue?.cityCode || '',
  cityName: props.modelValue?.cityName || '',
  districtCode: props.modelValue?.districtCode || '',
  districtName: props.modelValue?.districtName || ''
}))

const displayText = computed(() => {
  const value = normalizedValue.value
  return [value.provinceName, value.cityName, value.districtName]
    .filter(Boolean)
    .join(' / ')
})

const getProvinceList = () => {
  return regionTree.value || []
}

const getCityList = (provinceIndex: number) => {
  return getProvinceList()[provinceIndex]?.children || []
}

const getDistrictList = (provinceIndex: number, cityIndex: number) => {
  return getCityList(provinceIndex)[cityIndex]?.children || []
}

const buildColumns = (
  provinceIndex = 0,
  cityIndex = 0,
  districtIndex = 0
) => {
  const provinceList = getProvinceList()
  const cityList = getCityList(provinceIndex)
  const districtList = getDistrictList(provinceIndex, cityIndex)

  currentProvinceIndex.value = provinceIndex
  currentCityIndex.value = cityIndex
  currentDistrictIndex.value = districtIndex

  // 确保列数据存在，如果为空则提供占位符以防止 picker 报错或显示异常
  columns.value = [
    provinceList,
    cityList.length ? cityList : [{ code: '', name: '', level: 2 }],
    districtList.length ? districtList : [{ code: '', name: '', level: 3 }]
  ]
}

const findIndexesByValue = (value: RegionValue) => {
  const provinceList = getProvinceList()

  let provinceIndex = 0
  let cityIndex = 0
  let districtIndex = 0

  if (value.provinceCode) {
    const pIndex = provinceList.findIndex(
      item => item.code === value.provinceCode
    )
    provinceIndex = pIndex >= 0 ? pIndex : 0
  }

  const cityList = getCityList(provinceIndex)
  if (value.cityCode && cityList.length) {
    const cIndex = cityList.findIndex(item => item.code === value.cityCode)
    cityIndex = cIndex >= 0 ? cIndex : 0
  }

  const districtList = getDistrictList(provinceIndex, cityIndex)
  if (value.districtCode && districtList.length) {
    const dIndex = districtList.findIndex(
      item => item.code === value.districtCode
    )
    districtIndex = dIndex >= 0 ? dIndex : 0
  }

  return {
    provinceIndex,
    cityIndex,
    districtIndex
  }
}

// 2. 修改 loadRegionTree，直接请求接口
const loadRegionTree = async () => {
  try {
    loading.value = true
    // 直接调用接口，仿照 loadDiseaseOptions 的方式
    const res = await regionApi.getTree()
    regionTree.value = Array.isArray(res.data) ? res.data : []

    // 数据加载完成后，根据当前值构建列
    const indexes = findIndexesByValue(normalizedValue.value)
    buildColumns(
      indexes.provinceIndex,
      indexes.cityIndex,
      indexes.districtIndex
    )
  } catch (error) {
    console.error('获取地区数据失败', error)
    uni.showToast({ title: '地区数据加载失败', icon: 'none' })
    regionTree.value = []
    columns.value = [[], [], []]
  } finally {
    loading.value = false
  }
}

const openPicker = async () => {
  if (!regionTree.value.length) {
    await loadRegionTree()
  } else {
    // 如果数据已存在，重新构建列以反映可能的 modelValue 变化
    const indexes = findIndexesByValue(normalizedValue.value)
    buildColumns(
      indexes.provinceIndex,
      indexes.cityIndex,
      indexes.districtIndex
    )
  }

  show.value = true
}

const handleCancel = () => {
  show.value = false
}

const handleChange = (e: PickerChangeEvent) => {
  const { columnIndex, index, indexs } = e

  if (columnIndex === 0) {
    const provinceIndex = index
    const cityList = getCityList(provinceIndex)
    const cityIndex = 0
    const districtList = getDistrictList(provinceIndex, cityIndex)

    currentProvinceIndex.value = provinceIndex
    currentCityIndex.value = 0
    currentDistrictIndex.value = 0

    columns.value = [
      getProvinceList(),
      cityList.length ? cityList : [{ code: '', name: '', level: 2 }],
      districtList.length ? districtList : [{ code: '', name: '', level: 3 }]
    ]
    return
  }

  if (columnIndex === 1) {
    const provinceIndex = indexs[0]
    const cityIndex = index
    const districtList = getDistrictList(provinceIndex, cityIndex)

    currentProvinceIndex.value = provinceIndex
    currentCityIndex.value = cityIndex
    currentDistrictIndex.value = 0

    columns.value = [
      getProvinceList(),
      getCityList(provinceIndex).length
        ? getCityList(provinceIndex)
        : [{ code: '', name: '', level: 2 }],
      districtList.length ? districtList : [{ code: '', name: '', level: 3 }]
    ]
    return
  }

  if (columnIndex === 2) {
    currentProvinceIndex.value = indexs[0]
    currentCityIndex.value = indexs[1]
    currentDistrictIndex.value = index
  }
}

const handleConfirm = (e: PickerConfirmEvent) => {
  const values = e.value || []
  const province = values[0] || {}
  const city = values[1] || {}
  const district = values[2] || {}

  const result: RegionValue = {
    provinceCode: province.code || '',
    provinceName: province.name || '',
    cityCode: city.code || '',
    cityName: city.name || '',
    districtCode: district.code || '',
    districtName: district.name || ''
  }

  emit('update:modelValue', result)
  emit('change', result)

  show.value = false
}

watch(
  () => props.modelValue,
  () => {
    if (regionTree.value.length) {
      const indexes = findIndexesByValue(normalizedValue.value)
      buildColumns(
        indexes.provinceIndex,
        indexes.cityIndex,
        indexes.districtIndex
      )
    }
  },
  { deep: true }
)

onMounted(() => {
  if (props.autoLoad) {
    loadRegionTree()
  }
})
</script>

<style scoped lang="scss">
.region-picker {
  width: 100%;
}

.region-trigger {
  width: 100%;
  /* 确保触发器容器本身不透明 */
  background-color: #ffffff !important;
}

/* 使用 :deep() 穿透到插槽内容或内部元素 */
.region-trigger-inner {
  min-height: 72rpx;
  padding: 16rpx 20rpx;
  box-sizing: border-box;
  
  /* 强制白色背景 */
  background-color: #ffffff !important;
  /* 强制完全不透明 */
  opacity: 1 !important;
  
  /* 清晰的边框 */
  border: 1px solid #dcdfe6 !important; 
  border-radius: 8px;
  
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.region-text {
  flex: 1;
  font-size: 28rpx;
  /* 强制黑色文字 */
  color: #303133 !important; 
  line-height: 40rpx;
  padding-right: 12rpx;
  opacity: 1 !important;
}

.region-placeholder {
  /* 占位符颜色稍浅，但也要可见 */
  color: #909399 !important;
}
</style>