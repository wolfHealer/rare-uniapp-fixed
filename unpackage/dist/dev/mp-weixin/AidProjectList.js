"use strict";
const common_vendor = require("./common/vendor.js");
const utils_request = require("./utils/request.js");
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_loadmore2 = common_vendor.resolveComponent("u-loadmore");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  (_easycom_u_search2 + _easycom_u_loading_icon2 + _easycom_u_tag2 + _easycom_u_button2 + _easycom_u_loadmore2 + _easycom_u_empty2)();
}
const _easycom_u_search = () => "./node-modules/uview-plus/components/u-search/u-search.js";
const _easycom_u_loading_icon = () => "./node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_tag = () => "./node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_button = () => "./node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_loadmore = () => "./node-modules/uview-plus/components/u-loadmore/u-loadmore.js";
const _easycom_u_empty = () => "./node-modules/uview-plus/components/u-empty/u-empty.js";
if (!Math) {
  (_easycom_u_search + SmartFilterBar + _easycom_u_loading_icon + _easycom_u_tag + _easycom_u_button + _easycom_u_loadmore + _easycom_u_empty)();
}
const SmartFilterBar = () => "./components/filter/SmartFilterBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "AidProjectList",
  setup(__props) {
    const keyword = common_vendor.ref("");
    const currentPage = common_vendor.ref(1);
    const pageSize = common_vendor.ref(10);
    const loadStatus = common_vendor.ref("loadmore");
    const list = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const filterParams = common_vendor.ref({
      type: "",
      disease: {},
      difficulty: ""
    });
    const typeOptions = common_vendor.ref([
      { label: "全部类型", value: "" },
      { label: "医疗费用", value: "medical_cost" },
      { label: "生活补助", value: "living_support" },
      { label: "康复补贴", value: "rehab_subsidy" },
      { label: "药品救助", value: "drug_relief" },
      { label: "其他", value: "other" }
    ]);
    const difficultyOptions = common_vendor.ref([
      { label: "全部难度", value: "" },
      { label: "简单", value: "easy" },
      { label: "中等", value: "medium" },
      { label: "复杂", value: "hard" }
    ]);
    const getReliefTypeText = (type) => {
      const map = {
        "medical_cost": "医疗费用",
        "living_support": "生活补助",
        "rehab_subsidy": "康复补贴",
        "drug_relief": "药品救助",
        "other": "其他"
      };
      return map[type] || "未知类型";
    };
    const projectConfigs = [
      {
        key: "type",
        label: "类型",
        type: "tags",
        options: typeOptions.value
      },
      {
        key: "disease",
        label: "疾病",
        type: "disease"
      },
      {
        key: "difficulty",
        label: "难度",
        type: "tags",
        options: difficultyOptions.value
      }
    ];
    const fetchProjects = async (isRefresh = false) => {
      var _a;
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
        if (keyword.value && keyword.value.trim() !== "") {
          params.keyword = keyword.value.trim();
        }
        if (filterParams.value.type) {
          params.reliefType = filterParams.value.type;
        }
        const diseaseVal = filterParams.value.disease || {};
        if (diseaseVal.diseaseId) {
          params.diseaseId = diseaseVal.diseaseId;
        }
        if (filterParams.value.difficulty) {
          params.applyDifficulty = filterParams.value.difficulty;
        }
        const res = await utils_request.request.get("/api/resource/charity/projects", params);
        const records = ((_a = res.data) == null ? void 0 : _a.list) || [];
        list.value.push(...records);
        if (records.length < pageSize.value) {
          loadStatus.value = "nomore";
        } else {
          loadStatus.value = "loadmore";
          currentPage.value++;
        }
      } catch (error) {
        loadStatus.value = "loadmore";
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const onLoadMore = () => fetchProjects();
    const handleSearch = () => {
      fetchProjects(true);
    };
    const handleClear = () => {
      keyword.value = "";
      fetchProjects(true);
    };
    const handleFilterChange = () => {
      fetchProjects(true);
    };
    const handleFilterReset = () => {
      filterParams.value = {
        type: "",
        disease: {},
        difficulty: ""
      };
      fetchProjects(true);
    };
    const apply = async (item) => {
      try {
        await utils_request.request.post("/api/resource/charity/apply", { projectId: item.id });
        common_vendor.index.showToast({ title: "申请提交成功", icon: "success" });
      } catch (e) {
        common_vendor.index.showToast({ title: "申请失败", icon: "none" });
      }
    };
    const detail = (item) => {
      if (!(item == null ? void 0 : item.id))
        return;
      common_vendor.index.navigateTo({ url: `/pages/resource/charity/AidProjectDetail?id=${item.id}` });
    };
    const downloadDocs = (item) => {
      detail(item);
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
          placeholder: "搜索救助项目名称",
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
        i: loading.value && list.value.length === 0
      }, loading.value && list.value.length === 0 ? {
        j: common_vendor.p({
          mode: "circle"
        })
      } : common_vendor.e({
        k: common_vendor.f(list.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: "a693e922-3-" + i0,
            c: common_vendor.p({
              text: item.status === "open" ? "可申请" : "已结束",
              type: item.status === "open" ? "success" : "info",
              size: "mini"
            }),
            d: common_vendor.t(item.organizer),
            e: common_vendor.t(getReliefTypeText(item.reliefType)),
            f: common_vendor.t(item.reliefStandard || item.applyCondition),
            g: common_vendor.o(($event) => apply(item), item.id),
            h: "a693e922-4-" + i0,
            i: common_vendor.o(($event) => downloadDocs(item), item.id),
            j: "a693e922-5-" + i0,
            k: common_vendor.o(() => {
            }, item.id),
            l: item.id,
            m: common_vendor.o(($event) => detail(item), item.id)
          };
        }),
        l: common_vendor.p({
          size: "mini",
          type: "primary"
        }),
        m: common_vendor.p({
          size: "mini",
          plain: true
        }),
        n: common_vendor.o(onLoadMore),
        o: common_vendor.p({
          status: loadStatus.value
        }),
        p: !loading.value && list.value.length === 0
      }, !loading.value && list.value.length === 0 ? {
        q: common_vendor.p({
          mode: "data",
          text: "暂无救助项目"
        })
      } : {}), {
        r: common_vendor.o(onLoadMore)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a693e922"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/AidProjectList.js.map
