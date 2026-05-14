"use strict";
const common_vendor = require("./common/vendor.js");
const utils_request = require("./utils/request.js");
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_loadmore2 = common_vendor.resolveComponent("u-loadmore");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  (_easycom_u_search2 + _easycom_u_loading_icon2 + _easycom_u_tag2 + _easycom_u_icon2 + _easycom_u_button2 + _easycom_u_loadmore2 + _easycom_u_empty2)();
}
const _easycom_u_search = () => "./node-modules/uview-plus/components/u-search/u-search.js";
const _easycom_u_loading_icon = () => "./node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_tag = () => "./node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_icon = () => "./node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_button = () => "./node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_loadmore = () => "./node-modules/uview-plus/components/u-loadmore/u-loadmore.js";
const _easycom_u_empty = () => "./node-modules/uview-plus/components/u-empty/u-empty.js";
if (!Math) {
  (_easycom_u_search + SmartFilterBar + _easycom_u_loading_icon + _easycom_u_tag + _easycom_u_icon + _easycom_u_button + _easycom_u_loadmore + _easycom_u_empty)();
}
const SmartFilterBar = () => "./components/filter/SmartFilterBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "PsychologicalOrgList",
  setup(__props) {
    const keyword = common_vendor.ref("");
    const organizations = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const loadStatus = common_vendor.ref("loadmore");
    const page = common_vendor.ref(1);
    const pageSize = common_vendor.ref(10);
    const filterParams = common_vendor.ref({
      region: {},
      // 地区对象 { provinceCode, ... }
      isFree: "",
      // 是否免费: ''(全部), 'true', 'false'
      consultWay: ""
      // 咨询方式: ''(全部), 'online', 'offline', 'phone'
    });
    const orgConfigs = [
      {
        key: "region",
        label: "地区",
        type: "region"
        // 使用 RegionPicker
      },
      {
        key: "isFree",
        label: "费用",
        type: "tags",
        options: [
          { label: "全部", value: "" },
          { label: "免费", value: "true" },
          { label: "收费", value: "false" }
        ]
      },
      {
        key: "consultWay",
        label: "咨询方式",
        type: "tags",
        options: [
          { label: "全部", value: "" },
          { label: "线上", value: "online" },
          { label: "线下", value: "offline" },
          { label: "线下&线下", value: "both" }
        ]
      }
    ];
    const fetchOrganizations = async (isRefresh = false) => {
      if (isRefresh) {
        page.value = 1;
        organizations.value = [];
        loadStatus.value = "loading";
      }
      if (loadStatus.value === "nomore" && !isRefresh)
        return;
      loading.value = true;
      try {
        const params = {
          page: page.value,
          pageSize: pageSize.value
        };
        if (keyword.value)
          params.keyword = keyword.value;
        const regionData = filterParams.value.region || {};
        if (regionData.provinceCode)
          params.provinceCode = regionData.provinceCode;
        if (regionData.cityCode)
          params.cityCode = regionData.cityCode;
        if (regionData.districtCode)
          params.districtCode = regionData.districtCode;
        if (filterParams.value.isFree) {
          params.isFree = filterParams.value.isFree;
        }
        if (filterParams.value.consultWay) {
          params.consultWay = filterParams.value.consultWay;
        }
        const res = await utils_request.request.get("/api/resource/rehab/psychological/orgs", params);
        const responseData = res.data || {};
        const list = responseData.list || [];
        organizations.value.push(...list);
        if (list.length < pageSize.value) {
          loadStatus.value = "nomore";
        } else {
          loadStatus.value = "loadmore";
          page.value++;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/rehab/PsychologicalOrgList.vue:224", "获取机构列表失败:", error);
        loadStatus.value = "loadmore";
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const loadMore = () => fetchOrganizations();
    const handleSearch = () => fetchOrganizations(true);
    const handleClear = () => {
      keyword.value = "";
      fetchOrganizations(true);
    };
    const handleFilterChange = () => {
      fetchOrganizations(true);
    };
    const handleFilterReset = () => {
      filterParams.value = {
        region: {},
        isFree: "",
        consultWay: ""
      };
      fetchOrganizations(true);
    };
    const openDetail = (item) => {
      if (!(item == null ? void 0 : item.id))
        return;
      common_vendor.index.navigateTo({
        url: `/pages/resource/rehab/PsychologicalOrgDetail?id=${item.id}`
      });
    };
    const contactOrg = (item) => {
      if (item.phone) {
        common_vendor.index.makePhoneCall({ phoneNumber: item.phone });
      } else if (item.contact) {
        common_vendor.index.setClipboardData({
          data: item.contact,
          success: () => common_vendor.index.showToast({ title: "联系方式已复制", icon: "success" })
        });
      } else {
        common_vendor.index.showToast({ title: "暂无联系方式", icon: "none" });
      }
    };
    common_vendor.onMounted(() => {
      fetchOrganizations();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch),
        b: common_vendor.o(handleClear),
        c: common_vendor.o(($event) => keyword.value = $event),
        d: common_vendor.p({
          placeholder: "搜索心理机构名称",
          shape: "round",
          ["show-action"]: false,
          modelValue: keyword.value
        }),
        e: common_vendor.o(handleFilterChange),
        f: common_vendor.o(handleFilterReset),
        g: common_vendor.o(($event) => filterParams.value = $event),
        h: common_vendor.p({
          configs: orgConfigs,
          modelValue: filterParams.value
        }),
        i: loading.value && organizations.value.length === 0
      }, loading.value && organizations.value.length === 0 ? {
        j: common_vendor.p({
          mode: "circle"
        })
      } : {}, {
        k: common_vendor.f(organizations.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.name),
            b: item.isFree
          }, item.isFree ? {
            c: "3d9377bf-3-" + i0,
            d: common_vendor.p({
              text: "免费",
              type: "success",
              size: "mini",
              plain: true
            })
          } : {
            e: "3d9377bf-4-" + i0,
            f: common_vendor.p({
              text: item.typeName || "机构",
              type: "primary",
              size: "mini",
              plain: true
            })
          }, {
            g: "3d9377bf-5-" + i0,
            h: common_vendor.t(item.regionName || item.region),
            i: common_vendor.t(item.address),
            j: item.contact
          }, item.contact ? {
            k: "3d9377bf-6-" + i0,
            l: common_vendor.p({
              name: "phone",
              size: "14",
              color: "#9ca3af"
            }),
            m: common_vendor.t(item.contact)
          } : {}, {
            n: item.serviceTime
          }, item.serviceTime ? {
            o: "3d9377bf-7-" + i0,
            p: common_vendor.p({
              name: "clock",
              size: "14",
              color: "#9ca3af"
            }),
            q: common_vendor.t(item.serviceTime)
          } : {}, {
            r: item.description
          }, item.description ? {
            s: common_vendor.t(item.description)
          } : {}, {
            t: common_vendor.o(($event) => contactOrg(item), item.id),
            v: "3d9377bf-8-" + i0,
            w: item.id,
            x: common_vendor.o(($event) => openDetail(item), item.id)
          });
        }),
        l: common_vendor.p({
          name: "map",
          size: "14",
          color: "#9ca3af"
        }),
        m: common_vendor.p({
          size: "mini",
          type: "primary",
          plain: true
        }),
        n: common_vendor.o(loadMore),
        o: common_vendor.p({
          status: loadStatus.value
        }),
        p: !loading.value && organizations.value.length === 0
      }, !loading.value && organizations.value.length === 0 ? {
        q: common_vendor.p({
          mode: "data",
          text: "暂无心理咨询机构"
        })
      } : {}, {
        r: common_vendor.o(loadMore)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3d9377bf"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/PsychologicalOrgList.js.map
