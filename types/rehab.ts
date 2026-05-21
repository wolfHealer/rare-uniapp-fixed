import type { DiseaseFilterValue, QueryParams, RegionSelection } from './common'
import type { FilterParamsMap } from './filter'
import type { DiseaseBrief } from './medical'

export interface RehabGuideItem {
  id: number
  title?: string
  pdfUrl?: string
  stage?: string
  rehabStage?: string
  trainPurpose?: string
  trainContent?: string
  forbiddenAction?: string
  picUrls?: string[]
  guidePdf?: string
  guideWord?: string
  diseases?: DiseaseBrief[]
  auditStatus?: number
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

export type RehabGuideDetailData = RehabGuideItem

export interface RehabStaffBrief {
  name: string
  title?: string
  specialty?: string
}

export interface RehabInstitutionItem {
  id: number
  name?: string
  provinceName?: string
  cityName?: string
  districtName?: string
  address?: string
  [key: string]: unknown
}

export interface RehabInstitutionDetailData extends RehabInstitutionItem {
  typeName?: string
  contactPhone?: string
  contactUrl?: string
  qualification?: string
  rehabProjects?: string
  feeStandard?: string
  diseases?: DiseaseBrief[]
  auditStatus?: number
  rating?: number
  status?: string
  coverUrl?: string
  images?: string[]
  businessHours?: string
  facilities?: string[]
  doctors?: RehabStaffBrief[]
  isInsurance?: boolean
}

export interface PsychologicalCounselor {
  name: string
  title?: string
  specialty?: string
}

export interface PsychologicalOrgItem {
  id: number
  name?: string
  type?: string
  typeName?: string
  provinceName?: string
  cityName?: string
  region?: string
  regionName?: string
  address?: string
  contact?: string
  phone?: string
  isFree?: boolean
  serviceTime?: string
  description?: string
  rating?: number
  status?: string
  consultWay?: string
  [key: string]: unknown
}

export interface PsychologicalOrgDetailData extends PsychologicalOrgItem {
  services?: string[]
  counselors?: PsychologicalCounselor[]
  website?: string
  latitude?: number
  longitude?: number
}

export interface RehabInstitutionFilterParams extends FilterParamsMap {
  disease?: DiseaseFilterValue
  region?: RegionSelection
}

export interface PsychologicalOrgFilterParams extends FilterParamsMap {
  region?: RegionSelection
  isFree?: string
  consultWay?: string
}

export interface RehabGuideFilterParams extends FilterParamsMap {
  disease?: DiseaseFilterValue
  stage?: string
}

export type RehabListQuery = QueryParams
