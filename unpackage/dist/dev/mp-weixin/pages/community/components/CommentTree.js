"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _component_CommentTree = common_vendor.resolveComponent("CommentTree");
  (_easycom_u_icon2 + _component_CommentTree)();
}
const _easycom_u_icon = () => "../../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  _easycom_u_icon();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "CommentTree",
  props: {
    comments: {}
  },
  emits: ["set-reply-target", "load-more-replies"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const setReplyTarget = (comment) => {
      emit("set-reply-target", {
        parentId: comment.id,
        targetUser: comment.user_name || comment.display_name
      });
    };
    const loadMoreReplies = (rootId) => {
      emit("load-more-replies", {
        rootId
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(_ctx.comments, (comment, k0, i0) => {
          return common_vendor.e({
            a: "562bce3a-0-" + i0,
            b: common_vendor.t(comment.user_name || comment.display_name || "匿名用户"),
            c: common_vendor.t(comment.created_at),
            d: common_vendor.t(comment.content),
            e: common_vendor.o(($event) => setReplyTarget(comment), comment.id),
            f: comment.replies && comment.replies.length > 0
          }, comment.replies && comment.replies.length > 0 ? common_vendor.e({
            g: common_vendor.o(($event) => _ctx.$emit("set-reply-target", $event), comment.id),
            h: common_vendor.o(($event) => _ctx.$emit("load-more-replies", $event), comment.id),
            i: "562bce3a-1-" + i0,
            j: common_vendor.p({
              comments: comment.replies
            }),
            k: comment.has_more_replies
          }, comment.has_more_replies ? {
            l: common_vendor.o(($event) => loadMoreReplies(comment.id), comment.id)
          } : {}) : {}, {
            m: comment.id
          });
        }),
        b: common_vendor.p({
          name: "account",
          size: "16",
          color: "#999"
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-562bce3a"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/community/components/CommentTree.js.map
