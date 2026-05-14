
import { defineStore } from 'pinia'
import { ref } from 'vue'  // ✅ 使用具名导入

export interface UserInfo {
  user_id: number
  nickname: string
  phone: string
  avatar: string
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)

  // 初始化时从本地存储加载数据
  const initStore = () => {
    const storedToken = uni.getStorageSync('token')
    const storedUserInfo = uni.getStorageSync('userInfo')
    
    if (storedToken) {
      token.value = storedToken
    }
    
    if (storedUserInfo) {
      try {
        userInfo.value = JSON.parse(storedUserInfo)
      } catch (e) {
        console.error('解析用户信息失败:', e)
        userInfo.value = null
      }
    }
  }

  const setToken = (newToken: string) => {
    token.value = newToken
    uni.setStorageSync('token', newToken)
  }

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    uni.setStorageSync('userInfo', JSON.stringify(info))
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
  }

  // 检查是否已登录
  const isLoggedIn = (): boolean => {
    return !!token.value && !!userInfo.value
  }

  // 初始化 store
  initStore()

  return {
    token,
    userInfo,
    setToken,
    setUserInfo,
    logout,
    isLoggedIn
  }
})