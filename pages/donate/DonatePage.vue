<template>
  <view class="reward-page">
    <!-- 顶部导航栏 (自定义以匹配原设计，也可使用原生导航栏) -->
    <view class="custom-nav-bar">
      <view class="nav-left" @click="goBack">
        <u-icon name="arrow-left" size="20"></u-icon>
      </view>
      <view class="nav-title">助力平台</view>
      <view class="nav-right" @click="showHelp">
        <text class="help-text">帮助</text>
      </view>
    </view>

    <!-- 头部情感区 -->
    <view class="header-card">
      <text class="title">您的支持，让罕见病被看见</text>
      <text class="subtitle">
        打赏将用于：服务器、资源审核、患者资料维护、公益运营
      </text>
      <view class="icons-section">
        <view class="icon-item">
          <text>🖥</text> <text>服务器与存储</text>
        </view>
        <view class="icon-item">
          <text>📄</text> <text>医疗资源整理与审核</text>
        </view>
        <view class="icon-item">
          <text>🤝</text> <text>患者帮扶与信息更新</text>
        </view>
      </view>
    </view>

    <!-- 打赏金额选择区 -->
    <view class="section">
      <text class="section-title">选择支持金额</text>
      <view class="amount-buttons">
        <u-button
          v-for="amount in fixedAmounts"
          :key="amount"
          :type="selectedAmount === amount ? 'primary' : 'default'"
          size="medium"
          shape="circle"
          custom-style="width: 70px; height: 40px; margin-right: 10px; margin-bottom: 10px;"
          @click="selectAmount(amount)"
        >
          ¥{{ amount }}
        </u-button>
        <u-button
          :type="isCustomSelected ? 'primary' : 'default'"
          size="medium"
          shape="circle"
          custom-style="width: 70px; height: 40px;"
          @click="selectCustom"
        >
          其他
        </u-button>
      </view>

      <!-- 自定义金额输入框 -->
      <view v-if="isCustomSelected" class="custom-input-wrapper">
        <u-input
          v-model="customAmount"
          type="number"
          placeholder="自定义金额（最低1元）"
          border="surround"
          clearable
        ></u-input>
      </view>
    </view>

    <!-- 寄语输入框 -->
    <view class="section">
      <textarea
        v-model="message"
        placeholder="说点鼓励的话（选填）"
        class="message-input"
        maxlength="200"
      ></textarea>
    </view>

    <!-- 匿名开关 -->
    <view class="section switch-row">
      <text class="switch-label">匿名支持</text>
      <u-switch v-model="isAnonymous" active-color="#4A89FF"></u-switch>
    </view>

    <!-- 支付方式选择 -->
    <view class="section">
      <text class="section-title">选择支付方式</text>
      <u-radio-group v-model="paymentMethod" placement="row">
        <u-radio name="wechat" label="微信支付" active-color="#4A89FF"></u-radio>
        <u-radio name="alipay" label="支付宝" active-color="#4A89FF" style="margin-left: 20px;"></u-radio>
      </u-radio-group>
    </view>

    <!-- 信任公示区 -->
    <view class="trust-card">
      <text class="trust-title">资金透明公示</text>
      <text class="trust-desc">每月5号公示收支，所有打赏用于平台公益运营</text>
      <u-button size="mini" plain custom-style="margin-top: 10px;" @click="viewReport">查看公示</u-button>
    </view>

    <!-- 底部确认按钮 -->
    <view class="cta-container">
      <u-button
        type="primary"
        block
        shape="circle"
        custom-style="height: 52px; font-size: 16px; font-weight: bold;"
        @click="confirmSupport"
      >
        确认支持 ¥{{ finalAmount }}
      </u-button>
    </view>

    <!-- 帮助弹窗 -->
    <u-modal
      :show="showHelpDialog"
      title="帮助说明"
      content="这里是帮助内容"
      confirm-text="知道了"
      @confirm="showHelpDialog = false"
      @cancel="showHelpDialog = false"
    ></u-modal>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showToast } from 'vant' // 注意：如果项目完全迁移到 uView，建议替换为 uni.showToast 或 uView 的 toast 方法，但 uView 通常不强制替换 toast 逻辑，uni.showToast 是通用的。

// 数据模型
const fixedAmounts = [10, 20, 50, 100]
const selectedAmount = ref(20)
const customAmount = ref('')
const message = ref('')
const isAnonymous = ref(true)
const paymentMethod = ref('wechat')
const showHelpDialog = ref(false)

// 计算属性
const isCustomSelected = computed(() => customAmount.value !== '')
const finalAmount = computed(() =>
  isCustomSelected.value ? Number(customAmount.value) : selectedAmount.value
)

// 方法
const goBack = () => uni.navigateBack()
const showHelp = () => {
  showHelpDialog.value = true
}
const selectAmount = (amount: number) => {
  selectedAmount.value = amount
  customAmount.value = ''
}
const selectCustom = () => {
  selectedAmount.value = 0
}
const viewReport = () => {
  uni.showToast({ title: '跳转到公示页面', icon: 'none' })
}
const confirmSupport = () => {
  if (finalAmount.value < 1) {
    uni.showToast({ title: '金额不能低于1元', icon: 'none' })
    return
  }
  // 模拟支付跳转
  uni.showToast({ title: `正在跳转到${paymentMethod.value}支付...`, icon: 'none' })
}
</script>

<style scoped>
.reward-page {
  background-color: #f9fafb;
  min-height: 100vh;
  padding-bottom: 80px;
}

/* 顶部导航栏 */
.custom-nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 15px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}
.nav-left, .nav-right {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-title {
  font-size: 16px;
  font-weight: bold;
}
.help-text {
  font-size: 14px;
  color: #4A89FF;
}

/* 头部情感区 */
.header-card {
  background-color: #ffffff;
  border-radius: 12px;
  margin: 20px 15px;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}
.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
}
.icons-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}
.icon-item {
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

/* 金额选择区 */
.section {
  margin: 20px 15px;
}
.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  display: block;
  color: #333;
}
.amount-buttons {
  display: flex;
  flex-wrap: wrap;
  /* gap: 10px; u-view button margin handled inline */
}

.custom-input-wrapper {
  margin-top: 12px;
}

.message-input {
  width: 100%;
  min-height: 80px;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fff;
  box-sizing: border-box;
}

/* 开关行 */
.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}
.switch-label {
  font-size: 15px;
  color: #333;
}

/* 信任公示区 */
.trust-card {
  background-color: #fff8e1;
  border-radius: 8px;
  margin: 20px 15px;
  padding: 12px;
  font-size: 14px;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.trust-title {
  font-weight: bold;
  margin-bottom: 4px;
}
.trust-desc {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

/* 底部按钮 */
.cta-container {
  position: fixed;
  bottom: 20px;
  left: 15px;
  right: 15px;
  z-index: 100;
}
</style>