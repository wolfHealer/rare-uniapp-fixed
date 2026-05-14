"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_cell2 = common_vendor.resolveComponent("u-cell");
  const _easycom_u_cell_group2 = common_vendor.resolveComponent("u-cell-group");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  (_easycom_u_icon2 + _easycom_u_loading_icon2 + _easycom_u_image2 + _easycom_u_tag2 + _easycom_u_cell2 + _easycom_u_cell_group2 + _easycom_u_button2 + _easycom_u_empty2)();
}
const _easycom_u_icon = () => "../../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_loading_icon = () => "../../../node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_image = () => "../../../node-modules/uview-plus/components/u-image/u-image.js";
const _easycom_u_tag = () => "../../../node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_cell = () => "../../../node-modules/uview-plus/components/u-cell/u-cell.js";
const _easycom_u_cell_group = () => "../../../node-modules/uview-plus/components/u-cell-group/u-cell-group.js";
const _easycom_u_button = () => "../../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_empty = () => "../../../node-modules/uview-plus/components/u-empty/u-empty.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_loading_icon + _easycom_u_image + _easycom_u_tag + _easycom_u_cell + _easycom_u_cell_group + _easycom_u_button + _easycom_u_empty)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "RehabInstitutionDetail",
  setup(__props) {
    const detail = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const institutionId = common_vendor.ref(null);
    const getFullRegion = () => {
      if (!detail.value)
        return "";
      const parts = [detail.value.provinceName, detail.value.cityName, detail.value.districtName].filter(Boolean);
      return parts.join("");
    };
    const loadDetail = async (id) => {
      loading.value = true;
      try {
        const res = await utils_request.request.get(`/api/resource/rehab/institutions/${id}`);
        detail.value = res.data || null;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/rehab/RehabInstitutionDetail.vue:240", "加载机构详情失败:", error);
        detail.value = null;
        common_vendor.index.showToast({ title: "加载失败，请重试", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const makeCall = () => {
      var _a;
      if ((_a = detail.value) == null ? void 0 : _a.contactPhone) {
        common_vendor.index.makePhoneCall({
          phoneNumber: detail.value.contactPhone
        });
      }
    };
    const openWebsite = () => {
      var _a;
      if ((_a = detail.value) == null ? void 0 : _a.contactUrl) {
        common_vendor.index.setClipboardData({
          data: detail.value.contactUrl,
          success: () => {
            common_vendor.index.showToast({ title: "链接已复制", icon: "success" });
          }
        });
      }
    };
    const openQualification = () => {
      var _a;
      if ((_a = detail.value) == null ? void 0 : _a.qualification) {
        common_vendor.index.setClipboardData({
          data: detail.value.qualification,
          success: () => {
            common_vendor.index.showToast({ title: "资质链接已复制", icon: "success" });
          }
        });
      }
    };
    const copyAddress = () => {
      var _a;
      if ((_a = detail.value) == null ? void 0 : _a.address) {
        const fullAddress = `${getFullRegion()}${detail.value.address}`;
        common_vendor.index.setClipboardData({
          data: fullAddress,
          success: () => {
            common_vendor.index.showToast({ title: "地址已复制", icon: "success" });
          }
        });
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    common_vendor.onLoad((options) => {
      if (options.id) {
        institutionId.value = Number(options.id);
        loadDetail(institutionId.value);
      }
    });
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
        f: detail.value.coverUrl
      }, detail.value.coverUrl ? {
        g: common_vendor.p({
          src: detail.value.coverUrl,
          width: "100%",
          height: "200px",
          mode: "aspectFill"
        })
      } : {}, {
        h: common_vendor.t(detail.value.name),
        i: detail.value.isInsurance
      }, detail.value.isInsurance ? {
        j: common_vendor.p({
          text: "医保定点",
          type: "success",
          size: "mini",
          customStyle: "margin-left: 8px;"
        })
      } : {}, {
        k: common_vendor.p({
          text: detail.value.typeName || "康复机构",
          type: "primary",
          size: "mini"
        }),
        l: common_vendor.p({
          text: getFullRegion(),
          plain: true,
          size: "mini"
        }),
        m: detail.value.rating
      }, detail.value.rating ? {
        n: common_vendor.p({
          text: "评分 " + detail.value.rating,
          type: "warning",
          size: "mini",
          plain: true
        })
      } : {}, {
        o: common_vendor.p({
          name: "map",
          size: "14",
          color: "#9ca3af"
        }),
        p: common_vendor.t(detail.value.address),
        q: detail.value.diseases && detail.value.diseases.length > 0
      }, detail.value.diseases && detail.value.diseases.length > 0 ? {
        r: common_vendor.f(detail.value.diseases, (disease, index, i0) => {
          return {
            a: index,
            b: "da6ac7d0-8-" + i0,
            c: common_vendor.p({
              text: disease.name,
              plain: true,
              size: "mini",
              customStyle: "margin-right: 8px; margin-bottom: 8px;"
            })
          };
        })
      } : {}, {
        s: detail.value.rehabProjects
      }, detail.value.rehabProjects ? {
        t: common_vendor.t(detail.value.rehabProjects)
      } : {}, {
        v: detail.value.doctors && detail.value.doctors.length > 0
      }, detail.value.doctors && detail.value.doctors.length > 0 ? {
        w: common_vendor.f(detail.value.doctors, (doctor, index, i0) => {
          return {
            a: index,
            b: "da6ac7d0-10-" + i0 + ",da6ac7d0-9",
            c: common_vendor.p({
              title: doctor.name,
              label: `${doctor.title} · ${doctor.specialty}`
            })
          };
        })
      } : {}, {
        x: detail.value.facilities && detail.value.facilities.length > 0
      }, detail.value.facilities && detail.value.facilities.length > 0 ? {
        y: common_vendor.f(detail.value.facilities, (item, index, i0) => {
          return {
            a: "da6ac7d0-11-" + i0,
            b: common_vendor.t(item),
            c: index
          };
        }),
        z: common_vendor.p({
          name: "checkmark-circle",
          size: "14",
          color: "#10b981"
        })
      } : {}, {
        A: detail.value.businessHours
      }, detail.value.businessHours ? {
        B: common_vendor.t(detail.value.businessHours)
      } : {}, {
        C: detail.value.feeStandard
      }, detail.value.feeStandard ? {
        D: common_vendor.t(detail.value.feeStandard)
      } : {}, {
        E: detail.value.contactPhone
      }, detail.value.contactPhone ? {
        F: common_vendor.o(makeCall),
        G: common_vendor.p({
          size: "small",
          type: "primary",
          customStyle: "width: 100%; margin-bottom: 8px;"
        })
      } : {}, {
        H: detail.value.contactUrl
      }, detail.value.contactUrl ? {
        I: common_vendor.o(openWebsite),
        J: common_vendor.p({
          size: "small",
          plain: true,
          customStyle: "width: 100%; margin-bottom: 8px;"
        })
      } : {}, {
        K: common_vendor.o(copyAddress),
        L: common_vendor.p({
          size: "small",
          plain: true,
          customStyle: "width: 100%;"
        }),
        M: detail.value.qualification
      }, detail.value.qualification ? {
        N: common_vendor.o(openQualification),
        O: common_vendor.p({
          size: "small",
          plain: true,
          type: "info"
        })
      } : {}, {
        P: common_vendor.o(goBack),
        Q: common_vendor.p({
          plain: true,
          customStyle: "width: 100%;"
        })
      }) : {
        R: common_vendor.p({
          mode: "page",
          text: "机构不存在或已停业"
        })
      }, {
        e: detail.value
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-da6ac7d0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/rehab/RehabInstitutionDetail.js.map
