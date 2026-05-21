export interface KnowledgeCategory {
  id: number
  name: string
  icon?: string
  desc?: string
  bgColor?: string
}

export interface CategoryDiseaseItem {
  id: number
  name: string
  alias?: string
  description?: string
  introduction?: string
  [key: string]: unknown
}

export interface DiseaseTreeChild {
  id: number
  name: string
  [key: string]: unknown
}

export interface DiseaseTreeCategory {
  id: number
  name: string
  children?: DiseaseTreeChild[]
  [key: string]: unknown
}

export interface KnowledgeTag {
  id: number
  name: string
  type?: string
}

export interface DiseaseCategoryRef {
  id: number
  name: string
}

export interface ArticleBrief {
  id: number
  title: string
  summary?: string
  coverImage?: string
  sourceName?: string
  publishTime?: string
  viewCount?: number
}

export interface ArticleBlockExtra {
  url?: string
  width?: number
  height?: number
  question?: string
  answer?: string
}

export interface ArticleContentBlock {
  id: number
  blockType: 'text' | 'image' | 'faq' | string
  sortNo: number
  title?: string
  content?: string
  extra?: ArticleBlockExtra | null
}

export interface ArticleDetailData {
  id: number
  title: string
  summary?: string
  coverImage?: string
  contentType?: string
  authorId?: number
  sourceName: string
  sourceUrl?: string
  status?: number
  publishTime: string
  viewCount: number
  likeCount: number
  favoriteCount: number
  isTop?: number
  isRecommend?: number
  blocks?: ArticleContentBlock[]
  tags?: KnowledgeTag[]
}

export interface DiseaseDetailData {
  id: number
  name: string
  alias?: string
  introduction?: string
  symptoms?: string
  images?: string[]
  primaryCategoryId?: number
  primaryCategoryName?: string
  categoryIds?: number[]
  categories?: DiseaseCategoryRef[]
  tagIds?: number[]
  tags?: KnowledgeTag[]
  articles?: ArticleBrief[]
  status?: number
  content?: string
}
