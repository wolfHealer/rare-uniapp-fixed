"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_tabs2 = common_vendor.resolveComponent("u-tabs");
  (_easycom_u_icon2 + _easycom_u_tabs2)();
}
const _easycom_u_icon = () => "../../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_tabs = () => "../../../node-modules/uview-plus/components/u-tabs/u-tabs.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_tabs + AidProjectList + CaseShare + HelpChannel + BottomNav)();
}
const AidProjectList = () => "./AidProjectList2.js";
const CaseShare = () => "./CaseShareList2.js";
const HelpChannel = () => "./HelpChannelList2.js";
const BottomNav = () => "../../../components/BottomNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "CharityResource",
  setup(__props) {
    const activeTab = common_vendor.ref(0);
    const tabList = common_vendor.ref([
      { name: "救助项目库" },
      { name: "救助案例分享" },
      { name: "求助通道指引" }
    ]);
    const onTabChange = (item) => {
      activeTab.value = item.index;
    };
    const goBack = () => {
      common_vendor.index.navigateBack({
        delta: 1
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.p({
          name: "arrow-left",
          size: "24",
          color: "#FFFFFF"
        }),
        c: common_vendor.o(onTabChange),
        d: common_vendor.p({
          list: tabList.value,
          current: activeTab.value,
          lineColor: "#1E90FF",
          activeStyle: "color: #1E90FF; font-weight: bold;",
          inactiveStyle: "color: #666;"
        }),
        e: activeTab.value === 0
      }, activeTab.value === 0 ? {} : activeTab.value === 1 ? {} : activeTab.value === 2 ? {} : {}, {
        f: activeTab.value === 1,
        g: activeTab.value === 2
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3059dcad"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/charity/CharityResource.js.map
