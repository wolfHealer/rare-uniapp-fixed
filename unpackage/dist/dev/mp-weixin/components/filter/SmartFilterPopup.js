"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  (_easycom_u_button2 + _easycom_u_popup2)();
}
const _easycom_u_button = () => "../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_popup = () => "../../node-modules/uview-plus/components/u-popup/u-popup.js";
if (!Math) {
  (RegionPicker + ProvinceCityPicker + HospitalPicker + DiseasePicker + TagPicker + _easycom_u_button + _easycom_u_popup)();
}
const RegionPicker = () => "../RegionPicker.js";
const ProvinceCityPicker = () => "../ProvinceCityPicker.js";
const HospitalPicker = () => "./modules/HospitalPicker.js";
const DiseasePicker = () => "./modules/DiseasePicker.js";
const TagPicker = () => "./modules/TagPicker.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "SmartFilterPopup",
  props: {
    show: { type: Boolean },
    modelValue: {},
    configs: {}
  },
  emits: ["update:show", "update:modelValue", "confirm", "reset"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const formData = common_vendor.ref({});
    common_vendor.watch(() => props.show, (val) => {
      if (val) {
        formData.value = JSON.parse(JSON.stringify(props.modelValue || {}));
        props.configs.forEach((c) => {
          if ((c.type === "region" || c.type === "provinceCity") && !formData.value[c.key]) {
            formData.value[c.key] = {};
          }
          if (c.type === "hospital" && !formData.value[c.key]) {
            formData.value[c.key] = {};
          }
          if (c.type === "disease" && !formData.value[c.key]) {
            formData.value[c.key] = {};
          }
        });
      }
    }, { immediate: true });
    const handleClose = () => emit("update:show", false);
    const handleReset = () => {
      const emptyData = {};
      props.configs.forEach((c) => {
        if (c.type === "region" || c.type === "provinceCity" || c.type === "hospital" || c.type === "disease") {
          emptyData[c.key] = {};
        } else {
          emptyData[c.key] = "";
        }
      });
      formData.value = emptyData;
      emit("reset");
    };
    const handleConfirm = () => {
      emit("update:modelValue", formData.value);
      emit("confirm", formData.value);
      emit("update:show", false);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(_ctx.configs, (config, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(config.label),
            b: config.type === "region"
          }, config.type === "region" ? {
            c: "a0eec2d8-1-" + i0 + ",a0eec2d8-0",
            d: common_vendor.o(($event) => formData.value[config.key] = $event, config.key),
            e: common_vendor.p({
              placeholder: config.placeholder,
              modelValue: formData.value[config.key]
            })
          } : config.type === "provinceCity" ? {
            g: "a0eec2d8-2-" + i0 + ",a0eec2d8-0",
            h: common_vendor.o(($event) => formData.value[config.key] = $event, config.key),
            i: common_vendor.p({
              placeholder: config.placeholder,
              modelValue: formData.value[config.key]
            })
          } : config.type === "hospital" ? {
            k: "a0eec2d8-3-" + i0 + ",a0eec2d8-0",
            l: common_vendor.o(($event) => formData.value[config.key] = $event, config.key),
            m: common_vendor.p({
              modelValue: formData.value[config.key]
            })
          } : config.type === "disease" ? {
            o: "a0eec2d8-4-" + i0 + ",a0eec2d8-0",
            p: common_vendor.o(($event) => formData.value[config.key] = $event, config.key),
            q: common_vendor.p({
              modelValue: formData.value[config.key]
            })
          } : config.type === "tags" ? {
            s: "a0eec2d8-5-" + i0 + ",a0eec2d8-0",
            t: common_vendor.o(($event) => formData.value[config.key] = $event, config.key),
            v: common_vendor.p({
              options: config.options || [],
              modelValue: formData.value[config.key]
            })
          } : {}, {
            f: config.type === "provinceCity",
            j: config.type === "hospital",
            n: config.type === "disease",
            r: config.type === "tags",
            w: config.key
          });
        }),
        b: common_vendor.o(handleReset),
        c: common_vendor.p({
          text: "重置",
          shape: "circle",
          color: "#f3f4f6",
          customStyle: "color:#606266"
        }),
        d: common_vendor.o(handleConfirm),
        e: common_vendor.p({
          text: "确定",
          type: "primary",
          shape: "circle"
        }),
        f: common_vendor.o(handleClose),
        g: common_vendor.p({
          show: _ctx.show,
          mode: "bottom",
          round: "20"
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a0eec2d8"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/filter/SmartFilterPopup.js.map
