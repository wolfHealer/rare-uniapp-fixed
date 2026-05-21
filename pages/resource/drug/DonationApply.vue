<template>
  <view class="page-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <u-icon name="arrow-left" size="24" @click="goBack"></u-icon>
      <text class="nav-title">申请援助</text>
      <view class="nav-placeholder"></view>
    </view>

    <scroll-view scroll-y class="content-scroll">
      <!-- 项目信息卡片 -->
      <view class="card project-card" v-if="projectInfo">
        <view class="project-header">
          <text class="project-name">{{ projectInfo.name }}</text>
          <u-tag 
            :text="projectInfo.auditStatus === 1 ? '进行中' : '已结束'" 
            :type="projectInfo.auditStatus === 1 ? 'success' : 'info'" 
            size="mini"
          ></u-tag>
        </view>
        <view class="project-info-row">
          <text class="info-label">主办机构：</text>
          <text class="info-value">{{ projectInfo.organizer || '暂无' }}</text>
        </view>
        <view class="project-info-row">
          <text class="info-label">援助周期：</text>
          <text class="info-value">{{ projectInfo.period || '暂无' }}</text>
        </view>
        <view class="project-desc">
          <text class="desc-label">申请条件：</text>
          <text class="desc-content">{{ projectInfo.condition }}</text>
        </view>
      </view>

      <!-- 申请表单卡片 -->
      <view class="card form-card">
        <view class="card-header">
          <text class="header-title">基本信息</text>
          <text class="header-subtitle">请填写真实有效的患者信息</text>
        </view>
        
        <u-form :model="form" ref="uFormRef" :rules="rules" label-width="90">
          <u-form-item label="患者姓名" prop="patientName" required>
            <u-input 
              v-model="form.patientName" 
              placeholder="请输入患者真实姓名" 
              border="surround"
              clearable
            ></u-input>
          </u-form-item>
          
          <u-form-item label="身份证号" prop="patientIdCard" required>
            <u-input 
              v-model="form.patientIdCard" 
              placeholder="请输入18位身份证号" 
              border="surround"
              clearable
            ></u-input>
          </u-form-item>
          
          <u-form-item label="联系电话" prop="contactPhone" required>
            <u-input 
              v-model="form.contactPhone" 
              type="number" 
              placeholder="请输入手机号" 
              border="surround"
              clearable
            ></u-input>
          </u-form-item>
          
          <u-form-item label="诊断医院" prop="diagnosisHospital" required>
            <u-input 
              v-model="form.diagnosisHospital" 
              placeholder="请输入确诊医院全称" 
              border="surround"
              clearable
            ></u-input>
          </u-form-item>
          
          <u-form-item label="确诊时间" prop="diagnosisTime" required @click="showDatePicker = true">
            <u-input 
              v-model="form.diagnosisTime" 
              placeholder="请选择确诊日期" 
              border="surround" 
              disabled
              suffixIcon="calendar"
            ></u-input>
          </u-form-item>
        </u-form>
      </view>

      <!-- 病情与经济状况卡片 -->
      <view class="card form-card">
        <view class="card-header">
          <text class="header-title">病情与经济状况</text>
        </view>

        <u-form :model="form" ref="uFormRef" :rules="rules" label-width="90">
          <u-form-item label="收入证明" prop="incomeProof" required label-position="top">
            <u-textarea 
              v-model="form.incomeProof" 
              placeholder="请简要描述家庭年收入情况及经济困难原因..." 
              count 
              height="100"
              border="surround"
            ></u-textarea>
          </u-form-item>
          
          <u-form-item label="备注说明" prop="remark" label-position="top">
            <u-textarea 
              v-model="form.remark" 
              placeholder="其他需要补充说明的情况（选填）" 
              count 
              height="80"
              border="surround"
            ></u-textarea>
          </u-form-item>
        </u-form>
      </view>

      <!-- 材料上传卡片 -->
      <view class="card upload-card">
        <view class="card-header">
          <text class="header-title">证明材料上传</text>
          <text class="header-subtitle">最多5张，单张不超过10MB</text>
        </view>
        
        <u-upload
          :fileList="fileList"
          @afterRead="afterRead"
          @delete="deletePic"
          name="1"
          multiple
          :maxCount="5"
          :maxSize="10 * 1024 * 1024"
          width="100%"
          height="100px"
        ></u-upload>
        
        <view class="upload-tips">
          <u-icon name="info-circle" size="14" color="#9ca3af"></u-icon>
          <text>支持 jpg/png/pdf 格式，请确保图片清晰可见</text>
        </view>
      </view>

      <!-- 底部占位 -->
      <view class="bottom-safe-area"></view>
    </scroll-view>

    <!-- 底部固定提交按钮 -->
    <view class="action-bar">
      <u-button
        type="primary"
        shape="circle"
        customStyle="width: 100%; height: 44px; font-size: 16px;"
        @click="submitForm"
        :loading="submitting"
      >
        提交申请
      </u-button>
    </view>

    <!-- 日期选择器 -->
    <u-datetime-picker
      :show="showDatePicker"
      v-model="currentDate"
      mode="date"
      @confirm="confirmDate"
      @cancel="showDatePicker = false"
    ></u-datetime-picker>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { drugApi } from '@/api/drug'
