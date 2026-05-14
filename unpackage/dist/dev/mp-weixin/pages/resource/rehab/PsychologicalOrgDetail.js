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
  __name: "PsychologicalOrgDetail",
  setup(__props) {
    const detail = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const organizationId = common_vendor.ref(null);
    const loadDetail = async (id) => {
      loading.value = true;
      try {
        const res = await utils_request.request.get(`/api/resource/rehab/psychological/orgs/${id}`);
        detail.value = res.data || null;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/rehab/PsychologicalOrgDetail.vue:169", "加载机构详情失败:", error);
        detail.value = null;
        common_vendor.index.showToast({ title: "加载失败，请重试", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const makePhoneCall = (phoneNumber) => {
      if (!phoneNumber)
        return;
      common_vendor.index.makePhoneCall({
        phoneNumber,
        fail: () => {
          common_vendor.index.showToast({ title: "拨打失败", icon: "none" });
        }
      });
    };
    const openMap = () => {
      if (!detail.value)
        return;
      if (detail.value.latitude && detail.value.longitude) {
        common_vendor.index.openLocation({
          latitude: detail.value.latitude,
          longitude: detail.value.longitude,
          name: detail.value.name,
          address: detail.value.address || "",
          success: () => {
          },
          fail: () => {
            common_vendor.index.showToast({ title: "打开地图失败", icon: "none" });
          }
        });
      } else if (detail.value.address) {
        common_vendor.index.setClipboardData({
          data: detail.value.address,
          success: () => {
            common_vendor.index.showModal({
              title: "提示",
              content: "地址已复制，请打开地图APP搜索导航",
              showCancel: false
            });
          }
        });
      } else {
        common_vendor.index.showToast({ title: "暂无地址信息", icon: "none" });
      }
    };
    const copyWebsite = () => {
      var _a;
      if (!((_a = detail.value) == null ? void 0 : _a.website))
        return;
      common_vendor.index.setClipboardData({
        data: detail.value.website,
        success: () => {
          common_vendor.index.showToast({ title: "链接已复制", icon: "success" });
        }
      });
    };
    const handleConsult = () => {
      common_vendor.index.showToast({ title: "咨询功能开发中", icon: "none" });
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    common_vendor.onLoad((options) => {
      if (!options || !options.id) {
        common_vendor.index.showToast({ title: "缺少机构ID", icon: "none" });
        setTimeout(() => {
          goBack();
        }, 1500);
        return;
      }
      organizationId.value = Number(options.id);
      loadDetail(organizationId.value);
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
        e: common_vendor.p({
          text: detail.value.typeName,
          type: "primary",
          size: "mini",
          plain: true
        }),
        f: detail.value.isFree
      }, detail.value.isFree ? {
        g: common_vendor.p({
          text: "免费",
          type: "success",
          size: "mini",
          plain: true
        })
      } : {}, {
        h: common_vendor.p({
          text: detail.value.status === "active" ? "服务中" : "已停业",
          type: detail.value.status === "active" ? "success" : "info",
          size: "mini",
          plain: true
        }),
        i: detail.value.rating
      }, detail.value.rating ? {
        j: common_vendor.p({
          name: "star-fill",
          color: "#ff976a",
          size: "14"
        }),
        k: common_vendor.t(detail.value.rating)
      } : {}, {
        l: detail.value.description
      }, detail.value.description ? {
        m: common_vendor.t(detail.value.description)
      } : {}, {
        n: detail.value.services && detail.value.services.length > 0
      }, detail.value.services && detail.value.services.length > 0 ? {
        o: common_vendor.f(detail.value.services, (service, index, i0) => {
          return {
            a: index,
            b: "fd7d54e6-5-" + i0,
            c: common_vendor.p({
              text: service,
              plain: true,
              size: "mini",
              type: "primary"
            })
          };
        })
      } : {}, {
        p: detail.value.counselors && detail.value.counselors.length > 0
      }, detail.value.counselors && detail.value.counselors.length > 0 ? {
        q: common_vendor.f(detail.value.counselors, (c, index, i0) => {
          return {
            a: common_vendor.t(c.name),
            b: common_vendor.t(c.title),
            c: common_vendor.t(c.specialty),
            d: index
          };
        })
      } : {}, {
        r: detail.value.phone
      }, detail.value.phone ? {
        s: common_vendor.p({
          name: "phone",
          size: "16",
          color: "#3b82f6"
        }),
        t: common_vendor.t(detail.value.phone),
        v: common_vendor.o(($event) => makePhoneCall(detail.value.phone))
      } : {}, {
        w: detail.value.serviceTime
      }, detail.value.serviceTime ? {
        x: common_vendor.p({
          name: "clock",
          size: "16",
          color: "#6b7280"
        }),
        y: common_vendor.t(detail.value.serviceTime)
      } : {}, {
        z: detail.value.address
      }, detail.value.address ? {
        A: common_vendor.p({
          name: "map",
          size: "16",
          color: "#6b7280"
        }),
        B: common_vendor.t(detail.value.address),
        C: common_vendor.o(openMap),
        D: common_vendor.p({
          size: "mini",
          plain: true
        })
      } : {}, {
        E: detail.value.website
      }, detail.value.website ? {
        F: common_vendor.p({
          name: "link",
          size: "16",
          color: "#6b7280"
        }),
        G: common_vendor.o(copyWebsite),
        H: common_vendor.p({
          size: "mini",
          plain: true
        })
      } : {}, {
        I: common_vendor.o(handleConsult),
        J: common_vendor.p({
          type: "primary",
          block: true
        }),
        K: common_vendor.o(goBack),
        L: common_vendor.p({
          plain: true,
          block: true
        })
      }) : {
        M: common_vendor.p({
          mode: "data",
          description: "机构信息不存在"
        })
      }, {
        c: detail.value
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fd7d54e6"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/rehab/PsychologicalOrgDetail.js.map
