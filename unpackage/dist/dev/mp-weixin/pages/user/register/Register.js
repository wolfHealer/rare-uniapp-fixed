"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_form_item2 = common_vendor.resolveComponent("u-form-item");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_form2 = common_vendor.resolveComponent("u-form");
  (_easycom_u_input2 + _easycom_u_form_item2 + _easycom_u_button2 + _easycom_u_icon2 + _easycom_u_form2)();
}
const _easycom_u_input = () => "../../../node-modules/uview-plus/components/u-input/u-input.js";
const _easycom_u_form_item = () => "../../../node-modules/uview-plus/components/u-form-item/u-form-item.js";
const _easycom_u_button = () => "../../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_icon = () => "../../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_form = () => "../../../node-modules/uview-plus/components/u-form/u-form.js";
if (!Math) {
  (_easycom_u_input + _easycom_u_form_item + _easycom_u_button + _easycom_u_icon + _easycom_u_form)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Register",
  setup(__props) {
    const registerForm = common_vendor.ref({
      phone: "",
      code: "",
      password: ""
    });
    const showPassword = common_vendor.ref(false);
    const codeTimer = common_vendor.ref(0);
    const loading = common_vendor.ref(false);
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };
    const sendCode = () => {
      if (!registerForm.value.phone) {
        common_vendor.index.showToast({ title: "请输入手机号", icon: "none" });
        return;
      }
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(registerForm.value.phone)) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return;
      }
      common_vendor.index.showToast({ title: "验证码已发送", icon: "success" });
      codeTimer.value = 60;
      const timer = setInterval(() => {
        codeTimer.value--;
        if (codeTimer.value <= 0) {
          clearInterval(timer);
        }
      }, 1e3);
    };
    const handleRegister = () => {
      if (!registerForm.value.phone || !registerForm.value.code || !registerForm.value.password) {
        common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
        return;
      }
      if (registerForm.value.password.length < 6 || registerForm.value.password.length > 12) {
        common_vendor.index.showToast({ title: "密码长度需为6-12位", icon: "none" });
        return;
      }
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        common_vendor.index.showToast({ title: "注册成功", icon: "success" });
        setTimeout(() => {
          common_vendor.index.navigateTo({ url: "/pages/user/login/Login" });
        }, 1500);
      }, 1e3);
    };
    const goToLogin = () => {
      common_vendor.index.navigateTo({ url: "/pages/user/login/Login" });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => registerForm.value.phone = $event),
        b: common_vendor.p({
          placeholder: "请输入手机号",
          type: "number",
          maxlength: "11",
          border: "none",
          modelValue: registerForm.value.phone
        }),
        c: common_vendor.p({
          label: "手机号",
          prop: "phone",
          borderBottom: true
        }),
        d: common_vendor.o(($event) => registerForm.value.code = $event),
        e: common_vendor.p({
          placeholder: "请输入验证码",
          type: "number",
          maxlength: "6",
          border: "none",
          modelValue: registerForm.value.code
        }),
        f: common_vendor.t(codeTimer.value > 0 ? `${codeTimer.value}s后重发` : "发送验证码"),
        g: common_vendor.o(sendCode),
        h: common_vendor.p({
          size: "mini",
          type: "primary",
          disabled: codeTimer.value > 0,
          customStyle: "margin-left: 10px;"
        }),
        i: common_vendor.p({
          label: "短信验证码",
          prop: "code",
          borderBottom: true
        }),
        j: common_vendor.o(($event) => registerForm.value.password = $event),
        k: common_vendor.p({
          placeholder: showPassword.value ? "请输入密码" : "请输入密码（6-12位）",
          type: showPassword.value ? "text" : "password",
          border: "none",
          modelValue: registerForm.value.password
        }),
        l: common_vendor.o(togglePasswordVisibility),
        m: common_vendor.p({
          name: showPassword.value ? "eye" : "eye-off",
          size: "20",
          color: "#c0c4cc"
        }),
        n: common_vendor.p({
          label: "密码",
          prop: "password",
          borderBottom: true
        }),
        o: common_vendor.sr("formRef", "e03f874f-0"),
        p: common_vendor.p({
          model: registerForm.value
        }),
        q: common_vendor.o(handleRegister),
        r: common_vendor.p({
          type: "primary",
          shape: "circle",
          loading: loading.value
        }),
        s: common_vendor.o(goToLogin)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e03f874f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/register/Register.js.map
