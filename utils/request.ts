export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  request_id?: string
}

export interface RequestOptions extends Omit<UniApp.RequestOptions, 'success' | 'fail' | 'complete'> {
  showLoading?: boolean
}

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '')

const buildQuery = (params?: Record<string, any>) => {
  if (!params) return ''
  const query = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')
  return query ? `?${query}` : ''
}

const request = <T = any>(options: RequestOptions): Promise<ApiResponse<T>> => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')

    if (options.showLoading) {
      uni.showLoading({ title: '加载中...', mask: true })
    }

    uni.request({
      ...options,
      url: `${BASE_URL}${options.url}`,
      method: options.method || 'GET',
      header: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...(options.header || {})
      },
      success: (res) => {
        if (options.showLoading) {
          uni.hideLoading()
        }

        const body = (res.data || {}) as ApiResponse<T>

        if (res.statusCode === 200 && body.code === 200) {
          resolve(body)
          return
        }

        if (body.code === 401) {
          uni.removeStorageSync('token')
          uni.removeStorageSync('userInfo')
          uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
          setTimeout(() => {
            uni.reLaunch({ url: '/pages/user/login/Login' })
          }, 1200)
          reject(body)
          return
        }

        uni.showToast({ title: body.message || '请求失败', icon: 'none' })
        reject(body)
      },
      fail: (error) => {
        if (options.showLoading) {
          uni.hideLoading()
        }
        uni.showToast({ title: '网络异常，请检查网络连接', icon: 'none' })
        reject(error)
      }
    })
  })
}

export default {
  get<T = any>(url: string, params?: Record<string, any>, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>) {
    return request<T>({
      url: `${url}${buildQuery(params)}`,
      method: 'GET',
      ...options
    })
  },
  post<T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>) {
    return request<T>({ url, method: 'POST', data, ...options })
  },
  put<T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>) {
    return request<T>({ url, method: 'PUT', data, ...options })
  },
  delete<T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>) {
    return request<T>({ url, method: 'DELETE', data, ...options })
  },
  download(url: string, params?: Record<string, any>) {
    const token = uni.getStorageSync('token')
    return new Promise<UniApp.DownloadSuccessData>((resolve, reject) => {
      uni.downloadFile({
        url: `${BASE_URL}${url}${buildQuery(params)}`,
        header: {
          Authorization: token ? `Bearer ${token}` : ''
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res)
            return
          }
          reject(res)
        },
        fail: reject
      })
    })
  }
}
