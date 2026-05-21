<template>
  <view class="hospital-picker">
    <u-search
      v-model="keyword"
      placeholder="搜索医院名称"
      :showAction="false"
      shape="round"
      height="36"
      bgColor="#f9fafb"
      @change="handleSearch"
      @clear="clearSelect"
    />

    <scroll-view
      v-if="showResult"
      scroll-y
      class="hospital-result"
    >
      <view
        v-for="item in options"
        :key="item.id"
        class="hospital-item"
        :class="{ active: modelValue?.hospitalId === item.id }"
        @click="selectHospital(item)"
      >
        <view class="hospital-name">{{ item.name }}</view>
        <view class="hospital-meta">
          {{ item.cityName || item.city_name || '' }}
          <text v-if="item.levelName || item.level_name">
            · {{ item.levelName || item.level_name }}
          </text>
        </view>
      </view>

      <view v-if="!loading && options.length === 0" class="empty">
        暂无匹配医院
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { medicalApi } from '@/api/medical'

export interface HospitalOption {
  id: number | string
  name: string
  cityName?: string
  city_name?: string
  levelName?: string
  level_name?: string
}

export interface HospitalValue {
  hospitalId: number | string | ''
  hospitalName: string
}

const props = withDefaults(defineProps<{
  modelValue?: Partial<HospitalValue>
}>(), {
  modelValue: () => ({})
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: HospitalValue): void
  (e: 'change', value: HospitalValue): void
}>()

const keyword = ref(props.modelValue?.hospitalName || '')
const options = ref<HospitalOption[]>([])
const loading = ref(false)
const timer = ref<ReturnType<typeof setTimeout> | null>(null)

const showResult = computed(() => keyword.value.trim().length > 0)

watch(
  () => props.modelValue,
  (val) => {
    keyword.value = val?.hospitalName || ''
  },
  { deep: true }
)

const handleSearch = () => {
  if (timer.value) clearTimeout(timer.value)
  timer.value = setTimeout(() => {
    fetchHospitalList()
  }, 300)
}

const fetchHospitalList = async () => {
  const q = keyword.value.trim()
  if (!q) {
    options.value = []
    return
  }

  loading.value = true
  try {
    const res = await medicalApi.listHospitals({
      keyword: q,
      page: 1,
      pageSize: 20
    })

    const apiData = res.data || {}
    options.value = apiData.list || []
  } catch (e) {
    console.error('搜索医院失败', e)
    options.value = []
  } finally {
    loading.value = false
  }
}

const selectHospital = (item: HospitalOption) => {
  const value: HospitalValue = {
    hospitalId: item.id,
    hospitalName: item.name
  }
  keyword.value = item.name
  emit('update:modelValue', value)
  emit('change', value)
}

const clearSelect = () => {
  keyword.value = ''
  options.value = []
  const value: HospitalValue = {
    hospitalId: '',
    hospitalName: ''
  }
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped lang="scss">
.hospital-picker {
  width: 100%;
}

.hospital-result {
  margin-top: 12rpx;
  max-height: 320rpx;
  background: #f9fafb;
  border-radius: 12rpx;
  overflow: hidden;
}

.hospital-item {
  padding: 20rpx 24rpx;
  border-bottom: 1rpx solid #eef2f7;
  background: #fff;
}

.hospital-item:last-child {
  border-bottom: none;
}

.hospital-item.active {
  background: #eff6ff;
}

.hospital-name {
  font-size: 28rpx;
  color: #303133;
  font-weight: 500;
}

.hospital-meta {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #909399;
}

.empty {
  padding: 24rpx;
  text-align: center;
  font-size: 24rpx;
  color: #909399;
}
</style>