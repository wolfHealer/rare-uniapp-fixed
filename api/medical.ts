import request from '@/utils/request'
import type { PolicyDetailData, PolicyListData } from '@/types/medicare'
import type { PagedQuery } from '@/types/common'
import type { DoctorDetailData, DoctorListItem, ExaminationDetailData, ExaminationListItem, HospitalListItem } from '@/types/medical'

export const medicalApi = {
  listDoctors(params: PagedQuery) {
    return request.get<{ list: DoctorListItem[]; total?: number }>('/api/resource/medical/doctors', params)
  },
  getDoctor(id: number) {
    return request.get<DoctorDetailData>(`/api/resource/medical/doctors/${id}`)
  },
  listHospitals(params: PagedQuery) {
    return request.get<{ list: HospitalListItem[]; total?: number }>('/api/resource/medical/hospitals', params)
  },
  getHospital(id: number) {
    return request.get<HospitalListItem>(`/api/resource/medical/hospitals/${id}`)
  },
  listExaminations(params: PagedQuery) {
    return request.get<{ list: ExaminationListItem[]; total?: number }>('/api/resource/medical/examinations', params)
  },
  getExamination(id: number) {
    return request.get<ExaminationDetailData>(`/api/resource/medical/examinations/${id}`)
  },
  exportDoctors(params?: PagedQuery) {
    return request.download('/api/resource/medical/directory/export/doctors', params)
  }
}
