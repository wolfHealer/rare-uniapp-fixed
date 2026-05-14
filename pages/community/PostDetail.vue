<template>
  <view class="detail-page">
    
    <!-- 【新增】悬浮返回按钮 -->
    <view class="float-back-btn" @click="goBack">
      <u-icon name="arrow-left" color="#333" size="20"></u-icon>
    </view>

    <!-- 简化版导航栏 -->
    <u-navbar 
      :is-back="false" 
      title="帖子详情" 
      placeholder 
      bg-color="#ffffff"
      title-color="#1f2937"
      :border-bottom="true"
      custom-class="simple-navbar"
    ></u-navbar>

    <!-- 滚动内容区 -->
    <scroll-view scroll-y class="content-scroll" enable-back-to-top>
      <view class="post-body" v-if="post.id">
        <!-- 头部信息 -->
        <view class="header">
          <!-- 修改：仅当 title 存在时显示 -->
          <text class="title" v-if="post.title">{{ post.title }}</text>
          
          <view class="meta">
            <u-avatar :src="post.avatar || '/static/default-avatar.png'" size="40"></u-avatar>
            <view class="info">
              <text class="username">{{ post.display_name || '匿名病友' }}</text>
              <text class="date">{{ post.created_at }}</text>
            </view>
          </view>
        </view>

        <!-- 正文内容 -->
        <view class="main-content">
          <text user-select="true" class="content-text">{{ post.content }}</text>
          
          <!-- 图片网格 -->
          <view v-if="post.images && post.images.length" class="images">
             <image 
               v-for="(img, i) in post.images" 
               :key="i" 
               :src="img" 
               mode="widthFix" 
               class="post-img"
               @click="preview(img)"
             />
          </view>
        </view>

        <!-- 评论区展示 -->
        <view class="comment-section">
          <view class="section-title">评论 ({{ post.comment_count || 0 }})</view>
          
          <CommentTree 
            :comments="commentList" 
            @set-reply-target="handleSetReplyTarget"
            @load-more-replies="handleLoadMoreReplies"
          />

          <!-- 加载更多一级评论 -->
          <view v-if="hasMoreRootComments" class="load-more-root" @click="loadMoreRootComments">
            <text>加载更多评论</text>
          </view>
        </view>
        
        <!-- 底部占位 -->
        <view style="height: 80px;"></view>
      </view>
      
      <!-- 加载状态 -->
      <view v-else class="loading-state">
        <u-loading-icon mode="circle" text="加载中..."></u-loading-icon>
      </view>
    </scroll-view>

    <!-- 底部固定操作栏 (保持不变) -->
    <view class="bottom-bar">
      <view class="bar-item" @click="toggleLike">
        <u-icon 
          :name="post.is_liked ? 'heart-fill' : 'heart'" 
          :color="post.is_liked ? '#ff4d4f' : '#666'" 
          size="22"
        ></u-icon>
        <text :class="{ 'active-text': post.is_liked }">{{ post.like_count || 0 }}</text>
      </view>
      
      <view class="bar-item" @click="toggleCollect">
        <u-icon 
          :name="post.is_favorited ? 'star-fill' : 'star'" 
          :color="post.is_favorited ? '#ff9900' : '#666'" 
          size="22"
        ></u-icon>
        <text :class="{ 'active-text': post.is_favorited }">{{ post.favorite_count || 0 }}</text>
      </view>

      <view class="bar-item comment-btn" @click="showCommentPopup = true">
        <u-icon name="chat" color="#666" size="22"></u-icon>
        <text>评论</text>
      </view>
    </view>

    <!-- 评论弹窗 (保持不变) -->
    <u-popup :show="showCommentPopup" mode="bottom" round="12" @close="showCommentPopup = false">
      <view class="popup-content">
        <view class="popup-header">
          <text>发表评论</text>
          <u-icon name="close" @click="showCommentPopup = false"></u-icon>
        </view>
        
        <view v-if="replyTarget" class="reply-tip">
          回复 @{{ replyTarget.targetUser }} 
          <text class="cancel" @click="cancelReply">取消</text>
        </view>

        <textarea 
          v-model="newComment" 
          placeholder="写下你的想法..." 
          class="comment-input"
          auto-height
          maxlength="500"
          focus
        ></textarea>
        
        <u-button type="primary" block @click="submitComment">发送</u-button>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
