<template>
  <view class="page-container">
    <text class="page-title">注册</text>

    <!-- 表单区域 -->
    <u-form :model="registerForm" ref="formRef" class="register-form">
      
      <!-- 手机号输入 -->
      <u-form-item label="手机号" prop="phone" borderBottom>
        <u-input 
          v-model="registerForm.phone" 
          placeholder="请输入手机号" 
          type="number" 
          maxlength="11"
          border="none"
        ></u-input>
      </u-form-item>

      <!-- 验证码输入 -->
      <u-form-item label="短信验证码" prop="code" borderBottom>
        <u-input 
          v-model="registerForm.code" 
          placeholder="请输入验证码" 
          type="number" 
          maxlength="6"
          border="none"
        ></u-input>
        <template #right>
          <u-button 
            size="mini" 
            type="primary" 
            :disabled="codeTimer > 0"
            @click="sendCode"
            customStyle="margin-left: 10px;"
          >
            {{ codeTimer > 0 ? `${codeTimer}s后重发` : '发送验证码' }}
          </u-button>
        </template>
      </u-form-item>

      <!-- 密码输入 -->
      <u-form-item label="密码" prop="password" borderBottom>
        <u-input 
          v-model="registerForm.password" 
          :placeholder="showPassword ? '请输入密码' : '请输入密码（6-12位）'" 
          :type="showPassword ? 'text' : 'password'" 
          border="none"
        ></u-input>
        <template #right>
          <u-icon 
            :name="showPassword ? 'eye' : 'eye-off'" 
            size="20" 
            color="#c0c4cc"
            @click="togglePasswordVisibility"
          ></u-icon>
        </template>
      </u-form-item>
    </u-form>

    <!-- 隐私提示 -->
    <text class="privacy-tip">仅用于登录验证，不泄露个人信息</text>

    <!-- 注册按钮 -->
    <view class="btn-box">
      <u-button 
        type="primary" 
        shape="circle" 
        :loading="loading" 
        @click="handleRegister"
      >
        注册
      </u-button>
    </view>

    <!-- 登录入口 -->
    <view class="login-link-box">
      <text class="link-text">已有账号？</text>
      <text class="link-highlight" @click="goToLogin">立即登录</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 注册表单数据
const registerForm = ref({
  phone: '',
  code: '',
  password: ''
})

// 显示/隐藏密码
const showPassword = ref(false)

// 验证码倒计时
const codeTimer = ref(0)

// 加载状态
const loading = ref(false)

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 发送验证码
const sendCode = () => {
  if (!registerForm.value.phone) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }
  
  // 简单的手机号格式校验
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(registerForm.value.phone)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }

  uni.showToast({ title: '验证码已发送', icon: 'success' })
  codeTimer.value = 60
  const timer = setInterval(() => {
    codeTimer.value--
    if (codeTimer.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 处理注册
const handleRegister = () => {
  if (
    !registerForm.value.phone ||
    !registerForm.value.code ||
    !registerForm.value.password
  ) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }
  
  if (registerForm.value.password.length < 6 || registerForm.value.password.length > 12) {
    uni.showToast({ title: '密码长度需为6-12位', icon: 'none' })
    return
  }

  loading.value = true
  
  // 模拟注册请求
  setTimeout(() => {
    loading.value = false
    uni.showToast({ title: '注册成功', icon: 'success' })
    
    // 延迟跳转
    setTimeout(() => {
      // 注意：请根据实际 pages.json 中的路径调整
      uni.navigateTo({ url: '/pages/user/login/Login' })
    }, 1500)
  }, 1000)
}

// 跳转到登录页面
const goToLogin = () => {
  uni.navigateTo({ url: '/pages/user/login/Login' })
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 32px;
  align-self: flex-start;
  margin-left: 10px; /* 稍微对齐表单 */
}

.register-form {
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 10px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.privacy-tip {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 12px;
  align-self: flex-start;
  margin-left: 10px;
}

.btn-box {
  width: 100%;
  margin-top: 32px;
}

.login-link-box {
  margin-top: 24px;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.link-text {
  color: #6b7280;
}

.link-highlight {
  color: #3b82f6;
  margin-left: 4px;
}
</style>