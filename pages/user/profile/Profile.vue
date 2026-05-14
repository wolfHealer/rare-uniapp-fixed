<template>
  <view class="page-container">
    <!-- 统一使用 u-navbar -->
    <u-navbar 
      :is-back="false" 
      title="我的" 
      placeholder 
      bg-color="#ffffff"
      title-color="#1f2937"
      left-icon-color="#1f2937"
      :border-bottom="true"
    ></u-navbar>

    <!-- 内容区域 -->
    <scroll-view scroll-y class="content-scroll" enable-back-to-top>
      
      <!-- 状态 A: 未登录 -->
      <view v-if="!isLoggedIn" class="guest-view">
        <view class="guest-header">
          <image 
            :src="defaultAvatar" 
            mode="aspectFill" 
            class="guest-avatar"
          ></image>
          <text class="welcome-text">欢迎使用罕见病互助社区</text>
          <text class="sub-text">登录后享受更多专属服务</text>
          
          <view class="auth-buttons">
            <u-button 
              type="primary" 
              shape="circle" 
              size="medium"
              customStyle="width: 120px; margin-right: 12px;"
              @click="goToLogin"
            >
              登录
            </u-button>
            <u-button 
              plain 
              type="primary" 
              shape="circle" 
              size="medium"
              customStyle="width: 120px;"
              @click="goToRegister"
            >
              注册
            </u-button>
          </view>
        </view>

        <view class="guide-card">
          <view class="guide-title">登录后可使用：</view>
          <view class="guide-list">
            <view class="guide-item">
              <u-icon name="star" color="#2563eb" size="18"></u-icon>
              <text>我的收藏</text>
            </view>
            <view class="guide-item">
              <u-icon name="edit-pen" color="#2563eb" size="18"></u-icon>
              <text>发布动态</text>
            </view>
            <view class="guide-item">
              <u-icon name="file-text" color="#2563eb" size="18"></u-icon>
              <text>病历管理</text>
            </view>
            <view class="guide-item">
              <u-icon name="chat" color="#2563eb" size="18"></u-icon>
              <text>问诊记录</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 状态 B: 已登录 -->
      <view v-else class="logged-in-view">
        <!-- 用户信息卡片 -->
        <view class="user-card">
          <view class="user-info-row">
            <view class="avatar-wrapper" @click="uploadAvatar">
              <image
                :src="userInfo?.avatar || defaultAvatar"
                mode="aspectFill"
                class="avatar"
              />
              <view class="edit-badge">
                <u-icon name="camera-fill" size="12" color="#fff"></u-icon>
              </view>
            </view>
            
            <view class="user-text">
              <text class="nickname">{{ userInfo?.nickname || '未设置昵称' }}</text>
              <view class="phone-row">
                <u-icon name="phone" size="12" color="#9ca3af"></u-icon>
                <text class="phone">{{ userInfo?.phone || '未绑定手机号' }}</text>
              </view>
            </view>
            
            <view class="edit-profile-btn" @click="handleMenuClick('profile-edit')">
              <text>编辑</text>
              <u-icon name="arrow-right" size="12" color="#9ca3af"></u-icon>
            </view>
          </view>
        </view>

        <!-- 功能列表卡片 -->
        <view class="menu-card">
          <view
            v-for="(item, index) in menuItems"
            :key="item.action"
            class="menu-item"
            hover-class="menu-item-hover"
            @click="handleMenuClick(item.action)"
          >
            <view class="menu-left">
              <u-icon :name="item.icon" size="20" color="#2563eb"></u-icon>
              <text class="menu-label">{{ item.label }}</text>
            </view>
            <u-icon name="arrow-right" color="#d1d5db" size="14"></u-icon>
          </view>
        </view>

        <!-- 退出登录 -->
        <view class="logout-section">
          <u-button 
            type="error" 
            shape="circle" 
            hairline
            customStyle="background-color: #ffffff; color: #ef4444; border-color: #fee2e2;" 
            @click="logout"
          >
            退出登录
          </u-button>
        </view>
      </view>
      
      <view class="bottom-placeholder"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()

// 默认头像
const defaultAvatar = '/static/tabbar/profile.png' 

// 计算是否登录 (根据 token 或 userInfo 存在与否判断)
const isLoggedIn = computed(() => !!userStore.token)
const userInfo = computed(() => userStore.userInfo)

// 菜单配置
const menuItems = [
  { label: '我的收藏', action: 'favorites', icon: 'star' },
  { label: '我的发布', action: 'posts', icon: 'edit-pen' },
  { label: '我的问诊', action: 'questions', icon: 'chat' }, // 对应原 MyQuestions
  { label: '设置', action: 'settings', icon: 'setting' }     // 新增设置入口
]

// 处理菜单点击
const handleMenuClick = (action: string) => {
  // 如果未登录，所有功能点击都跳转登录
  if (!isLoggedIn.value) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => goToLogin(), 1000)
    return
  }

  let url = ''
  switch (action) {
    case 'favorites':
      url = '/pages/user/profile/Favorites'
      break
    case 'posts':
      url = '/pages/user/profile/MyPosts'
      break
    case 'questions':
      url = '/pages/user/profile/MyQuestions' // 确保该页面存在
      break
    case 'profile-edit':
      url = '/pages/user/profile/ProfileEdit'
      break
    case 'settings':
      // 如果有设置页面，填写路径，否则提示
      uni.showToast({ title: '设置功能开发中', icon: 'none' })
      return
  }
  
  if (url) {
    uni.navigateTo({ url })
  }
}

// 跳转登录
const goToLogin = () => {
  uni.navigateTo({ url: '/pages/user/login/Login' })
}

// 跳转注册
const goToRegister = () => {
  uni.navigateTo({ url: '/pages/user/register/Register' })
}

// 头像上传（仅登录态有效）
const uploadAvatar = () => {
  if (!isLoggedIn.value) return
  uni.showToast({ title: '请选择图片', icon: 'none' })
  // TODO: 实现 uni.chooseImage 和上传逻辑
}

// 退出登录
const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    confirmColor: '#ef4444',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.showToast({ title: '已退出', icon: 'success' })
      }
    }
  })
}
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9fafb;
}

.content-scroll {
  flex: 1;
  padding: 16px;
}

/* --- 未登录样式 --- */
.guest-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.guest-header {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.guest-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 16px;
  border: 2px solid #eff6ff;
}

.welcome-text {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.sub-text {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 24px;
}

.auth-buttons {
  display: flex;
  justify-content: center;
  width: 100%;
}

.guide-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.guide-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

.guide-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.guide-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #4b5563;
}

/* --- 已登录样式 --- */
.logged-in-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
}

.user-info-row {
  display: flex;
  align-items: center;
  width: 100%;
}

.avatar-wrapper {
  position: relative;
  margin-right: 16px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #eff6ff;
}

.edit-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #2563eb;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}

.user-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.nickname {
  color: #111827;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
}

.phone-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.phone {
  color: #6b7280;
  font-size: 13px;
}

.edit-profile-btn {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  color: #6b7280;
  padding: 4px 8px;
  background-color: #f3f4f6;
  border-radius: 12px;
}

.menu-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 8px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item-hover {
  opacity: 0.7;
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-label {
  color: #374151;
  font-size: 15px;
}

.logout-section {
  margin-top: 10px;
  padding: 0 16px;
}

.bottom-placeholder {
  height: 20px;
}
</style>