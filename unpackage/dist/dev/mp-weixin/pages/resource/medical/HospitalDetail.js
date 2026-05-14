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
  __name: "HospitalDetail",
  setup(__props) {
    const levelMap = {
      "1": "三级甲等",
      "2": "三级乙等",
      "3": "三级丙等",
      "4": "二级甲等",
      "5": "二级乙等",
      "6": "二级丙等",
      "7": "其他"
    };
    const detail = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const hospitalId = common_vendor.ref(null);
    const transformHospitalData = (apiData) => {
      return {
        id: apiData.id,
        name: apiData.name,
        level: apiData.level,
        levelText: levelMap[apiData.level] || "未知等级",
        specialty: apiData.treatScope || "",
        // 映射 treatScope -> specialty
        address: apiData.address,
        phone: apiData.phone,
        isNetworkMember: apiData.isRareNetwork === true,
        // 映射 isRareNetwork -> isNetworkMember
        // 新增：映射 diseases 字段，确保是数组
        diseases: Array.isArray(apiData.diseases) ? apiData.diseases : [],
        // 接口暂无以下字段，设默认值
        rating: 0,
        reviewCount: 0,
        reviews: [],
        latitude: void 0,
        longitude: void 0
      };
    };
    const loadDetail = async (id) => {
      loading.value = true;
      try {
        const res = await utils_request.request.get(`/api/resource/medical/hospitals/${id}`);
        if (res.data) {
          detail.value = transformHospitalData(res.data);
        } else {
          detail.value = null;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/medical/HospitalDetail.vue:168", "加载医院详情失败:", error);
        detail.value = null;
        common_vendor.index.showToast({ title: "加载医院信息失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const makePhoneCall = (phoneNumber) => {
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
              content: "医院地址已复制，请打开地图APP搜索导航",
              showCancel: false,
              confirmText: "知道了"
            });
          }
        });
      } else {
        common_vendor.index.showToast({ title: "暂无地址信息", icon: "none" });
      }
    };
    const handleBooking = () => {
      if (hospitalId.value) {
        common_vendor.index.navigateTo({
          url: `/pages/resource/medical/booking/hospital?id=${hospitalId.value}`
        });
      }
    };
    const handleNavigate = () => {
      openMap();
    };
    common_vendor.onLoad((options) => {
      const id = options == null ? void 0 : options.id;
      if (id) {
        hospitalId.value = Number(id);
        loadDetail(hospitalId.value);
      } else {
        common_vendor.index.showToast({ title: "缺少医院ID", icon: "none" });
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
        e: common_vendor.t(detail.value.levelText),
        f: detail.value.isNetworkMember
      }, detail.value.isNetworkMember ? {
        g: common_vendor.p({
          text: "协作网成员",
          type: "success",
          size: "mini"
        })
      } : {}, {
        h: common_vendor.t(detail.value.specialty),
        i: detail.value.diseases && detail.value.diseases.length > 0
      }, detail.value.diseases && detail.value.diseases.length > 0 ? {
        j: common_vendor.f(detail.value.diseases, (item, index, i0) => {
          return {
            a: item.id || index,
            b: "f21beee1-2-" + i0,
            c: common_vendor.p({
              text: item.name,
              type: "info",
              size: "mini",
              plain: true
            })
          };
        })
      } : {}, {
        k: detail.value.address
      }, detail.value.address ? {
        l: common_vendor.t(detail.value.address),
        m: common_vendor.p({
          name: "map",
          size: "14"
        }),
        n: common_vendor.o(openMap),
        o: common_vendor.p({
          size: "mini",
          plain: true
        })
      } : {}, {
        p: detail.value.phone
      }, detail.value.phone ? {
        q: common_vendor.t(detail.value.phone),
        r: common_vendor.o(($event) => makePhoneCall(detail.value.phone))
      } : {}, {
        s: detail.value.reviews && detail.value.reviews.length > 0
      }, detail.value.reviews && detail.value.reviews.length > 0 ? {
        t: common_vendor.t(detail.value.reviewCount),
        v: common_vendor.p({
          name: "star",
          color: "#ff976a",
          size: "18"
        }),
        w: common_vendor.t(detail.value.rating)
      } : {}, {
        x: common_vendor.o(handleBooking),
        y: common_vendor.p({
          type: "primary",
          block: true
        }),
        z: common_vendor.o(handleNavigate),
        A: common_vendor.p({
          plain: true,
          block: true
        })
      }) : {
        B: common_vendor.p({
          mode: "data",
          description: "医院信息不存在"
        })
      }, {
        c: detail.value
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f21beee1"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/medical/HospitalDetail.js.map
