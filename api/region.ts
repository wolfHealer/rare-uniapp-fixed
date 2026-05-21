import request from '@/utils/request'
import type { RegionNode } from '@/types/common'

export const regionApi = {
  getTree() {
    return request.get<RegionNode[]>('/api/region/tree')
  },
  getProvinceCityTree() {
    return request.get<RegionNode[]>('/api/region/province-city-tree')
  }
}
