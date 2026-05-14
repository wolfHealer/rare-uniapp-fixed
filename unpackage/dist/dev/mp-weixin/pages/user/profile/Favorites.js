"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  _easycom_u_empty2();
}
const _easycom_u_empty = () => "../../../node-modules/uview-plus/components/u-empty/u-empty.js";
if (!Math) {
  _easycom_u_empty();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Favorites",
  setup(__props) {
    const favorites = common_vendor.ref([
      { title: "收藏的文章1", description: "这是一篇很棒的文章..." },
      { title: "收藏的文章2", description: "值得反复阅读的内容..." }
    ]);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: favorites.value.length === 0
      }, favorites.value.length === 0 ? {
        b: common_vendor.p({
          mode: "data",
          text: "暂无收藏内容"
        })
      } : {
        c: common_vendor.f(favorites.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.description),
            c: index
          };
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3917dceb"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/profile/Favorites.js.map
