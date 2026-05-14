"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_cell2 = common_vendor.resolveComponent("u-cell");
  const _easycom_u_cell_group2 = common_vendor.resolveComponent("u-cell-group");
  (_easycom_u_icon2 + _easycom_u_cell2 + _easycom_u_cell_group2)();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_cell = () => "../../node-modules/uview-plus/components/u-cell/u-cell.js";
const _easycom_u_cell_group = () => "../../node-modules/uview-plus/components/u-cell-group/u-cell-group.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_cell + _easycom_u_cell_group)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Resources",
  setup(__props) {
    const entries = [
      { title: "疾病科普", icon: "file-text", path: "/pages/resource/knowledge/KnowledgeResource" },
      { title: "医院&医生", icon: "map", path: "/pages/resource/medical/MedicalResource" },
      { title: "救助", icon: "gift", path: "/pages/resource/charity/CharityResource" },
      { title: "用药", icon: "bag", path: "/pages/resource/drug/DrugResource" },
      { title: "康复", icon: "car", path: "/pages/resource/rehab/RehabResource" },
      { title: "医保", icon: "gift", path: "/pages/resource/medicare/MedicareResource" }
    ];
    const recommends = [
      { id: 1, title: "罕见病诊疗指南合集" },
      { id: 2, title: "医保报销流程图解" }
    ];
    const go = (path) => {
      common_vendor.index.navigateTo({ url: path });
    };
    const open = (item) => {
      common_vendor.index.showToast({ title: `打开: ${item.title}`, icon: "none" });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(entries, (item, index, i0) => {
          return {
            a: "fb8fd81e-0-" + i0,
            b: common_vendor.p({
              name: item.icon,
              size: "28",
              color: "#2563eb"
            }),
            c: common_vendor.t(item.title),
            d: index,
            e: common_vendor.o(($event) => go(item.path), index)
          };
        }),
        b: common_vendor.f(recommends, (item, k0, i0) => {
          return {
            a: item.id,
            b: common_vendor.o(($event) => open(item), item.id),
            c: "fb8fd81e-2-" + i0 + ",fb8fd81e-1",
            d: common_vendor.p({
              title: item.title,
              ["is-link"]: true
            })
          };
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fb8fd81e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/resource/Resources.js.map
