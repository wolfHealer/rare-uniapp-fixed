<template>
  <view class="post-edit-page">
    <!-- 顶部导航栏 -->
    <u-navbar 
      title="发布帖子" 
      :is-back="true" 
      bg-color="#ffffff"
      title-color="#1f2937"
      :border-bottom="true"
    >
      <template #right>
        <view class="nav-right-btn" @click="submitPost">
          <text :class="{ 'disabled': submitting }">{{ submitting ? '发布中...' : '发布' }}</text>
        </view>
      </template>
    </u-navbar>

    <scroll-view scroll-y class="content-scroll">
      <view class="form-container">
        
        <!-- 标题输入 -->
        <view class="form-item">
          <u-input 
            v-model="form.title" 
            placeholder="请输入标题（选填）" 
            border="none"
            maxlength="50"
            customStyle="font-size: 16px; font-weight: bold;"
          ></u-input>
        </view>

        <!-- 内容输入 -->
        <view class="form-item content-area">
          <textarea 
            v-model="form.content" 
            placeholder="分享你的经历、求助或心情..." 
            maxlength="2000"
            auto-height
            class="content-textarea"
          ></textarea>
        </view>

        <!-- 图片上传区域 -->
        <view class="form-item">
          <view class="image-grid">
            <view 
              v-for="(img, index) in form.images" 
              :key="index" 
              class="image-item"
            >
              <image :src="img" mode="aspectFill" class="uploaded-img" @click="previewImage(index)"></image>
              <view class="delete-btn" @click.stop="deleteImage(index)">
                <u-icon name="close" size="12" color="#fff"></u-icon>
              </view>
            </view>
            
            <!-- 上传按钮 -->
            <view 
              v-if="form.images.length < 9" 
              class="upload-btn" 
              @click="chooseImage"
            >
              <u-icon name="plus" size="24" color="#9ca3af"></u-icon>
              <text class="upload-text">添加图片</text>
            </view>
          </view>
        </view>

        <!-- 分类选择 -->
        <view class="form-item border-top">
          <view class="selector-row" @click="showTypePicker = true">
            <text class="label">类型</text>
            <view class="value-row">
              <text :class="{ 'placeholder': !form.type }">{{ typeLabel }}</text>
              <u-icon name="arrow-right" size="14" color="#9ca3af"></u-icon>
            </view>
          </view>
        </view>

        <!-- 疾病/分类选择 (可选，如果业务需要关联具体疾病) -->
        <view class="form-item border-top" @click="showDiseasePicker = true">
           <view class="selector-row">
            <text class="label">关联疾病</text>
            <view class="value-row">
              <text :class="{ 'placeholder': !diseaseLabel }">{{ diseaseLabel || '选择不必填' }}</text>
              <u-icon name="arrow-right" size="14" color="#9ca3af"></u-icon>
            </view>
          </view>
        </view>

      </view>
      
      <!-- 底部占位 -->
      <view style="height: 40px;"></view>
    </scroll-view>

    <!-- 类型选择器 -->
    <u-picker
      :show="showTypePicker"
      :columns="[typeOptions]"
      keyName="text"
      @confirm="onTypeConfirm"
      @cancel="showTypePicker = false"
      @close="showTypePicker = false"
    ></u-picker>

    <!-- 疾病选择器 (复用 Community 的逻辑，这里简化为单选) -->
    <u-picker
      :show="showDiseasePicker"
      :columns="[diseaseOptions]"
      keyName="text"
      @confirm="onDiseaseConfirm"
      @cancel="showDiseasePicker = false"
      @close="showDiseasePicker = false"
    ></u-picker>

  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { communityApi } from '@/api/community'
import { knowledgeApi } from '@/api/knowledge'
import { useUserStore } from '@/stores/modules/user'
import type { DiseaseTreeCategory, DiseaseTreeChild } from '@/types/knowledge'
import type { PickerConfirmEvent, PickerTextOption } from '@/types/ui'

const userStore = useUserStore()

// 表单数据
const form = ref({
  title: '',
  content: '',
  images: [] as string[],
  type: 'help', // 默认类型
  disease_id: null as number | null,
  category_id: null as number | null
})

const submitting = ref(false)

// 选择器状态
const showTypePicker = ref(false)
const showDiseasePicker = ref(false)

// 选项数据
const typeOptions = [
  { text: '求助', value: 'help' },
  { text: '经验', value: 'experience' },
  { text: '情绪', value: 'emotion' }
]

const diseaseOptions = ref<PickerTextOption[]>([])

// 计算显示文本
const typeLabel = computed(() => {
  const found = typeOptions.find(t => t.value === form.value.type)
  return found ? found.text : '请选择类型'
})

const diseaseLabel = computed(() => {
  const found = diseaseOptions.value.find(d => d.value === form.value.disease_id)
  return found ? found.text : ''
})

