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
  (_easycom_u_icon + _easycom_u_tabs + DrugList + DonationProject + ChannelList + BottomNav)();
}
const DrugList = () => "./DrugList2.js";
const DonationProject = () => "./DonationProjectList2.js";
const ChannelList = () => "./ChannelList2.js";
const BottomNav = () => "../../../components/BottomNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "DrugResource",
  setup(__props) {
    const activeTab = common_vendor.ref(0);
    const tabList = common_vendor.ref([
      { name: "药品名录" },
      { name: "赠药项目" },
      { name: "购药渠道" }
    ]);
    const onTabChange = (item) => {
      activeTab.value = item.index;
    };
    const goBack = () => {
      common_vendor.index.navigateBack({ delta: 1 });
    };
    return (_ctx, _cache) => {
      return {
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
        e: activeTab.value === 0,
        f: activeTab.value === 1,
        g: activeTab.value === 2
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-85748e01"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/drug/DrugResource.js.map
