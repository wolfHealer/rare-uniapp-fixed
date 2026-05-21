<template>
  <view class="list-container">
    <!-- 搜索与智能筛选 -->
    <view class="filter-area">
      <u-search 
        v-model="keyword" 
        placeholder="搜索药店或渠道名称" 
        shape="round"
        @search="handleSearch"
        @clear="handleClear"
      ></u-search>
      
      <!-- 引入智能筛选栏 -->
      <SmartFilterBar
        :configs="channelConfigs"
        v-model="filterParams"
        @change="handleFilterChange"
        @reset="handleFilterReset"
      />
    </view>

    <!-- 滚动列表 -->
    <scroll-view scroll-y class="scroll-content" @scrolltolower="loadMore">
      <view class="channel-list">
        <view 
          v-for="item in channels" 
          :key="item.id" 
          class="channel-card"
          @click="contact(item)"
        >
          <view class="card-top">
            <text class="channel-name">{{ item.name }}</text>
            <!-- 修改点: 使用辅助函数转换 channelType 显示文本 -->
            <u-tag :text="getChannelTypeText(item.channelType)" type="primary" size="mini"></u-tag>
          </view>
          
          <view class="card-middle">
            <u-icon name="map" size="14" color="#9ca3af"></u-icon>
            <!-- 修改点: 组合显示省市区 -->
            <text class="address-text">{{ getFullAddress(item) }}</text>
          </view>

          <view class="card-bottom">
            <!-- 修改点: 显示配送范围和周期，替代 desc -->
            <text class="desc-text">
              配送: {{ item.deliveryScope }} | 周期: {{ item.deliveryCycle }}
              <u-tag v-if="item.isInsuranceSettle" text="医保" type="success" size="mini" customStyle="margin-left: 4px;"></u-tag>
            </text>
          </view>

          <view class="card-actions" @click.stop>
            <u-button size="mini" type="primary" plain @click="copyInfo(item)">复制信息</u-button>
            <!-- 如果有 contactUrl 则显示访问，否则隐藏或显示其他操作 -->
            <u-button v-if="item.contactUrl" size="mini" type="success" plain @click="openUrl(item)">访问链接</u-button>
          </view>
        </view>

        <u-loadmore :status="loadStatus" @loadmore="loadMore" />
        <u-empty v-if="!loading && channels.length === 0" mode="data" text="暂无购药渠道" />
        <view class="bottom-spacer"></view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { drugApi } from '@/api/drug'
import { usePagedList } from '@/composables/usePagedList'
import SmartFilterBar from '@/components/filter/SmartFilterBar.vue'
import type { FilterConfigItem } from '@/types/filter'
import type { ChannelListItem, ChannelFilterParams } from '@/types/drug'
import type { DrugListQuery } from '@/types/drug'

const keyword = ref('')
const filterParams = ref<ChannelFilterParams>({
  region: {},    
  delivery: '',
  channel_type: '' // 确保这里有初始值
})

// --- 2. 筛选配置 (Core Logic) ---
const channelConfigs: FilterConfigItem[] = [
  {
    key: 'region',
    label: '地区',
    type: 'region' 
  },
  {
    key: 'delivery',
    label: '配送',
    type: 'tags',
    options: [
      { label: '全部', value: '' },
      { label: '仅门店自提', value: 'pickup' },
      { label: '全国快递', value: 'delivery' },
      { label: '同城配送', value: 'local' }
    ]
  },
  {
    key: 'channel_type',
    label: '渠道类型',
    type: 'tags',
    options: [
      { label: '全部', value: '' },
      { label: '医院药房', value: 'hospital_pharmacy' },
      { label: '连锁药店', value: 'retail_pharmacy' },
      { label: '医药电商', value: 'e_pharmacy' },
      { label: '合规代购/协助渠道', value: 'compliant_agent' }
    ]
  },
]

// --- 辅助函数 ---
const getChannelTypeText = (type: string) => {
  const map: Record<string, string> = {
    'hospital_pharmacy': '医院药房',
    'retail_pharmacy': '连锁药店',
    'e_pharmacy': '医药电商',
    'compliant_agent': '合规代购'
  }
  return map[type] || '其他渠道'
}

const getFullAddress = (item: ChannelListItem) => {
  const parts = [item.provinceName, item.cityName, item.districtName, item.address].filter(Boolean)
  return parts.join('') || '地址不详'
}

const buildQueryParams = (page: number, pageSize: number): DrugListQuery => {
  const params: DrugListQuery = { page, pageSize }
  if (keyword.value) params.keyword = keyword.value
  const regionData = filterParams.value.region || {}
  if (regionData.provinceCode) params.provinceCode = regionData.provinceCode
  if (regionData.cityCode) params.cityCode = regionData.cityCode
  if (regionData.districtCode) params.districtCode = regionData.districtCode
  if (filterParams.value.delivery) params.deliveryScope = filterParams.value.delivery
  if (filterParams.value.channel_type) params.channelType = filterParams.value.channel_type
  return params
}

const { list: channels, loading, loadStatus, refresh, onLoadMore } = usePagedList<ChannelListItem>({
  pageSize: 10,
  fetchPage: async (page, pageSize) => {
    const res = await drugApi.listChannels(buildQueryParams(page, pageSize))
    const records = res.data?.list || []
    return { list: records, hasMore: records.length >= pageSize }
  }
})

const loadMore = () => onLoadMore()
const handleSearch = () => refresh()
const handleClear = () => {
  keyword.value = ''
  refresh()
}
const handleFilterChange = () => refresh()
const handleFilterReset = () => {
  filterParams.value = { region: {}, delivery: '', channel_type: '' }
  refresh()
}

const contact = (item: ChannelListItem) => {
  uni.navigateTo({ url: `/pages/resource/drug/ChannelDetail?id=${item.id}` })
}

const copyInfo = (item: ChannelListItem) => {
  const text = `${item.name}\n${getFullAddress(item)}\n电话: ${item.contactPhone || '暂无'}`
  uni.setClipboardData({ 
    data: text, 
    success: () => uni.showToast({ title: '已复制', icon: 'success' }) 
  })
}

const openUrl = (item: ChannelListItem) => {
  if (!item.contactUrl) return
  // #ifdef H5
  window.open(item.contactUrl, '_blank')
  // #endif
  // #ifndef H5
  uni.setClipboardData({
    data: item.contactUrl,
    success: () => uni.showToast({ title: '链接已复制', icon: 'success' })
  })
  // #endif
}

onMounted(() => refresh())
</script>

<style scoped lang="scss">
/* 样式保持不变 */
.list-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
}

.filter-area {
  flex-shrink: 0;
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.scroll-content {
  flex: 1;
  height: 0;
}

.channel-list {
  padding: 16px;
}

.channel-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.channel-name {
  font-size: 16px;
  font-weight: bold;
}

.card-middle {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.address-text {
  font-size: 13px;
  color: #6b7280;
}

.desc-text {
  font-size: 14px;
  color: #374151;
  display: block;
  margin-bottom: 12px;
}

.card-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.bottom-spacer {
  height: 20px;
}
</style>