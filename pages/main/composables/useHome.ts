import { ref } from 'vue'

export interface FeatureItem {
  title: string
  icon: string
  path: string
}

export interface PostItem {
  author: string
  avatar: string
  time: string
  content: string
}

export interface NavItem {
  title: string
  icon: string
  path: string
}

export function useHome() {
  const searchValue = ref('')
  
  const coreFeatures = ref<FeatureItem[]>([
    { title: '知识库', icon: 'notes-o', path: '/pages/knowledge/Knowledge' },
    { title: '病友交流', icon: 'friends-o', path: '/pages/community/Community' },
    { title: '专家答疑', icon: 'question-o', path: '/pages/qa/QA' },
    { title: '资源下载', icon: 'down', path: '/pages/resource/Resources' }
  ])

  const posts = ref<PostItem[]>([
    {
      author: '用户 A',
      avatar: 'https://example.com/avatar1.jpg',
      time: '2 小时前',
      content: '分享一个关于罕见病的科普文章...'
    },
    {
      author: '用户 B',
      avatar: 'https://example.com/avatar2.jpg',
      time: '5 小时前',
      content: '求助：有没有治疗 XXX 的方法？'
    }
  ])

  const loading = ref(false)
  const finished = ref(false)
  const refreshing = ref(false)
  const unreadCount = ref(5)

  const handleFeatureClick = (path: string) => {
    uni.navigateTo({ url: path })
  }

  const goToMessages = () => {
    uni.navigateTo({ url: '/pages/main/Messages' })
  }

  const onRefresh = () => {
    refreshing.value = true
    setTimeout(() => {
      posts.value.unshift({ 
        author: '新用户', 
        avatar: '', 
        time: '刚刚', 
        content: '最新动态内容...' 
      })
      refreshing.value = false
      uni.stopPullDownRefresh()
    }, 1000)
  }

  const onLoadMore = () => {
    loading.value = true
    setTimeout(() => {
      const newPosts = Array.from({ length: 5 }, (_, i) => ({
        author: `用户${posts.value.length + i + 1}`,
        avatar: '',
        time: `${Math.floor(Math.random() * 10)}小时前`,
        content: `这是第${posts.value.length + i + 1}条动态...`
      }))
      posts.value.push(...newPosts)
      if (posts.value.length >= 20) finished.value = true
      loading.value = false
    }, 1000)
  }

  return {
    searchValue,
    coreFeatures,
    posts,
    loading,
    finished,
    refreshing,
    unreadCount,
    handleFeatureClick,
    goToMessages,
    onRefresh,
    onLoadMore
  }
}