import request from '@/utils/request'
import type { CommunityPost, CreatePostPayload, PostListQuery } from '@/types/community'
import type { PaginatedList } from '@/types/common'

export const communityApi = {
  listPosts(params: PostListQuery) {
    return request.get<PaginatedList<CommunityPost>>('/api/community/posts', params)
  },
  getPost(id: number) {
    return request.get<CommunityPost>(`/api/community/posts/${id}`)
  },
  createPost(data: CreatePostPayload) {
    return request.post<CommunityPost>('/api/community/posts', data)
  },
  likePost(id: number) {
    return request.post(`/api/community/posts/${id}/like`)
  },
  collectPost(id: number) {
    return request.post(`/api/community/posts/${id}/collect`)
  },
  favoritePost(id: number) {
    return request.post(`/api/community/posts/${id}/favorite`)
  },
  listComments(postId: number, params?: Record<string, unknown>) {
    return request.get(`/api/community/posts/${postId}/comments`, params)
  },
  listCommentTree(params: Record<string, unknown>) {
    return request.get('/api/community/comments/tree', params)
  },
  listCommentReplies(params: Record<string, unknown>) {
    return request.get('/api/community/comments/replies', params)
  },
  createComment(postId: number, data: Record<string, unknown>) {
    return request.post(`/api/community/posts/${postId}/comments`, data)
  }
}
