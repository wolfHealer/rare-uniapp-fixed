import request from '@/utils/request'
import type {
  ChangePasswordPayload,
  ConsultationList,
  FavoriteList,
  FavoriteListQuery,
  LoginPayload,
  LoginResponseData,
  MyPostsQuery,
  MyPostList,
  RegisterPayload,
  RemoveFavoritePayload,
  ResetPasswordPayload,
  SendSmsPayload,
  UpdateProfilePayload,
  UploadAvatarResult,
  UserInfo,
  UserSettings
} from '@/types/user'

/**
 * 用户中心 / 认证相关接口
 * 路径与 pages/user/* 页面对应，后端未就绪时可在页面侧继续 mock
 */
export const userApi = {
  // --- 认证 ---
  login(data: LoginPayload) {
    return request.post<LoginResponseData>('/api/auth/login', data)
  },
  register(data: RegisterPayload) {
    return request.post<LoginResponseData>('/api/auth/register', data)
  },
  sendSmsCode(data: SendSmsPayload) {
    return request.post<void>('/api/auth/sms/send', data)
  },
  logout() {
    return request.post<void>('/api/auth/logout')
  },
  forgotPassword(data: Pick<SendSmsPayload, 'phone'>) {
    return request.post<void>('/api/auth/password/forgot', data)
  },
  resetPassword(data: ResetPasswordPayload) {
    return request.post<void>('/api/auth/password/reset', data)
  },

  // --- 个人资料（Profile / ProfileEdit）---
  getProfile() {
    return request.get<UserInfo>('/api/user/profile')
  },
  updateProfile(data: UpdateProfilePayload) {
    return request.put<UserInfo>('/api/user/profile', data)
  },
  uploadAvatar(filePath: string) {
    return request.upload<UploadAvatarResult>('/api/user/avatar', filePath, {
      showLoading: true
    })
  },
  changePassword(data: ChangePasswordPayload) {
    return request.put<void>('/api/user/password', data)
  },

  // --- 我的收藏（Favorites）---
  listFavorites(params?: FavoriteListQuery) {
    return request.get<FavoriteList>('/api/user/favorites', params)
  },
  removeFavorite(id: number) {
    return request.delete<void>(`/api/user/favorites/${id}`)
  },
  removeFavoriteByTarget(data: RemoveFavoritePayload) {
    return request.delete<void>('/api/user/favorites', data)
  },

  // --- 我的发布（MyPosts）---
  listMyPosts(params?: MyPostsQuery) {
    return request.get<MyPostList>('/api/user/posts', params)
  },
  deleteMyPost(id: number) {
    return request.delete<void>(`/api/user/posts/${id}`)
  },

  // --- 我的问诊（Profile 菜单「我的问诊」，页面待建）---
  listMyConsultations(params?: MyPostsQuery) {
    return request.get<ConsultationList>('/api/user/consultations', params)
  },
  getConsultation(id: number) {
    return request.get(`/api/user/consultations/${id}`)
  },

  // --- 设置（Profile 菜单「设置」）---
  getSettings() {
    return request.get<UserSettings>('/api/user/settings')
  },
  updateSettings(data: UserSettings) {
    return request.put<UserSettings>('/api/user/settings', data)
  }
}
