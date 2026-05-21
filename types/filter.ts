// types/filter.ts
import type { DiseaseFilterValue, RegionSelection } from './common'

export interface FilterOption {
  label: string
  value: string | number | boolean | null
}

export type FilterType = 'region' | 'hospital' | 'tags' | 'disease' | 'provinceCity'

export interface FilterConfigItem {
  key: string
  label: string
  type: FilterType
  options?: FilterOption[]
  placeholder?: string
}

/** SmartFilterBar v-model 单字段值 */
export type FilterFieldValue =
  | string
  | number
  | boolean
  | null
  | DiseaseFilterValue
  | RegionSelection
  | Record<string, unknown>

/** SmartFilterBar v-model */
export type FilterParamsMap = Record<string, FilterFieldValue>
