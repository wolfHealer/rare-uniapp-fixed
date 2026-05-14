"use strict";
const common_vendor = require("./common/vendor.js");
const utils_request = require("./utils/request.js");
var define_import_meta_env_default = { VITE_CJS_IGNORE_WARNING: "true", VITE_USER_NODE_ENV: "development", VITE_ROOT_DIR: "/Users/zhonghua/Downloads/rare-uniapp-fixed", BASE_URL: "/", MODE: "development", DEV: true, PROD: false, SSR: false };
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  const _easycom_u_loadmore2 = common_vendor.resolveComponent("u-loadmore");
  (_easycom_u_search2 + _easycom_u_loading_icon2 + _easycom_u_tag2 + _easycom_u_button2 + _easycom_u_empty2 + _easycom_u_loadmore2)();
}
const _easycom_u_search = () => "./node-modules/uview-plus/components/u-search/u-search.js";
const _easycom_u_loading_icon = () => "./node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_tag = () => "./node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_button = () => "./node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_empty = () => "./node-modules/uview-plus/components/u-empty/u-empty.js";
const _easycom_u_loadmore = () => "./node-modules/uview-plus/components/u-loadmore/u-loadmore.js";
if (!Math) {
  (_easycom_u_search + SmartFilterBar + _easycom_u_loading_icon + _easycom_u_tag + _easycom_u_button + _easycom_u_empty + _easycom_u_loadmore)();
}
const SmartFilterBar = () => "./components/filter/SmartFilterBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "RehabGuideList",
  setup(__props) {
    const keyword = common_vendor.ref("");
    const list = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const loadStatus = common_vendor.ref("loadmore");
    const currentPage = common_vendor.ref(1);
    const pageSize = common_vendor.ref(10);
    const filterParams = common_vendor.ref({
      disease: {},
      stage: ""
    });
    const stageOptions = common_vendor.ref([
      { label: "全部阶段", value: "" },
      { label: "早期", value: "early" },
      { label: "中期", value: "middle" },
      // 注意：接口示例中未出现 middle，但保留以防万一
      { label: "晚期", value: "late" },
      { label: "稳定期", value: "stable" },
      { label: "渐进期", value: "progressive" }
    ]);
    const rehabConfigs = [
      {
        key: "disease",
        label: "疾病",
        type: "disease"
      },
      {
        key: "stage",
        label: "阶段",
        type: "tags",
        options: stageOptions.value
      }
    ];
    const stageLabels = {
      early: "早期",
      middle: "中期",
      late: "晚期",
      stable: "稳定期",
      progressive: "渐进期"
    };
    const getStageLabel = (stage) => {
      return stageLabels[stage] || stage || "未知阶段";
    };
    const fetchTrainings = async (isRefresh = false) => {
      if (isRefresh) {
        currentPage.value = 1;
        list.value = [];
        loadStatus.value = "loading";
      }
      if (loadStatus.value === "nomore" && !isRefresh)
        return;
      loading.value = true;
      try {
        const params = {
          page: currentPage.value,
          pageSize: pageSize.value
        };
        if (keyword.value) {
          params.keyword = keyword.value;
        }
        const diseaseVal = filterParams.value.disease || {};
        if (diseaseVal.diseaseId) {
          params.diseaseId = diseaseVal.diseaseId;
        }
        if (filterParams.value.stage) {
          params.rehabStage = filterParams.value.stage;
        }
        const res = await utils_request.request.get("/api/resource/rehab/trainings", params);
        const responseData = res.data || {};
        const records = responseData.list || [];
        list.value.push(...records);
        if (records.length < pageSize.value) {
          loadStatus.value = "nomore";
        } else {
          loadStatus.value = "loadmore";
          currentPage.value++;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/rehab/RehabGuideList.vue:191", "获取列表失败:", error);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
        loadStatus.value = "loadmore";
      } finally {
        loading.value = false;
      }
    };
    const onLoadMore = () => {
      if (!loading.value)
        fetchTrainings();
    };
    const handleSearch = () => {
      fetchTrainings(true);
    };
    const handleClear = () => {
      keyword.value = "";
      fetchTrainings(true);
    };
    const handleFilterChange = () => {
      fetchTrainings(true);
    };
    const handleFilterReset = () => {
      filterParams.value = {
        disease: {},
        stage: ""
      };
      fetchTrainings(true);
    };
    const viewDetails = (item) => {
      if (!(item == null ? void 0 : item.id))
        return;
      common_vendor.index.navigateTo({
        url: `/pages/resource/rehab/RehabGuideDetail?id=${item.id}`
      });
    };
    const downloadGuide = async (item) => {
      if (!item.guidePdf) {
        common_vendor.index.showToast({ title: "暂无PDF文件", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "下载中..." });
      let pdfUrl = item.guidePdf;
      if (!pdfUrl.startsWith("http")) {
        const BASE_URL = define_import_meta_env_default.VITE_API_BASE_URL || "";
        pdfUrl = BASE_URL + pdfUrl;
      }
      common_vendor.index.downloadFile({
        url: pdfUrl,
        success: (res) => {
          common_vendor.index.hideLoading();
          if (res.statusCode === 200) {
            common_vendor.index.openDocument({
              filePath: res.tempFilePath,
              fileType: "pdf",
              showMenu: true,
              success: () => {
              },
              fail: () => common_vendor.index.showToast({ title: "打开失败", icon: "none" })
            });
          } else {
            common_vendor.index.showToast({ title: "下载失败", icon: "none" });
          }
        },
        fail: () => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "网络错误", icon: "none" });
        }
      });
    };
    common_vendor.onMounted(() => {
      fetchTrainings();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch),
        b: common_vendor.o(handleClear),
        c: common_vendor.o(($event) => keyword.value = $event),
        d: common_vendor.p({
          placeholder: "搜索指南名称",
          shape: "round",
          ["show-action"]: false,
          modelValue: keyword.value
        }),
        e: common_vendor.o(handleFilterChange),
        f: common_vendor.o(handleFilterReset),
        g: common_vendor.o(($event) => filterParams.value = $event),
        h: common_vendor.p({
          configs: rehabConfigs,
          modelValue: filterParams.value
        }),
        i: loading.value && list.value.length === 0
      }, loading.value && list.value.length === 0 ? {
        j: common_vendor.p({
          mode: "circle"
        })
      } : {}, {
        k: common_vendor.f(list.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.f(item.diseases, (disease, index, i1) => {
              return {
                a: index,
                b: "46c11367-3-" + i0 + "-" + i1,
                c: common_vendor.p({
                  text: disease.name,
                  type: "primary",
                  size: "mini",
                  customStyle: "margin-right: 4px;"
                })
              };
            }),
            c: "46c11367-4-" + i0,
            d: common_vendor.p({
              text: getStageLabel(item.rehabStage),
              plain: true,
              size: "mini"
            }),
            e: common_vendor.t(item.trainPurpose),
            f: common_vendor.o(($event) => viewDetails(item), item.id),
            g: "46c11367-5-" + i0,
            h: common_vendor.o(($event) => downloadGuide(item), item.id),
            i: "46c11367-6-" + i0,
            j: common_vendor.o(() => {
            }, item.id),
            k: item.id,
            l: common_vendor.o(($event) => viewDetails(item), item.id)
          };
        }),
        l: common_vendor.p({
          size: "mini",
          type: "primary",
          plain: true
        }),
        m: common_vendor.p({
          size: "mini",
          plain: true
        }),
        n: !loading.value && list.value.length === 0
      }, !loading.value && list.value.length === 0 ? {
        o: common_vendor.p({
          mode: "data",
          description: "暂无训练指南"
        })
      } : {}, {
        p: list.value.length > 0
      }, list.value.length > 0 ? {
        q: common_vendor.p({
          status: loadStatus.value,
          ["loading-text"]: "加载中...",
          ["loadmore-text"]: "上拉加载更多",
          ["nomore-text"]: "没有更多了"
        })
      } : {}, {
        r: common_vendor.o(onLoadMore)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-46c11367"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/RehabGuideList.js.map
