"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
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
  __name: "DrugDetail",
  setup(__props) {
    const detail = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const downloading = common_vendor.ref(false);
    const drugId = common_vendor.ref(null);
    const DRUG_TYPE_MAP = {
      origin_import: "进口原研",
      origin_domestic: "国产原研",
      generic: "仿制药",
      other: "其他"
    };
    const getDrugTypeText = (type) => {
      return DRUG_TYPE_MAP[type] || type;
    };
    const loadDetail = async (id) => {
      loading.value = true;
      try {
        const res = await utils_request.request.get(`/api/resource/drug/drugs/${id}`);
        detail.value = res.data;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/drug/DrugDetail.vue:180", "加载药品详情失败:", error);
        detail.value = null;
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const handleDownload = async () => {
      var _a;
      if (!((_a = detail.value) == null ? void 0 : _a.id))
        return;
      const url = detail.value.manualPopular || detail.value.manualOriginal;
      if (!url) {
        common_vendor.index.showToast({ title: "暂无说明书链接", icon: "none" });
        return;
      }
      downloading.value = true;
      common_vendor.index.downloadFile({
        url,
        success: (downloadRes) => {
          if (downloadRes.statusCode === 200) {
            openPdf(downloadRes.tempFilePath);
          } else {
            common_vendor.index.showToast({ title: "下载失败", icon: "none" });
            downloading.value = false;
          }
        },
        fail: () => {
          common_vendor.index.showToast({ title: "下载失败，请检查网络", icon: "none" });
          downloading.value = false;
        }
      });
    };
    const openPdf = (filePath) => {
      common_vendor.index.showLoading({ title: "打开中..." });
      common_vendor.index.openDocument({
        filePath,
        fileType: "pdf",
        success: () => {
          common_vendor.index.hideLoading();
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/resource/drug/DrugDetail.vue:235", err);
          common_vendor.index.showToast({ title: "无法打开文件", icon: "none" });
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
        drugId.value = Number(options.id);
        loadDetail(drugId.value);
      } else {
        common_vendor.index.showToast({ title: "缺少药品ID", icon: "none" });
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
        f: common_vendor.t(detail.value.genericName),
        g: detail.value.brandName
      }, detail.value.brandName ? {
        h: common_vendor.t(detail.value.brandName)
      } : {}, {
        i: common_vendor.p({
          text: detail.value.isInsurance ? "医保" : "非医保",
          type: detail.value.isInsurance ? "success" : "info",
          size: "mini"
        }),
        j: detail.value.drugType
      }, detail.value.drugType ? {
        k: common_vendor.p({
          text: getDrugTypeText(detail.value.drugType),
          type: "primary",
          size: "mini"
        })
      } : {}, {
        l: detail.value.needPrescription
      }, detail.value.needPrescription ? {
        m: common_vendor.p({
          text: "处方药",
          type: "warning",
          size: "mini"
        })
      } : {}, {
        n: detail.value.diseases && detail.value.diseases.length > 0
      }, detail.value.diseases && detail.value.diseases.length > 0 ? {
        o: common_vendor.f(detail.value.diseases, (disease, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(disease.name),
            b: index < detail.value.diseases.length - 1
          }, index < detail.value.diseases.length - 1 ? {} : {}, {
            c: disease.id
          });
        })
      } : {}, {
        p: common_vendor.t(detail.value.indication),
        q: common_vendor.t(detail.value.dosageForm || "-"),
        r: common_vendor.t(detail.value.spec || "-"),
        s: common_vendor.t(detail.value.refPrice || "0.00"),
        t: common_vendor.t(detail.value.hasRelief ? "有" : "无"),
        v: detail.value.indication
      }, detail.value.indication ? {
        w: common_vendor.t(detail.value.indication)
      } : {}, {
        x: common_vendor.t(downloading.value ? "下载中..." : "查看说明书"),
        y: common_vendor.o(handleDownload),
        z: common_vendor.p({
          type: "primary",
          customStyle: "width: 100%; margin-bottom: 8px;",
          loading: downloading.value
        }),
        A: common_vendor.o(goBack),
        B: common_vendor.p({
          plain: true,
          customStyle: "width: 100%;"
        })
      }) : {
        C: common_vendor.p({
          mode: "page",
          text: "药品不存在或已下架"
        })
      }, {
        e: detail.value
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-191a9a0c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/drug/DrugDetail.js.map
