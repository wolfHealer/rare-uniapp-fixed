"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const stores_modules_user = require("../../stores/modules/user.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_navbar2 = common_vendor.resolveComponent("u-navbar");
  const _easycom_u_avatar2 = common_vendor.resolveComponent("u-avatar");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  (_easycom_u_icon2 + _easycom_u_navbar2 + _easycom_u_avatar2 + _easycom_u_loading_icon2 + _easycom_u_button2 + _easycom_u_popup2)();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_navbar = () => "../../node-modules/uview-plus/components/u-navbar/u-navbar.js";
const _easycom_u_avatar = () => "../../node-modules/uview-plus/components/u-avatar/u-avatar.js";
const _easycom_u_loading_icon = () => "../../node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_button = () => "../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_popup = () => "../../node-modules/uview-plus/components/u-popup/u-popup.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_navbar + _easycom_u_avatar + CommentTree + _easycom_u_loading_icon + _easycom_u_button + _easycom_u_popup)();
}
const CommentTree = () => "./components/CommentTree.js";
const rootSize = 10;
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "PostDetail",
  setup(__props) {
    const userStore = stores_modules_user.useUserStore();
    const postId = common_vendor.ref(0);
    const post = common_vendor.ref({});
    const commentList = common_vendor.ref([]);
    const showCommentPopup = common_vendor.ref(false);
    const newComment = common_vendor.ref("");
    const replyTarget = common_vendor.ref(null);
    const rootPage = common_vendor.ref(1);
    const hasMoreRootComments = common_vendor.ref(false);
    common_vendor.onLoad((options) => {
      if (options && options.id) {
        postId.value = Number(options.id);
        fetchDetail();
      }
    });
    const fetchDetail = async () => {
      try {
        const res = await utils_request.request.get(`/api/community/posts/${postId.value}`);
        const postData = res.data || res;
        post.value = postData;
        if (!post.value.is_liked)
          post.value.is_liked = false;
        if (post.value.is_favorited === void 0)
          post.value.is_favorited = false;
        if (!post.value.like_count)
          post.value.like_count = 0;
        if (!post.value.favorite_count)
          post.value.favorite_count = 0;
        if (!post.value.comment_count)
          post.value.comment_count = 0;
        rootPage.value = 1;
        commentList.value = [];
        fetchComments(true);
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/community/PostDetail.vue:188", e);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      }
    };
    const buildQueryString = (params) => {
      const parts = [];
      for (const key in params) {
        if (params[key] !== void 0 && params[key] !== null) {
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
        }
      }
      return parts.join("&");
    };
    const fetchComments = async (isRefresh = false) => {
      try {
        if (isRefresh) {
          rootPage.value = 1;
          commentList.value = [];
        }
        const params = {
          target_type: "post",
          target_id: postId.value,
          page: rootPage.value,
          size: rootSize,
          reply_limit: 3
        };
        const queryString = buildQueryString(params);
        const url = `/api/community/comments/tree?${queryString}`;
        const res = await utils_request.request.get(url);
        const data = res.data || res;
        const newList = data.list || [];
        if (isRefresh) {
          commentList.value = newList;
        } else {
          commentList.value = [...commentList.value, ...newList];
        }
        hasMoreRootComments.value = data.total > commentList.value.length;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/community/PostDetail.vue:236", "获取评论失败", e);
        common_vendor.index.showToast({ title: "评论加载失败", icon: "none" });
      }
    };
    const loadMoreRootComments = () => {
      rootPage.value++;
      fetchComments(false);
    };
    const handleLoadMoreReplies = async (data) => {
      const { rootId } = data;
      const rootComment = commentList.value.find((c) => c.id === rootId);
      if (!rootComment)
        return;
      if (!rootComment.replyPage) {
        rootComment.replyPage = 1;
      }
      rootComment.replyPage++;
      try {
        const params = {
          root_id: rootId,
          page: rootComment.replyPage,
          size: 20
        };
        const queryString = buildQueryString(params);
        const url = `/api/community/comments/replies?${queryString}`;
        const res = await utils_request.request.get(url);
        const replyData = res.data || res;
        const newReplies = replyData.list || [];
        if (newReplies.length > 0) {
          if (!rootComment.replies) {
            rootComment.replies = [];
          }
          rootComment.replies.push(...newReplies);
          const currentTotalLoaded = rootComment.replies.length;
          const totalReplies = replyData.total;
          if (currentTotalLoaded >= totalReplies || newReplies.length < 20) {
            rootComment.has_more_replies = false;
          } else {
            rootComment.has_more_replies = true;
          }
        } else {
          rootComment.has_more_replies = false;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/community/PostDetail.vue:289", "加载子回复失败", e);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      }
    };
    const toggleLike = async () => {
      try {
        await utils_request.request.post(`/api/community/posts/${postId.value}/like`);
        post.value.is_liked = !post.value.is_liked;
        post.value.like_count += post.value.is_liked ? 1 : -1;
      } catch (e) {
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      }
    };
    const toggleCollect = async () => {
      try {
        await utils_request.request.post(`/api/community/posts/${postId.value}/favorite`);
        post.value.is_favorited = !post.value.is_favorited;
        post.value.favorite_count += post.value.is_favorited ? 1 : -1;
      } catch (e) {
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      }
    };
    const handleSetReplyTarget = (target) => {
      replyTarget.value = target;
      showCommentPopup.value = true;
    };
    const cancelReply = () => {
      replyTarget.value = null;
    };
    const submitComment = async () => {
      var _a;
      if (!newComment.value.trim()) {
        common_vendor.index.showToast({ title: "内容不能为空", icon: "none" });
        return;
      }
      const userId = (_a = userStore.userInfo) == null ? void 0 : _a.user_id;
      if (!userId) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      try {
        await utils_request.request.post(`/api/community/posts/${postId.value}/comments`, {
          content: newComment.value,
          parent_id: replyTarget.value ? replyTarget.value.parentId : 0,
          user_id: userId
        });
        common_vendor.index.showToast({ title: "评论成功", icon: "success" });
        newComment.value = "";
        replyTarget.value = null;
        showCommentPopup.value = false;
        fetchComments(true);
        post.value.comment_count++;
      } catch (e) {
        common_vendor.index.showToast({ title: "评论失败", icon: "none" });
      }
    };
    const preview = (url) => {
      common_vendor.index.previewImage({ urls: [url] });
    };
    const goBack = () => {
      const pages = getCurrentPages();
      if (pages.length > 1) {
        common_vendor.index.navigateBack({ delta: 1 });
      } else {
        common_vendor.index.switchTab({ url: "/pages/community/Community" });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          name: "arrow-left",
          color: "#333",
          size: "20"
        }),
        b: common_vendor.o(goBack),
        c: common_vendor.p({
          ["is-back"]: false,
          title: "帖子详情",
          placeholder: true,
          ["bg-color"]: "#ffffff",
          ["title-color"]: "#1f2937",
          ["border-bottom"]: true,
          ["custom-class"]: "simple-navbar"
        }),
        d: post.value.id
      }, post.value.id ? common_vendor.e({
        e: post.value.title
      }, post.value.title ? {
        f: common_vendor.t(post.value.title)
      } : {}, {
        g: common_vendor.p({
          src: post.value.avatar || "/static/default-avatar.png",
          size: "40"
        }),
        h: common_vendor.t(post.value.display_name || "匿名病友"),
        i: common_vendor.t(post.value.created_at),
        j: common_vendor.t(post.value.content),
        k: post.value.images && post.value.images.length
      }, post.value.images && post.value.images.length ? {
        l: common_vendor.f(post.value.images, (img, i, i0) => {
          return {
            a: i,
            b: img,
            c: common_vendor.o(($event) => preview(img), i)
          };
        })
      } : {}, {
        m: common_vendor.t(post.value.comment_count || 0),
        n: common_vendor.o(handleSetReplyTarget),
        o: common_vendor.o(handleLoadMoreReplies),
        p: common_vendor.p({
          comments: commentList.value
        }),
        q: hasMoreRootComments.value
      }, hasMoreRootComments.value ? {
        r: common_vendor.o(loadMoreRootComments)
      } : {}) : {
        s: common_vendor.p({
          mode: "circle",
          text: "加载中..."
        })
      }, {
        t: common_vendor.p({
          name: post.value.is_liked ? "heart-fill" : "heart",
          color: post.value.is_liked ? "#ff4d4f" : "#666",
          size: "22"
        }),
        v: common_vendor.t(post.value.like_count || 0),
        w: post.value.is_liked ? 1 : "",
        x: common_vendor.o(toggleLike),
        y: common_vendor.p({
          name: post.value.is_favorited ? "star-fill" : "star",
          color: post.value.is_favorited ? "#ff9900" : "#666",
          size: "22"
        }),
        z: common_vendor.t(post.value.favorite_count || 0),
        A: post.value.is_favorited ? 1 : "",
        B: common_vendor.o(toggleCollect),
        C: common_vendor.p({
          name: "chat",
          color: "#666",
          size: "22"
        }),
        D: common_vendor.o(($event) => showCommentPopup.value = true),
        E: common_vendor.o(($event) => showCommentPopup.value = false),
        F: common_vendor.p({
          name: "close"
        }),
        G: replyTarget.value
      }, replyTarget.value ? {
        H: common_vendor.t(replyTarget.value.targetUser),
        I: common_vendor.o(cancelReply)
      } : {}, {
        J: newComment.value,
        K: common_vendor.o(($event) => newComment.value = $event.detail.value),
        L: common_vendor.o(submitComment),
        M: common_vendor.p({
          type: "primary",
          block: true
        }),
        N: common_vendor.o(($event) => showCommentPopup.value = false),
        O: common_vendor.p({
          show: showCommentPopup.value,
          mode: "bottom",
          round: "12"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-212b7d19"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/community/PostDetail.js.map
