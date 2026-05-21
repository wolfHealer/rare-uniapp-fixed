<template>
  <view class="page-container">
    <!-- 1. 顶部搜索栏 (固定或随滚动) -->
    <view class="search-header">
      <view class="search-box" @click="goSearch">
        <u-icon name="search" size="18" color="#9ca3af"></u-icon>
        <text class="search-placeholder">搜疾病、症状、医院、医生</text>
      </view>
      <view class="msg-icon" @click="goMessages">
        <u-badge :value="unreadCount" :absolute="true" :offset="[-5, -5]">
          <u-icon name="bell" size="20" color="#374151"></u-icon>
        </u-badge>
      </view>
    </view>

    <scroll-view scroll-y class="content-scroll" enable-back-to-top>
      
      <!-- 2. 金刚区 (快捷导航) -->
      <view class="nav-grid">
        <view 
          v-for="(item, index) in navItems" 
          :key="index" 
          class="nav-item"
          @click="handleNavClick(item)"
        >
          <view class="icon-box" :style="{ backgroundColor: item.bgColor }">
            <u-icon :name="item.icon" size="24" :color="item.color"></u-icon>
          </view>
          <text class="nav-text">{{ item.name }}</text>
        </view>
      </view>

      <!-- 3. 公告/轮播图 (可选) -->
      <view class="banner-area">
        <u-swiper :list="bannerList" keyName="image" height="160" border-radius="12"></u-swiper>
      </view>

      <!-- 4. 推荐专家 (横向滚动) -->
      <view class="section">
        <view class="section-header">
          <text class="title">推荐专家</text>
          <text class="more" @click="goMedical">查看更多 ></text>
        </view>
        <scroll-view scroll-x class="horizontal-scroll" show-scrollbar="false">
          <view class="doctor-card" v-for="(doc, index) in recommendedDoctors" :key="index" @click="goDoctorDetail(doc.id)">
            <image class="avatar" :src="doc.avatar || '/static/avatar.png'" mode="aspectFill"></image>
            <view class="doc-info">
              <text class="doc-name">{{ doc.name }}</text>
              <text class="doc-title">{{ doc.title }}</text>
              <text class="doc-hospital">{{ doc.hospital }}</text>
              <view class="doc-tags">
                <u-tag :text="doc.department" size="mini" type="primary" plain></u-tag>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 5. 热门救助/项目 -->
      <view class="section">
        <view class="section-header">
          <text class="title">最新救助</text>
          <text class="more" @click="goCharity">查看更多 ></text>
        </view>
        <view class="charity-list">
          <view 
            class="charity-card" 
            v-for="(item, index) in charityList" 
            :key="index"
            @click="goCharityDetail(item.id)"
          >
            <view class="charity-content">
              <text class="charity-title">{{ item.title }}</text>
              <text class="charity-desc">{{ item.desc }}</text>
              <view class="charity-footer">
                <u-tag text="进行中" type="success" size="mini"></u-tag>
                <text class="amount">最高补助 {{ item.amount }}</text>
              </view>
            </view>
            <u-image v-if="item.cover" :src="item.cover" width="80px" height="80px" radius="8"></u-image>
          </view>
        </view>
      </view>

      <!-- 6. 科普/社区动态 -->
      <view class="section">
        <view class="section-header">
          <text class="title">病友互助 & 科普</text>
        </view>
        <view class="post-list">
          <view 
            class="post-card" 
            v-for="(post, index) in postList" 
            :key="index"
            @click="goPostDetail(post.id)"
          >
            <text class="post-title">{{ post.title }}</text>
            <view class="post-meta">
              <text class="author">{{ post.author }}</text>
              <text class="time">{{ post.time }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部占位 -->
      <view style="height: 20px;"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// --- 数据定义 ---

// 未读消息数 (实际应从接口或 Store 获取)
const unreadCount = ref(2)

// 快捷导航配置
const navItems = ref([
  { name: '找医生', icon: 'account', bgColor: '#e0f2fe', color: '#0284c7', path: '/pages/resource/medical/DoctorList' },
  { name: '查疾病', icon: 'file-text', bgColor: '#fce7f3', color: '#db2777', path: '/pages/resource/knowledge/KnowledgeResource' },
  { name: '找救助', icon: 'gift', bgColor: '#fef3c7', color: '#d97706', path: '/pages/resource/charity/AidProjectList' },
  { name: '康复指南', icon: 'heart', bgColor: '#dcfce7', color: '#16a34a', path: '/pages/resource/rehab/RehabGuideList' },
  { name: '病友圈', icon: 'chat', bgColor: '#f3e8ff', color: '#9333ea', path: '/pages/community/Community' },
  { name: '药品查询', icon: 'shopping-cart', bgColor: '#fee2e2', color: '#dc2626', path: '/pages/resource/drug/DrugList' },
])

// 轮播图数据
const bannerList = ref([
  { image: 'https://via.placeholder.com/750x320/3b82f6/ffffff?text=罕见病日宣传' },
  { image: 'https://via.placeholder.com/750x320/10b981/ffffff?text=最新救助项目上线' }
])

// 推荐医生模拟数据
const recommendedDoctors = ref([
  { id: 1, name: '张主任', title: '主任医师', hospital: '北京协和医院', department: '神经内科', avatar: '' },
  { id: 2, name: '李教授', title: '副主任医师', hospital: '上海华山医院', department: '儿科', avatar: '' },
  { id: 3, name: '王医生', title: '主治医师', hospital: '华西医院', department: '遗传科', avatar: '' },
])

// 救助项目模拟数据
const charityList = ref([
  { id: 1, title: 'SMA患者援助项目', desc: '面向确诊脊髓性肌萎缩症...', amount: '5万', cover: '' },
  { id: 2, title: '法布雷病用药补贴', desc: '低收入家庭申请通道...', amount: '3万', cover: '' },
])

// 社区帖子模拟数据
const postList = ref([
  { id: 1, title: '确诊法布雷病两年，分享我的抗病经历', author: '勇敢的小草', time: '2小时前' },
  { id: 2, title: '请问北京哪家医院看戈谢病比较好？', author: '求助者A', time: '5小时前' },
])

// --- 方法定义 ---

const TAB_BAR_PAGES = [
  '/pages/main/Home',
  '/pages/resource/Resources',
  '/pages/community/Community',
  '/pages/user/profile/Profile'
]

const goSearch = () => {
  uni.navigateTo({ url: '/pages/search/index' })
}

const goMessages = () => {
  uni.navigateTo({ url: '/pages/main/Messages' })
}

const handleNavClick = (item: { path?: string }) => {
  if (!item.path) return
  if (TAB_BAR_PAGES.includes(item.path)) {
    uni.switchTab({ url: item.path })
  } else {
    uni.navigateTo({ url: item.path })
  }
}

const goMedical = () => {
  uni.switchTab({ url: '/pages/resource/Resources' })
}

const goDoctorDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/resource/medical/DoctorDetail?id=${id}` })
}

const goCharity = () => {
  uni.navigateTo({ url: '/pages/resource/charity/AidProjectList' })
}

const goCharityDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/resource/charity/AidProjectDetail?id=${id}` })
}

const goPostDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/community/PostDetail?id=${id}` })
}
</script>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
}

/* 顶部搜索 */
.search-header {
  background-color: #fff;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
}

.search-box {
  flex: 1;
  background-color: #f3f4f6;
  height: 36px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  margin-right: 12px;
}

.search-placeholder {
  font-size: 14px;
  color: #9ca3af;
  margin-left: 8px;
}

.msg-icon {
  position: relative;
  padding: 4px;
}

/* 滚动内容 */
.content-scroll {
  flex: 1;
  height: 0;
}

/* 金刚区 */
.nav-grid {
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 16px 0;
  margin-bottom: 12px;
}

.nav-item {
  width: 20%; /* 一行5个 */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
}

.icon-box {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.nav-text {
  font-size: 12px;
  color: #374151;
}

/* 通用 Section */
.section {
  background-color: #fff;
  margin-bottom: 12px;
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
}

.more {
  font-size: 12px;
  color: #9ca3af;
}

/* 横向滚动 */
.horizontal-scroll {
  white-space: nowrap;
}

.doctor-card {
  display: inline-block;
  width: 140px;
  margin-right: 12px;
  vertical-align: top;
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 8px;
}

.doc-info {
  display: flex;
  flex-direction: column;
}

.doc-name {
  font-size: 14px;
  font-weight: bold;
  color: #1f2937;
}

.doc-title {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.doc-hospital {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doc-tags {
  margin-top: 6px;
}

/* 救助列表 */
.charity-card {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.charity-card:last-child {
  border-bottom: none;
}

.charity-content {
  flex: 1;
  margin-right: 12px;
}

.charity-title {
  font-size: 15px;
  font-weight: 500;
  color: #1f2937;
  display: block;
  margin-bottom: 4px;
}

.charity-desc {
  font-size: 13px;
  color: #6b7280;
  display: block;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.charity-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.amount {
  font-size: 14px;
  color: #ef4444;
  font-weight: bold;
}

/* 帖子列表 */
.post-card {
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.post-card:last-child {
  border-bottom: none;
}

.post-title {
  font-size: 15px;
  color: #374151;
  display: block;
  margin-bottom: 6px;
  line-height: 1.4;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #9ca3af;
}
</style>