import request from '@/utils/request'
import type { ArticleDetailData, DiseaseDetailData } from '@/types/knowledge'

export const knowledgeApi = {
  getDiseaseTree() {
    return request.get('/api/knowledge/disease-tree')
  },
  getDisease(id: number | string) {
    return request.get<DiseaseDetailData>(`/api/knowledge/disease/${id}`)
  },
  getArticle(id: number | string) {
    return request.get<ArticleDetailData>(`/api/knowledge/article/${id}`)
  },
  getCategoryDiseases(categoryId: number | string) {
    return request.get(`/api/knowledge/category/${categoryId}/diseases`)
  },
  searchDiseases(params: Record<string, unknown>) {
    return request.get('/api/knowledge/diseases/search', params)
  }
}
