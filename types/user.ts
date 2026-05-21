import type { PaginatedList, PagedQuery } from './common'
import type { CommunityPost } from './community'
import type { UploadFileItem } from './ui'

export type { UploadFileItem }

export interface UserInfo {
  user_id: number
  nickname: string
  phone: string
  avatar: string
}

/** 登录接口实际返回（字段在 data 顶层） */
export interface LoginResponseData {
  token: string
  user_id: number
  nickname: string
  phone: string
  avatar: string
}

export interface LoginPayload {
  phone: string
  password: string
}

export interface RegisterPayload {
  phone: string
  code: string
  password: string
}

export interface SendSmsPayload {
  phone: string
  /** register | reset_password | change_phone */
  scene?: string
}

export interface UpdateProfilePayload {
  nickname?: string
  avatar?: string
  phone?: string
}

export interface ChangePasswordPayload {
  old_password: string
  new_password: string
}

export interface ResetPasswordPayload {
  phone: string
  code: string
  new_password: string
}

export interface UploadAvatarResult {
  url: string
}

/** 收藏条目（帖子 / 文章 / 资源等，按 target_type 区分） */
export type FavoriteTargetType = 'post' | 'article' | 'resource' | string

export interface FavoriteItem {
  id: number
  target_type: FavoriteTargetType
  target_id: number
  title?: string
  description?: string
  cover?: string
  created_at?: string
  [key: string]: unknown
}

export interface FavoriteListQuery extends PagedQuery {
  target_type?: FavoriteTargetType
}

export interface RemoveFavoritePayload {
  target_type: FavoriteTargetType
  target_id: number
}

/** 我的发布（社区帖） */
export interface MyPostsQuery extends PagedQuery {
  status?: string
}

/** 我的问诊 / 咨询记录（预留） */
export interface ConsultationItem {
  id: number
  title?: string
  status?: string
  doctor_name?: string
  created_at?: string
  [key: string]: unknown
}

export interface UserSettings {
  notify_enabled?: boolean
  privacy_level?: string
  [key: string]: unknown
}

export type MyPostList = PaginatedList<CommunityPost>
export type FavoriteList = PaginatedList<FavoriteItem>
export type ConsultationList = PaginatedList<ConsultationItem>

export interface ProfileFormState {
  nickname: string
  avatar: string
}
