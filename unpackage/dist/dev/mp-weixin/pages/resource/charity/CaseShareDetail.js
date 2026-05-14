"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
var define_import_meta_env_default = { VITE_CJS_IGNORE_WARNING: "true", VITE_USER_NODE_ENV: "development", VITE_ROOT_DIR: "/Users/zhonghua/Downloads/rare-uniapp-fixed", BASE_URL: "/", MODE: "development", DEV: true, PROD: false, SSR: false };
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  (_easycom_u_icon2 + _easycom_u_loading_icon2 + _easycom_u_tag2 + _easycom_u_button2 + _easycom_u_empty2)();
}
const _easycom_u_icon = () => "../../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_loading_icon = () => "../../../node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_tag = () => "../../../node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_button = () => "../../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_empty = () => "../../../node-modules/uview-plus/components/u-empty/u-empty.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_loading_icon + _easycom_u_tag + _easycom_u_button + _easycom_u_empty)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "CaseShareDetail",
  setup(__props) {
    const detail = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const caseId = common_vendor.ref("");
    const formatDate = (dateStr) => {
      if (!dateStr)
        return "-";
      const date = new Date(dateStr.replace(/-/g, "/"));
      if (isNaN(date.getTime()))
        return dateStr;
      return date.toLocaleDateString("zh-CN");
    };
    common_vendor.onLoad((options) => {
      if (options && options.id) {
        caseId.value = options.id;
        loadDetail();
      } else {
        common_vendor.index.showToast({ title: "缺少案例ID", icon: "none" });
        goBack();
      }
    });
    const loadDetail = async () => {
      if (!caseId.value)
        return;
      loading.value = true;
      try {
        const res = await utils_request.request.get(`/api/resource/charity/cases/${caseId.value}`);
        detail.value = res.data || null;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/charity/CaseShareDetail.vue:191", "加载案例详情失败:", error);
        detail.value = null;
        common_vendor.index.showToast({ title: "加载失败，请重试", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const downloadFile = async (url, fileName) => {
      if (!url) {
        common_vendor.index.showToast({ title: "链接无效", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "下载中..." });
      try {
        let downloadUrl = url;
        if (!url.startsWith("http")) {
          const BASE_URL = define_import_meta_env_default.VITE_API_BASE_URL || "";
          downloadUrl = BASE_URL + url;
        }
        common_vendor.index.downloadFile({
          url: downloadUrl,
          success: (res) => {
            if (res.statusCode === 200) {
              common_vendor.index.openDocument({
                filePath: res.tempFilePath,
                showMenu: true,
                success: () => {
                  common_vendor.index.hideLoading();
                },
                fail: (err) => {
                  common_vendor.index.hideLoading();
                  common_vendor.index.__f__("error", "at pages/resource/charity/CaseShareDetail.vue:228", "打开文档失败", err);
                  common_vendor.index.showToast({ title: "打开文档失败", icon: "none" });
                }
              });
            } else {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "下载失败", icon: "none" });
            }
          },
          fail: (err) => {
            common_vendor.index.hideLoading();
            common_vendor.index.__f__("error", "at pages/resource/charity/CaseShareDetail.vue:239", "下载文件失败", err);
            common_vendor.index.showToast({ title: "下载失败，请检查网络", icon: "none" });
          }
        });
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/resource/charity/CaseShareDetail.vue:246", "下载异常:", error);
        common_vendor.index.showToast({ title: "下载异常", icon: "none" });
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.p({
          name: "arrow-left",
          size: "24"
        }),
        c: loading.value
      }, loading.value ? {
        d: common_vendor.p({
          mode: "circle"
        })
      } : detail.value ? common_vendor.e({
        f: common_vendor.t(detail.value.caseTitle),
        g: common_vendor.p({
          text: detail.value.diseaseName,
          type: "primary",
          size: "mini"
        }),
        h: common_vendor.p({
          text: detail.value.projectName,
          plain: true,
          size: "mini",
          type: "warning"
        }),
        i: common_vendor.t(formatDate(detail.value.createdAt)),
        j: common_vendor.t(detail.value.applyCycle || "-"),
        k: common_vendor.t(detail.value.actualRelief || "-"),
        l: detail.value.patientDesc
      }, detail.value.patientDesc ? {
        m: common_vendor.t(detail.value.patientDesc)
      } : {}, {
        n: detail.value.experience
      }, detail.value.experience ? {
        o: common_vendor.t(detail.value.experience)
      } : {}, {
        p: detail.value.pitfallGuide
      }, detail.value.pitfallGuide ? {
        q: common_vendor.t(detail.value.pitfallGuide)
      } : {}, {
        r: detail.value.casePdf
      }, detail.value.casePdf ? {
        s: common_vendor.o(($event) => downloadFile(detail.value.casePdf)),
        t: common_vendor.p({
          size: "small",
          plain: true,
          type: "primary",
          icon: "file-text"
        })
      } : {}, {
        v: detail.value.materialTemplate
      }, detail.value.materialTemplate ? {
        w: common_vendor.o(($event) => downloadFile(detail.value.materialTemplate)),
        x: common_vendor.p({
          size: "small",
          plain: true,
          type: "warning",
          icon: "file-text"
        })
      } : {}, {
        y: !detail.value.casePdf && !detail.value.materialTemplate
      }, !detail.value.casePdf && !detail.value.materialTemplate ? {} : {}, {
        z: common_vendor.o(goBack),
        A: common_vendor.p({
          plain: true,
          customStyle: "width: 100%;"
        })
      }) : {
        B: common_vendor.p({
          mode: "page",
          text: "案例不存在或已下架"
        })
      }, {
        e: detail.value
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9d3467ad"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/charity/CaseShareDetail.js.map