import type {
  UviewFormRef,
  FormRuleCallback,
  UploadFileItem,
  UploadAfterReadEvent,
  PickerConfirmEvent
} from '@/types/ui'
import type { DonationApplyFormState, DonationProjectBrief } from '@/types/drug'

const projectInfo = ref<DonationProjectBrief | null>(null)
const submitting = ref(false)
const projectId = ref<number | null>(null)
const showDatePicker = ref(false)
const currentDate = ref(new Date().getTime())
const uFormRef = ref<UviewFormRef | null>(null)

// 表单数据
const form = reactive<DonationApplyFormState>({
  patientName: '',
  patientIdCard: '',
  contactPhone: '',
  diagnosisHospital: '',
  diagnosisTime: '',
  incomeProof: '',
  remark: ''
})

// 表单校验规则
const rules = {
  patientName: {
    type: 'string',
    required: true,
    message: '请填写患者姓名',
    trigger: ['blur', 'change']
  },
  patientIdCard: [
    {
      type: 'string',
      required: true,
      message: '请填写身份证号',
      trigger: ['blur', 'change']
    },
    {
      validator: (_rule: unknown, value: string, _callback: FormRuleCallback) => {
        return /^\d{17}[\dXx]$/.test(value)
      },
      message: '身份证号格式不正确',
      trigger: ['blur', 'change']
    }
  ],
  contactPhone: [
    {
      type: 'string',
      required: true,
      message: '请填写联系电话',
      trigger: ['blur', 'change']
    },
    {
      validator: (_rule: unknown, value: string, _callback: FormRuleCallback) => {
        return /^1[3-9]\d{9}$/.test(value)
      },
      message: '手机号格式不正确',
      trigger: ['blur', 'change']
    }
  ],
  diagnosisHospital: {
    type: 'string',
    required: true,
    message: '请填写诊断医院',
    trigger: ['blur', 'change']
  },
  diagnosisTime: {
    type: 'string',
    required: true,
    message: '请选择确诊时间',
    trigger: ['blur', 'change']
  },
  incomeProof: {
    type: 'string',
    required: true,
    message: '请填写收入情况',
    trigger: ['blur', 'change']
  }
}

// 文件列表
const fileList = ref<UploadFileItem[]>([])
const uploadedFileUrls = ref<string[]>([])

// 加载项目信息
const loadProjectInfo = async (id: number) => {
  try {
    const res = await drugApi.getDonation(Number(id))
    projectInfo.value = res.data
  } catch (error) {
    console.error('加载项目信息失败:', error)
    uni.showToast({ title: '项目信息加载失败', icon: 'none' })
  }
}

// 删除图片
const deletePic = (event: { index: number }) => {
  fileList.value.splice(event.index, 1)
  uploadedFileUrls.value.splice(event.index, 1)
}

