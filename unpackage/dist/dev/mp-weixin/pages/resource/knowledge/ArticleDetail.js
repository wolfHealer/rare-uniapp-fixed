"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_loading_icon2 = common_vendor.resolveComponent("u-loading-icon");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_empty2 = common_vendor.resolveComponent("u-empty");
  (_easycom_u_icon2 + _easycom_u_loading_icon2 + _easycom_u_tag2 + _easycom_u_button2 + _easycom_u_empty2)();
}
const _easycom_u_icon = () => "../../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_loading_icon = () => "../../../node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_tag = () => "../../../node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_button = () => "../../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_empty = () => "../../../node-modules/uview-plus/components/u-empty/u-empty.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_loading_icon + _easycom_u_tag + _easycom_u_button + _easycom_u_empty)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "ArticleDetail",
  setup(__props) {
    const article = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const articleId = common_vendor.ref(null);
    const liked = common_vendor.ref(false);
    const favorited = common_vendor.ref(false);
    const sortedBlocks = common_vendor.computed(() => {
      var _a;
      if (!((_a = article.value) == null ? void 0 : _a.blocks))
        return [];
      return [...article.value.blocks].sort((a, b) => a.sortNo - b.sortNo);
    });
    const formatTime = (timeStr) => {
      if (!timeStr)
        return "";
      return timeStr.split(" ")[0];
    };
    const previewImage = (url) => {
      if (!url)
        return;
      common_vendor.index.previewImage({
        urls: [url],
        current: url
      });
    };
    const openSourceUrl = () => {
      var _a;
      if (!((_a = article.value) == null ? void 0 : _a.sourceUrl))
        return;
      common_vendor.index.setClipboardData({
        data: article.value.sourceUrl,
        success: () => {
          common_vendor.index.showToast({ title: "链接已复制", icon: "success" });
        }
      });
    };
    const handleLike = async () => {
      if (!article.value)
        return;
      try {
        liked.value = !liked.value;
        article.value.likeCount += liked.value ? 1 : -1;
        common_vendor.index.showToast({
          title: liked.value ? "点赞成功" : "已取消点赞",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/knowledge/ArticleDetail.vue:243", "点赞失败:", error);
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      }
    };
    const handleFavorite = async () => {
      if (!article.value)
        return;
      try {
        favorited.value = !favorited.value;
        article.value.favoriteCount += favorited.value ? 1 : -1;
        common_vendor.index.showToast({
          title: favorited.value ? "收藏成功" : "已取消收藏",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/knowledge/ArticleDetail.vue:264", "收藏失败:", error);
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      }
    };
    const handleShare = () => {
      if (!article.value)
        return;
      common_vendor.index.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"]
      });
      common_vendor.index.showToast({ title: "请点击右上角分享", icon: "none" });
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const loadArticleDetail = async (id) => {
      var _a, _b;
      loading.value = true;
      try {
        const res = await utils_request.request.get(`/api/knowledge/article/${id}`);
        common_vendor.index.__f__("log", "at pages/resource/knowledge/ArticleDetail.vue:292", "=== 文章详情接口完整响应 ===");
        common_vendor.index.__f__("log", "at pages/resource/knowledge/ArticleDetail.vue:293", "res:", res);
        common_vendor.index.__f__("log", "at pages/resource/knowledge/ArticleDetail.vue:294", "res.code:", res.code);
        common_vendor.index.__f__("log", "at pages/resource/knowledge/ArticleDetail.vue:295", "res.data:", res.data);
        common_vendor.index.__f__("log", "at pages/resource/knowledge/ArticleDetail.vue:296", "res.data.blocks:", (_a = res.data) == null ? void 0 : _a.blocks);
        common_vendor.index.__f__("log", "at pages/resource/knowledge/ArticleDetail.vue:297", "res.data.tags:", (_b = res.data) == null ? void 0 : _b.tags);
        if (res.code === 200 && res.data) {
          article.value = res.data;
          common_vendor.index.__f__("log", "at pages/resource/knowledge/ArticleDetail.vue:301", "文章数据已设置:", article.value);
        } else {
          common_vendor.index.showToast({ title: res.message || "获取文章失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/knowledge/ArticleDetail.vue:306", "加载文章详情失败:", error);
        common_vendor.index.showToast({ title: "网络异常，加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    common_vendor.onMounted(() => {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const options = currentPage.options || {};
      const id = (options == null ? void 0 : options.id) ? parseInt(options.id) : null;
      if (id) {
        articleId.value = id;
        loadArticleDetail(id);
      } else {
        common_vendor.index.showToast({ title: "缺少文章ID", icon: "none" });
        setTimeout(() => {
          goBack();
        }, 1500);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.p({
          name: "arrow-left",
          size: "24"
        }),
        c: loading.value
      }, loading.value ? {
        d: common_vendor.p({
          mode: "circle"
        })
      } : article.value ? common_vendor.e({
        f: article.value.coverImage
      }, article.value.coverImage ? {
        g: article.value.coverImage
      } : {}, {
        h: common_vendor.t(article.value.title),
        i: common_vendor.t(article.value.sourceName),
        j: common_vendor.t(formatTime(article.value.publishTime)),
        k: common_vendor.t(article.value.viewCount),
        l: article.value.tags && article.value.tags.length > 0
      }, article.value.tags && article.value.tags.length > 0 ? {
        m: common_vendor.f(article.value.tags, (tag, index, i0) => {
          return {
            a: index,
            b: "8092db6b-2-" + i0,
            c: common_vendor.p({
              text: tag.name,
              plain: true,
              size: "mini",
              type: "primary",
              customStyle: "margin-right: 8px;"
            })
          };
        })
      } : {}, {
        n: article.value.summary
      }, article.value.summary ? {
        o: common_vendor.t(article.value.summary)
      } : {}, {
        p: common_vendor.f(sortedBlocks.value, (block, index, i0) => {
          var _a, _b, _c;
          return common_vendor.e({
            a: block.blockType === "text"
          }, block.blockType === "text" ? common_vendor.e({
            b: block.title
          }, block.title ? {
            c: common_vendor.t(block.title)
          } : {}, {
            d: common_vendor.t(block.content)
          }) : block.blockType === "image" ? common_vendor.e({
            f: block.title
          }, block.title ? {
            g: common_vendor.t(block.title)
          } : {}, {
            h: (_a = block.extra) == null ? void 0 : _a.url,
            i: common_vendor.o(($event) => {
              var _a2;
              return previewImage((_a2 = block.extra) == null ? void 0 : _a2.url);
            }, block.id)
          }) : block.blockType === "faq" ? common_vendor.e({
            k: block.title
          }, block.title ? {
            l: common_vendor.t(block.title)
          } : {}, {
            m: common_vendor.t((_b = block.extra) == null ? void 0 : _b.question),
            n: common_vendor.t((_c = block.extra) == null ? void 0 : _c.answer)
          }) : {}, {
            e: block.blockType === "image",
            j: block.blockType === "faq",
            o: block.id
          });
        }),
        q: article.value.sourceUrl
      }, article.value.sourceUrl ? {
        r: common_vendor.o(openSourceUrl),
        s: common_vendor.p({
          size: "small",
          plain: true,
          type: "primary"
        })
      } : {}, {
        t: common_vendor.p({
          name: "thumb-up",
          size: "20",
          color: liked.value ? "#ef4444" : "#6b7280"
        }),
        v: common_vendor.t(article.value.likeCount),
        w: common_vendor.o(handleLike),
        x: common_vendor.p({
          name: "star",
          size: "20",
          color: favorited.value ? "#f59e0b" : "#6b7280"
        }),
        y: common_vendor.t(article.value.favoriteCount),
        z: common_vendor.o(handleFavorite),
        A: common_vendor.p({
          name: "share",
          size: "20",
          color: "#6b7280"
        }),
        B: common_vendor.o(handleShare)
      }) : {
        C: common_vendor.p({
          mode: "data",
          description: "文章不存在或已下架"
        })
      }, {
        e: article.value
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8092db6b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/knowledge/ArticleDetail.js.map
