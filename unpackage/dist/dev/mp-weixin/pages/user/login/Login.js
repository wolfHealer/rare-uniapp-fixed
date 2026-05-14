"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
const stores_modules_user = require("../../../stores/modules/user.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  (_easycom_u_icon2 + _easycom_u_button2)();
}
const _easycom_u_icon = () => "../../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_button = () => "../../../node-modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_button)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Login",
  setup(__props) {
    const loginForm = common_vendor.ref({
      phone: "",
      password: ""
    });
    const showPassword = common_vendor.ref(false);
    const loading = common_vendor.ref(false);
    const userStore = stores_modules_user.useUserStore();
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };
    const validatePhone = (phone) => /^1[3-9]\d{9}$/.test(phone);
    const handleLogin = async () => {
      if (!loginForm.value.phone.trim()) {
        common_vendor.index.showToast({ title: "请输入手机号", icon: "none" });
        return;
      }
      if (!validatePhone(loginForm.value.phone)) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return;
      }
      if (!loginForm.value.password) {
        common_vendor.index.showToast({ title: "请输入密码", icon: "none" });
        return;
      }
      loading.value = true;
      try {
        const response = await utils_request.request.post("/api/auth/login", {
          phone: loginForm.value.phone,
          password: loginForm.value.password
        });
        const data = response.data;
        userStore.setToken(data.token);
        userStore.setUserInfo({
          user_id: data.user_id,
          nickname: data.nickname,
          phone: data.phone,
          avatar: data.avatar
        });
        common_vendor.index.showToast({ title: "登录成功", icon: "success" });
        setTimeout(() => {
          common_vendor.index.switchTab({ url: "/pages/main/Home" });
        }, 800);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/login/Login.vue:129", "登录失败:", error);
        common_vendor.index.showToast({ title: "登录失败，请检查账号密码", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const goToRegister = () => {
      common_vendor.index.navigateTo({ url: "/pages/user/register/Register" });
    };
    const goToForgotPassword = () => {
      common_vendor.index.showToast({ title: "请联系管理员重置密码", icon: "none" });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          name: "phone",
          color: "#9ca3af",
          size: "20"
        }),
        b: loginForm.value.phone,
        c: common_vendor.o(($event) => loginForm.value.phone = $event.detail.value),
        d: common_vendor.p({
          name: "lock",
          color: "#9ca3af",
          size: "20"
        }),
        e: !showPassword.value,
        f: loginForm.value.password,
        g: common_vendor.o(($event) => loginForm.value.password = $event.detail.value),
        h: common_vendor.o(togglePasswordVisibility),
        i: common_vendor.p({
          name: showPassword.value ? "eye" : "eye-off",
          size: "20",
          color: "#9ca3af"
        }),
        j: common_vendor.o(goToForgotPassword),
        k: common_vendor.t(loading.value ? "登录中..." : "登录"),
        l: common_vendor.o(handleLogin),
        m: common_vendor.p({
          type: "primary",
          shape: "circle",
          loading: loading.value,
          disabled: loading.value,
          customStyle: "height: 48px; font-size: 16px;"
        }),
        n: common_vendor.o(goToRegister)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-386015a1"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/login/Login.js.map
