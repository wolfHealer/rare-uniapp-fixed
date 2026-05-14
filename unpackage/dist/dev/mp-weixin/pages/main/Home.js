"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_badge2 = common_vendor.resolveComponent("u-badge");
  const _easycom_u_swiper2 = common_vendor.resolveComponent("u-swiper");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  (_easycom_u_icon2 + _easycom_u_badge2 + _easycom_u_swiper2 + _easycom_u_tag2 + _easycom_u_image2)();
}
const _easycom_u_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_badge = () => "../../node-modules/uview-plus/components/u-badge/u-badge.js";
const _easycom_u_swiper = () => "../../node-modules/uview-plus/components/u-swiper/u-swiper.js";
const _easycom_u_tag = () => "../../node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_image = () => "../../node-modules/uview-plus/components/u-image/u-image.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_badge + _easycom_u_swiper + _easycom_u_tag + _easycom_u_image)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Home",
  setup(__props) {
    const unreadCount = common_vendor.ref(2);
    const navItems = common_vendor.ref([
      { name: "找医生", icon: "account", bgColor: "#e0f2fe", color: "#0284c7", path: "/pages/resource/medical/DoctorList" },
      { name: "查疾病", icon: "file-text", bgColor: "#fce7f3", color: "#db2777", path: "/pages/resource/knowledge/KnowledgeResource" },
      { name: "找救助", icon: "gift", bgColor: "#fef3c7", color: "#d97706", path: "/pages/resource/charity/AidProjectList" },
      { name: "康复指南", icon: "heart", bgColor: "#dcfce7", color: "#16a34a", path: "/pages/resource/rehab/RehabGuideList" },
      { name: "病友圈", icon: "chat", bgColor: "#f3e8ff", color: "#9333ea", path: "/pages/community/Community" },
      { name: "药品查询", icon: "shopping-cart", bgColor: "#fee2e2", color: "#dc2626", path: "/pages/resource/drug/DrugList" }
    ]);
    const bannerList = common_vendor.ref([
      { image: "https://via.placeholder.com/750x320/3b82f6/ffffff?text=罕见病日宣传" },
      { image: "https://via.placeholder.com/750x320/10b981/ffffff?text=最新救助项目上线" }
    ]);
    const recommendedDoctors = common_vendor.ref([
      { id: 1, name: "张主任", title: "主任医师", hospital: "北京协和医院", department: "神经内科", avatar: "" },
      { id: 2, name: "李教授", title: "副主任医师", hospital: "上海华山医院", department: "儿科", avatar: "" },
      { id: 3, name: "王医生", title: "主治医师", hospital: "华西医院", department: "遗传科", avatar: "" }
    ]);
    const charityList = common_vendor.ref([
      { id: 1, title: "SMA患者援助项目", desc: "面向确诊脊髓性肌萎缩症...", amount: "5万", cover: "" },
      { id: 2, title: "法布雷病用药补贴", desc: "低收入家庭申请通道...", amount: "3万", cover: "" }
    ]);
    const postList = common_vendor.ref([
      { id: 1, title: "确诊法布雷病两年，分享我的抗病经历", author: "勇敢的小草", time: "2小时前" },
      { id: 2, title: "请问北京哪家医院看戈谢病比较好？", author: "求助者A", time: "5小时前" }
    ]);
    const goSearch = () => {
      common_vendor.index.navigateTo({ url: "/pages/search/Search" });
    };
    const goMessages = () => {
      common_vendor.index.navigateTo({ url: "/pages/main/Messages" });
    };
    const handleNavClick = (item) => {
      if (item.path) {
        const tabBarPages = ["/pages/medical/Medical", "/pages/community/Community", "/pages/main/Home"];
        if (tabBarPages.includes(item.path)) {
          common_vendor.index.switchTab({ url: item.path });
        } else {
          common_vendor.index.navigateTo({ url: item.path });
        }
      }
    };
    const goMedical = () => {
      common_vendor.index.switchTab({ url: "/pages/medical/Medical" });
    };
    const goDoctorDetail = (id) => {
      common_vendor.index.navigateTo({ url: `/pages/medical/DoctorDetail?id=${id}` });
    };
    const goCharity = () => {
      common_vendor.index.navigateTo({ url: "/pages/resource/charity/AidProjectList" });
    };
    const goCharityDetail = (id) => {
      common_vendor.index.navigateTo({ url: `/pages/resource/charity/AidProjectDetail?id=${id}` });
    };
    const goPostDetail = (id) => {
      common_vendor.index.navigateTo({ url: `/pages/community/PostDetail?id=${id}` });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          name: "search",
          size: "18",
          color: "#9ca3af"
        }),
        b: common_vendor.o(goSearch),
        c: common_vendor.p({
          name: "bell",
          size: "20",
          color: "#374151"
        }),
        d: common_vendor.p({
          value: unreadCount.value,
          absolute: true,
          offset: "[-5, -5]"
        }),
        e: common_vendor.o(goMessages),
        f: common_vendor.f(navItems.value, (item, index, i0) => {
          return {
            a: "6a312ec2-3-" + i0,
            b: common_vendor.p({
              name: item.icon,
              size: "24",
              color: item.color
            }),
            c: item.bgColor,
            d: common_vendor.t(item.name),
            e: index,
            f: common_vendor.o(($event) => handleNavClick(item), index)
          };
        }),
        g: common_vendor.p({
          list: bannerList.value,
          keyName: "image",
          height: "160",
          ["border-radius"]: "12"
        }),
        h: common_vendor.o(goMedical),
        i: common_vendor.f(recommendedDoctors.value, (doc, index, i0) => {
          return {
            a: doc.avatar || "/static/avatar.png",
            b: common_vendor.t(doc.name),
            c: common_vendor.t(doc.title),
            d: common_vendor.t(doc.hospital),
            e: "6a312ec2-5-" + i0,
            f: common_vendor.p({
              text: doc.department,
              size: "mini",
              type: "primary",
              plain: true
            }),
            g: index,
            h: common_vendor.o(($event) => goDoctorDetail(doc.id), index)
          };
        }),
        j: common_vendor.o(goCharity),
        k: common_vendor.f(charityList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.desc),
            c: "6a312ec2-6-" + i0,
            d: common_vendor.t(item.amount),
            e: item.cover
          }, item.cover ? {
            f: "6a312ec2-7-" + i0,
            g: common_vendor.p({
              src: item.cover,
              width: "80px",
              height: "80px",
              radius: "8"
            })
          } : {}, {
            h: index,
            i: common_vendor.o(($event) => goCharityDetail(item.id), index)
          });
        }),
        l: common_vendor.p({
          text: "进行中",
          type: "success",
          size: "mini"
        }),
        m: common_vendor.f(postList.value, (post, index, i0) => {
          return {
            a: common_vendor.t(post.title),
            b: common_vendor.t(post.author),
            c: common_vendor.t(post.time),
            d: index,
            e: common_vendor.o(($event) => goPostDetail(post.id), index)
          };
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6a312ec2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/main/Home.js.map
