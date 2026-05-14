"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "TagPicker",
  props: {
    modelValue: {},
    options: {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(_ctx.options, (opt, k0, i0) => {
          return {
            a: common_vendor.t(opt.label),
            b: opt.value,
            c: _ctx.modelValue === opt.value ? 1 : "",
            d: common_vendor.o(($event) => _ctx.$emit("update:modelValue", opt.value), opt.value)
          };
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ff63b423"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/components/filter/modules/TagPicker.js.map
