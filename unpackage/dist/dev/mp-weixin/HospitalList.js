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
  __name: "HospitalList",
  setup(__props) {
    const hospitalConfigs = [
      {
        key: "region",
        label: "地区",
        type: "region"
        // 特殊类型，内部会渲染 RegionPicker
      },
      {
        key: "level",
        label: "医院等级",
        type: "tags",
        options: [
          { label: "全部", value: "" },
          { label: "三级甲等", value: "1" },
          { label: "三级乙等", value: "2" },
          { label: "三级丙等", value: "3" },
          { label: "二级甲等", value: "4" },
          { label: "二级乙等", value: "5" },
          { label: "二级丙等", value: "6" },
          { label: "其他", value: "7" }
        ]
      }
    ];
    const levelMap = {
      "1": "三级甲等",
      "2": "三级乙等",
      "3": "三级丙等",
      "4": "二级甲等",
      "5": "二级乙等",
      "6": "二级丙等",
      "7": "其他"
    };
    const getLevelText = (level) => {
      return levelMap[String(level)] || "未知等级";
    };
    const keyword = common_vendor.ref("");
    const filterParams = common_vendor.ref({
      region: {},
      // RegionPicker 返回的对象 { provinceCode, ... }
      level: ""
      // 医院等级的值
    });
    const hospitals = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const loadStatus = common_vendor.ref("loadmore");
    const page = common_vendor.ref(1);
    const loadList = async (isRefresh = false) => {
      if (isRefresh) {
        page.value = 1;
        hospitals.value = [];
        loadStatus.value = "loading";
      }
      if (loadStatus.value === "nomore" && !isRefresh)
        return;
      loading.value = true;
      try {
        const queryParams = {
          page: page.value,
          pageSize: 10
        };
        if (keyword.value)
          queryParams.keyword = keyword.value;
        const region = filterParams.value.region || {};
        if (region.provinceCode)
          queryParams.provinceCode = region.provinceCode;
        if (region.cityCode)
          queryParams.cityCode = region.cityCode;
        if (region.districtCode)
          queryParams.districtCode = region.districtCode;
        if (filterParams.value.level)
          queryParams.level = filterParams.value.level;
        const res = await utils_request.request.get("/api/resource/medical/hospitals", queryParams);
        const apiData = res.data || {};
        const rawList = apiData.list || [];
        const processedList = rawList.map((item) => ({
          ...item,
          // 添加 levelName 字段，值为中文等级描述
          levelName: levelMap[String(item.level)] || "未知等级"
        }));
        hospitals.value.push(...processedList);
        if (processedList.length < 10) {
          loadStatus.value = "nomore";
        } else {
          loadStatus.value = "loadmore";
          page.value++;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/resource/medical/HospitalList.vue:175", "加载医院列表失败", e);
        loadStatus.value = "loadmore";
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const loadMore = () => loadList();
    const handleSearch = () => loadList(true);
    const handleClear = () => {
      keyword.value = "";
      loadList(true);
    };
    const handleFilterChange = () => {
      loadList(true);
    };
    const handleFilterReset = () => {
      filterParams.value = {
        region: {},
        level: ""
      };
      loadList(true);
    };
    const open = (item) => {
      common_vendor.index.navigateTo({ url: `/pages/resource/medical/HospitalDetail?id=${item.id}` });
    };
    const handleDownload = () => {
      common_vendor.index.showToast({ title: "下载功能开发中", icon: "none" });
    };
    common_vendor.onMounted(() => loadList());
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch),
        b: common_vendor.o(handleClear),
        c: common_vendor.o(($event) => keyword.value = $event),
        d: common_vendor.p({
          placeholder: "搜索医院名称",
          shape: "round",
          modelValue: keyword.value
        }),
        e: common_vendor.o(handleFilterChange),
        f: common_vendor.o(handleFilterReset),
        g: common_vendor.o(($event) => filterParams.value = $event),
        h: common_vendor.p({
          configs: hospitalConfigs,
          modelValue: filterParams.value
        }),
        i: common_vendor.f(hospitals.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: "2fb68c73-2-" + i0,
            c: common_vendor.p({
              text: item.levelName || getLevelText(item.level),
              type: "primary",
              size: "mini"
            }),
            d: "2fb68c73-3-" + i0,
            e: common_vendor.t(item.address),
            f: "2fb68c73-4-" + i0,
            g: common_vendor.t(item.phone || "暂无电话"),
            h: common_vendor.o(handleDownload, item.id),
            i: "2fb68c73-5-" + i0,
            j: item.id,
            k: common_vendor.o(($event) => open(item), item.id)
          };
        }),
        j: common_vendor.p({
          name: "map",
          size: "14",
          color: "#9ca3af"
        }),
        k: common_vendor.p({
          name: "phone",
          size: "14",
          color: "#9ca3af"
        }),
        l: common_vendor.p({
          size: "mini",
          type: "primary",
          plain: true
        }),
        m: common_vendor.o(loadMore),
        n: common_vendor.p({
          status: loadStatus.value
        }),
        o: !loading.value && hospitals.value.length === 0
      }, !loading.value && hospitals.value.length === 0 ? {
        p: common_vendor.p({
          mode: "data",
          text: "暂无医院数据"
        })
      } : {}, {
        q: common_vendor.o(loadMore)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2fb68c73"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/HospitalList.js.map
