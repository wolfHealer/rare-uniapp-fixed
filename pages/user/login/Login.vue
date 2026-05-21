<template>
  <view class="page-container">
    <!-- 顶部标题 -->
    <view class="header-section">
      <text class="page-title">欢迎登录</text>
      <text class="page-subtitle">罕见病互助社区</text>
    </view>

    <!-- 表单区域卡片 -->
    <view class="form-card">
      <view class="form-item">
        <view class="input-wrapper">
          <u-icon name="phone" color="#9ca3af" size="20" class="input-icon"></u-icon>
          <input
            v-model="loginForm.phone"
            type="number"
            placeholder="请输入手机号"
            placeholder-class="placeholder-style"
            class="input-field"
            maxlength="11"
          />
        </view>
      </view>

      <view class="form-item">
        <view class="input-wrapper">
          <u-icon name="lock" color="#9ca3af" size="20" class="input-icon"></u-icon>
          <input
            v-model="loginForm.password"
            :password="!showPassword"
            placeholder="请输入密码"
            placeholder-class="placeholder-style"
            class="input-field"
          />
          <u-icon
            :name="showPassword ? 'eye' : 'eye-off'"
            size="20"
            color="#9ca3af"
            class="eye-icon"
            @click="togglePasswordVisibility"
          />
        </view>
      </view>

      <view class="forgot-box">
        <text class="forgot-text" @click="goToForgotPassword">忘记密码？</text>
      </view>

      <u-button
        type="primary"
        shape="circle"
        :loading="loading"
        :disabled="loading"
        @click="handleLogin"
        class="login-btn"
        customStyle="height: 48px; font-size: 16px;"
      >
        {{ loading ? '登录中...' : '登录' }}
      </u-button>
    </view>

    <view class="register-box">
      <text class="reg-text">还没有账号？</text>
      <text class="reg-link" @click="goToRegister">立即注册</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { userApi } from '@/api/user'
import { useUserStore } from '@/stores/modules/user'
import type { LoginResponseData } from '@/types/user'

const loginForm = ref({
  phone: '',
  password: ''
})
const showPassword = ref(false)
const loading = ref(false)
const userStore = useUserStore()

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const validatePhone = (phone: string): boolean => /^1[3-9]\d{9}$/.test(phone)

const handleLogin = async () => {
  if (!loginForm.value.phone.trim()) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }
  if (!validatePhone(loginForm.value.phone)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  if (!loginForm.value.password) {
    uni.showToast({ title: '请输入密码', icon: 'none' })
    return
  }

  loading.value = true
  try {
    const response = await userApi.login({
      phone: loginForm.value.phone,
      password: loginForm.value.password
    })

    const data = response.data as LoginResponseData
    userStore.setToken(data.token)
    userStore.setUserInfo({
      user_id: data.user_id,
      nickname: data.nickname,
      phone: data.phone,
      avatar: data.avatar
    })

    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/main/Home' })
    }, 800)
  } catch (error) {
    console.error('登录失败:', error)
    // 这里可以添加更具体的错误提示，例如从 error.response.data 获取
    uni.showToast({ title: '登录失败，请检查账号密码', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  uni.navigateTo({ url: '/pages/user/register/Register' })
}

const goToForgotPassword = () => {
  uni.showToast({ title: '请联系管理员重置密码', icon: 'none' })
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 40rpx 32rpx;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
}

.header-section {
  margin-bottom: 40rpx;
  margin-top: 40rpx;
}

.page-title {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8rpx;
}

.page-subtitle {
  display: block;
  font-size: 28rpx;
  color: #6b7280;
}

/* 表单卡片化，更整洁 */
.form-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.form-item {
  margin-bottom: 24rpx;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f3f4f6;
  border-radius: 16rpx;
  padding: 0 24rpx;
  height: 96rpx; /* 固定高度确保一致性 */
}

.input-icon {
  margin-right: 16rpx;
}

/* 关键修改：优化 input 样式以解决显示不全问题 */
.input-field {
  flex: 1;
  height: 100%;
  font-size: 30rpx;
  color: #1f2937;
  /* 确保行高与容器高度匹配，避免文字被切 */
  line-height: 96rpx; 
}

/* 占位符样式 */
.placeholder-style {
  color: #9ca3af;
  font-size: 30rpx;
}

.eye-icon {
  padding: 10rpx; /* 增加点击区域 */
}

.forgot-box {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 32rpx;
}

.forgot-text {
  color: #2563eb;
  font-size: 26rpx;
}

.login-btn {
  width: 100%;
  font-weight: 600;
}

.register-box {
  display: flex;
  justify-content: center;
  margin-top: 40rpx;
  font-size: 28rpx;
}

.reg-text {
  color: #6b7280;
}

.reg-link {
  color: #2563eb;
  margin-left: 8rpx;
  font-weight: 500;
}
</style>