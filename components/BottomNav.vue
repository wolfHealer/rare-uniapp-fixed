<template>
  <view class="bottom-nav">
    <view
      v-for="item in navList"
      :key="item.path"
      class="nav-item"
      @click="handleTabClick(item.path)"
    >
      <image class="nav-icon" :src="currentPath === item.path ? item.activeIcon : item.icon" mode="aspectFit" />
      <text :class="['nav-text', currentPath === item.path ? 'active' : '']">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const navList = [
  {
    text: '首页',
    path: '/pages/main/Home',
    icon: '/static/tabbar/home.png',
    activeIcon: '/static/tabbar/home-active.png'
  },
  {
    text: '医疗',
    path: '/pages/resource/Resources',
    icon: '/static/tabbar/medical.png',
    activeIcon: '/static/tabbar/medical-active.png'
  },
  {
    text: '社区',
    path: '/pages/community/Community',
    icon: '/static/tabbar/community.png',
    activeIcon: '/static/tabbar/community-active.png'
  },
  {
    text: '我的',
    path: '/pages/user/profile/Profile',
    icon: '/static/tabbar/profile.png',
    activeIcon: '/static/tabbar/profile-active.png'
  }
]

const currentPath = computed(() => {
  const pages = getCurrentPages()
  if (!pages.length) return ''
  const current = pages[pages.length - 1]
  return `/${current.route}`
})

const handleTabClick = (path: string) => {
  if (currentPath.value === path) return
  uni.switchTab({ url: path })
}
</script>

<style scoped>
.bottom-nav {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100rpx;
  background: #ffffff;
  border-top: 1rpx solid #e5e5e5;
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}
.nav-icon {
  width: 44rpx;
  height: 44rpx;
}
.nav-text {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: #7a7e83;
}
.nav-text.active {
  color: #3cc51f;
}
</style>