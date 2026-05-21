import type { DiseaseFilterValue, QueryParams, RegionSelection } from './common'

export interface DiseaseBrief {
  id: number
  name: string
  alias?: string
}

export interface DoctorReview {
  id: number
  content: string
  date: string
  rating: number
}

/** 医生列表/详情（同一后端实体） */
export interface DoctorListItem {
  id: number
  name: string
  hospital?: string
  hospitalName?: string
  department?: string
  title?: string
  goodAt?: string
  rating?: number
  reviewCount?: number
  score?: number
  commentNum?: number
  isRareNetwork?: boolean
  region?: string
  level?: string
  address?: string
  contact?: string
  clinicTime?: string
  diseaseIds?: number[]
  diseases?: DiseaseBrief[]
  reviews?: DoctorReview[]
  auditStatus?: number
  cityCode?: string
  cityName?: string
  districtCode?: string
  districtName?: string
  hospitalId?: number
  provinceCode?: string
  provinceName?: string
  [key: string]: unknown
}

export type DoctorDetailData = DoctorListItem

export interface HospitalListItem {
  id: number
  name: string
  level?: string | number
  levelName?: string
  address?: string
  phone?: string
  treatScope?: string
  isRareNetwork?: boolean
  [key: string]: unknown
}

/** 检查项目列表/详情 */
export interface ExaminationListItem {
  id: number
  name?: string
  examName?: string
  examPurpose?: string
  examType?: string
  price?: number
  duration?: string
  sampleNotes?: string
  institution?: string
  diseaseIds?: number[]
  sort?: number
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

export type ExaminationDetailData = ExaminationListItem

export interface HospitalReview {
  id?: number
  content?: string
  rating?: number
  user_name?: string
  [key: string]: unknown
}

export interface HospitalDetailData {
  id: number
  name: string
  level: string
  levelText: string
  specialty: string
  address?: string
  phone?: string
  rating?: number
  reviewCount?: number
  reviews?: HospitalReview[]
  isNetworkMember?: boolean
  latitude?: number
  longitude?: number
  diseases?: DiseaseBrief[]
}

export interface HospitalFilterParams {
  region?: RegionSelection
  level?: string
  disease?: DiseaseFilterValue
}

export interface DoctorFilterParams {
  disease?: DiseaseFilterValue
  hospital?: { hospitalId?: number | string; hospitalName?: string }
  title?: string
}

export type HospitalListQuery = QueryParams
export type DoctorListQuery = QueryParams
