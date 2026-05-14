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
  __name: "MyPosts",
  setup(__props) {
    const posts = common_vendor.ref([
      { title: "我的第一篇动态", content: "这是我发布的第一个动态..." },
      { title: "我的第二篇动态", content: "继续分享生活点滴..." }
    ]);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: posts.value.length === 0
      }, posts.value.length === 0 ? {
        b: common_vendor.p({
          mode: "data",
          text: "暂无发布内容"
        })
      } : {
        c: common_vendor.f(posts.value, (post, index, i0) => {
          return {
            a: common_vendor.t(post.title),
            b: common_vendor.t(post.content),
            c: index
          };
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bb6b1307"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/profile/MyPosts.js.map
