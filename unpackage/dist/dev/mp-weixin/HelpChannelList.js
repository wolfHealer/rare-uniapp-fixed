"use strict";
const common_vendor = require("./common/vendor.js");
const utils_request = require("./utils/request.js");
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_cell2 = common_vendor.resolveComponent("u-cell");
  const _easycom_u_cell_group2 = common_vendor.resolveComponent("u-cell-group");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  (_easycom_u_search2 + _easycom_u_loading_icon2 + _easycom_u_tag2 + _easycom_u_cell2 + _easycom_u_cell_group2 + _easycom_u_empty2 + _easycom_u_button2)();
}
const _easycom_u_search = () => "./node-modules/uview-plus/components/u-search/u-search.js";
const _easycom_u_loading_icon = () => "./node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_tag = () => "./node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_cell = () => "./node-modules/uview-plus/components/u-cell/u-cell.js";
const _easycom_u_cell_group = () => "./node-modules/uview-plus/components/u-cell-group/u-cell-group.js";
const _easycom_u_empty = () => "./node-modules/uview-plus/components/u-empty/u-empty.js";
const _easycom_u_button = () => "./node-modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  (_easycom_u_search + SmartFilterBar + _easycom_u_loading_icon + _easycom_u_tag + _easycom_u_cell + _easycom_u_cell_group + _easycom_u_empty + _easycom_u_button)();
}
const SmartFilterBar = () => "./components/filter/SmartFilterBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "HelpChannelList",
  setup(__props) {
    const channels = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const downloading = common_vendor.ref(false);
    const keyword = common_vendor.ref("");
    const filterParams = common_vendor.ref({
      channelType: ""
    });
    const channelConfigs = [
      {
        key: "channelType",
        label: "通道类型",
        type: "tags",
        options: [
          { label: "全部类型", value: "" },
          { label: "紧急求助", value: "emergency_help" },
          { label: "众筹求助", value: "crowdfunding" },
          { label: "慈善咨询", value: "charity_consulting" },
          { label: "基金会支持", value: "foundation_support" },
          { label: "其他", value: "other" }
        ]
      }
    ];
    const getChannelTypeTag = (type) => {
      const tagMap = {
        emergency_help: "success",
        crowdfunding: "primary",
        charity_consulting: "warning",
        foundation_support: "info"
      };
      return tagMap[type] || "info";
    };
    const getChannelTypeLabel = (type) => {
      const labelMap = {
        emergency_help: "紧急求助",
        crowdfunding: "众筹求助",
        charity_consulting: "慈善咨询",
        foundation_support: "基金会支持"
      };
      return labelMap[type] || "其他";
    };
    const fetchChannels = async () => {
      loading.value = true;
      try {
        const params = {};
        if (keyword.value && keyword.value.trim() !== "") {
          params.keyword = keyword.value.trim();
        }
        if (filterParams.value.channelType) {
          params.channelType = filterParams.value.channelType;
        }
        const res = await utils_request.request.get("/api/resource/charity/channels", params);
        const resultData = res.data || res;
        channels.value = resultData.list || [];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/charity/HelpChannelList.vue:163", "获取求助渠道失败:", error);
        channels.value = [];
        common_vendor.index.showToast({ title: "加载失败，请重试", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const contact = (item) => {
      if (!(item == null ? void 0 : item.id)) {
        common_vendor.index.showToast({ title: "渠道信息不完整", icon: "none" });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/resource/charity/HelpChannelDetail?id=${item.id}`
      });
    };
    const downloadTemplate = async () => {
      downloading.value = true;
      try {
        const res = await utils_request.request.get("/api/resource/charity/channels/template");
        const data = res.data || {};
        if (data.templates && data.templates.length > 0) {
          common_vendor.index.showToast({ title: "功能开发中", icon: "none" });
        } else {
          common_vendor.index.showToast({ title: "暂无可下载模板", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/charity/HelpChannelList.vue:198", "下载模板失败:", error);
        common_vendor.index.showToast({ title: "下载失败，请重试", icon: "none" });
      } finally {
        downloading.value = false;
      }
    };
    const handleSearch = () => {
      fetchChannels();
    };
    const handleClear = () => {
      keyword.value = "";
      fetchChannels();
    };
    const handleFilterChange = () => {
      fetchChannels();
    };
    const handleFilterReset = () => {
      filterParams.value = {
        channelType: ""
      };
      fetchChannels();
    };
    common_vendor.onMounted(() => {
      fetchChannels();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch),
        b: common_vendor.o(handleClear),
        c: common_vendor.o(($event) => keyword.value = $event),
        d: common_vendor.p({
          placeholder: "搜索渠道名称",
          shape: "round",
          ["show-action"]: false,
          modelValue: keyword.value
        }),
        e: common_vendor.o(handleFilterChange),
        f: common_vendor.o(handleFilterReset),
        g: common_vendor.o(($event) => filterParams.value = $event),
        h: common_vendor.p({
          configs: channelConfigs,
          modelValue: filterParams.value
        }),
        i: loading.value
      }, loading.value ? {
        j: common_vendor.p({
          mode: "circle"
        })
      } : {
        k: common_vendor.f(channels.value, (item, k0, i0) => {
          return {
            a: "843668f8-5-" + i0 + "," + ("843668f8-4-" + i0),
            b: common_vendor.p({
              text: getChannelTypeLabel(item.channelType),
              type: getChannelTypeTag(item.channelType),
              size: "mini"
            }),
            c: item.id,
            d: common_vendor.o(($event) => contact(item), item.id),
            e: "843668f8-4-" + i0 + ",843668f8-3",
            f: common_vendor.p({
              title: item.name,
              label: item.applyCondition,
              ["is-link"]: true
            })
          };
        })
      }, {
        l: !loading.value && channels.value.length === 0
      }, !loading.value && channels.value.length === 0 ? {
        m: common_vendor.p({
          mode: "data",
          text: "暂无求助渠道"
        })
      } : {}, {
        n: common_vendor.o(downloadTemplate),
        o: common_vendor.p({
          type: "primary",
          loading: downloading.value
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-843668f8"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/HelpChannelList.js.map
