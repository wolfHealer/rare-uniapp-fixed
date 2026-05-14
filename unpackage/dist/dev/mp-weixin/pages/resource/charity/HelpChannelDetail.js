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
  __name: "HelpChannelDetail",
  setup(__props) {
    const detail = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const channelId = common_vendor.ref("");
    const hasTemplates = common_vendor.computed(() => {
      return detail.value && (detail.value.helpLetterTemplate || detail.value.crowdfundingTemplate);
    });
    const getChannelTypeTag = (type) => {
      const tagMap = {
        emergency_help: "success",
        crowdfunding: "primary",
        charity_consulting: "warning",
        foundation_support: "info",
        other: "info"
      };
      return tagMap[type] || "info";
    };
    const getChannelTypeLabel = (type) => {
      const labelMap = {
        emergency_help: "紧急求助",
        crowdfunding: "众筹求助",
        charity_consulting: "慈善咨询",
        foundation_support: "基金会支持",
        other: "其他"
      };
      return labelMap[type] || "其他";
    };
    common_vendor.onLoad((options) => {
      if (options && options.id) {
        channelId.value = options.id;
        loadDetail();
      } else {
        common_vendor.index.showToast({ title: "缺少渠道ID", icon: "none" });
        goBack();
      }
    });
    const loadDetail = async () => {
      if (!channelId.value)
        return;
      loading.value = true;
      try {
        const res = await utils_request.request.get(`/api/resource/charity/channels/${channelId.value}`);
        detail.value = res.data || null;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/charity/HelpChannelDetail.vue:216", "加载渠道详情失败:", error);
        detail.value = null;
        common_vendor.index.showToast({ title: "加载失败，请重试", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const makeCall = () => {
      var _a;
      if (!((_a = detail.value) == null ? void 0 : _a.contactPhone))
        return;
      common_vendor.index.makePhoneCall({
        phoneNumber: detail.value.contactPhone,
        fail: () => {
          common_vendor.index.showToast({ title: "拨打失败", icon: "none" });
        }
      });
    };
    const openUrl = () => {
      var _a;
      if (!((_a = detail.value) == null ? void 0 : _a.contactUrl))
        return;
      common_vendor.index.setClipboardData({
        data: detail.value.contactUrl,
        success: () => {
          common_vendor.index.showToast({ title: "链接已复制，请在浏览器中打开", icon: "none" });
        }
      });
    };
    const downloadResource = async (url, name) => {
      if (!url) {
        common_vendor.index.showToast({ title: "资源链接无效", icon: "none" });
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
                  common_vendor.index.showToast({ title: `${name}已打开`, icon: "success" });
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
            common_vendor.index.__f__("error", "at pages/resource/charity/HelpChannelDetail.vue:294", "下载失败", err);
            common_vendor.index.showToast({ title: "下载失败，请检查网络", icon: "none" });
          }
        });
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/resource/charity/HelpChannelDetail.vue:301", "下载异常", error);
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
          text: getChannelTypeLabel(detail.value.channelType),
          type: getChannelTypeTag(detail.value.channelType),
          size: "mini"
        }),
        h: common_vendor.p({
          text: detail.value.auditStatus === 1 ? "正常" : "审核中",
          type: detail.value.auditStatus === 1 ? "success" : "info",
          size: "mini"
        }),
        i: detail.value.contactPhone
      }, detail.value.contactPhone ? {
        j: common_vendor.p({
          name: "phone",
          size: "18",
          color: "#6b7280"
        }),
        k: common_vendor.t(detail.value.contactPhone)
      } : {}, {
        l: detail.value.contactUrl
      }, detail.value.contactUrl ? {
        m: common_vendor.p({
          name: "link",
          size: "18",
          color: "#6b7280"
        }),
        n: common_vendor.t(detail.value.contactUrl)
      } : {}, {
        o: detail.value.contactPhone
      }, detail.value.contactPhone ? {
        p: common_vendor.o(makeCall),
        q: common_vendor.p({
          size: "small",
          type: "primary",
          customStyle: "flex: 1;"
        })
      } : {}, {
        r: detail.value.contactUrl
      }, detail.value.contactUrl ? {
        s: common_vendor.o(openUrl),
        t: common_vendor.p({
          size: "small",
          type: "primary",
          customStyle: "flex: 1;"
        })
      } : {}, {
        v: detail.value.responseTime
      }, detail.value.responseTime ? {
        w: common_vendor.p({
          name: "clock",
          size: "16"
        }),
        x: common_vendor.t(detail.value.responseTime)
      } : {}, {
        y: detail.value.applyCondition
      }, detail.value.applyCondition ? {
        z: common_vendor.t(detail.value.applyCondition)
      } : {}, {
        A: hasTemplates.value
      }, hasTemplates.value ? common_vendor.e({
        B: detail.value.helpLetterTemplate
      }, detail.value.helpLetterTemplate ? {
        C: common_vendor.o(($event) => downloadResource(detail.value.helpLetterTemplate, "求助信模板")),
        D: common_vendor.p({
          size: "small",
          plain: true,
          customStyle: "width: 100%; margin-bottom: 8px;"
        })
      } : {}, {
        E: detail.value.crowdfundingTemplate
      }, detail.value.crowdfundingTemplate ? {
        F: common_vendor.o(($event) => downloadResource(detail.value.crowdfundingTemplate, "众筹材料模板")),
        G: common_vendor.p({
          size: "small",
          plain: true,
          customStyle: "width: 100%;"
        })
      } : {}) : {}, {
        H: common_vendor.o(goBack),
        I: common_vendor.p({
          plain: true,
          customStyle: "width: 100%;"
        })
      }) : {
        J: common_vendor.p({
          mode: "page",
          text: "渠道不存在或已下架"
        })
      }, {
        e: detail.value
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7b33b8a4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/charity/HelpChannelDetail.js.map
