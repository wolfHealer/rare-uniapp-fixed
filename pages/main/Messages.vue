<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 顶部筛选栏 -->
    <view class="sticky top-0 z-10 bg-white shadow-sm p-4 w-full">
      <!-- 使用 scroll-view 横向滚动展示筛选选项，替代 Dropdown -->
      <scroll-view scroll-x class="flex whitespace-nowrap">
        <view 
          v-for="(item, index) in messageTypes" 
          :key="index"
          class="inline-block mr-4 last:mr-0"
        >
          <u-button 
            size="mini" 
            :type="messageType === item.value ? 'primary' : 'default'"
            :plain="messageType !== item.value"
            @click="changeMessageType(item.value)"
          >
            {{ item.text }}
          </u-button>
        </view>
      </scroll-view>
    </view>

    <!-- 消息列表 -->
    <view class="p-4">
      <view
        v-for="(message, index) in filteredMessages"
        :key="index"
        class="bg-white rounded-lg shadow-sm p-4 mb-4 cursor-pointer"
        :class="{ 'font-bold': !message.isRead }"
        @click="readMessage(message)"
      >
        <view class="flex justify-between items-center">
          <view>
            <text class="text-sm block">{{ message.title }}</text>
            <text class="text-xs text-gray-500 mt-1 block">
              来自：{{ message.sender }} · {{ message.time }}
            </text>
          </view>
          <u-tag
            :text="getMessageTypeName(message.type)"
            :type="getMessageTagType(message.type)"
            size="mini"
            plain
          ></u-tag>
        </view>
      </view>
      
      <!-- 空状态 -->
      <u-empty v-if="filteredMessages.length === 0" mode="message" text="暂无消息"></u-empty>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 消息类型选项
const messageTypes = ref([
  { text: '全部', value: 'all' },
  { text: '评论回复', value: 'comment' },
  { text: '专家答疑', value: 'qa' },
  { text: '资源更新', value: 'resource' }
])

// 当前筛选类型
const messageType = ref('all')

// 消息数据
const messages = ref([
  {
    id: 1,
    title: '您的评论收到了新回复',
    sender: '用户A',
    time: '2小时前',
    type: 'comment',
    isRead: false,
    link: '/post/123'
  },
  {
    id: 2,
    title: '专家已回复您的问题',
    sender: '张医生',
    time: '1天前',
    type: 'qa',
    isRead: true,
    link: '/qa/question/456'
  },
  {
    id: 3,
    title: '您关注的资源已更新',
    sender: '系统通知',
    time: '3天前',
    type: 'resource',
    isRead: false,
    link: '/resources/detail/789'
  }
])

// 筛选后的消息
const filteredMessages = computed(() => {
  if (messageType.value === 'all') return messages.value
  return messages.value.filter((msg) => msg.type === messageType.value)
})

// 获取消息标签类型
const getMessageTagType = (type: string) => {
  switch (type) {
    case 'comment':
      return 'primary'
    case 'qa':
      return 'success'
    case 'resource':
      return 'warning'
    default:
      return 'info'
  }
}

// 获取消息类型名称
const getMessageTypeName = (type: string) => {
  switch (type) {
    case 'comment':
      return '评论回复'
    case 'qa':
      return '专家答疑'
    case 'resource':
      return '资源更新'
    default:
      return '未知'
  }
}

// 切换消息类型
const changeMessageType = (value: string) => {
  messageType.value = value
}

// 阅读消息并跳转
const readMessage = (message: any) => {
  message.isRead = true
  // 注意：实际项目中可能需要根据 link 判断是 navigateTo 还是 switchTab
  uni.navigateTo({ url: message.link })
}
</script>

<style scoped>
.rounded-lg {
  border-radius: 10px;
}
.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.cursor-pointer {
  /* 小程序中 cursor-pointer 无效，但保留类名用于 H5 */
}
.font-bold {
  font-weight: bold;
}
.text-sm {
  font-size: 14px;
}
.text-xs {
  font-size: 12px;
}
.mt-1 {
  margin-top: 4px;
}
.block {
  display: block;
}
.flex {
  display: flex;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}
.min-h-screen {
  min-height: 100vh;
}
.bg-gray-50 {
  background-color: #f9fafb;
}
.sticky {
  position: sticky;
}
.top-0 {
  top: 0;
}
.z-10 {
  z-index: 10;
}
.bg-white {
  background-color: #ffffff;
}
.p-4 {
  padding: 16px;
}
.w-full {
  width: 100%;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.inline-block {
  display: inline-block;
}
.mr-4 {
  margin-right: 16px;
}
</style>