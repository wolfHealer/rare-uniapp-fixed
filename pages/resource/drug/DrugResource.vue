<template>
  <view class="page-container">
    <!-- 顶部操作栏 -->
    <view class="header-bar">
      <u-icon name="arrow-left" size="24" color="#FFFFFF" @click="goBack"></u-icon>
      <text class="header-title">用药资源</text>
      <view class="placeholder"></view>
    </view>

    <!-- Tabs 标签栏 -->
    <view class="tabs-wrapper">
      <u-tabs
        :list="tabList"
        :current="activeTab"
        @change="onTabChange"
        lineColor="#1E90FF"
        activeStyle="color: #1E90FF; font-weight: bold;"
        inactiveStyle="color: #666;"
      ></u-tabs>
    </view>

    <!-- 内容区域 -->
    <view class="content-body">
      <view v-show="activeTab === 0" class="tab-pane">
        <DrugList />
      </view>
      <view v-show="activeTab === 1" class="tab-pane">
        <DonationProject />
      </view>
      <view v-show="activeTab === 2" class="tab-pane">
        <ChannelList />
      </view>
    </view>

    <!-- 底部导航栏 -->
    <BottomNav />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DrugList from './DrugList.vue'
import DonationProject from './DonationProjectList.vue'
import ChannelList from './ChannelList.vue'
import BottomNav from '@/components/BottomNav.vue'

const activeTab = ref(0)

const tabList = ref([
  { name: '药品名录' },
  { name: '赠药项目' },
  { name: '购药渠道' }
])

const onTabChange = (item: any) => {
  activeTab.value = item.index
}

const goBack = () => {
  uni.navigateBack({ delta: 1 })
}
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9fafb;
  overflow: hidden;
}

.header-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #1E90FF;
  color: #fff;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
}

.placeholder {
  width: 24px;
}

.tabs-wrapper {
  flex-shrink: 0;
  background-color: #fff;
}

.content-body {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.tab-pane {
  height: 100%;
  overflow-y: auto;
}
</style>