import { ref } from 'vue'

export type LoadStatus = 'loading' | 'loadmore' | 'nomore'

export interface PagedFetchResult<T> {
  list: T[]
  hasMore: boolean
}

export interface UsePagedListOptions<T> {
  pageSize?: number
  /** 拉取一页数据，由调用方对接 api 并解析响应 */
  fetchPage: (page: number, pageSize: number) => Promise<PagedFetchResult<T>>
  onError?: (error: unknown) => void
}

/**
 * 通用分页列表：搜索/筛选后调用 refresh()，滚动触底调用 onLoadMore()
 */
export function usePagedList<T>(options: UsePagedListOptions<T>) {
  const pageSize = options.pageSize ?? 10
  const list = ref<T[]>([])
  const loading = ref(false)
  const loadStatus = ref<LoadStatus>('loadmore')
  const currentPage = ref(1)

  const load = async (isRefresh = false) => {
    if (isRefresh) {
      currentPage.value = 1
      list.value = []
      loadStatus.value = 'loading'
    } else if (loadStatus.value === 'nomore') {
      return
    }

    if (loading.value && !isRefresh) return

    loading.value = true
    if (!isRefresh && loadStatus.value !== 'loading') {
      loadStatus.value = 'loading'
    }

    try {
      const { list: records, hasMore } = await options.fetchPage(currentPage.value, pageSize)

      if (isRefresh) {
        list.value = records
      } else {
        list.value.push(...records)
      }

      if (hasMore) {
        loadStatus.value = 'loadmore'
        currentPage.value++
      } else {
        loadStatus.value = 'nomore'
      }
    } catch (error) {
      options.onError?.(error)
      loadStatus.value = list.value.length > 0 ? 'loadmore' : 'loadmore'
      uni.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      loading.value = false
    }
  }

  const refresh = () => load(true)
  const onLoadMore = () => load(false)

  return {
    list,
    loading,
    loadStatus,
    currentPage,
    pageSize,
    refresh,
    onLoadMore,
    load
  }
}
