"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (_easycom_u_icon + SmartFilterPopup)();
}
const SmartFilterPopup = () => "./SmartFilterPopup.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "SmartFilterBar",
  props: {
    configs: {},
    modelValue: {}
  },
  emits: ["update:modelValue", "change", "reset"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const showPopup = common_vendor.ref(false);
    const tempParams = common_vendor.ref({});
    const openPopup = () => {
      tempParams.value = JSON.parse(JSON.stringify(props.modelValue || {}));
      props.configs.forEach((c) => {
        if (c.type === "region" && !tempParams.value[c.key]) {
          tempParams.value[c.key] = {};
        }
        if (c.type === "hospital" && !tempParams.value[c.key]) {
          tempParams.value[c.key] = {};
        }
      });
      showPopup.value = true;
    };
    const hasValue = (key) => {
      const val = props.modelValue[key];
      if (!val)
        return false;
      const config = props.configs.find((c) => c.key === key);
      if (!config)
        return false;
      if (config.type === "region") {
        return !!(val.provinceCode || val.cityCode || val.districtCode);
      }
      if (config.type === "provinceCity") {
        return !!(val.provinceCode || val.cityCode);
      }
      if (config.type === "hospital") {
        return !!val.hospitalId;
      }
      if (config.type === "disease") {
        return !!val.diseaseId;
      }
      if (config.type === "tags") {
        return val !== "" && val !== null && val !== void 0 && val !== "all";
      }
      return false;
    };
    const getDisplayText = (config) => {
      var _a;
      const val = props.modelValue[config.key];
      if (config.type === "region") {
        if (!val)
          return config.label;
        return val.districtName || val.cityName || val.provinceName || config.label;
      }
      if (config.type === "provinceCity") {
        if (!val)
          return config.label;
        return val.cityName || val.provinceName || config.label;
      }
      if (config.type === "hospital") {
        return (val == null ? void 0 : val.hospitalName) || config.label;
      }
      if (config.type === "disease") {
        return (val == null ? void 0 : val.diseaseName) || config.label;
      }
      if (config.type === "tags") {
        if (!val || val === "all")
          return config.label;
        const option = (_a = config.options) == null ? void 0 : _a.find((opt) => opt.value === val);
        return option ? option.label : config.label;
      }
      return config.label;
    };
    const handleConfirm = (val) => {
      emit("update:modelValue", val);
      emit("change");
    };
    const handleReset = () => {
      emit("reset");
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(_ctx.configs, (config, k0, i0) => {
          return {
            a: common_vendor.t(getDisplayText(config)),
            b: hasValue(config.key) ? 1 : "",
            c: "6022c733-0-" + i0,
            d: common_vendor.p({
              name: "arrow-down",
              size: "12",
              color: hasValue(config.key) ? "#2979ff" : "#909399"
            }),
            e: config.key,
            f: common_vendor.o(openPopup, config.key)
          };
        }),
        b: common_vendor.o(handleConfirm),
        c: common_vendor.o(handleReset),
        d: common_vendor.o(($event) => showPopup.value = $event),
        e: common_vendor.o(($event) => tempParams.value = $event),
        f: common_vendor.p({
          configs: _ctx.configs,
          show: showPopup.value,
          modelValue: tempParams.value
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6022c733"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/filter/SmartFilterBar.js.map
