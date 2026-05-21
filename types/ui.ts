/** uView / uni-app 通用 UI 事件与组件类型 */

export interface TabChangeEvent {
  index: number
  name?: string
}

/** u-picker 列项 */
export interface PickerColumnItem {
  name?: string
  text?: string
  value?: string | number | null
  code?: string
  [key: string]: unknown
}

export interface PickerChangeEvent {
  columnIndex?: number
  index?: number
  indexs?: number[]
  value?: PickerColumnItem[]
}

export interface PickerConfirmEvent {
  value?: PickerColumnItem[]
  indexs?: number[]
  indexes?: number[]
}

export interface PickerTextOption {
  text: string
  value: number | string | null
}

/** u-upload afterRead */
export interface UploadAfterReadEvent {
  file: UploadFileItem | UploadFileItem[]
}

export interface UploadFileItem {
  url?: string
  thumb?: string
  name?: string
  size?: number
  type?: string
  serverUrl?: string
  status?: string
  message?: string
  [key: string]: unknown
}

/** uView u-tag type */
export type UviewTagType = 'primary' | 'success' | 'warning' | 'error' | 'info'

export interface RecommendItem {
  id: number
  title: string
}

export interface SelectOption<T = string | number | null> {
  label: string
  value: T
}

/** uView u-form 实例（仅暴露页面用到的能力） */
export interface UviewFormRef {
  validate?: () => Promise<boolean>
}

export type FormRuleCallback = (error?: Error | string) => void

/** uni-app 页面栈项（getCurrentPages） */
export interface UniPageInstance {
  options?: Record<string, string>
  route?: string
  [key: string]: unknown
}
