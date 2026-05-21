import request from '@/utils/request'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '')

export interface DownloadOpenOptions {
  fileType?: string
  loadingTitle?: string
  failText?: string
  showMenu?: boolean
}

function resolveUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/')) return `${BASE_URL}${url}`
  return `${BASE_URL}/${url}`
}

function getAuthHeader(): Record<string, string> {
  const token = uni.getStorageSync('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * 下载并打开文档（PDF 等），支持完整 URL 或需鉴权的 API 路径
 */
export async function downloadAndOpenDocument(
  source: { url: string } | { apiPath: string; params?: Record<string, unknown> },
  options: DownloadOpenOptions = {}
): Promise<void> {
  const {
    fileType = 'pdf',
    loadingTitle = '下载中...',
    failText = '下载失败',
    showMenu = true
  } = options

  uni.showLoading({ title: loadingTitle, mask: true })

  const openTempFile = (tempFilePath: string) => {
    uni.openDocument({
      filePath: tempFilePath,
      fileType,
      showMenu,
      success: () => uni.hideLoading(),
      fail: () => {
        uni.hideLoading()
        uni.showToast({ title: '打开文件失败', icon: 'none' })
      }
    })
  }

  try {
    if ('apiPath' in source) {
      const res = await request.download(source.apiPath, source.params)
      openTempFile(res.tempFilePath)
      return
    }

    await new Promise<void>((resolve, reject) => {
      uni.downloadFile({
        url: resolveUrl(source.url),
        header: getAuthHeader(),
        success: (res) => {
          if (res.statusCode === 200) {
            openTempFile(res.tempFilePath)
            resolve()
          } else {
            uni.hideLoading()
            uni.showToast({ title: failText, icon: 'none' })
            reject(res)
          }
        },
        fail: (err) => {
          uni.hideLoading()
          uni.showToast({ title: failText, icon: 'none' })
          reject(err)
        }
      })
    })
  } catch {
    uni.hideLoading()
    uni.showToast({ title: failText, icon: 'none' })
  }
}

/**
 * 下载 API 资源并保存到本地（如导出 Excel）
 */
export async function downloadAndSaveFile(
  apiPath: string,
  params?: Record<string, unknown>,
  options: { loadingTitle?: string; successText?: string } = {}
): Promise<void> {
  const { loadingTitle = '下载中...', successText = '下载成功' } = options
  uni.showLoading({ title: loadingTitle, mask: true })

  try {
    const res = await request.download(apiPath, params)
    await new Promise<void>((resolve, reject) => {
      uni.saveFile({
        tempFilePath: res.tempFilePath,
        success: () => {
          uni.hideLoading()
          uni.showToast({ title: successText, icon: 'none' })
          resolve()
        },
        fail: () => {
          uni.hideLoading()
          uni.showToast({ title: '保存失败', icon: 'none' })
          reject()
        }
      })
    })
  } catch {
    uni.hideLoading()
    uni.showToast({ title: '下载失败', icon: 'none' })
  }
}
