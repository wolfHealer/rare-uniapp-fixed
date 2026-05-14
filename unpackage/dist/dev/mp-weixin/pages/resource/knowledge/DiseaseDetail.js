"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  (_easycom_u_icon2 + _easycom_u_loading_icon2 + _easycom_u_tag2 + _easycom_u_empty2)();
}
const _easycom_u_icon = () => "../../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_loading_icon = () => "../../../node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_tag = () => "../../../node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_empty = () => "../../../node-modules/uview-plus/components/u-empty/u-empty.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_loading_icon + _easycom_u_tag + _easycom_u_empty)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "DiseaseDetail",
  setup(__props) {
    const disease = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const diseaseId = common_vendor.ref(null);
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const previewImage = (currentIndex) => {
      var _a;
      if (!((_a = disease.value) == null ? void 0 : _a.images) || disease.value.images.length === 0)
        return;
      common_vendor.index.previewImage({
        urls: disease.value.images,
        current: currentIndex
      });
    };
    const goToArticle = (articleId) => {
      common_vendor.index.navigateTo({
        url: `/pages/resource/knowledge/ArticleDetail?id=${articleId}`,
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/resource/knowledge/DiseaseDetail.vue:205", "跳转文章失败:", err);
          common_vendor.index.showToast({ title: "页面跳转失败", icon: "none" });
        }
      });
    };
    const formatTime = (timeStr) => {
      if (!timeStr)
        return "";
      return timeStr.split(" ")[0];
    };
    const fetchDiseaseDetail = async (id) => {
      loading.value = true;
      try {
        const res = await utils_request.request.get(`/api/knowledge/disease/${id}`);
        common_vendor.index.__f__("log", "at pages/resource/knowledge/DiseaseDetail.vue:224", "病种详情原始数据:", res.data);
        if (res.code === 200 && res.data) {
          disease.value = res.data;
        } else {
          common_vendor.index.showToast({ title: res.message || "获取详情失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/knowledge/DiseaseDetail.vue:232", "获取病种详情失败:", error);
        common_vendor.index.showToast({ title: "网络异常，加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    common_vendor.onMounted(() => {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const options = currentPage.options || {};
      const id = options.id ? parseInt(options.id) : null;
      if (id) {
        diseaseId.value = id;
        fetchDiseaseDetail(id);
      } else {
        common_vendor.index.showToast({ title: "缺少病种ID", icon: "none" });
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.p({
          name: "arrow-left",
          size: "20"
        }),
        c: loading.value
      }, loading.value ? {
        d: common_vendor.p({
          mode: "circle"
        })
      } : disease.value ? common_vendor.e({
        f: common_vendor.t(disease.value.name),
        g: disease.value.alias
      }, disease.value.alias ? {
        h: common_vendor.t(disease.value.alias)
      } : {}, {
        i: disease.value.primaryCategoryName
      }, disease.value.primaryCategoryName ? {
        j: common_vendor.p({
          text: disease.value.primaryCategoryName,
          type: "primary",
          plain: true,
          size: "mini"
        })
      } : {}, {
        k: common_vendor.t(disease.value.introduction || "暂无简介"),
        l: disease.value.symptoms
      }, disease.value.symptoms ? {
        m: common_vendor.t(disease.value.symptoms)
      } : {}, {
        n: disease.value.categories && disease.value.categories.length > 0
      }, disease.value.categories && disease.value.categories.length > 0 ? {
        o: common_vendor.f(disease.value.categories, (cat, index, i0) => {
          return {
            a: index,
            b: "6e42e0dd-3-" + i0,
            c: common_vendor.p({
              text: cat.name,
              plain: true,
              size: "mini",
              type: "info"
            })
          };
        })
      } : {}, {
        p: disease.value.tags && disease.value.tags.length > 0
      }, disease.value.tags && disease.value.tags.length > 0 ? {
        q: common_vendor.f(disease.value.tags, (tag, index, i0) => {
          return {
            a: index,
            b: "6e42e0dd-4-" + i0,
            c: common_vendor.p({
              text: tag.name,
              plain: true,
              size: "mini",
              type: "warning"
            })
          };
        })
      } : {}, {
        r: disease.value.images && disease.value.images.length > 0
      }, disease.value.images && disease.value.images.length > 0 ? {
        s: common_vendor.f(disease.value.images, (img, index, i0) => {
          return {
            a: index,
            b: img,
            c: common_vendor.o(($event) => previewImage(index), index)
          };
        })
      } : {}, {
        t: disease.value.articles && disease.value.articles.length > 0
      }, disease.value.articles && disease.value.articles.length > 0 ? {
        v: common_vendor.f(disease.value.articles, (article, index, i0) => {
          return common_vendor.e({
            a: article.coverImage
          }, article.coverImage ? {
            b: article.coverImage
          } : {}, {
            c: common_vendor.t(article.title),
            d: common_vendor.t(article.summary),
            e: common_vendor.t(article.sourceName),
            f: common_vendor.t(formatTime(article.publishTime)),
            g: common_vendor.t(article.viewCount),
            h: index,
            i: common_vendor.o(($event) => goToArticle(article.id), index)
          });
        })
      } : {}, {
        w: disease.value.content
      }, disease.value.content ? {
        x: disease.value.content
      } : {}) : {
        y: common_vendor.p({
          mode: "page",
          text: "未找到相关病种信息"
        })
      }, {
        e: disease.value
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6e42e0dd"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/knowledge/DiseaseDetail.js.map
