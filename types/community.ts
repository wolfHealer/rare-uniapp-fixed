import type { DiseaseFilterValue } from './common'
import type { FilterFieldValue } from './filter'

export interface CommunityPost {
  id: number
  title?: string
  content?: string
  display_name?: string
  avatar?: string
  created_at?: string
  images?: string[]
  is_liked?: boolean
  is_favorited?: boolean
  like_count?: number
  favorite_count?: number
  comment_count?: number
  [key: string]: unknown
}

export interface PostListQuery {
  disease_id?: number | null
  type?: string
  sort?: string
  page?: number
  limit?: number
}

export interface CreatePostPayload {
  title?: string
  content: string
  disease_id?: number | null
  type?: string
  images?: string[]
  [key: string]: unknown
}

export interface CommentItem {
  id: number
  content?: string
  user_name?: string
  display_name?: string
  created_at?: string
  replies?: CommentItem[]
  has_more_replies?: boolean
  replyPage?: number
  [key: string]: unknown
}

export interface CommentTreeQuery {
  target_type?: string
  target_id?: number
  page?: number
  size?: number
  reply_limit?: number
  root_id?: number
}

export interface CommentReplyTarget {
  parentId: number
  targetUser?: string
}

export interface PostCommentEmitPayload {
  post: CommunityPost
  newComment?: CommentItem
  comments?: CommentItem[]
}

export interface CommunityFilterParams extends Record<string, FilterFieldValue> {
  disease?: DiseaseFilterValue
  postType?: string
  sortOrder?: string
}

export interface PostListExpose {
  refresh: () => void
}
