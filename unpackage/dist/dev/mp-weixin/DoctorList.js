"use strict";
const common_vendor = require("./common/vendor.js");
const utils_request = require("./utils/request.js");
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  (_easycom_u_search2 + _easycom_u_icon2 + _easycom_u_button2 + _easycom_u_tag2 + _easycom_u_empty2 + _easycom_u_loading_icon2)();
}
const _easycom_u_search = () => "./node-modules/uview-plus/components/u-search/u-search.js";
const _easycom_u_icon = () => "./node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_button = () => "./node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_tag = () => "./node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_empty = () => "./node-modules/uview-plus/components/u-empty/u-empty.js";
const _easycom_u_loading_icon = () => "./node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
if (!Math) {
  (_easycom_u_search + SmartFilterBar + _easycom_u_icon + _easycom_u_button + _easycom_u_tag + _easycom_u_empty + _easycom_u_loading_icon)();
}
const SmartFilterBar = () => "./components/filter/SmartFilterBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "DoctorList",
  setup(__props) {
    const keyword = common_vendor.ref("");
    const list = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const total = common_vendor.ref(0);
    const page = common_vendor.ref(1);
    const pageSize = common_vendor.ref(20);
    const filterParams = common_vendor.ref({
      disease: {},
      // 疾病对象 { diseaseId, diseaseName }
      hospital: {},
      // 医院对象 { hospitalId, hospitalName }
      title: ""
      // 医生职称/等级
    });
    const doctorConfigs = [
      {
        key: "disease",
        label: "疾病",
        type: "disease"
        // 使用 DiseasePicker 组件
      },
      {
        key: "hospital",
        label: "医院",
        type: "hospital"
      },
      {
        key: "title",
        label: "职称",
        type: "tags",
        options: [
          { label: "全部", value: "" },
          { label: "主任医师", value: "主任医师" },
          { label: "副主任医师", value: "副主任医师" },
          { label: "主治医师", value: "主治医师" },
          { label: "住院医师", value: "住院医师" }
        ]
      }
    ];
    const loadList = async (isRefresh = false) => {
      if (isRefresh) {
        page.value = 1;
        list.value = [];
        loading.value = true;
      }
      try {
        const queryParams = {
          keyword: keyword.value,
          page: page.value,
          pageSize: pageSize.value
        };
        const diseaseVal = filterParams.value.disease || {};
        if (diseaseVal.diseaseId) {
          queryParams.diseaseId = diseaseVal.diseaseId;
        }
        const hospital = filterParams.value.hospital || {};
        if (hospital.hospitalId) {
          queryParams.hospitalId = hospital.hospitalId;
        }
        if (filterParams.value.title) {
          queryParams.title = filterParams.value.title;
        }
        const res = await utils_request.request.get("/api/resource/medical/doctors", queryParams);
        const apiData = res.data || {};
        const newList = apiData.list || [];
        const newTotal = apiData.total || 0;
        if (isRefresh) {
          list.value = newList;
        } else {
          list.value = [...list.value, ...newList];
        }
        total.value = newTotal;
        if (newList.length < pageSize.value) {
        } else {
          page.value++;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/medical/DoctorList.vue:226", "加载名录数据失败:", error);
        common_vendor.index.showToast({ title: "网络错误", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const loadMore = () => {
      if (!loading.value)
        loadList();
    };
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
        disease: {},
        hospital: {},
        title: ""
      };
      loadList(true);
    };
    const open = (item) => {
      const path = `/pages/resource/medical/DoctorDetail?id=${item.id}`;
      common_vendor.index.navigateTo({
        url: path,
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/resource/medical/DoctorList.vue:267", "跳转详情失败:", err);
          common_vendor.index.showToast({ title: "页面跳转失败", icon: "none" });
        }
      });
    };
    const handleDownload = () => {
      const url = "/api/resource/medical/directory/export/doctors";
      const params = new URLSearchParams();
      if (keyword.value)
        params.append("keyword", keyword.value);
      const diseaseVal = filterParams.value.disease || {};
      if (diseaseVal.diseaseId)
        params.append("diseaseId", String(diseaseVal.diseaseId));
      const hospital = filterParams.value.hospital || {};
      if (hospital.hospitalId)
        params.append("hospitalId", String(hospital.hospitalId));
      if (filterParams.value.title)
        params.append("title", filterParams.value.title);
      const fullUrl = `${url}?${params.toString()}`;
      common_vendor.index.showLoading({ title: "下载中..." });
      common_vendor.index.downloadFile({
        url: fullUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            common_vendor.index.saveFile({
              tempFilePath: res.tempFilePath,
              success: (saveRes) => {
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({ title: "下载成功", icon: "none" });
              },
              fail: () => {
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({ title: "保存失败", icon: "none" });
              }
            });
          } else {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({ title: "下载失败", icon: "none" });
          }
        },
        fail: () => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "网络错误", icon: "none" });
        }
      });
    };
    common_vendor.onMounted(() => {
      loadList();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch),
        b: common_vendor.o(handleClear),
        c: common_vendor.o(($event) => keyword.value = $event),
        d: common_vendor.p({
          placeholder: "搜索医生姓名或医院",
          shape: "round",
          clearable: true,
          modelValue: keyword.value
        }),
        e: common_vendor.o(handleFilterChange),
        f: common_vendor.o(handleFilterReset),
        g: common_vendor.o(($event) => filterParams.value = $event),
        h: common_vendor.p({
          configs: doctorConfigs,
          modelValue: filterParams.value
        }),
        i: common_vendor.p({
          name: "download",
          size: "14"
        }),
        j: common_vendor.o(($event) => handleDownload()),
        k: common_vendor.p({
          size: "mini",
          type: "primary"
        }),
        l: common_vendor.p({
          name: "download",
          size: "14"
        }),
        m: common_vendor.o(($event) => handleDownload()),
        n: common_vendor.p({
          size: "mini",
          plain: true
        }),
        o: common_vendor.f(list.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.name),
            b: item.hospital
          }, item.hospital ? {
            c: common_vendor.t(item.hospital)
          } : {}, {
            d: item.department
          }, item.department ? {} : {}, {
            e: item.department
          }, item.department ? {
            f: common_vendor.t(item.department)
          } : {}, {
            g: item.title
          }, item.title ? {} : {}, {
            h: item.title
          }, item.title ? {
            i: common_vendor.t(item.title)
          } : {}, {
            j: common_vendor.t(item.goodAt),
            k: item.isRareNetwork
          }, item.isRareNetwork ? {
            l: "aa73a30e-6-" + i0,
            m: common_vendor.p({
              type: "success",
              size: "mini"
            })
          } : {}, {
            n: "aa73a30e-7-" + i0,
            o: item.rating
          }, item.rating ? {
            p: "aa73a30e-8-" + i0,
            q: common_vendor.p({
              name: "star-fill",
              color: "#ff976a",
              size: "12"
            }),
            r: common_vendor.t(item.rating),
            s: common_vendor.t(item.reviewCount)
          } : {}, {
            t: item.id,
            v: common_vendor.o(($event) => open(item), item.id)
          });
        }),
        p: common_vendor.p({
          type: "primary",
          size: "mini"
        }),
        q: !loading.value && list.value.length === 0
      }, !loading.value && list.value.length === 0 ? {
        r: common_vendor.p({
          text: "暂无医生数据"
        })
      } : {}, {
        s: loading.value
      }, loading.value ? {
        t: common_vendor.p({
          mode: "circle"
        })
      } : {}, {
        v: total.value > 0
      }, total.value > 0 ? {
        w: common_vendor.t(total.value)
      } : {}, {
        x: common_vendor.o(loadMore)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-aa73a30e"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/DoctorList.js.map
