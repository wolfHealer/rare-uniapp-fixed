"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
if (!Array) {
  const _easycom_u_loadmore2 = common_vendor.resolveComponent("u-loadmore");
  _easycom_u_loadmore2();
}
const _easycom_u_loadmore = () => "../../../node-modules/uview-plus/components/u-loadmore/u-loadmore.js";
if (!Math) {
  (PostCard + _easycom_u_loadmore)();
}
const PostCard = () => "./PostCard.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "PostList",
  props: {
    diseaseId: {},
    type: {},
    sort: {}
  },
  emits: ["comment", "preview-image"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const list = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const finished = common_vendor.ref(false);
    const loadStatus = common_vendor.ref("loadmore");
    let page = 1;
    let lastRequestId = 0;
    const fetchPosts = async (isRefresh = false) => {
      const currentRequestId = ++lastRequestId;
      if (isRefresh) {
        page = 1;
        list.value = [];
        finished.value = false;
        loadStatus.value = "loading";
      }
      if (finished.value && !isRefresh)
        return;
      if (loading.value)
        return;
      loading.value = true;
      try {
        const res = await utils_request.request.get(
          "/api/community/posts",
          {
            disease_id: props.diseaseId,
            type: props.type === "all" ? void 0 : props.type,
            sort: props.sort,
            page,
            limit: 10
          }
        );
        if (currentRequestId !== lastRequestId) {
          return;
        }
        const records = res.data.records || [];
        if (isRefresh) {
          list.value = records;
        } else {
          list.value.push(...records);
        }
        if (records.length < 10) {
          finished.value = true;
          loadStatus.value = "nomore";
        } else {
          loadStatus.value = "loadmore";
          page++;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/community/components/PostList.vue:91", "获取动态失败:", error);
        if (currentRequestId === lastRequestId) {
          loadStatus.value = "loadmore";
        }
      } finally {
        if (currentRequestId === lastRequestId) {
          loading.value = false;
        }
      }
    };
    const resetAndReload = () => {
      lastRequestId++;
      fetchPosts(true);
    };
    const onLoadMore = () => {
      if (!finished.value && !loading.value) {
        fetchPosts();
      }
    };
    const onComment = (data) => {
      emit("comment", data);
    };
    const onPreviewImage = (url) => {
      emit("preview-image", url);
    };
    common_vendor.watch(
      () => [props.diseaseId, props.type, props.sort],
      () => {
        resetAndReload();
      },
      { deep: true }
    );
    common_vendor.onMounted(() => {
      fetchPosts();
    });
    __expose({
      refresh: () => {
        resetAndReload();
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(list.value, (item, k0, i0) => {
          return {
            a: item.id,
            b: common_vendor.o(onComment, item.id),
            c: common_vendor.o(onPreviewImage, item.id),
            d: "cf0b3624-0-" + i0,
            e: common_vendor.p({
              post: item
            })
          };
        }),
        b: common_vendor.o(onLoadMore),
        c: common_vendor.p({
          status: loadStatus.value,
          ["loading-text"]: "加载中...",
          ["loadmore-text"]: "上拉加载更多",
          ["nomore-text"]: "没有更多了"
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cf0b3624"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/community/components/PostList.js.map
