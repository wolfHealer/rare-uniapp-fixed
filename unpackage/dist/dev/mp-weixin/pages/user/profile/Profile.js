"use strict";
const common_vendor = require("../../../common/vendor.js");
const stores_modules_user = require("../../../stores/modules/user.js");
if (!Array) {
  const _easycom_u_navbar2 = common_vendor.resolveComponent("u-navbar");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  (_easycom_u_navbar2 + _easycom_u_button2 + _easycom_u_icon2)();
}
const _easycom_u_navbar = () => "../../../node-modules/uview-plus/components/u-navbar/u-navbar.js";
const _easycom_u_button = () => "../../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_icon = () => "../../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (_easycom_u_navbar + _easycom_u_button + _easycom_u_icon)();
}
const defaultAvatar = "/static/tabbar/profile.png";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Profile",
  setup(__props) {
    const userStore = stores_modules_user.useUserStore();
    const isLoggedIn = common_vendor.computed(() => !!userStore.token);
    const userInfo = common_vendor.computed(() => userStore.userInfo);
    const menuItems = [
      { label: "我的收藏", action: "favorites", icon: "star" },
      { label: "我的发布", action: "posts", icon: "edit-pen" },
      { label: "我的问诊", action: "questions", icon: "chat" },
      // 对应原 MyQuestions
      { label: "设置", action: "settings", icon: "setting" }
      // 新增设置入口
    ];
    const handleMenuClick = (action) => {
      if (!isLoggedIn.value) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        setTimeout(() => goToLogin(), 1e3);
        return;
      }
      let url = "";
      switch (action) {
        case "favorites":
          url = "/pages/user/profile/Favorites";
          break;
        case "posts":
          url = "/pages/user/profile/MyPosts";
          break;
        case "questions":
          url = "/pages/user/profile/MyQuestions";
          break;
        case "profile-edit":
          url = "/pages/user/profile/ProfileEdit";
          break;
        case "settings":
          common_vendor.index.showToast({ title: "设置功能开发中", icon: "none" });
          return;
      }
      if (url) {
        common_vendor.index.navigateTo({ url });
      }
    };
    const goToLogin = () => {
      common_vendor.index.navigateTo({ url: "/pages/user/login/Login" });
    };
    const goToRegister = () => {
      common_vendor.index.navigateTo({ url: "/pages/user/register/Register" });
    };
    const uploadAvatar = () => {
      if (!isLoggedIn.value)
        return;
      common_vendor.index.showToast({ title: "请选择图片", icon: "none" });
    };
    const logout = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        confirmColor: "#ef4444",
        success: (res) => {
          if (res.confirm) {
            userStore.logout();
            common_vendor.index.showToast({ title: "已退出", icon: "success" });
          }
        }
      });
    };
    return (_ctx, _cache) => {
      var _a, _b, _c;
      return common_vendor.e({
        a: common_vendor.p({
          ["is-back"]: false,
          title: "我的",
          placeholder: true,
          ["bg-color"]: "#ffffff",
          ["title-color"]: "#1f2937",
          ["left-icon-color"]: "#1f2937",
          ["border-bottom"]: true
        }),
        b: !isLoggedIn.value
      }, !isLoggedIn.value ? {
        c: defaultAvatar,
        d: common_vendor.o(goToLogin),
        e: common_vendor.p({
          type: "primary",
          shape: "circle",
          size: "medium",
          customStyle: "width: 120px; margin-right: 12px;"
        }),
        f: common_vendor.o(goToRegister),
        g: common_vendor.p({
          plain: true,
          type: "primary",
          shape: "circle",
          size: "medium",
          customStyle: "width: 120px;"
        }),
        h: common_vendor.p({
          name: "star",
          color: "#2563eb",
          size: "18"
        }),
        i: common_vendor.p({
          name: "edit-pen",
          color: "#2563eb",
          size: "18"
        }),
        j: common_vendor.p({
          name: "file-text",
          color: "#2563eb",
          size: "18"
        }),
        k: common_vendor.p({
          name: "chat",
          color: "#2563eb",
          size: "18"
        })
      } : {
        l: ((_a = userInfo.value) == null ? void 0 : _a.avatar) || defaultAvatar,
        m: common_vendor.p({
          name: "camera-fill",
          size: "12",
          color: "#fff"
        }),
        n: common_vendor.o(uploadAvatar),
        o: common_vendor.t(((_b = userInfo.value) == null ? void 0 : _b.nickname) || "未设置昵称"),
        p: common_vendor.p({
          name: "phone",
          size: "12",
          color: "#9ca3af"
        }),
        q: common_vendor.t(((_c = userInfo.value) == null ? void 0 : _c.phone) || "未绑定手机号"),
        r: common_vendor.p({
          name: "arrow-right",
          size: "12",
          color: "#9ca3af"
        }),
        s: common_vendor.o(($event) => handleMenuClick("profile-edit")),
        t: common_vendor.f(menuItems, (item, index, i0) => {
          return {
            a: "b9648a51-10-" + i0,
            b: common_vendor.p({
              name: item.icon,
              size: "20",
              color: "#2563eb"
            }),
            c: common_vendor.t(item.label),
            d: "b9648a51-11-" + i0,
            e: item.action,
            f: common_vendor.o(($event) => handleMenuClick(item.action), item.action)
          };
        }),
        v: common_vendor.p({
          name: "arrow-right",
          color: "#d1d5db",
          size: "14"
        }),
        w: common_vendor.o(logout),
        x: common_vendor.p({
          type: "error",
          shape: "circle",
          hairline: true,
          customStyle: "background-color: #ffffff; color: #ef4444; border-color: #fee2e2;"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b9648a51"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/profile/Profile.js.map
