"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
if (!Array) {
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  (_easycom_u_loading_icon2 + _easycom_u_tag2 + _easycom_u_icon2 + _easycom_u_button2 + _easycom_u_empty2)();
}
const _easycom_u_loading_icon = () => "../../../node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_tag = () => "../../../node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_icon = () => "../../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_button = () => "../../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_empty = () => "../../../node-modules/uview-plus/components/u-empty/u-empty.js";
if (!Math) {
  (_easycom_u_loading_icon + _easycom_u_tag + _easycom_u_icon + _easycom_u_button + _easycom_u_empty)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "DoctorDetail",
  setup(__props) {
    const detail = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const showPhone = common_vendor.ref(false);
    const doctorId = common_vendor.ref(null);
    const loadDetail = async (id) => {
      loading.value = true;
      try {
        const res = await utils_request.request.get(`/api/resource/medical/doctors/${id}`);
        detail.value = res.data;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/medical/DoctorDetail.vue:158", "加载医生详情失败:", error);
        detail.value = null;
        common_vendor.index.showToast({ title: "加载医生信息失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const maskPhone = (phone) => {
      if (!phone)
        return "";
      if (!showPhone.value) {
        return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
      }
      return phone;
    };
    const togglePhone = () => {
      showPhone.value = !showPhone.value;
    };
    const handleBooking = () => {
      if (doctorId.value) {
        common_vendor.index.navigateTo({
          url: `/pages/resource/medical/booking/doctor?id=${doctorId.value}`
        });
      }
    };
    const handleConsult = () => {
      if (doctorId.value) {
        common_vendor.index.navigateTo({
          url: `/pages/resource/medical/consult/doctor?id=${doctorId.value}`
        });
      }
    };
    common_vendor.onLoad((options) => {
      if (options.id) {
        doctorId.value = Number(options.id);
        loadDetail(doctorId.value);
      } else {
        common_vendor.index.showToast({ title: "缺少医生ID", icon: "none" });
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
        d: common_vendor.t(detail.value.name),
        e: common_vendor.t(detail.value.hospitalName),
        f: common_vendor.t(detail.value.department),
        g: common_vendor.t(detail.value.title),
        h: common_vendor.t(detail.value.goodAt),
        i: detail.value.diseases && detail.value.diseases.length > 0
      }, detail.value.diseases && detail.value.diseases.length > 0 ? {
        j: common_vendor.f(detail.value.diseases, (disease, k0, i0) => {
          return {
            a: disease.id,
            b: "ab740b2f-1-" + i0,
            c: common_vendor.p({
              text: disease.name,
              type: "primary",
              size: "mini",
              shape: "circle",
              plain: true
            })
          };
        })
      } : {}, {
        k: detail.value.address
      }, detail.value.address ? {
        l: common_vendor.p({
          name: "map",
          size: "14",
          color: "#999"
        }),
        m: common_vendor.t(detail.value.address)
      } : {}, {
        n: detail.value.isRareNetwork
      }, detail.value.isRareNetwork ? {
        o: common_vendor.p({
          type: "success",
          size: "mini"
        })
      } : {}, {
        p: detail.value.clinicTime
      }, detail.value.clinicTime ? {
        q: common_vendor.t(detail.value.clinicTime)
      } : {}, {
        r: detail.value.contact
      }, detail.value.contact ? {
        s: common_vendor.t(maskPhone(detail.value.contact)),
        t: common_vendor.t(showPhone.value ? "隐藏" : "查看"),
        v: common_vendor.o(togglePhone),
        w: common_vendor.p({
          size: "mini",
          plain: true
        })
      } : {}, {
        x: detail.value.commentNum && detail.value.commentNum > 0
      }, detail.value.commentNum && detail.value.commentNum > 0 ? common_vendor.e({
        y: common_vendor.t(detail.value.commentNum),
        z: common_vendor.p({
          name: "star-fill",
          color: "#ff976a",
          size: "18"
        }),
        A: common_vendor.t(detail.value.score),
        B: !detail.value.reviews || detail.value.reviews.length === 0
      }, !detail.value.reviews || detail.value.reviews.length === 0 ? {} : {}) : {}, {
        C: common_vendor.o(handleBooking),
        D: common_vendor.p({
          type: "primary",
          block: true
        }),
        E: common_vendor.o(handleConsult),
        F: common_vendor.p({
          plain: true,
          block: true
        })
      }) : {
        G: common_vendor.p({
          mode: "data",
          description: "医生信息不存在"
        })
      }, {
        c: detail.value
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ab740b2f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/medical/DoctorDetail.js.map
