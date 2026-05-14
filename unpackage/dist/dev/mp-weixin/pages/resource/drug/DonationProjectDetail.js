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
  __name: "DonationProjectDetail",
  setup(__props) {
    const detail = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const projectId = common_vendor.ref("");
    const hasDownloads = common_vendor.computed(() => {
      return detail.value && (detail.value.applyGuide || detail.value.applyForm || detail.value.materialList);
    });
    common_vendor.onLoad((options) => {
      if (options && options.projectId) {
        projectId.value = options.projectId;
        loadDetail();
      } else if (options && options.id) {
        projectId.value = options.id;
        loadDetail();
      } else {
        common_vendor.index.showToast({ title: "缺少项目ID", icon: "none" });
        goBack();
      }
    });
    const loadDetail = async () => {
      if (!projectId.value)
        return;
      loading.value = true;
      try {
        const res = await utils_request.request.get(`/api/resource/drug/donations/${projectId.value}`);
        detail.value = res.data || null;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/drug/DonationProjectDetail.vue:192", "加载项目详情失败:", error);
        detail.value = null;
        common_vendor.index.showToast({ title: "加载失败，请重试", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const handleApply = () => {
      if (!detail.value)
        return;
      if (detail.value.auditStatus !== 1) {
        common_vendor.index.showToast({ title: "该项目暂不可申请", icon: "none" });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/resource/drug/DonationApply?projectId=${detail.value.id}`
      });
    };
    const checkProgress = () => {
      var _a;
      if (!((_a = detail.value) == null ? void 0 : _a.progressQuery)) {
        common_vendor.index.showToast({ title: "暂无进度查询说明", icon: "none" });
        return;
      }
      common_vendor.index.showModal({
        title: "进度查询方式",
        content: detail.value.progressQuery,
        showCancel: false
      });
    };
    const downloadFile = async (url, fileName) => {
      if (!url) {
        common_vendor.index.showToast({ title: "链接无效", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "下载中..." });
      try {
        let downloadUrl = url;
        if (!downloadUrl.startsWith("http")) {
          const BASE_URL = define_import_meta_env_default.VITE_API_BASE_URL || "";
          downloadUrl = BASE_URL + downloadUrl;
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
                  common_vendor.index.showToast({ title: `${fileName}已打开`, icon: "success" });
                },
                fail: () => {
                  common_vendor.index.hideLoading();
                  common_vendor.index.showToast({ title: "打开文件失败", icon: "none" });
                }
              });
            } else {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "下载失败", icon: "none" });
            }
          },
          fail: (err) => {
            common_vendor.index.hideLoading();
            common_vendor.index.__f__("error", "at pages/resource/drug/DonationProjectDetail.vue:266", "下载失败", err);
            common_vendor.index.showToast({ title: "下载失败，请检查网络", icon: "none" });
          }
        });
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/resource/drug/DonationProjectDetail.vue:272", "下载异常", error);
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
          size: "24",
          color: "#000000"
        }),
        c: loading.value
      }, loading.value ? {
        d: common_vendor.p({
          mode: "circle"
        })
      } : detail.value ? common_vendor.e({
        f: common_vendor.t(detail.value.name),
        g: common_vendor.p({
          text: detail.value.diseaseName,
          type: "primary",
          size: "mini"
        }),
        h: common_vendor.p({
          text: detail.value.auditStatus === 1 ? "进行中" : "已暂停",
          type: detail.value.auditStatus === 1 ? "success" : "info",
          size: "mini"
        }),
        i: common_vendor.t(detail.value.organizer || "暂无"),
        j: common_vendor.t(detail.value.period || "暂无"),
        k: common_vendor.t(detail.value.dosage || "暂无"),
        l: detail.value.condition
      }, detail.value.condition ? {
        m: common_vendor.t(detail.value.condition)
      } : {}, {
        n: detail.value.progressQuery
      }, detail.value.progressQuery ? {
        o: common_vendor.p({
          name: "info-circle",
          size: "16"
        }),
        p: common_vendor.t(detail.value.progressQuery)
      } : {}, {
        q: hasDownloads.value
      }, hasDownloads.value ? common_vendor.e({
        r: detail.value.applyGuide
      }, detail.value.applyGuide ? {
        s: common_vendor.o(($event) => downloadFile(detail.value.applyGuide, "申请指南")),
        t: common_vendor.p({
          size: "small",
          plain: true,
          type: "primary",
          customStyle: "width: 100%; margin-bottom: 8px;"
        })
      } : {}, {
        v: detail.value.applyForm
      }, detail.value.applyForm ? {
        w: common_vendor.o(($event) => downloadFile(detail.value.applyForm, "申请表")),
        x: common_vendor.p({
          size: "small",
          plain: true,
          type: "warning",
          customStyle: "width: 100%; margin-bottom: 8px;"
        })
      } : {}, {
        y: detail.value.materialList
      }, detail.value.materialList ? {
        z: common_vendor.o(($event) => downloadFile(detail.value.materialList, "材料清单")),
        A: common_vendor.p({
          size: "small",
          plain: true,
          type: "info",
          customStyle: "width: 100%;"
        })
      } : {}) : {}) : {
        B: common_vendor.p({
          mode: "page",
          text: "项目不存在或已下架"
        })
      }, {
        e: detail.value,
        C: detail.value
      }, detail.value ? {
        D: common_vendor.o(checkProgress),
        E: common_vendor.p({
          plain: true,
          customStyle: "flex: 1; margin-right: 8px;"
        }),
        F: common_vendor.t(detail.value.auditStatus === 1 ? "立即申请" : "暂不可申请"),
        G: common_vendor.o(handleApply),
        H: common_vendor.p({
          type: "primary",
          customStyle: "flex: 2;",
          disabled: detail.value.auditStatus !== 1
        })
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-11202550"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/drug/DonationProjectDetail.js.map
