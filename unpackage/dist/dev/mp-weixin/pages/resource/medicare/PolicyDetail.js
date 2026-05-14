"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_cell2 = common_vendor.resolveComponent("u-cell");
  const _easycom_u_cell_group2 = common_vendor.resolveComponent("u-cell-group");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  (_easycom_u_icon2 + _easycom_u_loading_icon2 + _easycom_u_tag2 + _easycom_u_button2 + _easycom_u_cell2 + _easycom_u_cell_group2 + _easycom_u_empty2)();
}
const _easycom_u_icon = () => "../../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_loading_icon = () => "../../../node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_tag = () => "../../../node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_button = () => "../../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_cell = () => "../../../node-modules/uview-plus/components/u-cell/u-cell.js";
const _easycom_u_cell_group = () => "../../../node-modules/uview-plus/components/u-cell-group/u-cell-group.js";
const _easycom_u_empty = () => "../../../node-modules/uview-plus/components/u-empty/u-empty.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_loading_icon + _easycom_u_tag + _easycom_u_button + _easycom_u_cell + _easycom_u_cell_group + _easycom_u_empty)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "PolicyDetail",
  setup(__props) {
    const detail = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const policyId = common_vendor.ref("");
    const formatDate = (dateStr) => {
      if (!dateStr)
        return "-";
      const date = new Date(dateStr);
      return date.toLocaleDateString("zh-CN");
    };
    common_vendor.onLoad((options) => {
      if (options && options.id) {
        policyId.value = options.id;
        loadDetail();
      } else {
        common_vendor.index.showToast({ title: "缺少政策ID", icon: "none" });
        goBack();
      }
    });
    const loadDetail = async () => {
      if (!policyId.value)
        return;
      loading.value = true;
      try {
        const res = await utils_request.request.get(`/api/resource/medicare/policies/${policyId.value}`);
        detail.value = res.data || res.data;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/medicare/PolicyDetail.vue:159", "加载政策详情失败:", error);
        detail.value = null;
        common_vendor.index.showToast({ title: "加载失败，请重试", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const downloadFile = async (url, fileName) => {
      if (!url) {
        common_vendor.index.showToast({ title: "文件链接无效", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "下载中..." });
      try {
        let downloadUrl = url;
        if (!downloadUrl.startsWith("http")) {
          downloadUrl = "https://your-api-domain.com" + downloadUrl;
        }
        common_vendor.index.downloadFile({
          url: downloadUrl,
          success: (res) => {
            if (res.statusCode === 200) {
              common_vendor.index.openDocument({
                filePath: res.tempFilePath,
                fileType: "pdf",
                // 指定文件类型，有助于正确预览
                showMenu: true,
                // 显示右上角菜单，允许用户保存/转发
                success: () => {
                  common_vendor.index.hideLoading();
                },
                fail: (err) => {
                  common_vendor.index.hideLoading();
                  common_vendor.index.__f__("error", "at pages/resource/medicare/PolicyDetail.vue:200", "打开文档失败", err);
                  common_vendor.index.showToast({ title: "打开文档失败", icon: "none" });
                }
              });
            } else {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "下载失败", icon: "none" });
            }
          },
          fail: (err) => {
            common_vendor.index.hideLoading();
            common_vendor.index.__f__("error", "at pages/resource/medicare/PolicyDetail.vue:211", "下载文件失败", err);
            common_vendor.index.showToast({ title: "下载失败，请检查网络或域名配置", icon: "none" });
          }
        });
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/resource/medicare/PolicyDetail.vue:218", "下载异常", error);
        common_vendor.index.showToast({ title: "下载异常", icon: "none" });
      }
    };
    const viewRelated = (id) => {
      common_vendor.index.navigateTo({
        url: `/pages/resource/medicare/PolicyDetail?id=${id}`
      });
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
        f: common_vendor.t(detail.value.title),
        g: common_vendor.p({
          text: detail.value.category,
          type: "primary",
          size: "mini"
        }),
        h: common_vendor.p({
          text: detail.value.region,
          plain: true,
          size: "mini"
        }),
        i: common_vendor.t(detail.value.region),
        j: common_vendor.t(formatDate(detail.value.publishDate)),
        k: common_vendor.t(detail.value.category),
        l: detail.value.content
      }, detail.value.content ? {
        m: common_vendor.t(detail.value.content)
      } : {}, {
        n: detail.value.fileUrl
      }, detail.value.fileUrl ? {
        o: common_vendor.o(($event) => downloadFile(detail.value.fileUrl)),
        p: common_vendor.p({
          size: "small",
          plain: true,
          customStyle: "width: 100%;"
        })
      } : {}, {
        q: detail.value.relatedPolicies && detail.value.relatedPolicies.length > 0
      }, detail.value.relatedPolicies && detail.value.relatedPolicies.length > 0 ? {
        r: common_vendor.f(detail.value.relatedPolicies, (policy, k0, i0) => {
          return {
            a: policy.id,
            b: common_vendor.o(($event) => viewRelated(policy.id), policy.id),
            c: "f9dbe6e2-6-" + i0 + ",f9dbe6e2-5",
            d: common_vendor.p({
              title: policy.title,
              ["is-link"]: true
            })
          };
        })
      } : {}, {
        s: common_vendor.o(goBack),
        t: common_vendor.p({
          plain: true,
          customStyle: "width: 100%;"
        })
      }) : {
        v: common_vendor.p({
          mode: "page",
          text: "政策不存在或已下架"
        })
      }, {
        e: detail.value
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f9dbe6e2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/medicare/PolicyDetail.js.map
