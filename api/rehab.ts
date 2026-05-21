import request from '@/utils/request'
import type {
  PsychologicalOrgDetailData,
  PsychologicalOrgItem,
  RehabGuideDetailData,
  RehabGuideItem,
  RehabInstitutionDetailData,
  RehabInstitutionItem
} from '@/types/rehab'
import type { PaginatedList, PagedQuery } from '@/types/common'

export const rehabApi = {
  listInstitutions(params: PagedQuery) {
    return request.get<PaginatedList<RehabInstitutionItem>>('/api/resource/rehab/institutions', params)
  },
  getInstitution(id: number) {
    return request.get<RehabInstitutionDetailData>(`/api/resource/rehab/institutions/${id}`)
  },
  listPsychologicalOrgs(params: PagedQuery) {
    return request.get<PaginatedList<PsychologicalOrgItem>>('/api/resource/rehab/psychological/orgs', params)
  },
  getPsychologicalOrg(id: number) {
    return request.get<PsychologicalOrgDetailData>(`/api/resource/rehab/psychological/orgs/${id}`)
  },
  listGuides(params: PagedQuery) {
    return request.get<PaginatedList<RehabGuideItem>>('/api/resource/rehab/trainings', params)
  },
  getGuide(id: number) {
    return request.get<RehabGuideDetailData>(`/api/resource/rehab/trainings/${id}`)
  }
}
