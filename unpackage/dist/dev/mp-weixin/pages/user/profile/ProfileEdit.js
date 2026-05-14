"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_form_item2 = common_vendor.resolveComponent("u-form-item");
  const _easycom_u_form2 = common_vendor.resolveComponent("u-form");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_upload2 = common_vendor.resolveComponent("u-upload");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  (_easycom_u_icon2 + _easycom_u_input2 + _easycom_u_form_item2 + _easycom_u_form2 + _easycom_u_button2 + _easycom_u_upload2 + _easycom_u_popup2)();
}
const _easycom_u_icon = () => "../../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_input = () => "../../../node-modules/uview-plus/components/u-input/u-input.js";
const _easycom_u_form_item = () => "../../../node-modules/uview-plus/components/u-form-item/u-form-item.js";
const _easycom_u_form = () => "../../../node-modules/uview-plus/components/u-form/u-form.js";
const _easycom_u_button = () => "../../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_upload = () => "../../../node-modules/uview-plus/components/u-upload/u-upload.js";
const _easycom_u_popup = () => "../../../node-modules/uview-plus/components/u-popup/u-popup.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_input + _easycom_u_form_item + _easycom_u_form + _easycom_u_button + _easycom_u_upload + _easycom_u_popup)();
}
const defaultAvatar = "https://via.placeholder.com/150";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "ProfileEdit",
  setup(__props) {
    const userInfo = common_vendor.ref({
      nickname: "用户名",
      avatar: ""
    });
    const showAvatarPopup = common_vendor.ref(false);
    const avatarFileList = common_vendor.ref([]);
    const saving = common_vendor.ref(false);
    const handleAvatarUpload = (event) => {
      common_vendor.index.__f__("log", "at pages/user/profile/ProfileEdit.vue:90", "选择文件:", event.file);
      avatarFileList.value = event.file;
    };
    const confirmAvatarUpload = () => {
      if (avatarFileList.value.length > 0) {
        userInfo.value.avatar = avatarFileList.value[0].url || defaultAvatar;
        common_vendor.index.showToast({ title: "头像上传成功", icon: "success" });
      }
      showAvatarPopup.value = false;
    };
    const saveProfile = () => {
      if (!userInfo.value.nickname) {
        common_vendor.index.showToast({ title: "昵称不能为空", icon: "none" });
        return;
      }
      saving.value = true;
      setTimeout(() => {
        saving.value = false;
        common_vendor.index.showToast({ title: "保存成功", icon: "success" });
        common_vendor.index.navigateBack();
      }, 1e3);
    };
    return (_ctx, _cache) => {
      return {
        a: userInfo.value.avatar || defaultAvatar,
        b: common_vendor.p({
          name: "arrow-right",
          color: "#c0c4cc"
        }),
        c: common_vendor.o(($event) => showAvatarPopup.value = true),
        d: common_vendor.o(($event) => userInfo.value.nickname = $event),
        e: common_vendor.p({
          placeholder: "请输入昵称",
          border: "none",
          modelValue: userInfo.value.nickname
        }),
        f: common_vendor.p({
          label: "昵称",
          prop: "nickname",
          borderBottom: true
        }),
        g: common_vendor.sr("formRef", "821b2f7d-1"),
        h: common_vendor.p({
          model: userInfo.value
        }),
        i: common_vendor.o(saveProfile),
        j: common_vendor.p({
          type: "primary",
          shape: "circle",
          loading: saving.value
        }),
        k: common_vendor.o(handleAvatarUpload),
        l: common_vendor.p({
          fileList: avatarFileList.value,
          maxCount: 1,
          width: "100",
          height: "100"
        }),
        m: common_vendor.o(confirmAvatarUpload),
        n: common_vendor.p({
          type: "primary",
          block: true
        }),
        o: common_vendor.o(($event) => showAvatarPopup.value = $event),
        p: common_vendor.p({
          mode: "bottom",
          round: "10",
          show: showAvatarPopup.value
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-821b2f7d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/profile/ProfileEdit.js.map
