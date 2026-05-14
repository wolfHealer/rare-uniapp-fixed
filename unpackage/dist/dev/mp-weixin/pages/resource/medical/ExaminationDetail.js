"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
if (!Array) {
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  (_easycom_u_loading_icon2 + _easycom_u_button2 + _easycom_u_empty2)();
}
const _easycom_u_loading_icon = () => "../../../node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_button = () => "../../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_empty = () => "../../../node-modules/uview-plus/components/u-empty/u-empty.js";
if (!Math) {
  (_easycom_u_loading_icon + _easycom_u_button + _easycom_u_empty)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "ExaminationDetail",
  setup(__props) {
    const EXAM_TYPE_MAP = {
      lab: "实验室检查",
      metabolic: "代谢筛查",
      imaging: "影像学检查",
      genetic: "基因检测",
      pathology: "病理检查",
      functional: "功能检查",
      scale: "量表评估",
      special: "专科专项检查",
      other: "其他"
    };
    const getExamTypeText = (type) => {
      return EXAM_TYPE_MAP[type] || type;
    };
    const detail = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const examId = common_vendor.ref(null);
    const loadDetail = async (id) => {
      loading.value = true;
      try {
        const res = await utils_request.request.get(`/api/resource/medical/examinations/${id}`);
        detail.value = res.data;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/medical/ExaminationDetail.vue:109", "加载检查项目详情失败:", error);
        detail.value = null;
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const handleBooking = () => {
      if (examId.value) {
        common_vendor.index.navigateTo({
          url: `/pages/resource/medical/booking/index?id=${examId.value}`
        });
      }
    };
    const handleConsult = () => {
      if (examId.value) {
        common_vendor.index.navigateTo({
          url: `/pages/resource/medical/consult/index?id=${examId.value}`
        });
      }
    };
    common_vendor.onLoad((options) => {
      if (options.id) {
        examId.value = Number(options.id);
        loadDetail(examId.value);
      } else {
        common_vendor.index.showToast({ title: "缺少项目ID", icon: "none" });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: loading.value
      }, loading.value ? {
        b: common_vendor.p({
          mode: "circle"
        })
      } : detail.value ? common_vendor.e({
        d: common_vendor.t(detail.value.examName),
        e: detail.value.examType
      }, detail.value.examType ? {
        f: common_vendor.t(getExamTypeText(detail.value.examType))
      } : {}, {
        g: detail.value.duration
      }, detail.value.duration ? {} : {}, {
        h: detail.value.duration
      }, detail.value.duration ? {
        i: common_vendor.t(detail.value.duration)
      } : {}, {
        j: detail.value.price
      }, detail.value.price ? {
        k: common_vendor.t(detail.value.price)
      } : {}, {
        l: common_vendor.o(handleBooking),
        m: common_vendor.p({
          size: "mini",
          type: "primary"
        }),
        n: common_vendor.o(handleConsult),
        o: common_vendor.p({
          size: "mini",
          plain: true
        }),
        p: common_vendor.t(detail.value.examPurpose),
        q: detail.value.sampleNotes
      }, detail.value.sampleNotes ? {
        r: common_vendor.t(detail.value.sampleNotes)
      } : {}, {
        s: detail.value.institution
      }, detail.value.institution ? {
        t: common_vendor.t(detail.value.institution)
      } : {}) : {
        v: common_vendor.p({
          mode: "data",
          description: "检查项目不存在或已下架"
        })
      }, {
        c: detail.value
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f6ed7f4a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/medical/ExaminationDetail.js.map
