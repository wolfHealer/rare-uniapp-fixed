import request from '@/utils/request'
import type { PolicyDetailData, PolicyListData } from '@/types/medicare'
import type { PagedQuery } from '@/types/common'

export const medicareApi = {
  listPolicies(params: PagedQuery) {
    return request.get<PolicyListData>('/api/resource/medicare/policies', params)
  },
  getPolicy(id: number) {
    return request.get<PolicyDetailData>(`/api/resource/medicare/policies/${id}`)
  }
}
