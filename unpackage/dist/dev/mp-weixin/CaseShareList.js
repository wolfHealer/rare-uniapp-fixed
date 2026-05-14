"use strict";
const common_vendor = require("./common/vendor.js");
const utils_request = require("./utils/request.js");
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  const _easycom_u_loadmore2 = common_vendor.resolveComponent("u-loadmore");
  (_easycom_u_search2 + _easycom_u_tag2 + _easycom_u_button2 + _easycom_u_empty2 + _easycom_u_loadmore2)();
}
const _easycom_u_search = () => "./node-modules/uview-plus/components/u-search/u-search.js";
const _easycom_u_tag = () => "./node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_button = () => "./node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_empty = () => "./node-modules/uview-plus/components/u-empty/u-empty.js";
const _easycom_u_loadmore = () => "./node-modules/uview-plus/components/u-loadmore/u-loadmore.js";
if (!Math) {
  (_easycom_u_search + SmartFilterBar + _easycom_u_tag + _easycom_u_button + _easycom_u_empty + _easycom_u_loadmore)();
}
const SmartFilterBar = () => "./components/filter/SmartFilterBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "CaseShareList",
  setup(__props) {
    const currentPage = common_vendor.ref(1);
    const pageSize = common_vendor.ref(10);
    const loadStatus = common_vendor.ref("loadmore");
    const list = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const keyword = common_vendor.ref("");
    const filterParams = common_vendor.ref({
      disease: {}
    });
    const caseConfigs = [
      {
        key: "disease",
        label: "疾病",
        type: "disease"
      }
    ];
    const fetchCases = async (isRefresh = false) => {
      var _a;
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
          // 注意：接口参数通常是 pageSize 或 limit，根据之前 AidProject 接口推测是 pageSize
        };
        if (keyword.value && keyword.value.trim() !== "") {
          params.keyword = keyword.value.trim();
        }
        const diseaseVal = filterParams.value.disease || {};
        if (diseaseVal.diseaseId) {
          params.diseaseId = diseaseVal.diseaseId;
        }
        const res = await utils_request.request.get("/api/resource/charity/cases", params);
        const records = ((_a = res.data) == null ? void 0 : _a.list) || [];
        list.value.push(...records);
        if (records.length < pageSize.value) {
          loadStatus.value = "nomore";
        } else {
          loadStatus.value = "loadmore";
          currentPage.value++;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/charity/CaseShareList.vue:151", "获取案例失败:", error);
        loadStatus.value = "loadmore";
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const onLoadMore = () => {
      fetchCases();
    };
    const handleSearch = () => {
      fetchCases(true);
    };
    const handleClear = () => {
      keyword.value = "";
      fetchCases(true);
    };
    const handleFilterChange = () => {
      fetchCases(true);
    };
    const handleFilterReset = () => {
      filterParams.value = {
        disease: {}
      };
      fetchCases(true);
    };
    const viewCase = (item) => {
      common_vendor.index.navigateTo({
        url: `/pages/resource/charity/CaseShareDetail?id=${item.id}`
      });
    };
    const downloadCase = (item) => {
      if (item.casePdf) {
        common_vendor.index.showLoading({ title: "下载中..." });
        common_vendor.index.downloadFile({
          url: item.casePdf,
          success: (res) => {
            common_vendor.index.hideLoading();
            if (res.statusCode === 200) {
              common_vendor.index.openDocument({
                filePath: res.tempFilePath,
                showMenu: true
              });
            } else {
              common_vendor.index.showToast({ title: "下载失败", icon: "none" });
            }
          },
          fail: () => {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({ title: "下载失败", icon: "none" });
          }
        });
      } else {
        common_vendor.index.showToast({ title: "暂无PDF文件", icon: "none" });
      }
    };
    common_vendor.onMounted(() => {
      fetchCases(true);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch),
        b: common_vendor.o(handleClear),
        c: common_vendor.o(($event) => keyword.value = $event),
        d: common_vendor.p({
          placeholder: "搜索案例名称",
          shape: "round",
          ["show-action"]: false,
          modelValue: keyword.value
        }),
        e: common_vendor.o(handleFilterChange),
        f: common_vendor.o(handleFilterReset),
        g: common_vendor.o(($event) => filterParams.value = $event),
        h: common_vendor.p({
          configs: caseConfigs,
          modelValue: filterParams.value
        }),
        i: common_vendor.f(list.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.caseTitle),
            b: "75dfed6d-2-" + i0,
            c: common_vendor.p({
              text: item.diseaseName,
              type: "primary",
              size: "mini"
            }),
            d: common_vendor.t(item.actualRelief),
            e: common_vendor.t(item.patientDesc),
            f: common_vendor.o(($event) => viewCase(item), item.id),
            g: "75dfed6d-3-" + i0,
            h: common_vendor.o(($event) => downloadCase(item), item.id),
            i: "75dfed6d-4-" + i0,
            j: common_vendor.o(() => {
            }, item.id),
            k: item.id,
            l: common_vendor.o(($event) => viewCase(item), item.id)
          };
        }),
        j: common_vendor.p({
          size: "mini",
          plain: true
        }),
        k: common_vendor.p({
          size: "mini",
          plain: true
        }),
        l: !loading.value && list.value.length === 0
      }, !loading.value && list.value.length === 0 ? {
        m: common_vendor.p({
          mode: "data",
          text: "暂无案例分享"
        })
      } : {}, {
        n: common_vendor.p({
          status: loadStatus.value,
          ["loading-text"]: "加载中...",
          ["loadmore-text"]: "上拉加载更多",
          ["nomore-text"]: "没有更多了"
        }),
        o: common_vendor.o(onLoadMore)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-75dfed6d"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/CaseShareList.js.map
