// types/filter.ts

export interface FilterOption {
  label: string
  value: any
}

// 添加 'provinceCity'
export type FilterType = 'region' | 'hospital' | 'tags' | 'disease' | 'provinceCity'

export interface FilterConfigItem {
  key: string
  label: string
  type: FilterType
  options?: FilterOption[]
  placeholder?: string
}