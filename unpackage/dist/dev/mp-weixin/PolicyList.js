"use strict";
const common_vendor = require("./common/vendor.js");
const utils_request = require("./utils/request.js");
if (!Array) {
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_cell2 = common_vendor.resolveComponent("u-cell");
  const _easycom_u_cell_group2 = common_vendor.resolveComponent("u-cell-group");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  const _easycom_u_loadmore2 = common_vendor.resolveComponent("u-loadmore");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  (_easycom_u_loading_icon2 + _easycom_u_tag2 + _easycom_u_cell2 + _easycom_u_cell_group2 + _easycom_u_empty2 + _easycom_u_loadmore2 + _easycom_u_button2)();
}
const _easycom_u_loading_icon = () => "./node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_tag = () => "./node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_cell = () => "./node-modules/uview-plus/components/u-cell/u-cell.js";
const _easycom_u_cell_group = () => "./node-modules/uview-plus/components/u-cell-group/u-cell-group.js";
const _easycom_u_empty = () => "./node-modules/uview-plus/components/u-empty/u-empty.js";
const _easycom_u_loadmore = () => "./node-modules/uview-plus/components/u-loadmore/u-loadmore.js";
const _easycom_u_button = () => "./node-modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  (SmartFilterBar + _easycom_u_loading_icon + _easycom_u_tag + _easycom_u_cell + _easycom_u_cell_group + _easycom_u_empty + _easycom_u_loadmore + _easycom_u_button)();
}
const SmartFilterBar = () => "./components/filter/SmartFilterBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "PolicyList",
  setup(__props) {
    const currentPage = common_vendor.ref(1);
    const pageSize = common_vendor.ref(10);
    const loadStatus = common_vendor.ref("loadmore");
    const list = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const downloading = common_vendor.ref(false);
    const filterParams = common_vendor.ref({
      disease: {},
      // 疾病 (对应后端 disease_id)
      region: {}
      // 地区对象 { provinceCode, cityCode, ... }
    });
    const policyConfigs = [
      {
        key: "region",
        label: "选择地区",
        type: "provinceCity"
        // 使用 RegionPicker 组件
      },
      {
        key: "disease",
        // 修改 key
        label: "选择疾病",
        type: "disease"
        // 修改 type 为 disease，这将触发 SmartFilterPopup 使用 DiseasePicker
      }
    ];
    const fetchPolicies = async (isRefresh = false) => {
      if (isRefresh) {
        currentPage.value = 1;
        list.value = [];
      }
      if (loadStatus.value === "nomore" && !isRefresh)
        return;
      loading.value = true;
      if (isRefresh) {
        loadStatus.value = "loading";
      }
      try {
        const params = {
          page: currentPage.value,
          pageSize: pageSize.value
          // 注意：后端返回字段是 pageSize，这里保持一致
        };
        const diseaseVal = filterParams.value.disease || {};
        if (diseaseVal.diseaseId) {
          params.disease_id = diseaseVal.diseaseId;
        }
        const region = filterParams.value.region || {};
        if (region.provinceCode) {
          params.province_code = region.provinceCode;
        }
        if (region.cityCode) {
          params.city_code = region.cityCode;
        }
        const res = await utils_request.request.get("/api/resource/medicare/policies", params);
        const apiData = res.data || {};
        const policiesObj = apiData.policies || {};
        const nationalList = policiesObj.national || [];
        const provinceList = policiesObj.province || [];
        const cityList = policiesObj.city || [];
        const newRecords = [...nationalList, ...provinceList, ...cityList];
        const total = apiData.total || 0;
        list.value.push(...newRecords);
        if (list.value.length >= total || newRecords.length === 0) {
          loadStatus.value = "nomore";
        } else {
          loadStatus.value = "loadmore";
          currentPage.value++;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/medicare/PolicyList.vue:164", "获取政策失败:", error);
        loadStatus.value = "loadmore";
        common_vendor.index.showToast({ title: "加载失败，请重试", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const onLoadMore = () => {
      fetchPolicies();
    };
    const handleFilterChange = () => {
      fetchPolicies(true);
    };
    const handleFilterReset = () => {
      filterParams.value = {
        disease: {},
        // 重置为空对象
        region: {}
      };
      fetchPolicies(true);
    };
    const open = (item) => {
      common_vendor.index.navigateTo({
        url: `/pages/resource/medicare/PolicyDetail?id=${item.id}`
      });
    };
    const getDisplayRegion = (item) => {
      return item.region || "全国";
    };
    const downloadMaterials = async () => {
      downloading.value = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        common_vendor.index.showToast({ title: "下载已开始", icon: "success" });
      } catch (error) {
        common_vendor.index.showToast({ title: "下载失败", icon: "none" });
      } finally {
        downloading.value = false;
      }
    };
    common_vendor.onMounted(() => {
      fetchPolicies(true);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleFilterChange),
        b: common_vendor.o(handleFilterReset),
        c: common_vendor.o(($event) => filterParams.value = $event),
        d: common_vendor.p({
          configs: policyConfigs,
          modelValue: filterParams.value
        }),
        e: loading.value
      }, loading.value ? {
        f: common_vendor.p({
          mode: "circle"
        })
      } : common_vendor.e({
        g: common_vendor.f(list.value, (item, k0, i0) => {
          return {
            a: "5697d670-4-" + i0 + "," + ("5697d670-3-" + i0),
            b: item.id,
            c: common_vendor.o(($event) => open(item), item.id),
            d: "5697d670-3-" + i0 + ",5697d670-2",
            e: common_vendor.p({
              title: item.title,
              label: getDisplayRegion(item) + " · " + item.date,
              ["is-link"]: true
            })
          };
        }),
        h: common_vendor.p({
          text: "政策",
          type: "primary",
          size: "mini"
        }),
        i: list.value.length === 0
      }, list.value.length === 0 ? {
        j: common_vendor.p({
          mode: "data",
          text: "暂无政策解读"
        })
      } : {}, {
        k: common_vendor.p({
          status: loadStatus.value,
          ["loading-text"]: "加载中...",
          ["loadmore-text"]: "上拉加载更多",
          ["nomore-text"]: "没有更多了"
        })
      }), {
        l: common_vendor.o(downloadMaterials),
        m: common_vendor.p({
          type: "primary",
          loading: downloading.value
        }),
        n: common_vendor.o(onLoadMore)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5697d670"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/PolicyList.js.map
