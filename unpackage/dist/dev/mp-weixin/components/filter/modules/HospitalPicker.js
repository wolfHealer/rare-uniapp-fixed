"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  _easycom_u_search2();
}
const _easycom_u_search = () => "../../../node-modules/uview-plus/components/u-search/u-search.js";
if (!Math) {
  _easycom_u_search();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "HospitalPicker",
  props: {
    modelValue: { default: () => ({}) }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    var _a;
    const props = __props;
    const emit = __emit;
    const keyword = common_vendor.ref(((_a = props.modelValue) == null ? void 0 : _a.hospitalName) || "");
    const options = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const timer = common_vendor.ref(null);
    const showResult = common_vendor.computed(() => keyword.value.trim().length > 0);
    common_vendor.watch(
      () => props.modelValue,
      (val) => {
        keyword.value = (val == null ? void 0 : val.hospitalName) || "";
      },
      { deep: true }
    );
    const handleSearch = () => {
      if (timer.value)
        clearTimeout(timer.value);
      timer.value = setTimeout(() => {
        fetchHospitalList();
      }, 300);
    };
    const fetchHospitalList = async () => {
      const q = keyword.value.trim();
      if (!q) {
        options.value = [];
        return;
      }
      loading.value = true;
      try {
        const res = await utils_request.request.get("/api/resource/medical/hospitals", {
          keyword: q,
          page: 1,
          pageSize: 20
        });
        const apiData = res.data || {};
        options.value = apiData.list || [];
      } catch (e) {
        common_vendor.index.__f__("error", "at components/filter/modules/HospitalPicker.vue:111", "搜索医院失败", e);
        options.value = [];
      } finally {
        loading.value = false;
      }
    };
    const selectHospital = (item) => {
      const value = {
        hospitalId: item.id,
        hospitalName: item.name
      };
      keyword.value = item.name;
      emit("update:modelValue", value);
      emit("change", value);
    };
    const clearSelect = () => {
      keyword.value = "";
      options.value = [];
      const value = {
        hospitalId: "",
        hospitalName: ""
      };
      emit("update:modelValue", value);
      emit("change", value);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch),
        b: common_vendor.o(clearSelect),
        c: common_vendor.o(($event) => keyword.value = $event),
        d: common_vendor.p({
          placeholder: "搜索医院名称",
          showAction: false,
          shape: "round",
          height: "36",
          bgColor: "#f9fafb",
          modelValue: keyword.value
        }),
        e: showResult.value
      }, showResult.value ? common_vendor.e({
        f: common_vendor.f(options.value, (item, k0, i0) => {
          var _a2;
          return common_vendor.e({
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.cityName || item.city_name || ""),
            c: item.levelName || item.level_name
          }, item.levelName || item.level_name ? {
            d: common_vendor.t(item.levelName || item.level_name)
          } : {}, {
            e: item.id,
            f: ((_a2 = _ctx.modelValue) == null ? void 0 : _a2.hospitalId) === item.id ? 1 : "",
            g: common_vendor.o(($event) => selectHospital(item), item.id)
          });
        }),
        g: !loading.value && options.value.length === 0
      }, !loading.value && options.value.length === 0 ? {} : {}) : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-84932577"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/components/filter/modules/HospitalPicker.js.map
