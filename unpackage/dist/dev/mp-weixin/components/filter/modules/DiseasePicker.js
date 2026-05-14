"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  (_easycom_u_search2 + _easycom_u_loading_icon2 + _easycom_u_icon2)();
}
const _easycom_u_search = () => "../../../node-modules/uview-plus/components/u-search/u-search.js";
const _easycom_u_loading_icon = () => "../../../node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_icon = () => "../../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (_easycom_u_search + _easycom_u_loading_icon + _easycom_u_icon)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "DiseasePicker",
  props: {
    modelValue: { default: () => ({}) }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    var _a;
    const props = __props;
    const emit = __emit;
    const keyword = common_vendor.ref(((_a = props.modelValue) == null ? void 0 : _a.diseaseName) || "");
    const options = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const timer = common_vendor.ref(null);
    const showResult = common_vendor.computed(() => keyword.value.trim().length > 0);
    common_vendor.watch(
      () => props.modelValue,
      (val) => {
        keyword.value = (val == null ? void 0 : val.diseaseName) || "";
      },
      { deep: true }
    );
    const handleSearch = () => {
      if (timer.value)
        clearTimeout(timer.value);
      timer.value = setTimeout(() => {
        fetchDiseaseList();
      }, 300);
    };
    const fetchDiseaseList = async () => {
      const q = keyword.value.trim();
      if (!q) {
        options.value = [];
        return;
      }
      loading.value = true;
      try {
        const res = await utils_request.request.get("/api/knowledge/diseases/search", {
          keyword: q
        });
        const apiData = res.data || {};
        options.value = apiData.list || [];
      } catch (e) {
        common_vendor.index.__f__("error", "at components/filter/modules/DiseasePicker.vue:129", "搜索疾病失败", e);
        options.value = [];
        common_vendor.index.showToast({ title: "搜索失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const selectDisease = (item) => {
      const value = {
        diseaseId: item.id,
        diseaseName: item.name
      };
      keyword.value = item.name;
      emit("update:modelValue", value);
      emit("change", value);
    };
    const clearSelect = () => {
      keyword.value = "";
      options.value = [];
      const value = {
        diseaseId: "",
        diseaseName: ""
      };
      emit("update:modelValue", value);
      emit("change", value);
    };
    return (_ctx, _cache) => {
      var _a2, _b;
      return common_vendor.e({
        a: common_vendor.o(handleSearch),
        b: common_vendor.o(clearSelect),
        c: common_vendor.o(($event) => keyword.value = $event),
        d: common_vendor.p({
          placeholder: "搜索疾病名称",
          showAction: false,
          shape: "round",
          height: "36",
          bgColor: "#f9fafb",
          modelValue: keyword.value
        }),
        e: showResult.value
      }, showResult.value ? common_vendor.e({
        f: common_vendor.f(options.value, (item, k0, i0) => {
          var _a3;
          return common_vendor.e({
            a: common_vendor.t(item.name),
            b: item.alias
          }, item.alias ? {
            c: common_vendor.t(item.alias)
          } : {}, {
            d: item.id,
            e: ((_a3 = _ctx.modelValue) == null ? void 0 : _a3.diseaseId) === item.id ? 1 : "",
            f: common_vendor.o(($event) => selectDisease(item), item.id)
          });
        }),
        g: !loading.value && options.value.length === 0
      }, !loading.value && options.value.length === 0 ? {} : {}, {
        h: loading.value
      }, loading.value ? {
        i: common_vendor.p({
          mode: "circle",
          size: "20"
        })
      } : {}) : ((_a2 = _ctx.modelValue) == null ? void 0 : _a2.diseaseName) ? {
        k: common_vendor.t(_ctx.modelValue.diseaseName),
        l: common_vendor.o(clearSelect),
        m: common_vendor.p({
          name: "close-circle-fill",
          color: "#c0c4cc",
          size: "18"
        })
      } : {}, {
        j: (_b = _ctx.modelValue) == null ? void 0 : _b.diseaseName
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0c78ca8c"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/components/filter/modules/DiseasePicker.js.map
