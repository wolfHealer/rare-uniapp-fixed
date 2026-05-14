"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
var define_import_meta_env_default = { VITE_CJS_IGNORE_WARNING: "true", VITE_USER_NODE_ENV: "development", VITE_ROOT_DIR: "/Users/zhonghua/Downloads/rare-uniapp-fixed", BASE_URL: "/", MODE: "development", DEV: true, PROD: false, SSR: false };
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  (_easycom_u_icon2 + _easycom_u_loading_icon2 + _easycom_u_button2 + _easycom_u_empty2)();
}
const _easycom_u_icon = () => "../../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_loading_icon = () => "../../../node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_button = () => "../../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_empty = () => "../../../node-modules/uview-plus/components/u-empty/u-empty.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_loading_icon + _easycom_u_button + _easycom_u_empty)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "AidProjectDetail",
  setup(__props) {
    const detail = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const projectId = common_vendor.ref("");
    const hasDownloadableFiles = common_vendor.computed(() => {
      return detail.value && (detail.value.applyForm || detail.value.applyGuide || detail.value.materialList);
    });
    const getReliefTypeText = (type) => {
      if (!type)
        return "-";
      const map = {
        "medical_cost": "医疗费用",
        "living_support": "生活补助",
        "rehab_subsidy": "康复补贴",
        "drug_relief": "药品救助",
        "other": "其他"
      };
      return map[type] || type;
    };
    const getDifficultyText = (diff) => {
      if (!diff)
        return "-";
      const map = {
        "easy": "简单",
        "medium": "中等",
        "hard": "复杂"
      };
      return map[diff] || diff;
    };
    const formatDate = (dateStr) => {
      if (!dateStr)
        return "-";
      const date = new Date(dateStr);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };
    common_vendor.onLoad((options) => {
      if (options && options.id) {
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
        const res = await utils_request.request.get(`/api/resource/charity/projects/${projectId.value}`);
        detail.value = res.data || null;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/charity/AidProjectDetail.vue:232", "加载项目详情失败:", error);
        detail.value = null;
        common_vendor.index.showToast({ title: "加载失败，请重试", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const handleApply = async () => {
      var _a;
      if (!((_a = detail.value) == null ? void 0 : _a.id))
        return;
      try {
        const res = await utils_request.request.post("/api/resource/charity/apply", {
          projectId: detail.value.id
        });
        if (res.code === 200) {
          common_vendor.index.showToast({ title: "申请提交成功", icon: "success" });
          setTimeout(() => goBack(), 1500);
        } else {
          common_vendor.index.showToast({ title: res.message || "申请失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/charity/AidProjectDetail.vue:255", "申请失败:", error);
        common_vendor.index.showToast({ title: "申请失败，请重试", icon: "none" });
      }
    };
    const downloadFile = async (url, fileName) => {
      common_vendor.index.showLoading({ title: "下载中..." });
      try {
        let downloadUrl = url;
        if (!url.startsWith("http")) {
          const BASE_URL = define_import_meta_env_default.VITE_API_BASE_URL || "https://your-api-domain.com";
          downloadUrl = BASE_URL.replace(/\/+$/, "") + url;
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
            common_vendor.index.__f__("error", "at pages/resource/charity/AidProjectDetail.vue:294", "下载失败:", err);
            common_vendor.index.showToast({ title: "下载失败，请检查网络", icon: "none" });
          }
        });
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/resource/charity/AidProjectDetail.vue:300", "下载异常:", error);
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
        f: common_vendor.t(detail.value.name),
        g: common_vendor.t(getReliefTypeText(detail.value.reliefType)),
        h: common_vendor.t(getDifficultyText(detail.value.applyDifficulty)),
        i: common_vendor.t(detail.value.organizer),
        j: detail.value.updatedAt
      }, detail.value.updatedAt ? {
        k: common_vendor.t(formatDate(detail.value.updatedAt))
      } : {}, {
        l: detail.value.reliefStandard
      }, detail.value.reliefStandard ? {
        m: common_vendor.t(detail.value.reliefStandard)
      } : {}, {
        n: detail.value.applyCondition
      }, detail.value.applyCondition ? {
        o: common_vendor.t(detail.value.applyCondition)
      } : {}, {
        p: hasDownloadableFiles.value
      }, hasDownloadableFiles.value ? common_vendor.e({
        q: detail.value.applyForm
      }, detail.value.applyForm ? {
        r: common_vendor.o(($event) => downloadFile(detail.value.applyForm, "申请表")),
        s: common_vendor.p({
          size: "small",
          plain: true,
          customStyle: "width: 100%; margin-bottom: 8px;"
        })
      } : {}, {
        t: detail.value.applyGuide
      }, detail.value.applyGuide ? {
        v: common_vendor.o(($event) => downloadFile(detail.value.applyGuide, "申请指南")),
        w: common_vendor.p({
          size: "small",
          plain: true,
          customStyle: "width: 100%; margin-bottom: 8px;"
        })
      } : {}, {
        x: detail.value.materialList
      }, detail.value.materialList ? {
        y: common_vendor.o(($event) => downloadFile(detail.value.materialList, "材料清单")),
        z: common_vendor.p({
          size: "small",
          plain: true,
          customStyle: "width: 100%;"
        })
      } : {}) : {}, {
        A: common_vendor.o(handleApply),
        B: common_vendor.p({
          type: "primary",
          customStyle: "width: 100%; margin-bottom: 8px;"
        }),
        C: common_vendor.o(goBack),
        D: common_vendor.p({
          plain: true,
          customStyle: "width: 100%;"
        })
      }) : {
        E: common_vendor.p({
          mode: "page",
          text: "项目不存在或已下架"
        })
      }, {
        e: detail.value
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7c3a53db"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/charity/AidProjectDetail.js.map