// ... script 部分保持不变，之前的 fetchDetail 逻辑已经正确将 res.data 赋值给 post.value ...
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import request from '@/utils/request'
import CommentTree from './components/CommentTree.vue'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()
const postId = ref<number>(0)
const post = ref<any>({})
const commentList = ref<any[]>([])
const showCommentPopup = ref(false)
const newComment = ref('')
const replyTarget = ref<{ parentId: number; targetUser: string } | null>(null)

const rootPage = ref(1)
const hasMoreRootComments = ref(false)
const rootSize = 10

onLoad((options) => {
  if (options && options.id) {
    postId.value = Number(options.id)
    fetchDetail()
  }
})

const fetchDetail = async () => {
  try {
    // 假设 request.get 返回的是 { code, data, message }
    const res = await request.get(`/api/community/posts/${postId.value}`)
    
    // 根据你提供的返回值样式，数据在 res.data 中
    // 如果 request 拦截器已经解包了 data，则直接用 res
    // 这里假设 res 是完整响应，所以取 res.data
    const postData = res.data || res 
    
    post.value = postData
    
    // 初始化默认值，防止 undefined 导致 UI 错误
    if (!post.value.is_liked) post.value.is_liked = false
    // 注意：接口返回的是 is_favorited，但之前代码可能用的是 is_collected
    // 这里统一使用接口返回的字段 is_favorited
    if (post.value.is_favorited === undefined) post.value.is_favorited = false
    
    if (!post.value.like_count) post.value.like_count = 0
    if (!post.value.favorite_count) post.value.favorite_count = 0 // 对应接口的 favorite_count
    if (!post.value.comment_count) post.value.comment_count = 0
    
    // 重置评论状态
    rootPage.value = 1
    commentList.value = []
    fetchComments(true)
  } catch (e) {
    console.error(e)
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

// ... 其余函数 (buildQueryString, fetchComments, handleLoadMoreReplies 等) 保持不变 ...

const buildQueryString = (params: Record<string, any>) => {
  const parts: string[] = []
  for (const key in params) {
    if (params[key] !== undefined && params[key] !== null) {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    }
  }
  return parts.join('&')
}

const fetchComments = async (isRefresh = false) => {
  try {
    if (isRefresh) {
      rootPage.value = 1
      commentList.value = []
    }

    const params = {
      target_type: 'post',
      target_id: postId.value,
      page: rootPage.value,
      size: rootSize,
      reply_limit: 3
    }
    
    const queryString = buildQueryString(params)
    const url = `/api/community/comments/tree?${queryString}`

    const res = await request.get(url)
    const data = res.data || res // 兼容处理
    const newList = data.list || []
    
    if (isRefresh) {
      commentList.value = newList
    } else {
      commentList.value = [...commentList.value, ...newList]
    }

    hasMoreRootComments.value = data.total > commentList.value.length

  } catch (e) {
    console.error('获取评论失败', e)
    uni.showToast({ title: '评论加载失败', icon: 'none' })
  }
}

const loadMoreRootComments = () => {
  rootPage.value++
  fetchComments(false)
}

const handleLoadMoreReplies = async (data: { rootId: number }) => {
  const { rootId } = data
  const rootComment = commentList.value.find(c => c.id === rootId)
  if (!rootComment) return

  if (!rootComment.replyPage) {
    rootComment.replyPage = 1
  }
  rootComment.replyPage++

  try {
    const params = {
      root_id: rootId,
      page: rootComment.replyPage,
      size: 20
    }
    
    const queryString = buildQueryString(params)
    const url = `/api/community/comments/replies?${queryString}`

    const res = await request.get(url)
    const replyData = res.data || res
    const newReplies = replyData.list || []

    if (newReplies.length > 0) {
      if (!rootComment.replies) {
        rootComment.replies = []
      }
      rootComment.replies.push(...newReplies)
      
      const currentTotalLoaded = rootComment.replies.length
      const totalReplies = replyData.total
      
      if (currentTotalLoaded >= totalReplies || newReplies.length < 20) {
        rootComment.has_more_replies = false
      } else {
        rootComment.has_more_replies = true
      }
    } else {
      rootComment.has_more_replies = false
    }

  } catch (e) {
    console.error('加载子回复失败', e)
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

const toggleLike = async () => {
  try {
    await request.post(`/api/community/posts/${postId.value}/like`)
    post.value.is_liked = !post.value.is_liked
    post.value.like_count += post.value.is_liked ? 1 : -1
  } catch (e) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

const toggleCollect = async () => {
  try {
    // 注意：接口字段是 favorite，所以路径可能是 /favorite 或 /collect，请根据实际后端调整
    // 这里假设后端路径是 /collect 或者 /favorite，根据 PostCard.vue 之前用的是 collect
    // 但接口返回的是 is_favorited 和 favorite_count
    // 假设后端接口路径为 /api/community/posts/{id}/favorite
    await request.post(`/api/community/posts/${postId.value}/favorite`)
    post.value.is_favorited = !post.value.is_favorited
    post.value.favorite_count += post.value.is_favorited ? 1 : -1
  } catch (e) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

const handleSetReplyTarget = (target: any) => {
  replyTarget.value = target
  showCommentPopup.value = true
}

const cancelReply = () => {
  replyTarget.value = null
}

const submitComment = async () => {
  if (!newComment.value.trim()) {
    uni.showToast({ title: '内容不能为空', icon: 'none' })
    return
  }
  
  const userId = userStore.userInfo?.user_id
  if (!userId) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }

  try {
    await request.post(`/api/community/posts/${postId.value}/comments`, {
      content: newComment.value,
      parent_id: replyTarget.value ? replyTarget.value.parentId : 0,
      user_id: userId
    })
    uni.showToast({ title: '评论成功', icon: 'success' })
    newComment.value = ''
    replyTarget.value = null
    showCommentPopup.value = false
    
    fetchComments(true)
    post.value.comment_count++
  } catch (e) {
    uni.showToast({ title: '评论失败', icon: 'none' })
  }
}

const preview = (url: string) => {
  uni.previewImage({ urls: [url] })
}

const goBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack({ delta: 1 })
  } else {
    uni.switchTab({ url: '/pages/community/Community' })
  }
}
</script>

<style scoped>
/* 样式保持不变 */
.detail-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  position: relative;
}

.float-back-btn {
  position: fixed;
  top: 40px;
  left: 16px;
  width: 36px;
  height: 36px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
}

.float-back-btn:active {
  background-color: #f0f0f0;
  transform: scale(0.95);
}

.content-scroll {
  flex: 1;
}

.post-body {
  background: #fff;
  padding: 16px;
  min-height: 100%;
}

.header {
  margin-bottom: 20px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #111827;
  margin-bottom: 12px;
  display: block;
  line-height: 1.4;
}

.meta {
  display: flex;
  align-items: center;
}

.info {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.date {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

.main-content {
  margin-bottom: 24px;
}

.content-text {
  font-size: 15px;
  line-height: 1.7;
  color: #374151;
  display: block;
  margin-bottom: 16px;
  white-space: pre-wrap;
}

.images {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.post-img {
  width: 100%;
  border-radius: 8px;
  max-height: 300px;
  background-color: #f3f4f6;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
  border-left: 4px solid #2563eb;
  padding-left: 10px;
  color: #111827;
}

.load-more-root {
  text-align: center;
  padding: 15px 0;
  color: #2563eb;
  font-size: 14px;
  cursor: pointer;
  background-color: #f9fafb;
  margin-top: 10px;
  border-radius: 8px;
}

.bottom-bar {
  height: 50px;
  background: #fff;
  border-top: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -2px 10px rgba(0,0,0,0.03);
  z-index: 10;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  color: #6b7280;
  gap: 2px;
  transition: color 0.2s;
}

.active-text {
  color: #2563eb;
}

.popup-content {
  padding: 16px;
  background: #fff;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 16px;
  color: #111827;
}

.reply-tip {
  font-size: 12px;
  color: #2563eb;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.cancel {
  color: #9ca3af;
  margin-left: 8px;
  font-size: 12px;
}

.comment-input {
  background: #f9fafb;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 12px;
  min-height: 80px;
  font-size: 14px;
  color: #374151;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: #9ca3af;
}
</style>