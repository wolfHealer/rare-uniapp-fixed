"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("../utils/request.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_picker2 = common_vendor.resolveComponent("u-picker");
  (_easycom_u_icon2 + _easycom_u_picker2)();
}
const _easycom_u_icon = () => "../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_picker = () => "../node-modules/uview-plus/components/u-picker/u-picker.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_picker)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "RegionPicker",
  props: {
    modelValue: { default: () => ({}) },
    placeholder: { default: "请选择地区" },
    autoLoad: { type: Boolean, default: true }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const show = common_vendor.ref(false);
    const loading = common_vendor.ref(false);
    const regionTree = common_vendor.ref([]);
    const columns = common_vendor.ref([]);
    const currentProvinceIndex = common_vendor.ref(0);
    const currentCityIndex = common_vendor.ref(0);
    const currentDistrictIndex = common_vendor.ref(0);
    const normalizedValue = common_vendor.computed(() => {
      var _a, _b, _c, _d, _e, _f;
      return {
        provinceCode: ((_a = props.modelValue) == null ? void 0 : _a.provinceCode) || "",
        provinceName: ((_b = props.modelValue) == null ? void 0 : _b.provinceName) || "",
        cityCode: ((_c = props.modelValue) == null ? void 0 : _c.cityCode) || "",
        cityName: ((_d = props.modelValue) == null ? void 0 : _d.cityName) || "",
        districtCode: ((_e = props.modelValue) == null ? void 0 : _e.districtCode) || "",
        districtName: ((_f = props.modelValue) == null ? void 0 : _f.districtName) || ""
      };
    });
    const displayText = common_vendor.computed(() => {
      const value = normalizedValue.value;
      return [value.provinceName, value.cityName, value.districtName].filter(Boolean).join(" / ");
    });
    const getProvinceList = () => {
      return regionTree.value || [];
    };
    const getCityList = (provinceIndex) => {
      var _a;
      return ((_a = getProvinceList()[provinceIndex]) == null ? void 0 : _a.children) || [];
    };
    const getDistrictList = (provinceIndex, cityIndex) => {
      var _a;
      return ((_a = getCityList(provinceIndex)[cityIndex]) == null ? void 0 : _a.children) || [];
    };
    const buildColumns = (provinceIndex = 0, cityIndex = 0, districtIndex = 0) => {
      const provinceList = getProvinceList();
      const cityList = getCityList(provinceIndex);
      const districtList = getDistrictList(provinceIndex, cityIndex);
      currentProvinceIndex.value = provinceIndex;
      currentCityIndex.value = cityIndex;
      currentDistrictIndex.value = districtIndex;
      columns.value = [
        provinceList,
        cityList.length ? cityList : [{ code: "", name: "", level: 2 }],
        districtList.length ? districtList : [{ code: "", name: "", level: 3 }]
      ];
    };
    const findIndexesByValue = (value) => {
      const provinceList = getProvinceList();
      let provinceIndex = 0;
      let cityIndex = 0;
      let districtIndex = 0;
      if (value.provinceCode) {
        const pIndex = provinceList.findIndex(
          (item) => item.code === value.provinceCode
        );
        provinceIndex = pIndex >= 0 ? pIndex : 0;
      }
      const cityList = getCityList(provinceIndex);
      if (value.cityCode && cityList.length) {
        const cIndex = cityList.findIndex((item) => item.code === value.cityCode);
        cityIndex = cIndex >= 0 ? cIndex : 0;
      }
      const districtList = getDistrictList(provinceIndex, cityIndex);
      if (value.districtCode && districtList.length) {
        const dIndex = districtList.findIndex(
          (item) => item.code === value.districtCode
        );
        districtIndex = dIndex >= 0 ? dIndex : 0;
      }
      return {
        provinceIndex,
        cityIndex,
        districtIndex
      };
    };
    const loadRegionTree = async () => {
      try {
        loading.value = true;
        const res = await utils_request.request.get("/api/region/tree");
        let treeData = [];
        if (res.code === 0 || res.code === 200) {
          treeData = res.data || [];
        } else if (Array.isArray(res)) {
          treeData = res;
        } else if (res.data && Array.isArray(res.data)) {
          treeData = res.data;
        }
        regionTree.value = treeData;
        const indexes = findIndexesByValue(normalizedValue.value);
        buildColumns(
          indexes.provinceIndex,
          indexes.cityIndex,
          indexes.districtIndex
        );
      } catch (error) {
        common_vendor.index.__f__("error", "at components/RegionPicker.vue:197", "获取地区数据失败", error);
        common_vendor.index.showToast({ title: "地区数据加载失败", icon: "none" });
        regionTree.value = [];
        columns.value = [[], [], []];
      } finally {
        loading.value = false;
      }
    };
    const openPicker = async () => {
      if (!regionTree.value.length) {
        await loadRegionTree();
      } else {
        const indexes = findIndexesByValue(normalizedValue.value);
        buildColumns(
          indexes.provinceIndex,
          indexes.cityIndex,
          indexes.districtIndex
        );
      }
      show.value = true;
    };
    const handleCancel = () => {
      show.value = false;
    };
    const handleChange = (e) => {
      const { columnIndex, index, indexs } = e;
      if (columnIndex === 0) {
        const provinceIndex = index;
        const cityList = getCityList(provinceIndex);
        const cityIndex = 0;
        const districtList = getDistrictList(provinceIndex, cityIndex);
        currentProvinceIndex.value = provinceIndex;
        currentCityIndex.value = 0;
        currentDistrictIndex.value = 0;
        columns.value = [
          getProvinceList(),
          cityList.length ? cityList : [{ code: "", name: "", level: 2 }],
          districtList.length ? districtList : [{ code: "", name: "", level: 3 }]
        ];
        return;
      }
      if (columnIndex === 1) {
        const provinceIndex = indexs[0];
        const cityIndex = index;
        const districtList = getDistrictList(provinceIndex, cityIndex);
        currentProvinceIndex.value = provinceIndex;
        currentCityIndex.value = cityIndex;
        currentDistrictIndex.value = 0;
        columns.value = [
          getProvinceList(),
          getCityList(provinceIndex).length ? getCityList(provinceIndex) : [{ code: "", name: "", level: 2 }],
          districtList.length ? districtList : [{ code: "", name: "", level: 3 }]
        ];
        return;
      }
      if (columnIndex === 2) {
        currentProvinceIndex.value = indexs[0];
        currentCityIndex.value = indexs[1];
        currentDistrictIndex.value = index;
      }
    };
    const handleConfirm = (e) => {
      const values = e.value || [];
      const province = values[0] || {};
      const city = values[1] || {};
      const district = values[2] || {};
      const result = {
        provinceCode: province.code || "",
        provinceName: province.name || "",
        cityCode: city.code || "",
        cityName: city.name || "",
        districtCode: district.code || "",
        districtName: district.name || ""
      };
      emit("update:modelValue", result);
      emit("change", result);
      show.value = false;
    };
    common_vendor.watch(
      () => props.modelValue,
      () => {
        if (regionTree.value.length) {
          const indexes = findIndexesByValue(normalizedValue.value);
          buildColumns(
            indexes.provinceIndex,
            indexes.cityIndex,
            indexes.districtIndex
          );
        }
      },
      { deep: true }
    );
    common_vendor.onMounted(() => {
      if (props.autoLoad) {
        loadRegionTree();
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(displayText.value || _ctx.placeholder),
        b: !displayText.value ? 1 : "",
        c: common_vendor.p({
          name: "arrow-down",
          size: "16",
          color: "#999999"
        }),
        d: common_vendor.o(openPicker),
        e: common_vendor.o(handleConfirm),
        f: common_vendor.o(handleCancel),
        g: common_vendor.o(handleCancel),
        h: common_vendor.o(handleChange),
        i: common_vendor.p({
          show: show.value,
          columns: columns.value,
          keyName: "name",
          loading: loading.value
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d8a0cb3f"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/RegionPicker.js.map
