<!-- components/filter/modules/DiseasePicker.vue -->
<template>
  <view class="disease-picker">
    <!-- 搜索框 -->
    <u-search
      v-model="keyword"
      placeholder="搜索疾病名称"
      :showAction="false"
      shape="round"
      height="36"
      bgColor="#f9fafb"
      @change="handleSearch"
      @clear="clearSelect"
    />

    <!-- 搜索结果列表 -->
    <scroll-view
      v-if="showResult"
      scroll-y
      class="disease-result"
    >
      <view
        v-for="item in options"
        :key="item.id"
        class="disease-item"
        :class="{ active: modelValue?.diseaseId === item.id }"
        @click="selectDisease(item)"
      >
        <view class="disease-name">{{ item.name }}</view>
        <view class="disease-meta" v-if="item.alias">
          别名：{{ item.alias }}
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && options.length === 0" class="empty">
        暂无匹配疾病
      </view>
      
      <!-- 加载状态 -->
      <view v-if="loading" class="loading">
        <u-loading-icon mode="circle" size="20"></u-loading-icon>
        <text class="ml-2">搜索中...</text>
      </view>
    </scroll-view>
    
    <!-- 初始提示或已选状态展示 (可选) -->
    <view v-else-if="modelValue?.diseaseName" class="selected-preview">
      <text class="label">已选：</text>
      <text class="value">{{ modelValue.diseaseName }}</text>
      <u-icon name="close-circle-fill" color="#c0c4cc" size="18" @click="clearSelect" class="ml-2"></u-icon>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { knowledgeApi } from '@/api/knowledge'

// 定义疾病选项接口
export interface DiseaseOption {
  id: number | string
  name: string
  alias?: string
}

// 定义绑定值接口
export interface DiseaseValue {
  diseaseId: number | string | ''
  diseaseName: string
}

const props = withDefaults(defineProps<{
  modelValue?: Partial<DiseaseValue>
}>(), {
  modelValue: () => ({})
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: DiseaseValue): void
  (e: 'change', value: DiseaseValue): void
}>()

// 响应式数据
const keyword = ref(props.modelValue?.diseaseName || '')
const options = ref<DiseaseOption[]>([])
const loading = ref(false)
const timer = ref<ReturnType<typeof setTimeout> | null>(null)

// 当输入框有内容时显示结果区域
const showResult = computed(() => keyword.value.trim().length > 0)

// 监听外部 modelValue 变化，同步到内部 keyword
watch(
  () => props.modelValue,
  (val) => {
    keyword.value = val?.diseaseName || ''
  },
  { deep: true }
)

// 处理搜索输入（防抖）
const handleSearch = () => {
  if (timer.value) clearTimeout(timer.value)
  timer.value = setTimeout(() => {
    fetchDiseaseList()
  }, 300)
}

// 请求疾病列表
const fetchDiseaseList = async () => {
  const q = keyword.value.trim()
  if (!q) {
    options.value = []
    return
  }

  loading.value = true
  try {
    // 调用指定接口
    const res = await knowledgeApi.searchDiseases({
        keyword: q
    })

    // 适配返回结构: { code: 200, data: { list: [...] } }
    const apiData = res.data || {}
    options.value = apiData.list || []
  } catch (e) {
    console.error('搜索疾病失败', e)
    options.value = []
    uni.showToast({ title: '搜索失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 选中疾病
const selectDisease = (item: DiseaseOption) => {
  const value: DiseaseValue = {
    diseaseId: item.id,
    diseaseName: item.name
  }
  
  // 更新搜索框显示为选中的名称
  keyword.value = item.name
  
  // 触发更新
  emit('update:modelValue', value)
  emit('change', value)
}

// 清空选择
const clearSelect = () => {
  keyword.value = ''
  options.value = []
  const value: DiseaseValue = {
    diseaseId: '',
    diseaseName: ''
  }
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped lang="scss">
.disease-picker {
  width: 100%;
}

.disease-result {
  margin-top: 12rpx;
  max-height: 320rpx;
  background: #f9fafb;
  border-radius: 12rpx;
  overflow: hidden;
  border: 1rpx solid #ebeef5;
}

.disease-item {
  padding: 20rpx 24rpx;
  border-bottom: 1rpx solid #eef2f7;
  background: #fff;
  transition: background-color 0.2s;
}

.disease-item:last-child {
  border-bottom: none;
}

.disease-item.active {
  background: #eff6ff;
  border-left: 4rpx solid #2979ff;
}

.disease-name {
  font-size: 28rpx;
  color: #303133;
  font-weight: 500;
}

.disease-meta {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #909399;
}

.empty, .loading {
  padding: 24rpx;
  text-align: center;
  font-size: 24rpx;
  color: #909399;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ml-2 {
  margin-left: 8rpx;
}

.selected-preview {
  margin-top: 12rpx;
  padding: 16rpx 24rpx;
  background: #f5f7fa;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  font-size: 26rpx;
  
  .label {
    color: #909399;
  }
  .value {
    color: #303133;
    font-weight: 500;
    flex: 1;
  }
}
</style>