// 初始化获取疾病列表 (简化版，实际可能需要级联选择)
onMounted(async () => {
  try {
    // 这里假设有一个简单的疾病列表接口，或者复用之前的 disease-tree 逻辑展平
    // 为了演示，我们暂时用一个空数组或模拟数据，实际项目中请调用真实接口
    const res = await knowledgeApi.getDiseaseTree()
    const categories = res.data || []
    // 展平所有疾病用于选择
    const allDiseases: PickerTextOption[] = []
    ;(categories as DiseaseTreeCategory[]).forEach((cat) => {
      if (cat.children) {
        cat.children.forEach((d: DiseaseTreeChild) => {
          allDiseases.push({ text: d.name, value: d.id })
        })
      }
    })
    diseaseOptions.value = [{ text: '不关联特定疾病', value: null }, ...allDiseases]
  } catch (e) {
    console.error('获取疾病列表失败', e)
  }
})

// 选择类型
const onTypeConfirm = (e: PickerConfirmEvent) => {
  const selectedIndex = (e.indexes ?? e.indexs ?? [0])[0]
  form.value.type = typeOptions[selectedIndex].value
  showTypePicker.value = false
}

// 选择疾病
const onDiseaseConfirm = (e: PickerConfirmEvent) => {
  const selectedIndex = (e.indexes ?? e.indexs ?? [0])[0]
  const selected = diseaseOptions.value[selectedIndex]
  form.value.disease_id = selected.value
  showDiseasePicker.value = false
}

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 9 - form.value.images.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      // 这里只是临时路径，提交前需要上传到服务器
      // 为了简化，我们假设直接上传并获取 URL，或者在 submit 时统一上传
      // 最佳实践：选择后立即上传到 OSS，拿到 URL 存入 form.images
      uploadImages(res.tempFilePaths)
    }
  })
}

// 上传图片到服务器
const uploadImages = async (tempPaths: string[]) => {
  uni.showLoading({ title: '上传中...' })
  try {
    for (const path of tempPaths) {
      // 假设有一个通用的上传接口 /api/common/upload
      // 注意：uni.uploadFile 是原生 API，需要配合后端接口
      const uploadRes = await new Promise<string>((resolve, reject) => {
        uni.uploadFile({
          url: '/api/common/upload', // 请替换为真实的上传接口地址
          filePath: path,
          name: 'file',
          header: {
            'Authorization': `Bearer ${userStore.token}` // 如果需要鉴权
          },
          success: (res) => {
            const data = JSON.parse(res.data)
            if (data.code === 200 || data.code === 0) {
              resolve(data.data.url) // 假设返回结构中有 url
            } else {
              reject(new Error(data.message || '上传失败'))
            }
          },
          fail: (err) => reject(err)
        })
      })
      form.value.images.push(uploadRes)
    }
    uni.hideLoading()
  } catch (e) {
    uni.hideLoading()
    uni.showToast({ title: '图片上传失败', icon: 'none' })
  }
}

// 删除图片
const deleteImage = (index: number) => {
  form.value.images.splice(index, 1)
}

// 预览图片
const previewImage = (index: number) => {
  uni.previewImage({
    urls: form.value.images,
    current: index
  })
}

// 提交帖子
const submitPost = async () => {
  if (!form.value.content.trim()) {
    uni.showToast({ title: '请输入内容', icon: 'none' })
    return
  }

  if (submitting.value) return
  submitting.value = true

  try {
    const payload = {
      title: form.value.title,
      content: form.value.content,
      images: form.value.images,
      type: form.value.type,
      disease_id: form.value.disease_id,
      category_id: form.value.category_id
    }

    await communityApi.createPost(payload)
    
    uni.showToast({ title: '发布成功', icon: 'success' })
    
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    console.error(e)
    uni.showToast({ title: '发布失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.post-edit-page {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
}

.nav-right-btn {
  padding: 0 16px;
  height: 44px;
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #2563eb;
  font-weight: 500;
}

.nav-right-btn.disabled {
  color: #9ca3af;
}

.content-scroll {
  flex: 1;
}

.form-container {
  background-color: #fff;
  margin-top: 10px;
  padding: 0 16px;
}

.form-item {
  padding: 16px 0;
}

.border-top {
  border-top: 1px solid #f3f4f6;
}

.content-area {
  padding-top: 8px;
}

.content-textarea {
  width: 100%;
  min-height: 150px;
  font-size: 15px;
  line-height: 1.6;
  color: #374151;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-item {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.uploaded-img {
  width: 100%;
  height: 100%;
}

.delete-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-btn {
  width: 80px;
  height: 80px;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
}

.upload-text {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
}

.selector-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 15px;
  color: #374151;
}

.value-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.value-row text {
  font-size: 15px;
  color: #111827;
}

.placeholder {
  color: #9ca3af;
}
</style>