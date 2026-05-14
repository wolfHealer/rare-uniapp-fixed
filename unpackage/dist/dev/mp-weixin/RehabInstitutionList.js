"use strict";
const common_vendor = require("./common/vendor.js");
const utils_request = require("./utils/request.js");
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_loadmore2 = common_vendor.resolveComponent("u-loadmore");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  (_easycom_u_search2 + _easycom_u_loading_icon2 + _easycom_u_tag2 + _easycom_u_icon2 + _easycom_u_button2 + _easycom_u_loadmore2 + _easycom_u_empty2)();
}
const _easycom_u_search = () => "./node-modules/uview-plus/components/u-search/u-search.js";
const _easycom_u_loading_icon = () => "./node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_tag = () => "./node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_icon = () => "./node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_button = () => "./node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_loadmore = () => "./node-modules/uview-plus/components/u-loadmore/u-loadmore.js";
const _easycom_u_empty = () => "./node-modules/uview-plus/components/u-empty/u-empty.js";
if (!Math) {
  (_easycom_u_search + SmartFilterBar + _easycom_u_loading_icon + _easycom_u_tag + _easycom_u_icon + _easycom_u_button + _easycom_u_loadmore + _easycom_u_empty)();
}
const SmartFilterBar = () => "./components/filter/SmartFilterBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "RehabInstitutionList",
  setup(__props) {
    const keyword = common_vendor.ref("");
    const institutions = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const institutionLoadStatus = common_vendor.ref("loadmore");
    const institutionPage = common_vendor.ref(1);
    const institutionPageSize = common_vendor.ref(10);
    const filterParams = common_vendor.ref({
      disease: {},
      region: {}
    });
    const institutionConfigs = [
      {
        key: "disease",
        label: "疾病",
        type: "disease"
      },
      {
        key: "region",
        label: "地区",
        type: "region"
      }
    ];
    const getFullAddress = (item) => {
      const parts = [item.provinceName, item.cityName, item.districtName, item.address].filter(Boolean);
      return parts.join("") || "地址不详";
    };
    const fetchInstitutions = async (isRefresh = false) => {
      if (isRefresh) {
        institutionPage.value = 1;
        institutions.value = [];
        institutionLoadStatus.value = "loading";
      }
      if (institutionLoadStatus.value === "nomore" && !isRefresh)
        return;
      loading.value = true;
      try {
        const params = {
          page: institutionPage.value,
          pageSize: institutionPageSize.value
        };
        if (keyword.value) {
          params.keyword = keyword.value;
        }
        const diseaseVal = filterParams.value.disease || {};
        if (diseaseVal.diseaseId) {
          params.diseaseId = diseaseVal.diseaseId;
        }
        const regionData = filterParams.value.region || {};
        if (regionData.provinceCode)
          params.provinceCode = regionData.provinceCode;
        if (regionData.cityCode)
          params.cityCode = regionData.cityCode;
        if (regionData.districtCode)
          params.districtCode = regionData.districtCode;
        const res = await utils_request.request.get("/api/resource/rehab/institutions", params);
        const responseData = res.data || {};
        const records = responseData.list || [];
        institutions.value.push(...records);
        if (records.length < institutionPageSize.value) {
          institutionLoadStatus.value = "nomore";
        } else {
          institutionLoadStatus.value = "loadmore";
          institutionPage.value++;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/rehab/RehabInstitutionList.vue:185", "获取康复机构失败:", error);
        institutionLoadStatus.value = "loadmore";
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const loadMore = () => fetchInstitutions();
    const handleSearch = () => fetchInstitutions(true);
    const handleClear = () => {
      keyword.value = "";
      fetchInstitutions(true);
    };
    const handleFilterChange = () => {
      fetchInstitutions(true);
    };
    const handleFilterReset = () => {
      filterParams.value = {
        disease: {},
        region: {}
      };
      fetchInstitutions(true);
    };
    const openDetail = (item) => {
      if (!(item == null ? void 0 : item.id))
        return;
      common_vendor.index.navigateTo({ url: `/pages/resource/rehab/RehabInstitutionDetail?id=${item.id}` });
    };
    const viewDetails = (item) => {
      openDetail(item);
    };
    common_vendor.onMounted(() => {
      fetchInstitutions();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch),
        b: common_vendor.o(handleClear),
        c: common_vendor.o(($event) => keyword.value = $event),
        d: common_vendor.p({
          placeholder: "搜索康复机构名称",
          shape: "round",
          ["show-action"]: false,
          modelValue: keyword.value
        }),
        e: common_vendor.o(handleFilterChange),
        f: common_vendor.o(handleFilterReset),
        g: common_vendor.o(($event) => filterParams.value = $event),
        h: common_vendor.p({
          configs: institutionConfigs,
          modelValue: filterParams.value
        }),
        i: loading.value && institutions.value.length === 0
      }, loading.value && institutions.value.length === 0 ? {
        j: common_vendor.p({
          mode: "circle"
        })
      } : {}, {
        k: common_vendor.f(institutions.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.name),
            b: item.rating
          }, item.rating ? {
            c: "e07cdbeb-3-" + i0,
            d: common_vendor.p({
              text: "评分 " + item.rating,
              type: "warning",
              size: "mini",
              plain: true
            })
          } : {}, {
            e: "e07cdbeb-4-" + i0,
            f: common_vendor.t(getFullAddress(item)),
            g: "e07cdbeb-5-" + i0,
            h: common_vendor.t(item.contactPhone || "暂无联系方式"),
            i: item.rehabProjects
          }, item.rehabProjects ? {
            j: "e07cdbeb-6-" + i0,
            k: common_vendor.p({
              name: "star",
              size: "14",
              color: "#9ca3af"
            }),
            l: common_vendor.t(item.rehabProjects)
          } : {}, {
            m: common_vendor.o(($event) => viewDetails(item), item.id),
            n: "e07cdbeb-7-" + i0,
            o: item.id,
            p: common_vendor.o(($event) => openDetail(item), item.id)
          });
        }),
        l: common_vendor.p({
          name: "map",
          size: "14",
          color: "#9ca3af"
        }),
        m: common_vendor.p({
          name: "phone",
          size: "14",
          color: "#9ca3af"
        }),
        n: common_vendor.p({
          size: "mini",
          type: "primary",
          plain: true
        }),
        o: common_vendor.o(loadMore),
        p: common_vendor.p({
          status: institutionLoadStatus.value
        }),
        q: !loading.value && institutions.value.length === 0
      }, !loading.value && institutions.value.length === 0 ? {
        r: common_vendor.p({
          mode: "data",
          text: "暂无康复机构"
        })
      } : {}, {
        s: common_vendor.o(loadMore)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e07cdbeb"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/RehabInstitutionList.js.map
