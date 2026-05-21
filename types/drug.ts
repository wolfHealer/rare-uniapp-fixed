import type { DiseaseFilterValue, QueryParams, RegionSelection } from './common'
import type { FilterParamsMap } from './filter'
import type { DiseaseBrief } from './medical'

export interface DrugListItem {
  id: number
  generic_name: string
  brand_name?: string
  indication: string
  drug_type: string
  is_insurance: boolean
  dosage_form?: string
  spec?: string
  ref_price?: string
  has_relief?: boolean
  is_launched?: boolean
  need_prescription?: boolean
  manual_original?: string
  manual_popular?: string
  [key: string]: unknown
}

/** 药品详情（后端驼峰字段） */
export interface DrugDetailData {
  id: number
  genericName: string
  brandName?: string
  indication: string
  drugType: string
  isInsurance: boolean
  dosageForm?: string
  spec?: string
  refPrice?: string
  hasRelief?: boolean
  isLaunched?: boolean
  needPrescription?: boolean
  manualOriginal?: string
  manualPopular?: string
  auditStatus?: number
  diseases?: DiseaseBrief[]
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

export interface DrugOptionItem {
  label: string
  value: string
}

export interface DrugOptionsData {
  types?: DrugOptionItem[]
  insurances?: DrugOptionItem[]
}

export interface DrugFilterParams extends FilterParamsMap {
  drug_type?: string
  is_insurance?: string
}

export interface ChannelFilterParams extends FilterParamsMap {
  region?: RegionSelection
  delivery?: string
  channel_type?: string
}

export interface ChannelListItem {
  id: number
  name?: string
  provinceName?: string
  cityName?: string
  districtName?: string
  address?: string
  phone?: string
  website?: string
  [key: string]: unknown
}

export interface DrugChannelDrugBrief {
  id: number
  genericName?: string
  brandName?: string
}

export interface DrugChannelDetailData extends ChannelListItem {
  channelType?: string
  contactPhone?: string
  contactUrl?: string
  deliveryScope?: string
  desc?: string
  drugs?: DrugChannelDrugBrief[]
  qualification?: string
  auditStatus?: number
}

/** 赠药项目列表/详情（兼容多种字段名） */
export interface DonationProjectItem {
  id: number
  name?: string
  diseaseId?: number
  diseaseName?: string
  drugId?: number
  drugName?: string
  organizer?: string
  applyCondition?: string
  condition?: string
  reliefCycle?: string
  period?: string
  reliefDosageDesc?: string
  dosage?: string
  applyForm?: string
  applyGuide?: string
  materialList?: string
  progressQuery?: string
  auditStatus?: number
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

export type DonationProjectDetailData = DonationProjectItem

export interface DonationProjectBrief {
  id: number
  name: string
  condition?: string
  period?: string
  organizer?: string
  auditStatus?: number
}

export interface DonationApplyFormState {
  patientName: string
  patientIdCard: string
  contactPhone: string
  diagnosisHospital: string
  diagnosisTime: string
  incomeProof: string
  remark: string
}

export interface DonationProjectFilterParams extends FilterParamsMap {
  disease?: DiseaseFilterValue
}

export type DrugListQuery = QueryParams
