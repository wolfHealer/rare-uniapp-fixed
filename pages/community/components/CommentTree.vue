<template>
  <view class="comment-tree">
    <view v-for="comment in comments" :key="comment.id" class="comment-item">
      <view class="comment-main flex-row">
        <!-- 头像占位 -->
        <view class="avatar-placeholder">
          <u-icon name="account" size="16" color="#999"></u-icon>
        </view>
        
        <view class="comment-content">
          <view class="user-info-row">
            <text class="username">{{ comment.user_name || comment.display_name || '匿名用户' }}</text>
            <text class="time">{{ comment.created_at }}</text>
          </view>
          
          <!-- 评论内容 -->
          <view class="content-text" user-select="true">{{ comment.content }}</view>
          
          <view class="action-row">
             <text class="reply-btn" @click="setReplyTarget(comment)">
              回复
            </text>
          </view>
        </view>
      </view>

      <!-- 递归渲染子评论 (replies) -->
      <view class="replies-container" v-if="comment.replies && comment.replies.length > 0">
        <CommentTree
          :comments="comment.replies"
          @set-reply-target="$emit('set-reply-target', $event)"
          @load-more-replies="$emit('load-more-replies', $event)"
        />
        
        <!-- 查看更多回复按钮 -->
        <view 
          v-if="comment.has_more_replies" 
          class="load-more-replies-btn"
          @click="loadMoreReplies(comment.id)"
        >
          查看更多回复
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits(['set-reply-target', 'load-more-replies'])

defineProps<{
  comments: any[]
}>()

const setReplyTarget = (comment: any) => {
  emit('set-reply-target', {
    parentId: comment.id,
    targetUser: comment.user_name || comment.display_name
  })
}

const loadMoreReplies = (rootId: number) => {
  emit('load-more-replies', {
    rootId: rootId
  })
}
</script>

<style scoped>
.comment-tree {
  width: 100%;
}

.comment-item {
  margin-bottom: 12px;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.user-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.time {
  font-size: 12px;
  color: #9ca3af;
}

.content-text {
  font-size: 14px;
  color: #374151;
  margin-top: 4px;
  line-height: 1.5;
}

.action-row {
  display: flex;
  align-items: center;
  margin-top: 4px;
}

.reply-btn {
  font-size: 12px;
  color: #3b82f6;
  cursor: pointer;
  margin-right: 16px;
}

/* 子评论容器 */
.replies-container {
  margin-left: 40px;
  margin-top: 8px;
  background-color: #f9fafb;
  padding: 8px;
  border-radius: 8px;
}

/* 查看更多回复按钮样式 */
.load-more-replies-btn {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  margin-top: 8px;
  padding: 4px 0;
  cursor: pointer;
  border-radius: 4px;
}

/* 模拟 hover 效果在小程序中较难完美实现，通常使用 active 或点击态 */
.load-more-replies-btn:active {
  background-color: #f3f4f6;
}
</style>