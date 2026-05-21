import request from '@/utils/request'
import type {
  ChannelListItem,
  DonationProjectBrief,
  DonationProjectDetailData,
  DonationProjectItem,
  DrugChannelDetailData,
  DrugDetailData,
  DrugListItem
} from '@/types/drug'
import type { PaginatedList, PagedQuery } from '@/types/common'

export const drugApi = {
  getDrugOptions() {
    return request.get('/api/resource/drug/drugs/options')
  },
  listDrugs(params: PagedQuery) {
    return request.get<PaginatedList<DrugListItem>>('/api/resource/drug/drugs', params)
  },
  getDrug(id: number) {
    return request.get<DrugDetailData>(`/api/resource/drug/drugs/${id}`)
  },
  exportDrugs(params?: PagedQuery) {
    return request.get('/api/resource/drug/drugs/export', params)
  },
  listDonations(params: PagedQuery) {
    return request.get<PaginatedList<DonationProjectItem>>('/api/resource/drug/donations', params)
  },
  getDonation(id: number) {
    return request.get<DonationProjectBrief | DonationProjectDetailData>(`/api/resource/drug/donations/${id}`)
  },
  applyDonation(id: number, data: Record<string, unknown>) {
    return request.post(`/api/resource/drug/donations/${id}/apply`, data)
  },
  listChannels(params: PagedQuery) {
    return request.get<PaginatedList<ChannelListItem>>('/api/resource/drug/channels', params)
  },
  getChannel(id: number) {
    return request.get<DrugChannelDetailData>(`/api/resource/drug/channels/${id}`)
  }
}
