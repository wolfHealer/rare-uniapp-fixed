"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
if (!Array) {
  const _easycom_u_avatar2 = common_vendor.resolveComponent("u-avatar");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  (_easycom_u_avatar2 + _easycom_u_icon2)();
}
const _easycom_u_avatar = () => "../../../node-modules/uview-plus/components/u-avatar/u-avatar.js";
const _easycom_u_icon = () => "../../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (_easycom_u_avatar + _easycom_u_icon)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "PostCard",
  props: {
    post: {}
  },
  emits: ["refresh"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const truncatedContent = common_vendor.computed(() => {
      const content = props.post.content || "";
      return content.length > 100 ? content.substring(0, 100) + "..." : content;
    });
    const goToDetail = () => {
      common_vendor.index.navigateTo({
        url: `/pages/community/PostDetail?id=${props.post.id}`
      });
    };
    const previewImage = (url) => {
      common_vendor.index.previewImage({ urls: [url] });
    };
    const handleLike = async () => {
      try {
        const originalState2 = {
          liked: props.post.is_liked,
          count: props.post.like_count
        };
        props.post.is_liked = !props.post.is_liked;
        props.post.like_count += props.post.is_liked ? 1 : -1;
        await utils_request.request.post(`/api/community/posts/${props.post.id}/like`);
      } catch (error) {
        props.post.is_liked = !props.post.is_liked;
        props.post.like_count = originalState.count;
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      }
    };
    const handleCollect = async () => {
      try {
        const originalState2 = {
          collected: props.post.is_collected,
          count: props.post.collect_count
        };
        props.post.is_collected = !props.post.is_collected;
        props.post.collect_count += props.post.is_collected ? 1 : -1;
        await utils_request.request.post(`/api/community/posts/${props.post.id}/collect`);
      } catch (error) {
        props.post.is_collected = !props.post.is_collected;
        props.post.collect_count = originalState.count;
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          src: _ctx.post.avatar || "/static/default-avatar.png",
          size: "60"
        }),
        b: common_vendor.t(_ctx.post.display_name || "匿名病友"),
        c: common_vendor.t(_ctx.post.created_at),
        d: _ctx.post.title
      }, _ctx.post.title ? {
        e: common_vendor.t(_ctx.post.title)
      } : {}, {
        f: common_vendor.t(truncatedContent.value),
        g: _ctx.post.images && _ctx.post.images.length
      }, _ctx.post.images && _ctx.post.images.length ? {
        h: common_vendor.f(_ctx.post.images.slice(0, 3), (img, index, i0) => {
          return {
            a: index,
            b: img,
            c: common_vendor.o(($event) => previewImage(img), index)
          };
        })
      } : {}, {
        i: common_vendor.p({
          name: _ctx.post.is_liked ? "heart-fill" : "heart",
          color: _ctx.post.is_liked ? "#ff4d4f" : "#909399",
          size: "18"
        }),
        j: common_vendor.t(_ctx.post.like_count || 0),
        k: common_vendor.o(handleLike),
        l: common_vendor.p({
          name: _ctx.post.is_collected ? "star-fill" : "star",
          color: _ctx.post.is_collected ? "#ff9900" : "#909399",
          size: "18"
        }),
        m: common_vendor.t(_ctx.post.collect_count || 0),
        n: common_vendor.o(handleCollect),
        o: common_vendor.p({
          name: "chat",
          color: "#909399",
          size: "18"
        }),
        p: common_vendor.t(_ctx.post.comment_count || 0),
        q: common_vendor.o(goToDetail),
        r: common_vendor.o(() => {
        }),
        s: common_vendor.o(goToDetail)
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-523a7d94"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/community/components/PostCard.js.map
