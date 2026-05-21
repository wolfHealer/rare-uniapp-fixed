<template>
  <view class="page-container">
    <!-- 搜索框 -->
    <view class="search-box">
      <u-search 
        v-model="keyword" 
        placeholder="搜索检查项目" 
        shape="round"
        clearable
        @search="onSearch"
        @clear="onClear"
      ></u-search>
    </view>

    <!-- 列表 -->
    <scroll-view scroll-y class="list-box" @scrolltolower="onLoadMore">
      <u-cell-group>
        <u-cell
          v-for="item in list"
          :key="item.id"
          :title="item.examName"
          :label="item.examPurpose"
          is-link
          @click="open(item)"
        >
          <template #value>
            <u-tag 
              v-if="item.examType" 
              :text="getExamTypeText(item.examType)" 
              type="primary" 
              size="mini"
            ></u-tag>
          </template>
        </u-cell>
      </u-cell-group>

      <u-empty 
        v-if="!loading && list.length === 0" 
        mode="data" 
        text="暂无检查项目数据"
      ></u-empty>

      <view v-if="loading && list.length === 0" class="loading-more">
        <u-loading-icon mode="circle"></u-loading-icon>
      </view>

      <view v-if="total > 0" class="pagination-info">
        <text>共 {{ total }} 条记录</text>
      </view>
      
      <u-loadmore 
        :status="loadStatus" 
        v-if="list.length > 0"
      />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { medicalApi } from '@/api/medical'
import { usePagedList } from '@/composables/usePagedList'
import type { ExaminationListItem } from '@/types/medical'

const keyword = ref('')
const total = ref(0)

const EXAM_TYPE_MAP: Record<string, string> = {
  lab: '实验室检查',
  metabolic: '代谢筛查',
  imaging: '影像学检查',
  genetic: '基因检测',
  pathology: '病理检查',
  functional: '功能检查',
  scale: '量表评估',
  special: '专科专项检查',
  other: '其他'
}

const getExamTypeText = (type: string) => {
  return EXAM_TYPE_MAP[type] || type
}

const { list, loading, loadStatus, refresh, onLoadMore } = usePagedList<ExaminationListItem>({
  pageSize: 20,
  fetchPage: async (page, pageSize) => {
    const res = await medicalApi.listExaminations({
      keyword: keyword.value,
      page,
      pageSize
    })
    const records = res.data?.list || []
    total.value = res.data?.total || 0
    return { list: records, hasMore: records.length >= pageSize }
  }
})

const open = (item: ExaminationListItem) => {
  uni.navigateTo({
    url: `/pages/resource/medical/ExaminationDetail?id=${item.id}`
  })
}

const onSearch = () => refresh()
const onClear = () => {
  keyword.value = ''
  refresh()
}

onMounted(() => refresh())
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.search-box {
  margin-bottom: 12px;
}

.list-box {
  flex: 1;
  height: 0;
}

.loading-more {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

.pagination-info {
  text-align: center;
  font-size: 12px;
  color: #6b7280;
  margin-top: 16px;
}
</style>
