import request from '@/utils/request'
import type {
  AidProjectDetailData,
  AidProjectItem,
  CaseShareDetailData,
  CaseShareItem,
  HelpChannelDetailData,
  HelpChannelItem
} from '@/types/charity'
import type { PaginatedList, PagedQuery } from '@/types/common'

export const charityApi = {
  listCases(params: PagedQuery) {
    return request.get<PaginatedList<CaseShareItem>>('/api/resource/charity/cases', params)
  },
  getCase(id: number) {
    return request.get<CaseShareDetailData>(`/api/resource/charity/cases/${id}`)
  },
  listProjects(params: PagedQuery) {
    return request.get<PaginatedList<AidProjectItem>>('/api/resource/charity/projects', params)
  },
  getProject(id: number) {
    return request.get<AidProjectDetailData>(`/api/resource/charity/projects/${id}`)
  },
  applyProject(data: Record<string, unknown>) {
    return request.post('/api/resource/charity/apply', data)
  },
  listChannels(params: PagedQuery) {
    return request.get<PaginatedList<HelpChannelItem>>('/api/resource/charity/channels', params)
  },
  getChannel(id: number) {
    return request.get<HelpChannelDetailData>(`/api/resource/charity/channels/${id}`)
  },
  getChannelTemplate() {
    return request.get('/api/resource/charity/channels/template')
  }
}
