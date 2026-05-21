export interface PolicyItem {
  id: number
  title?: string
  region?: string
  date?: string
  [key: string]: unknown
}

export interface PolicyRelatedItem {
  id: number
  title: string
}

export interface PolicyDetailData {
  id: number
  title: string
  region: string
  regionCode: string
  publishDate: string
  category: string
  content: string
  fileUrl: string
  relatedPolicies?: PolicyRelatedItem[]
}

export interface PolicyListData {
  policies?: {
    national?: PolicyItem[]
    province?: PolicyItem[]
    city?: PolicyItem[]
  }
  total?: number
}