// 新增图片
const afterRead = async (event: UploadAfterReadEvent | UploadFileItem) => {
  const raw = 'file' in event ? event.file : event
  const files = Array.isArray(raw) ? raw : [raw]
  
  for (const file of files) {
    // 设置初始状态
    file.status = 'uploading'
    file.message = '上传中...'
    
    try {
      // 小程序上传
      const uploadRes = await new Promise((resolve, reject) => {
        uni.uploadFile({
          url: `${request.defaults?.baseURL || 'https://api.yourserver.com'}/api/upload`, 
          filePath: file.url,
          name: 'file',
          success: (res) => {
            try {
              const data = JSON.parse(res.data)
              if (data.code === 200 || data.success) {
                resolve(data.data.url)
              } else {
                reject(new Error(data.message || '上传失败'))
              }
            } catch (e) {
              reject(e)
            }
          },
          fail: (err) => {
            reject(err)
          }
        })
      }) as string
      
      file.status = 'success'
      file.message = ''
      file.serverUrl = uploadRes
      uploadedFileUrls.value.push(uploadRes)
      
    } catch (error: unknown) {
      file.status = 'failed'
      file.message = '上传失败'
      const msg = error instanceof Error ? error.message : '文件上传失败'
      uni.showToast({ title: msg, icon: 'none' })
    }
  }
}

// 日期选择确认
const confirmDate = (e: PickerConfirmEvent) => {
  const date = new Date(Number(e.value))
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  form.diagnosisTime = `${year}-${month}-${day}`
  showDatePicker.value = false
}

// 提交表单
const submitForm = async () => {
  if (!uFormRef.value) return
  
  try {
    await uFormRef.value.validate()
  } catch (err) {
    return
  }

  if (!projectId.value) {
    uni.showToast({ title: '项目ID缺失', icon: 'none' })
    return
  }

  const failedFiles = fileList.value.filter(f => f.status === 'failed')
  if (failedFiles.length > 0) {
    uni.showToast({ title: '存在上传失败的文件，请重试或删除', icon: 'none' })
    return
  }
  
  submitting.value = true
  uni.showLoading({ title: '提交中...', mask: true })

  try {
    await drugApi.applyDonation(projectId.value, {
      projectId: projectId.value,
      patientName: form.patientName,
      patientIdCard: form.patientIdCard,
      contactPhone: form.contactPhone,
      diagnosisHospital: form.diagnosisHospital,
      diagnosisTime: form.diagnosisTime,
      incomeProof: form.incomeProof,
      remark: form.remark,
      attachmentUrls: uploadedFileUrls.value
    })
    
    uni.hideLoading()
    uni.showToast({ title: '申请提交成功，请等待审核', icon: 'success' })
    setTimeout(() => {
      goBack()
    }, 1500)
  } catch (error) {
    uni.hideLoading()
    console.error('提交申请失败:', error)
    uni.showToast({ title: '申请提交失败，请稍后再试', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 生命周期
onLoad((options) => {
  if (options.projectId) {
    projectId.value = Number(options.projectId)
    loadProjectInfo(projectId.value)
  } else {
    uni.showToast({ title: '缺少项目ID', icon: 'none' })
    setTimeout(() => {
      goBack()
    }, 1500)
  }
})
</script>

<style scoped>
/* 页面容器 */
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f3f4f6; /* 更柔和的背景色 */
}

/* 顶部导航 */
.nav-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #ffffff;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.nav-title {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
}

.nav-placeholder {
  width: 24px;
}

/* 滚动区域 */
.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

/* 通用卡片样式 */
.card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-header {
  margin-bottom: 16px;
  border-left: 4px solid #3b82f6; /* 蓝色 accent */
  padding-left: 10px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  display: block;
}

.header-subtitle {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
  display: block;
}

/* 项目信息卡片特有样式 */
.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.project-name {
  font-size: 18px;
  font-weight: bold;
  color: #111827;
}

.project-info-row {
  display: flex;
  font-size: 14px;
  margin-bottom: 8px;
}

.info-label {
  color: #6b7280;
  width: 80px;
}

.info-value {
  color: #374151;
  flex: 1;
}

.project-desc {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.desc-label {
  font-size: 13px;
  color: #6b7280;
  display: block;
  margin-bottom: 4px;
}

.desc-content {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
}

/* 上传卡片特有样式 */
.upload-tips {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 12px;
  color: #9ca3af;
}

/* 底部操作栏 */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 12px 16px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 20;
}

.bottom-safe-area {
  height: 80px; /* 为底部按钮留出空间 */
}
</style>