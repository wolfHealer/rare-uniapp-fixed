"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "BottomNav",
  setup(__props) {
    const navList = [
      {
        text: "首页",
        path: "/pages/main/Home",
        icon: "/static/tabbar/home.png",
        activeIcon: "/static/tabbar/home-active.png"
      },
      {
        text: "医疗",
        path: "/pages/resource/Resources",
        icon: "/static/tabbar/medical.png",
        activeIcon: "/static/tabbar/medical-active.png"
      },
      {
        text: "社区",
        path: "/pages/community/Community",
        icon: "/static/tabbar/community.png",
        activeIcon: "/static/tabbar/community-active.png"
      },
      {
        text: "我的",
        path: "/pages/user/profile/Profile",
        icon: "/static/tabbar/profile.png",
        activeIcon: "/static/tabbar/profile-active.png"
      }
    ];
    const currentPath = common_vendor.computed(() => {
      const pages = getCurrentPages();
      if (!pages.length)
        return "";
      const current = pages[pages.length - 1];
      return `/${current.route}`;
    });
    const handleTabClick = (path) => {
      if (currentPath.value === path)
        return;
      common_vendor.index.switchTab({ url: path });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(navList, (item, k0, i0) => {
          return {
            a: currentPath.value === item.path ? item.activeIcon : item.icon,
            b: common_vendor.t(item.text),
            c: common_vendor.n(currentPath.value === item.path ? "active" : ""),
            d: item.path,
            e: common_vendor.o(($event) => handleTabClick(item.path), item.path)
          };
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-53d1cde7"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/BottomNav.js.map
