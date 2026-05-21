import type { DiseaseFilterValue, QueryParams } from './common'
import type { FilterParamsMap } from './filter'
import type { UviewTagType } from './ui'

export interface CaseShareItem {
  id: number
  diseaseId?: number
  diseaseName?: string
  projectId?: number
  projectName?: string
  caseTitle?: string
  patientDesc?: string
  applyCycle?: string
  actualRelief?: string
  experience?: string
  pitfallGuide?: string
  casePdf?: string
  materialTemplate?: string
  auditStatus?: number
  rejectReason?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

export type CaseShareDetailData = CaseShareItem

export interface AidProjectItem {
  id: number
  name?: string
  organizer?: string
  status?: string
  reliefType?: string | number
  reliefStandard?: string
  applyCondition?: string
  applyDifficulty?: string
  diseaseIds?: number[]
  auditStatus?: number
  rejectReason?: string
  sort?: number
  updatedAt?: string
  applyForm?: string
  applyGuide?: string
  materialList?: string
  contact?: string
  [key: string]: unknown
}

export type AidProjectDetailData = AidProjectItem

export interface HelpChannelItem {
  id: number
  name?: string
  channelType?: string
  applyCondition?: string
  responseTime?: string
  contactPhone?: string
  contactUrl?: string
  helpLetterTemplate?: string
  crowdfundingTemplate?: string
  auditStatus?: number
  rejectReason?: string
  sort?: number
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

export type HelpChannelDetailData = HelpChannelItem

export interface AidProjectFilterParams extends FilterParamsMap {
  type?: string
  disease?: DiseaseFilterValue
  difficulty?: string | number
}

export interface HelpChannelFilterParams extends FilterParamsMap {
  disease?: DiseaseFilterValue
  channelType?: string
}

export type ChannelTypeTagMap = Record<string, UviewTagType>

export type CharityListQuery = QueryParams
