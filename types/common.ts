/** 后端统一响应（与 utils/request ApiResponse 对齐） */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  request_id?: string
}

export interface PaginatedList<T> {
  list: T[]
  total?: number
}

export interface PagedQuery {
  page?: number
  pageSize?: number
  limit?: number
  keyword?: string
  [key: string]: unknown
}

export interface RegionNode {
  code: string
  name: string
  level: number
  children?: RegionNode[]
}

export interface RegionSelection {
  provinceCode?: string
  provinceName?: string
  cityCode?: string
  cityName?: string
  districtCode?: string
  districtName?: string
}

export interface DiseaseFilterValue {
  diseaseId?: number | string
  diseaseName?: string
}

/** 列表/详情请求查询参数 */
export type QueryParams = Record<string, string | number | boolean | undefined | null>

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
