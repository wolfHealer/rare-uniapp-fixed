<template>
  <view class="page-container">
    <text class="page-title">个人信息</text>

    <!-- 头像上传 -->
    <view class="card">
      <view class="avatar-row" @click="showAvatarPopup = true">
        <image 
          :src="userInfo.avatar || defaultAvatar" 
          mode="aspectFill"
          class="avatar-img"
        ></image>
        <text class="upload-hint">点击更换头像</text>
        <u-icon name="arrow-right" color="#c0c4cc"></u-icon>
      </view>
    </view>

    <!-- 昵称修改 -->
    <view class="card">
      <u-form :model="userInfo" ref="formRef">
        <u-form-item label="昵称" prop="nickname" borderBottom>
          <u-input 
            v-model="userInfo.nickname" 
            placeholder="请输入昵称" 
            border="none"
          ></u-input>
        </u-form-item>
      </u-form>
    </view>

    <!-- 保存按钮 -->
    <view class="btn-box">
      <u-button 
        type="primary" 
        shape="circle" 
        :loading="saving" 
        @click="saveProfile"
      >
        保存
      </u-button>
    </view>

    <!-- 头像上传弹窗 -->
    <u-popup 
      v-model:show="showAvatarPopup" 
      mode="bottom" 
      round="10"
    >
      <view class="popup-content">
        <u-upload
          :fileList="avatarFileList"
          @afterRead="handleAvatarUpload"
          :maxCount="1"
          width="100"
          height="100"
        ></u-upload>
        <view class="popup-actions">
          <u-button type="primary" block @click="confirmAvatarUpload">
            确认上传
          </u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UploadFileItem, UploadAfterReadEvent } from '@/types/ui'

// 默认头像
const defaultAvatar = 'https://via.placeholder.com/150'

// 用户信息
const userInfo = ref({
  nickname: '用户名',
  avatar: ''
})

// 头像上传弹窗状态
const showAvatarPopup = ref(false)
const avatarFileList = ref<UploadFileItem[]>([])

// 保存状态
const saving = ref(false)

// 处理头像上传 (选择文件后触发)
const handleAvatarUpload = (event: UploadAfterReadEvent) => {
  // event.file 包含选中的文件信息
  // 这里可以执行压缩、上传到 OSS 等操作
  console.log('选择文件:', event.file)
  // 模拟更新 fileList 用于预览
  avatarFileList.value = event.file
}

// 确认上传头像
const confirmAvatarUpload = () => {
  if (avatarFileList.value.length > 0) {
    // 执行实际上传逻辑...
    userInfo.value.avatar = avatarFileList.value[0].url || defaultAvatar
    uni.showToast({ title: '头像上传成功', icon: 'success' })
  }
  showAvatarPopup.value = false
}

// 保存个人信息
const saveProfile = () => {
  if (!userInfo.value.nickname) {
    uni.showToast({ title: '昵称不能为空', icon: 'none' })
    return
  }
  
  saving.value = true
  // 模拟保存请求
  setTimeout(() => {
    saving.value = false
    uni.showToast({ title: '保存成功', icon: 'success' })
    uni.navigateBack()
  }, 1000)
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  display: block;
}

.card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.avatar-row {
  display: flex;
  align-items: center;
}

.avatar-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 12px;
}

.upload-hint {
  flex: 1;
  font-size: 14px;
  color: #3b82f6;
}

.btn-box {
  margin-top: 24px;
}

.popup-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popup-actions {
  width: 100%;
  margin-top: 20px;
}
</style>