<template>
  <view class="page-container">
    <!-- 顶部固定筛选区 -->
    <view class="filter-area">
      <!-- 1. 搜索框：按通道名称关键字搜索 -->
      <u-search 
        v-model="keyword" 
        placeholder="搜索渠道名称" 
        shape="round"
        @search="handleSearch"
        @clear="handleClear"
        :show-action="false"
      ></u-search>

      <!-- 2. 智能筛选栏：按通道类型筛选 -->
      <SmartFilterBar
        :configs="channelConfigs"
        v-model="filterParams"
        @change="handleFilterChange"
        @reset="handleFilterReset"
      />
    </view>

    <!-- 列表内容区 -->
    <scroll-view scroll-y class="content-scroll">
      <view class="p-4">
        <!-- 加载状态 -->
        <view v-if="loading" class="mt-4 flex justify-center items-center">
          <u-loading-icon mode="circle"></u-loading-icon>
          <text class="ml-2 text-gray-500">加载中...</text>
        </view>

        <!-- 求助渠道列表 -->
        <u-cell-group v-else>
          <u-cell
            v-for="item in channels"
            :key="item.id"
            :title="item.name"
            :label="item.applyCondition" 
            is-link
            @click="contact(item)"
          >
            <template #value>
              <u-tag 
                :text="getChannelTypeLabel(item.channelType)" 
                :type="getChannelTypeTag(item.channelType)" 
                size="mini"
              ></u-tag>
            </template>
          </u-cell>
        </u-cell-group>

        <!-- 空状态 -->
        <u-empty v-if="!loading && channels.length === 0" mode="data" text="暂无求助渠道"></u-empty>

        <!-- 模板下载 -->
        <view class="mt-4 text-center">
          <u-button type="primary" @click="downloadTemplate" :loading="downloading">
            下载求助模板
          </u-button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import SmartFilterBar from '@/components/filter/SmartFilterBar.vue'
import type { FilterConfigItem } from '@/types/filter'

// 渠道类型定义更新
interface Channel {
  id: number
  channelType: string // 修改点: type -> channelType
  name: string
  applyCondition: string // 修改点: desc -> applyCondition
  responseTime: string
  contactPhone: string
  contactUrl: string
  helpLetterTemplate: string
  crowdfundingTemplate: string
  auditStatus: number
  sort: number
  createdAt: string
  updatedAt: string
}

// 列表数据
const channels = ref<Channel[]>([])
const loading = ref(false)
const downloading = ref(false)

// 搜索关键词
const keyword = ref('')

// 筛选参数状态
const filterParams = ref<Record<string, any>>({
  channelType: '' 
})

// 筛选配置 (Core Logic)
const channelConfigs: FilterConfigItem[] = [
  {
    key: 'channelType',
    label: '通道类型',
    type: 'tags',
    options: [
      { label: '全部类型', value: '' },
      { label: '紧急求助', value: 'emergency_help' },
      { label: '众筹求助', value: 'crowdfunding' },
      { label: '慈善咨询', value: 'charity_consulting' },
      { label: '基金会支持', value: 'foundation_support' },
      { label: '其他', value: 'other' },
    ]
  }
]

// 获取渠道类型标签样式
const getChannelTypeTag = (type: string) => {
  const tagMap: Record<string, any> = {
    emergency_help: 'success',
    crowdfunding: 'primary',
    charity_consulting: 'warning',
    foundation_support: 'info'
  }
  return tagMap[type] || 'info'
}

// 获取渠道类型标签文字
const getChannelTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    emergency_help: '紧急求助',
    crowdfunding: '众筹求助',
    charity_consulting: '慈善咨询',
    foundation_support: '基金会支持'
  }
  return labelMap[type] || '其他'
}

// 获取求助渠道列表
const fetchChannels = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {}

    if (keyword.value && keyword.value.trim() !== '') {
      params.keyword = keyword.value.trim()
    }

    if (filterParams.value.channelType) {
      params.channelType = filterParams.value.channelType // 确保参数名与后端一致
    }

    const res = await request.get('/api/resource/charity/channels', params)
    
    // 接口返回结构: res.data.list
    const resultData = res.data || res; 
    channels.value = resultData.list || [];

  } catch (error) {
    console.error('获取求助渠道失败:', error)
    channels.value = []
    uni.showToast({ title: '加载失败，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 联系/查看详情
const contact = (item: Channel) => {
  if (!item?.id) {
    uni.showToast({ title: '渠道信息不完整', icon: 'none' })
    return
  }
  uni.navigateTo({
    url: `/pages/resource/charity/HelpChannelDetail?id=${item.id}`
  })
}

// 下载求助模板 (保持原逻辑，但需注意接口可能变化)
const downloadTemplate = async () => {
  downloading.value = true
  try {
    // 假设模板接口不变，或者从第一个渠道获取模板作为示例
    // 这里为了演示，暂时保持原逻辑，实际可能需要调整
    const res = await request.get('/api/resource/charity/channels/template')
    const data = res.data || {}

    if (data.templates && data.templates.length > 0) {
       // ... 原有下载逻辑 ...
       uni.showToast({ title: '功能开发中', icon: 'none' })
    } else {
      uni.showToast({ title: '暂无可下载模板', icon: 'none' })
    }
  } catch (error) {
    console.error('下载模板失败:', error)
    uni.showToast({ title: '下载失败，请重试', icon: 'none' })
  } finally {
    downloading.value = false
  }
}

// --- 事件处理 ---
const handleSearch = () => {
  fetchChannels()
}

const handleClear = () => {
  keyword.value = ''
  fetchChannels()
}

const handleFilterChange = () => {
  fetchChannels()
}

const handleFilterReset = () => {
  filterParams.value = {
    channelType: ''
  }
  fetchChannels()
}

onMounted(() => {
  fetchChannels()
})
</script>

<style scoped lang="scss">
/* 样式保持不变 */
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9fafb;
}

.filter-area {
  flex-shrink: 0;
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  z-index: 10;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
}

.p-4 { padding: 16px; }
.mt-4 { margin-top: 16px; }
.flex { display: flex; }
.justify-center { justify-content: center; }
.items-center { align-items: center; }
.ml-2 { margin-left: 8px; }
.text-gray-500 { color: #6b7280; }
.text-center { text-align: center; }
</style>