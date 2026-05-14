"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  _easycom_u_search2();
}
const _easycom_u_search = () => "../../../node-modules/uview-plus/components/u-search/u-search.js";
if (!Math) {
  (_easycom_u_search + BottomNav)();
}
const BottomNav = () => "../../../components/BottomNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "KnowledgeResource",
  setup(__props) {
    const searchKeyword = common_vendor.ref("");
    const categories = common_vendor.ref([
      { id: 1, name: "神经系统", icon: "🧠", desc: "运动神经元、癫痫等", bgColor: "#e6f3ff" },
      { id: 2, name: "遗传代谢", icon: "🧬", desc: "代谢异常相关罕见病", bgColor: "#fef3c7" },
      { id: 3, name: "心血管系统", icon: "❤️", desc: "心肌病、血管畸形等", bgColor: "#fee2e2" },
      { id: 4, name: "呼吸系统", icon: "🫁", desc: "肺纤维化、气道异常", bgColor: "#dbeafe" },
      { id: 5, name: "免疫风湿", icon: "🛡️", desc: "自身免疫系统疾病", bgColor: "#f3e8ff" },
      { id: 6, name: "血液系统", icon: "🩸", desc: "血友病、贫血等", bgColor: "#ffe4e6" },
      { id: 7, name: "内分泌系统", icon: "🧪", desc: "生长发育、激素异常", bgColor: "#ecfccb" },
      { id: 8, name: "骨骼组织", icon: "🦴", desc: "成骨不全、软骨发育", bgColor: "#f5f5f4" },
      { id: 9, name: "神经肌肉", icon: "💪", desc: "肌营养不良、重症肌无力", bgColor: "#ffedd5" },
      { id: 10, name: "皮肤系统", icon: "🧴", desc: "大疱性表皮松解等", bgColor: "#fae8ff" },
      { id: 11, name: "眼耳鼻喉", icon: "👁️", desc: "视网膜病变、听力障碍", bgColor: "#ccfbf1" },
      { id: 12, name: "儿童发育", icon: "👶", desc: "孤独症、发育迟缓", bgColor: "#e0f2fe" }
    ]);
    const handleSearch = () => {
      if (searchKeyword.value.trim()) {
        common_vendor.index.navigateTo({
          url: `/pages/search/index?keyword=${encodeURIComponent(searchKeyword.value)}`
        });
      }
    };
    const goToCommonDiseases = () => {
      common_vendor.index.__f__("log", "at pages/resource/knowledge/KnowledgeResource.vue:107", "点击了常见疾病");
      common_vendor.index.showToast({ title: "功能开发中", icon: "none" });
    };
    const goToHotArticles = () => {
      common_vendor.index.__f__("log", "at pages/resource/knowledge/KnowledgeResource.vue:114", "点击了热门科普");
      common_vendor.index.showToast({ title: "功能开发中", icon: "none" });
    };
    const goToCategory = (category) => {
      common_vendor.index.__f__("log", "at pages/resource/knowledge/KnowledgeResource.vue:120", "点击分类:", category.name, "ID:", category.id);
      const name = encodeURIComponent(category.name);
      const url = `/pages/resource/knowledge/CategoryDetail?id=${category.id}&name=${name}`;
      common_vendor.index.__f__("log", "at pages/resource/knowledge/KnowledgeResource.vue:126", "准备跳转 URL:", url);
      common_vendor.index.navigateTo({
        url,
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/resource/knowledge/KnowledgeResource.vue:131", "跳转失败:", err);
          common_vendor.index.showToast({ title: "页面跳转失败", icon: "none" });
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleSearch),
        b: common_vendor.o(handleSearch),
        c: common_vendor.o(($event) => searchKeyword.value = $event),
        d: common_vendor.p({
          placeholder: "搜索病种、症状...",
          ["show-action"]: false,
          shape: "round",
          ["bg-color"]: "#f3f4f6",
          modelValue: searchKeyword.value
        }),
        e: common_vendor.o(goToCommonDiseases),
        f: common_vendor.o(goToHotArticles),
        g: common_vendor.f(categories.value, (category, index, i0) => {
          return {
            a: common_vendor.t(category.icon),
            b: category.bgColor || "#eff6ff",
            c: common_vendor.t(category.name),
            d: common_vendor.t(category.desc),
            e: index,
            f: common_vendor.o(($event) => goToCategory(category), index)
          };
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b7c6fc8a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/knowledge/KnowledgeResource.js.map
