"use strict";
const common_vendor = require("./common/vendor.js");
const utils_request = require("./utils/request.js");
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_cell2 = common_vendor.resolveComponent("u-cell");
  const _easycom_u_cell_group2 = common_vendor.resolveComponent("u-cell-group");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_loadmore2 = common_vendor.resolveComponent("u-loadmore");
  (_easycom_u_search2 + _easycom_u_tag2 + _easycom_u_cell2 + _easycom_u_cell_group2 + _easycom_u_empty2 + _easycom_u_loading_icon2 + _easycom_u_loadmore2)();
}
const _easycom_u_search = () => "./node-modules/uview-plus/components/u-search/u-search.js";
const _easycom_u_tag = () => "./node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_cell = () => "./node-modules/uview-plus/components/u-cell/u-cell.js";
const _easycom_u_cell_group = () => "./node-modules/uview-plus/components/u-cell-group/u-cell-group.js";
const _easycom_u_empty = () => "./node-modules/uview-plus/components/u-empty/u-empty.js";
const _easycom_u_loading_icon = () => "./node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_loadmore = () => "./node-modules/uview-plus/components/u-loadmore/u-loadmore.js";
if (!Math) {
  (_easycom_u_search + _easycom_u_tag + _easycom_u_cell + _easycom_u_cell_group + _easycom_u_empty + _easycom_u_loading_icon + _easycom_u_loadmore)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "ExaminationsList",
  setup(__props) {
    const EXAM_TYPE_MAP = {
      lab: "实验室检查",
      metabolic: "代谢筛查",
      imaging: "影像学检查",
      genetic: "基因检测",
      pathology: "病理检查",
      functional: "功能检查",
      scale: "量表评估",
      special: "专科专项检查",
      other: "其他"
    };
    const keyword = common_vendor.ref("");
    const list = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const total = common_vendor.ref(0);
    const page = common_vendor.ref(1);
    const pageSize = common_vendor.ref(20);
    const loadStatus = common_vendor.ref("loadmore");
    const getExamTypeText = (type) => {
      return EXAM_TYPE_MAP[type] || type;
    };
    const loadInspectionList = async (isRefresh = false) => {
      if (isRefresh) {
        page.value = 1;
        list.value = [];
      }
      if (loadStatus.value === "nomore" && !isRefresh)
        return;
      loading.value = true;
      loadStatus.value = "loading";
      try {
        const res = await utils_request.request.get("/api/resource/medical/examinations", {
          params: {
            keyword: keyword.value,
            page: page.value,
            pageSize: pageSize.value
          }
        });
        const responseData = res.data || {};
        const records = responseData.list || [];
        if (isRefresh) {
          list.value = records;
        } else {
          list.value.push(...records);
        }
        total.value = responseData.total || 0;
        if (records.length < pageSize.value) {
          loadStatus.value = "nomore";
        } else {
          loadStatus.value = "loadmore";
          page.value++;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/medical/ExaminationsList.vue:150", "加载检查项目列表失败:", error);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
        loadStatus.value = "loadmore";
      } finally {
        loading.value = false;
      }
    };
    const open = (item) => {
      common_vendor.index.navigateTo({
        url: `/pages/resource/medical/ExaminationDetail?id=${item.id}`
      });
    };
    const onSearch = () => {
      loadInspectionList(true);
    };
    const onClear = () => {
      keyword.value = "";
      loadInspectionList(true);
    };
    common_vendor.onMounted(() => {
      loadInspectionList();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(onSearch),
        b: common_vendor.o(onClear),
        c: common_vendor.o(($event) => keyword.value = $event),
        d: common_vendor.p({
          placeholder: "搜索检查项目",
          shape: "round",
          clearable: true,
          modelValue: keyword.value
        }),
        e: common_vendor.f(list.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.examType
          }, item.examType ? {
            b: "a62828c8-3-" + i0 + "," + ("a62828c8-2-" + i0),
            c: common_vendor.p({
              text: getExamTypeText(item.examType),
              type: "primary",
              size: "mini"
            })
          } : {}, {
            d: item.id,
            e: common_vendor.o(($event) => open(item), item.id),
            f: "a62828c8-2-" + i0 + ",a62828c8-1",
            g: common_vendor.p({
              title: item.examName,
              label: item.examPurpose,
              ["is-link"]: true
            })
          });
        }),
        f: !loading.value && list.value.length === 0
      }, !loading.value && list.value.length === 0 ? {
        g: common_vendor.p({
          mode: "data",
          text: "暂无检查项目数据"
        })
      } : {}, {
        h: loading.value
      }, loading.value ? {
        i: common_vendor.p({
          mode: "circle"
        })
      } : {}, {
        j: total.value > 0
      }, total.value > 0 ? {
        k: common_vendor.t(total.value)
      } : {}, {
        l: list.value.length > 0
      }, list.value.length > 0 ? {
        m: common_vendor.p({
          status: loadStatus.value
        })
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a62828c8"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/ExaminationsList.js.map
