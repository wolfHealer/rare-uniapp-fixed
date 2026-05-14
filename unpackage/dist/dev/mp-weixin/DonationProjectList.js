"use strict";
const common_vendor = require("./common/vendor.js");
const utils_request = require("./utils/request.js");
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  (_easycom_u_search2 + _easycom_u_loading_icon2 + _easycom_u_empty2 + _easycom_u_tag2 + _easycom_u_icon2)();
}
const _easycom_u_search = () => "./node-modules/uview-plus/components/u-search/u-search.js";
const _easycom_u_loading_icon = () => "./node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_empty = () => "./node-modules/uview-plus/components/u-empty/u-empty.js";
const _easycom_u_tag = () => "./node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_icon = () => "./node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (_easycom_u_search + SmartFilterBar + _easycom_u_loading_icon + _easycom_u_empty + _easycom_u_tag + _easycom_u_icon)();
}
const SmartFilterBar = () => "./components/filter/SmartFilterBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "DonationProjectList",
  setup(__props) {
    const keyword = common_vendor.ref("");
    const projects = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const filterParams = common_vendor.ref({
      disease: {}
    });
    const projectConfigs = [
      {
        key: "disease",
        label: "疾病",
        type: "disease"
      }
    ];
    const formatDate = (dateStr) => {
      if (!dateStr)
        return "-";
      const date = new Date(dateStr);
      if (isNaN(date.getTime()))
        return dateStr;
      return date.toLocaleDateString("zh-CN");
    };
    const fetchProjects = async () => {
      var _a;
      loading.value = true;
      try {
        const params = {};
        if (keyword.value && keyword.value.trim() !== "") {
          params.keyword = keyword.value.trim();
        }
        const diseaseVal = filterParams.value.disease || {};
        if (diseaseVal.diseaseId) {
          params.diseaseId = diseaseVal.diseaseId;
        }
        const res = await utils_request.request.get("/api/resource/drug/donations", params);
        projects.value = ((_a = res.data) == null ? void 0 : _a.list) || [];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/drug/DonationProjectList.vue:156", "获取援助项目列表失败:", error);
        projects.value = [];
        common_vendor.index.showToast({ title: "加载项目列表失败，请稍后再试", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const viewDetail = (project) => {
      common_vendor.index.navigateTo({
        url: `/pages/resource/drug/DonationProjectDetail?projectId=${project.id}`
      });
    };
    const handleSearch = () => {
      fetchProjects();
    };
    const handleClear = () => {
      keyword.value = "";
      fetchProjects();
    };
    const handleFilterChange = () => {
      fetchProjects();
    };
    const handleFilterReset = () => {
      filterParams.value = {
        disease: {}
      };
      fetchProjects();
    };
    common_vendor.onMounted(() => {
      fetchProjects();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch),
        b: common_vendor.o(handleClear),
        c: common_vendor.o(($event) => keyword.value = $event),
        d: common_vendor.p({
          placeholder: "搜索援助项目名称",
          shape: "round",
          ["show-action"]: false,
          modelValue: keyword.value
        }),
        e: common_vendor.o(handleFilterChange),
        f: common_vendor.o(handleFilterReset),
        g: common_vendor.o(($event) => filterParams.value = $event),
        h: common_vendor.p({
          configs: projectConfigs,
          modelValue: filterParams.value
        }),
        i: loading.value
      }, loading.value ? {
        j: common_vendor.p({
          mode: "circle"
        })
      } : projects.value.length === 0 ? {
        l: common_vendor.p({
          mode: "data",
          text: "暂无援助项目"
        })
      } : {
        m: common_vendor.f(projects.value, (project, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(project.name),
            b: "5f1e9c4b-4-" + i0,
            c: common_vendor.p({
              text: project.diseaseName,
              type: "primary",
              size: "mini"
            }),
            d: common_vendor.t(project.organizer),
            e: common_vendor.t(project.applyCondition),
            f: common_vendor.t(project.reliefCycle),
            g: project.reliefDosageDesc
          }, project.reliefDosageDesc ? {
            h: common_vendor.t(project.reliefDosageDesc)
          } : {}, {
            i: "5f1e9c4b-5-" + i0,
            j: common_vendor.p({
              text: project.auditStatus === 1 ? "进行中" : "审核中",
              type: project.auditStatus === 1 ? "success" : "warning",
              size: "mini"
            }),
            k: common_vendor.t(formatDate(project.updatedAt)),
            l: "5f1e9c4b-6-" + i0,
            m: project.id,
            n: common_vendor.o(($event) => viewDetail(project), project.id)
          });
        }),
        n: common_vendor.p({
          name: "arrow-right",
          size: "14",
          color: "#9ca3af"
        })
      }, {
        k: projects.value.length === 0
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5f1e9c4b"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/DonationProjectList.js.map
