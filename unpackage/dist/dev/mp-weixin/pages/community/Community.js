"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_modules_user = require("../../stores/modules/user.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (SmartFilterBar + PostList + _easycom_u_icon)();
}
const PostList = () => "./components/PostList.js";
const SmartFilterBar = () => "../../components/filter/SmartFilterBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Community",
  setup(__props) {
    const userStore = stores_modules_user.useUserStore();
    const postListRef = common_vendor.ref(null);
    const refreshing = common_vendor.ref(false);
    const categoryId = common_vendor.ref(null);
    const diseaseId = common_vendor.ref(null);
    const type = common_vendor.ref("all");
    const sort = common_vendor.ref("latest");
    const filterParams = common_vendor.ref({
      disease: {},
      postType: "all",
      sortOrder: "latest"
    });
    const typeOptions = [
      { label: "全部类型", value: "all" },
      { label: "求助", value: "help" },
      { label: "经验", value: "experience" },
      { label: "情绪", value: "emotion" }
    ];
    const sortOptions = [
      { label: "最新", value: "latest" },
      { label: "热门", value: "hot" }
    ];
    const communityConfigs = [
      {
        key: "disease",
        label: "疾病",
        type: "disease"
      },
      {
        key: "postType",
        label: "类型",
        type: "tags",
        options: typeOptions
      },
      {
        key: "sortOrder",
        label: "排序",
        type: "tags",
        options: sortOptions
      }
    ];
    common_vendor.watch(
      () => filterParams.value,
      (newVal) => {
        const diseaseVal = newVal.disease || {};
        diseaseId.value = diseaseVal.diseaseId ? Number(diseaseVal.diseaseId) : null;
        if (newVal.postType) {
          type.value = newVal.postType;
        }
        if (newVal.sortOrder) {
          sort.value = newVal.sortOrder;
        }
      },
      { deep: true }
    );
    const handleFilterChange = () => {
    };
    const handleFilterReset = () => {
    };
    const handleComment = async (data) => {
      common_vendor.index.__f__("log", "at pages/community/Community.vue:143", "接收到评论事件:", data);
      if (data.newComment) {
        common_vendor.index.showToast({
          title: "评论成功",
          icon: "success"
        });
      }
    };
    const onRefresh = async () => {
      refreshing.value = true;
      if (postListRef.value) {
        await postListRef.value.refresh();
      }
      refreshing.value = false;
      common_vendor.index.stopPullDownRefresh();
    };
    common_vendor.onPullDownRefresh(() => {
      onRefresh();
    });
    const goToPost = () => {
      if (!userStore.token) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        setTimeout(() => {
          common_vendor.index.navigateTo({ url: "/pages/user/login/Login" });
        }, 1500);
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/community/PostEdit"
      });
    };
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleFilterChange),
        b: common_vendor.o(handleFilterReset),
        c: common_vendor.o(($event) => filterParams.value = $event),
        d: common_vendor.p({
          configs: communityConfigs,
          modelValue: filterParams.value
        }),
        e: common_vendor.sr(postListRef, "d14a54c0-1", {
          "k": "postListRef"
        }),
        f: common_vendor.o(handleComment),
        g: common_vendor.p({
          ["category-id"]: categoryId.value,
          ["disease-id"]: diseaseId.value,
          type: type.value,
          sort: sort.value
        }),
        h: refreshing.value,
        i: common_vendor.o(onRefresh),
        j: common_vendor.p({
          name: "plus",
          color: "#fff",
          size: "24"
        }),
        k: common_vendor.o(goToPost)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d14a54c0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/community/Community.js.map
