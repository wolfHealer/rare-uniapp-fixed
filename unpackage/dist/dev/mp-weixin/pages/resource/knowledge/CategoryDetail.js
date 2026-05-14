"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  (_easycom_u_icon2 + _easycom_u_loading_icon2 + _easycom_u_empty2)();
}
const _easycom_u_icon = () => "../../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_loading_icon = () => "../../../node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_empty = () => "../../../node-modules/uview-plus/components/u-empty/u-empty.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_loading_icon + _easycom_u_empty + BottomNav)();
}
const BottomNav = () => "../../../components/BottomNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "CategoryDetail",
  setup(__props) {
    const categoryName = common_vendor.ref("疾病分类");
    const diseases = common_vendor.ref([]);
    const categoryId = common_vendor.ref(0);
    const loading = common_vendor.ref(false);
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const goToDiseaseDetail = (diseaseId) => {
      common_vendor.index.navigateTo({
        url: `/pages/resource/knowledge/DiseaseDetail?id=${diseaseId}`
      });
    };
    const loadDiseasesByCategory = async (id) => {
      loading.value = true;
      try {
        const response = await utils_request.request.get(`/api/knowledge/category/${id}/diseases`);
        common_vendor.index.__f__("log", "at pages/resource/knowledge/CategoryDetail.vue:85", "接口返回原始数据:", response);
        if (response.code === 200 && response.data && response.data.list) {
          const list = response.data.list;
          if (Array.isArray(list)) {
            diseases.value = list.map((item) => ({
              id: item.id,
              name: item.name,
              // 优先使用 introduction，如果没有则使用空字符串
              introduction: item.introduction || ""
            }));
            common_vendor.index.__f__("log", "at pages/resource/knowledge/CategoryDetail.vue:104", "解析后的疾病列表:", diseases.value);
          } else {
            diseases.value = [];
          }
        } else {
          common_vendor.index.showToast({
            title: response.message || "获取数据失败",
            icon: "none"
          });
          diseases.value = [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/knowledge/CategoryDetail.vue:116", "加载分类病种失败：", error);
        common_vendor.index.showToast({
          title: "网络异常，请稍后重试",
          icon: "none"
        });
        diseases.value = [];
      } finally {
        loading.value = false;
      }
    };
    common_vendor.onMounted(() => {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const options = currentPage.options || {};
      const id = options.id ? parseInt(options.id, 10) : 0;
      if (options.name) {
        categoryName.value = decodeURIComponent(options.name);
      } else if (options.categoryName) {
        categoryName.value = decodeURIComponent(options.categoryName);
      }
      if (id > 0) {
        categoryId.value = id;
        loadDiseasesByCategory(id);
      } else {
        common_vendor.index.showToast({
          title: "分类 ID 无效",
          icon: "none"
        });
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.p({
          name: "arrow-left",
          size: "20",
          color: "#ffffff"
        }),
        c: common_vendor.t(categoryName.value),
        d: loading.value
      }, loading.value ? {
        e: common_vendor.p({
          mode: "circle"
        })
      } : diseases.value.length > 0 ? {
        g: common_vendor.f(diseases.value, (disease, index, i0) => {
          return {
            a: common_vendor.t(disease.name),
            b: common_vendor.t(disease.introduction || "暂无简介"),
            c: disease.id,
            d: common_vendor.o(($event) => goToDiseaseDetail(disease.id), disease.id)
          };
        })
      } : {
        h: common_vendor.p({
          mode: "data",
          text: "暂无相关病种数据"
        })
      }, {
        f: diseases.value.length > 0
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-73d5eed3"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/knowledge/CategoryDetail.js.map
