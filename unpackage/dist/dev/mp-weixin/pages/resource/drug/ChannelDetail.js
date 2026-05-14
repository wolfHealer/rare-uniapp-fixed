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
  __name: "ChannelDetail",
  setup(__props) {
    const detail = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const channelId = common_vendor.ref(null);
    const getChannelTypeText = (type) => {
      const map = {
        "hospital_pharmacy": "医院药房",
        "retail_pharmacy": "连锁药店",
        "e_pharmacy": "医药电商",
        "compliant_agent": "合规代购"
      };
      return map[type] || "其他渠道";
    };
    const getFullRegion = () => {
      if (!detail.value)
        return "暂无";
      const parts = [detail.value.provinceName, detail.value.cityName, detail.value.districtName].filter(Boolean);
      return parts.join("") || "暂无";
    };
    const loadDetail = async () => {
      if (!channelId.value)
        return;
      loading.value = true;
      try {
        const res = await utils_request.request.get(`/api/resource/drug/channels/${channelId.value}`);
        detail.value = res.data || null;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/drug/ChannelDetail.vue:190", "加载渠道详情失败:", error);
        detail.value = null;
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const makeCall = () => {
      var _a;
      if (!((_a = detail.value) == null ? void 0 : _a.contactPhone))
        return;
      common_vendor.index.makePhoneCall({
        phoneNumber: detail.value.contactPhone
      });
    };
    const openUrl = () => {
      var _a;
      if (!((_a = detail.value) == null ? void 0 : _a.contactUrl))
        return;
      common_vendor.index.setClipboardData({
        data: detail.value.contactUrl,
        success: () => common_vendor.index.showToast({ title: "链接已复制", icon: "success" })
      });
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    common_vendor.onLoad((options) => {
      if (options.id) {
        channelId.value = Number(options.id);
        loadDetail();
      } else {
        common_vendor.index.showToast({ title: "缺少渠道ID", icon: "none" });
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
        f: common_vendor.t(detail.value.name),
        g: common_vendor.p({
          text: getChannelTypeText(detail.value.channelType),
          type: "primary",
          size: "mini"
        }),
        h: common_vendor.p({
          text: detail.value.auditStatus === 1 ? "已认证" : "审核中",
          type: detail.value.auditStatus === 1 ? "success" : "info",
          size: "mini"
        }),
        i: common_vendor.t(getFullRegion()),
        j: common_vendor.t(detail.value.deliveryScope || "暂无"),
        k: common_vendor.t(detail.value.address || "暂无"),
        l: detail.value.desc
      }, detail.value.desc ? {
        m: common_vendor.t(detail.value.desc)
      } : {}, {
        n: detail.value.drugs && detail.value.drugs.length > 0
      }, detail.value.drugs && detail.value.drugs.length > 0 ? {
        o: common_vendor.f(detail.value.drugs, (drug, index, i0) => {
          return {
            a: common_vendor.t(drug.brandName),
            b: common_vendor.t(drug.genericName),
            c: index
          };
        })
      } : {}, {
        p: detail.value.qualification
      }, detail.value.qualification ? {
        q: common_vendor.t(detail.value.qualification)
      } : {}, {
        r: detail.value.contactPhone
      }, detail.value.contactPhone ? {
        s: common_vendor.p({
          name: "phone",
          size: "20",
          color: "#1989fa"
        }),
        t: common_vendor.t(detail.value.contactPhone)
      } : {}, {
        v: detail.value.contactUrl
      }, detail.value.contactUrl ? {
        w: common_vendor.p({
          name: "link",
          size: "20",
          color: "#1989fa"
        }),
        x: common_vendor.t(detail.value.contactUrl),
        y: common_vendor.o(openUrl)
      } : {}, {
        z: !detail.value.contactPhone && !detail.value.contactUrl
      }, !detail.value.contactPhone && !detail.value.contactUrl ? {} : {}, {
        A: detail.value.contactPhone
      }, detail.value.contactPhone ? {
        B: common_vendor.o(makeCall),
        C: common_vendor.p({
          type: "primary",
          customStyle: "width: 100%; margin-bottom: 8px;"
        })
      } : {}, {
        D: common_vendor.o(goBack),
        E: common_vendor.p({
          plain: true,
          customStyle: "width: 100%;"
        })
      }) : {
        F: common_vendor.p({
          mode: "page",
          text: "渠道不存在或已下架"
        })
      }, {
        e: detail.value
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-de57bc56"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/drug/ChannelDetail.js.map
