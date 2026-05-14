"use strict";
const common_vendor = require("./common/vendor.js");
const utils_request = require("./utils/request.js");
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_loadmore2 = common_vendor.resolveComponent("u-loadmore");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  (_easycom_u_search2 + _easycom_u_tag2 + _easycom_u_icon2 + _easycom_u_button2 + _easycom_u_loadmore2 + _easycom_u_empty2)();
}
const _easycom_u_search = () => "./node-modules/uview-plus/components/u-search/u-search.js";
const _easycom_u_tag = () => "./node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_icon = () => "./node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_button = () => "./node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_loadmore = () => "./node-modules/uview-plus/components/u-loadmore/u-loadmore.js";
const _easycom_u_empty = () => "./node-modules/uview-plus/components/u-empty/u-empty.js";
if (!Math) {
  (_easycom_u_search + SmartFilterBar + _easycom_u_tag + _easycom_u_icon + _easycom_u_button + _easycom_u_loadmore + _easycom_u_empty)();
}
const SmartFilterBar = () => "./components/filter/SmartFilterBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "ChannelList",
  setup(__props) {
    const keyword = common_vendor.ref("");
    const channels = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const loadStatus = common_vendor.ref("loadmore");
    const page = common_vendor.ref(1);
    const filterParams = common_vendor.ref({
      region: {},
      delivery: "",
      channel_type: ""
      // 确保这里有初始值
    });
    const channelConfigs = [
      {
        key: "region",
        label: "地区",
        type: "region"
      },
      {
        key: "delivery",
        label: "配送",
        type: "tags",
        options: [
          { label: "全部", value: "" },
          { label: "仅门店自提", value: "pickup" },
          { label: "全国快递", value: "delivery" },
          { label: "同城配送", value: "local" }
        ]
      },
      {
        key: "channel_type",
        label: "渠道类型",
        type: "tags",
        options: [
          { label: "全部", value: "" },
          { label: "医院药房", value: "hospital_pharmacy" },
          { label: "连锁药店", value: "retail_pharmacy" },
          { label: "医药电商", value: "e_pharmacy" },
          { label: "合规代购/协助渠道", value: "compliant_agent" }
        ]
      }
    ];
    const getChannelTypeText = (type) => {
      const map = {
        "hospital_pharmacy": "医院药房",
        "retail_pharmacy": "连锁药店",
        "e_pharmacy": "医药电商",
        "compliant_agent": "合规代购"
      };
      return map[type] || "其他渠道";
    };
    const getFullAddress = (item) => {
      const parts = [item.provinceName, item.cityName, item.districtName, item.address].filter(Boolean);
      return parts.join("") || "地址不详";
    };
    const fetchChannels = async (isRefresh = false) => {
      var _a;
      if (isRefresh) {
        page.value = 1;
        channels.value = [];
        loadStatus.value = "loading";
      }
      if (loadStatus.value === "nomore" && !isRefresh)
        return;
      loading.value = true;
      try {
        const params = {
          page: page.value,
          pageSize: 10
        };
        if (keyword.value) {
          params.keyword = keyword.value;
        }
        const regionData = filterParams.value.region || {};
        if (regionData.provinceCode)
          params.provinceCode = regionData.provinceCode;
        if (regionData.cityCode)
          params.cityCode = regionData.cityCode;
        if (regionData.districtCode)
          params.districtCode = regionData.districtCode;
        if (filterParams.value.delivery) {
          params.deliveryScope = filterParams.value.delivery;
        }
        if (filterParams.value.channel_type) {
          params.channelType = filterParams.value.channel_type;
        }
        const res = await utils_request.request.get("/api/resource/drug/channels", params);
        const list = ((_a = res.data) == null ? void 0 : _a.list) || [];
        channels.value.push(...list);
        if (list.length < 10) {
          loadStatus.value = "nomore";
        } else {
          loadStatus.value = "loadmore";
          page.value++;
        }
      } catch (e) {
        loadStatus.value = "loadmore";
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const loadMore = () => fetchChannels();
    const handleSearch = () => fetchChannels(true);
    const handleClear = () => {
      keyword.value = "";
      fetchChannels(true);
    };
    const handleFilterChange = () => {
      fetchChannels(true);
    };
    const handleFilterReset = () => {
      filterParams.value = {
        region: {},
        delivery: "",
        channel_type: ""
      };
      fetchChannels(true);
    };
    const contact = (item) => {
      common_vendor.index.navigateTo({ url: `/pages/resource/drug/ChannelDetail?id=${item.id}` });
    };
    const copyInfo = (item) => {
      const text = `${item.name}
${getFullAddress(item)}
电话: ${item.contactPhone || "暂无"}`;
      common_vendor.index.setClipboardData({
        data: text,
        success: () => common_vendor.index.showToast({ title: "已复制", icon: "success" })
      });
    };
    const openUrl = (item) => {
      if (!item.contactUrl)
        return;
      common_vendor.index.setClipboardData({
        data: item.contactUrl,
        success: () => common_vendor.index.showToast({ title: "链接已复制", icon: "success" })
      });
    };
    common_vendor.onMounted(() => fetchChannels());
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch),
        b: common_vendor.o(handleClear),
        c: common_vendor.o(($event) => keyword.value = $event),
        d: common_vendor.p({
          placeholder: "搜索药店或渠道名称",
          shape: "round",
          modelValue: keyword.value
        }),
        e: common_vendor.o(handleFilterChange),
        f: common_vendor.o(handleFilterReset),
        g: common_vendor.o(($event) => filterParams.value = $event),
        h: common_vendor.p({
          configs: channelConfigs,
          modelValue: filterParams.value
        }),
        i: common_vendor.f(channels.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.name),
            b: "8ad9c37b-2-" + i0,
            c: common_vendor.p({
              text: getChannelTypeText(item.channelType),
              type: "primary",
              size: "mini"
            }),
            d: "8ad9c37b-3-" + i0,
            e: common_vendor.t(getFullAddress(item)),
            f: common_vendor.t(item.deliveryScope),
            g: common_vendor.t(item.deliveryCycle),
            h: item.isInsuranceSettle
          }, item.isInsuranceSettle ? {
            i: "8ad9c37b-4-" + i0,
            j: common_vendor.p({
              text: "医保",
              type: "success",
              size: "mini",
              customStyle: "margin-left: 4px;"
            })
          } : {}, {
            k: common_vendor.o(($event) => copyInfo(item), item.id),
            l: "8ad9c37b-5-" + i0,
            m: item.contactUrl
          }, item.contactUrl ? {
            n: common_vendor.o(($event) => openUrl(item), item.id),
            o: "8ad9c37b-6-" + i0,
            p: common_vendor.p({
              size: "mini",
              type: "success",
              plain: true
            })
          } : {}, {
            q: common_vendor.o(() => {
            }, item.id),
            r: item.id,
            s: common_vendor.o(($event) => contact(item), item.id)
          });
        }),
        j: common_vendor.p({
          name: "map",
          size: "14",
          color: "#9ca3af"
        }),
        k: common_vendor.p({
          size: "mini",
          type: "primary",
          plain: true
        }),
        l: common_vendor.o(loadMore),
        m: common_vendor.p({
          status: loadStatus.value
        }),
        n: !loading.value && channels.value.length === 0
      }, !loading.value && channels.value.length === 0 ? {
        o: common_vendor.p({
          mode: "data",
          text: "暂无购药渠道"
        })
      } : {}, {
        p: common_vendor.o(loadMore)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8ad9c37b"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/ChannelList.js.map
