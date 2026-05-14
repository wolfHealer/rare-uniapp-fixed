"use strict";
const common_vendor = require("./common/vendor.js");
const utils_request = require("./utils/request.js");
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_loadmore2 = common_vendor.resolveComponent("u-loadmore");
  (_easycom_u_search2 + _easycom_u_loading_icon2 + _easycom_u_empty2 + _easycom_u_tag2 + _easycom_u_button2 + _easycom_u_loadmore2)();
}
const _easycom_u_search = () => "./node-modules/uview-plus/components/u-search/u-search.js";
const _easycom_u_loading_icon = () => "./node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_empty = () => "./node-modules/uview-plus/components/u-empty/u-empty.js";
const _easycom_u_tag = () => "./node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_button = () => "./node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_loadmore = () => "./node-modules/uview-plus/components/u-loadmore/u-loadmore.js";
if (!Math) {
  (_easycom_u_search + SmartFilterBar + _easycom_u_loading_icon + _easycom_u_empty + _easycom_u_tag + _easycom_u_button + _easycom_u_loadmore)();
}
const SmartFilterBar = () => "./components/filter/SmartFilterBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "DrugList",
  setup(__props) {
    const keyword = common_vendor.ref("");
    const drugs = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const exporting = common_vendor.ref(false);
    const loadStatus = common_vendor.ref("nomore");
    const filterParams = common_vendor.ref({
      drug_type: "",
      is_insurance: ""
    });
    const DRUG_TYPE_MAP = {
      origin_import: "进口原研",
      origin_domestic: "国产原研",
      generic: "仿制药",
      other: "其他"
    };
    const getDrugTypeText = (type) => {
      return DRUG_TYPE_MAP[type] || type;
    };
    const typeOptions = common_vendor.ref([
      { label: "全部类型", value: "" },
      { label: "进口原研", value: "origin_import" },
      { label: "国产原研", value: "origin_domestic" },
      { label: "仿制药", value: "generic" },
      { label: "其他", value: "other" }
    ]);
    const insuranceOptions = common_vendor.ref([
      { label: "全部状态", value: "" },
      { label: "医保", value: "true" },
      { label: "非医保", value: "false" }
    ]);
    const drugConfigs = [
      {
        key: "drug_type",
        // 注意：这里 key 对应 filterParams 和接口参数
        label: "类型",
        type: "tags",
        options: typeOptions.value
      },
      {
        key: "is_insurance",
        label: "医保状态",
        type: "tags",
        options: insuranceOptions.value
      }
    ];
    const fetchOptions = async () => {
      try {
        const res = await utils_request.request.get("/api/resource/drug/drugs/options");
        const data = res.data || {};
        if (data.types && Array.isArray(data.types)) {
          typeOptions.value = [
            { label: "全部类型", value: "" },
            ...data.types.map((item) => ({
              label: item.label,
              value: item.value
            }))
          ];
        }
        if (data.insurances && Array.isArray(data.insurances)) {
          insuranceOptions.value = [
            { label: "全部状态", value: "" },
            ...data.insurances.map((item) => ({
              label: item.label,
              value: item.value
            }))
          ];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/drug/DrugList.vue:204", "获取筛选选项失败:", error);
      }
    };
    const fetchDrugs = async () => {
      loading.value = true;
      try {
        const params = {};
        if (keyword.value && keyword.value.trim() !== "") {
          params.keyword = keyword.value;
        }
        if (filterParams.value.drug_type) {
          params.drug_type = filterParams.value.drug_type;
        }
        if (filterParams.value.is_insurance) {
          params.is_insurance = filterParams.value.is_insurance;
        }
        const res = await utils_request.request.get("/api/resource/drug/drugs", { params });
        let resultList = [];
        if (res.data && res.data.list) {
          resultList = res.data.list;
        } else if (Array.isArray(res.data)) {
          resultList = res.data;
        }
        drugs.value = resultList;
        loadStatus.value = "nomore";
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/drug/DrugList.vue:239", "获取药品列表失败:", error);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
        drugs.value = [];
      } finally {
        loading.value = false;
      }
    };
    const onSearch = () => {
      fetchDrugs();
    };
    const onClear = () => {
      keyword.value = "";
      fetchDrugs();
    };
    const loadMore = () => {
    };
    const handleFilterChange = () => {
      fetchDrugs();
    };
    const handleFilterReset = () => {
      filterParams.value = {
        drug_type: "",
        is_insurance: ""
      };
      fetchDrugs();
    };
    const viewDetails = (drug) => {
      common_vendor.index.navigateTo({
        url: `/pages/resource/drug/DrugDetail?id=${drug.id}`
      });
    };
    const downloadManual = async (drug) => {
      const url = drug.manual_popular || drug.manual_original;
      if (!url) {
        common_vendor.index.showToast({ title: "暂无说明书", icon: "none" });
        return;
      }
      common_vendor.index.downloadFile({
        url,
        success: (res) => {
          if (res.statusCode === 200) {
            common_vendor.index.openDocument({
              filePath: res.tempFilePath,
              showMenu: true,
              fail: (err) => {
                common_vendor.index.__f__("error", "at pages/resource/drug/DrugList.vue:300", err);
                common_vendor.index.showToast({ title: "打开失败", icon: "none" });
              }
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/resource/drug/DrugList.vue:307", err);
          common_vendor.index.showToast({ title: "下载失败", icon: "none" });
        }
      });
    };
    const downloadList = async () => {
      exporting.value = true;
      try {
        const params = {};
        if (keyword.value)
          params.keyword = keyword.value;
        if (filterParams.value.drug_type)
          params.drug_type = filterParams.value.drug_type;
        if (filterParams.value.is_insurance)
          params.is_insurance = filterParams.value.is_insurance;
        common_vendor.index.showToast({ title: "请在H5端导出Excel", icon: "none" });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/drug/DrugList.vue:343", "导出名录失败:", error);
        common_vendor.index.showToast({ title: "导出失败", icon: "none" });
      } finally {
        exporting.value = false;
      }
    };
    common_vendor.onMounted(() => {
      fetchOptions();
      fetchDrugs();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(onSearch),
        b: common_vendor.o(onClear),
        c: common_vendor.o(($event) => keyword.value = $event),
        d: common_vendor.p({
          placeholder: "搜索药品名称",
          shape: "round",
          modelValue: keyword.value
        }),
        e: common_vendor.o(handleFilterChange),
        f: common_vendor.o(handleFilterReset),
        g: common_vendor.o(($event) => filterParams.value = $event),
        h: common_vendor.p({
          configs: drugConfigs,
          modelValue: filterParams.value
        }),
        i: loading.value && drugs.value.length === 0
      }, loading.value && drugs.value.length === 0 ? {
        j: common_vendor.p({
          mode: "circle"
        })
      } : drugs.value.length === 0 ? {
        l: common_vendor.p({
          mode: "data",
          text: "暂无数据"
        })
      } : common_vendor.e({
        m: common_vendor.f(drugs.value, (drug, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(drug.generic_name),
            b: drug.brand_name
          }, drug.brand_name ? {
            c: common_vendor.t(drug.brand_name)
          } : {}, {
            d: "72aa480f-4-" + i0,
            e: common_vendor.p({
              text: drug.is_insurance ? "医保" : "非医保",
              type: drug.is_insurance ? "success" : "info",
              size: "mini"
            }),
            f: common_vendor.t(drug.indication),
            g: drug.drug_type
          }, drug.drug_type ? {
            h: "72aa480f-5-" + i0,
            i: common_vendor.p({
              text: getDrugTypeText(drug.drug_type),
              type: "primary",
              size: "mini"
            })
          } : {}, {
            j: drug.spec
          }, drug.spec ? {
            k: common_vendor.t(drug.spec)
          } : {}, {
            l: common_vendor.o(($event) => viewDetails(drug), drug.id),
            m: "72aa480f-6-" + i0,
            n: common_vendor.o(($event) => downloadManual(drug), drug.id),
            o: "72aa480f-7-" + i0,
            p: common_vendor.o(() => {
            }, drug.id),
            q: drug.id,
            r: common_vendor.o(($event) => viewDetails(drug), drug.id)
          });
        }),
        n: common_vendor.p({
          size: "mini",
          type: "primary"
        }),
        o: common_vendor.p({
          size: "mini",
          plain: true
        }),
        p: drugs.value.length > 0
      }, drugs.value.length > 0 ? {
        q: common_vendor.p({
          status: loadStatus.value,
          ["loading-text"]: "加载中...",
          ["loadmore-text"]: "上拉加载更多",
          ["nomore-text"]: "没有更多了"
        })
      } : {}), {
        k: drugs.value.length === 0,
        r: common_vendor.o(loadMore),
        s: common_vendor.o(downloadList),
        t: common_vendor.p({
          type: "primary",
          block: true,
          loading: exporting.value
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-72aa480f"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/DrugList.js.map
