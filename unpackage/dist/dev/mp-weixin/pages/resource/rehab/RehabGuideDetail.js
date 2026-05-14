"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
var define_import_meta_env_default = { VITE_CJS_IGNORE_WARNING: "true", VITE_USER_NODE_ENV: "development", VITE_ROOT_DIR: "/Users/zhonghua/Downloads/rare-uniapp-fixed", BASE_URL: "/", MODE: "development", DEV: true, PROD: false, SSR: false };
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  (_easycom_u_icon2 + _easycom_u_loading_icon2 + _easycom_u_tag2 + _easycom_u_image2 + _easycom_u_button2 + _easycom_u_empty2)();
}
const _easycom_u_icon = () => "../../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_loading_icon = () => "../../../node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_tag = () => "../../../node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_image = () => "../../../node-modules/uview-plus/components/u-image/u-image.js";
const _easycom_u_button = () => "../../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_empty = () => "../../../node-modules/uview-plus/components/u-empty/u-empty.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_loading_icon + _easycom_u_tag + _easycom_u_image + _easycom_u_button + _easycom_u_empty)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "RehabGuideDetail",
  setup(__props) {
    const detail = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const downloading = common_vendor.ref(false);
    const guideId = common_vendor.ref(null);
    const getStageLabel = (stage) => {
      if (!stage)
        return "未知";
      const map = {
        early: "早期",
        middle: "中期",
        late: "晚期",
        stable: "稳定期",
        progressive: "渐进期"
      };
      return map[stage] || stage;
    };
    const loadDetail = async (id) => {
      loading.value = true;
      try {
        const res = await utils_request.request.get(`/api/resource/rehab/trainings/${id}`);
        detail.value = res.data || null;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/rehab/RehabGuideDetail.vue:173", "加载指南详情失败:", error);
        detail.value = null;
        common_vendor.index.showToast({ title: "加载失败，请重试", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const previewImage = (currentIndex) => {
      var _a;
      if (!((_a = detail.value) == null ? void 0 : _a.picUrls) || detail.value.picUrls.length === 0)
        return;
      common_vendor.index.previewImage({
        urls: detail.value.picUrls,
        current: currentIndex
      });
    };
    const downloadGuide = async () => {
      var _a;
      if (!((_a = detail.value) == null ? void 0 : _a.guidePdf)) {
        common_vendor.index.showToast({ title: "暂无PDF文件", icon: "none" });
        return;
      }
      downloading.value = true;
      let pdfUrl = detail.value.guidePdf;
      if (!pdfUrl.startsWith("http")) {
        const BASE_URL = define_import_meta_env_default.VITE_API_BASE_URL || "";
        pdfUrl = BASE_URL + pdfUrl;
      }
      common_vendor.index.showLoading({ title: "加载中..." });
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
              fail: (err) => {
                common_vendor.index.__f__("error", "at pages/resource/rehab/RehabGuideDetail.vue:220", err);
                common_vendor.index.showToast({ title: "打开文件失败", icon: "none" });
              }
            });
          } else {
            common_vendor.index.showToast({ title: "下载失败", icon: "none" });
          }
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/resource/rehab/RehabGuideDetail.vue:230", err);
          common_vendor.index.showToast({ title: "网络请求失败", icon: "none" });
        },
        complete: () => {
          downloading.value = false;
        }
      });
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    common_vendor.onLoad((options) => {
      if (options.id) {
        guideId.value = Number(options.id);
        loadDetail(guideId.value);
      } else {
        common_vendor.index.showToast({ title: "缺少指南ID", icon: "none" });
        setTimeout(() => {
          goBack();
        }, 1500);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.p({
          name: "arrow-left",
          size: "24",
          color: "#000000"
        }),
        c: loading.value
      }, loading.value ? {
        d: common_vendor.p({
          mode: "circle"
        })
      } : detail.value ? common_vendor.e({
        f: common_vendor.t(detail.value.title),
        g: common_vendor.f(detail.value.diseases || [], (disease, index, i0) => {
          return {
            a: index,
            b: "0c921b7e-2-" + i0,
            c: common_vendor.p({
              text: disease.name,
              type: "primary",
              size: "mini",
              customStyle: "margin-right: 4px;"
            })
          };
        }),
        h: common_vendor.p({
          text: getStageLabel(detail.value.rehabStage),
          plain: true,
          size: "mini"
        }),
        i: detail.value.picUrls && detail.value.picUrls.length > 0
      }, detail.value.picUrls && detail.value.picUrls.length > 0 ? {
        j: common_vendor.f(detail.value.picUrls, (img, index, i0) => {
          return {
            a: index,
            b: common_vendor.o(($event) => previewImage(index), index),
            c: "0c921b7e-4-" + i0,
            d: common_vendor.p({
              src: img,
              width: "100%",
              height: "200px",
              mode: "aspectFill"
            })
          };
        })
      } : {}, {
        k: detail.value.trainPurpose
      }, detail.value.trainPurpose ? {
        l: common_vendor.t(detail.value.trainPurpose)
      } : {}, {
        m: detail.value.trainContent
      }, detail.value.trainContent ? {
        n: common_vendor.t(detail.value.trainContent)
      } : {}, {
        o: detail.value.forbiddenAction
      }, detail.value.forbiddenAction ? {
        p: common_vendor.t(detail.value.forbiddenAction)
      } : {}, {
        q: detail.value.guidePdf
      }, detail.value.guidePdf ? {
        r: common_vendor.t(downloading.value ? "下载中..." : "查看/下载 PDF 版"),
        s: common_vendor.o(downloadGuide),
        t: common_vendor.p({
          plain: true,
          block: true,
          loading: downloading.value
        })
      } : {}, {
        v: common_vendor.o(goBack),
        w: common_vendor.p({
          plain: true,
          block: true
        })
      }) : {
        x: common_vendor.p({
          mode: "data",
          description: "指南不存在或已下架"
        })
      }, {
        e: detail.value
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0c921b7e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/rehab/RehabGuideDetail.js.map
