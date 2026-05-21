export type MessageType = 'comment' | 'qa' | 'resource' | 'all' | string

export interface MessageItem {
  id: number
  type: MessageType
  title: string
  content: string
  time: string
  isRead: boolean
  link: string
}
