"use strict";
const common_vendor = require("../../common/vendor.js");
const useUserStore = common_vendor.defineStore("user", () => {
  const token = common_vendor.ref("");
  const userInfo = common_vendor.ref(null);
  const initStore = () => {
    const storedToken = common_vendor.index.getStorageSync("token");
    const storedUserInfo = common_vendor.index.getStorageSync("userInfo");
    if (storedToken) {
      token.value = storedToken;
    }
    if (storedUserInfo) {
      try {
        userInfo.value = JSON.parse(storedUserInfo);
      } catch (e) {
        common_vendor.index.__f__("error", "at stores/modules/user.ts:29", "解析用户信息失败:", e);
        userInfo.value = null;
      }
    }
  };
  const setToken = (newToken) => {
    token.value = newToken;
    common_vendor.index.setStorageSync("token", newToken);
  };
  const setUserInfo = (info) => {
    userInfo.value = info;
    common_vendor.index.setStorageSync("userInfo", JSON.stringify(info));
  };
  const logout = () => {
    token.value = "";
    userInfo.value = null;
    common_vendor.index.removeStorageSync("token");
    common_vendor.index.removeStorageSync("userInfo");
  };
  const isLoggedIn = () => {
    return !!token.value && !!userInfo.value;
  };
  initStore();
  return {
    token,
    userInfo,
    setToken,
    setUserInfo,
    logout,
    isLoggedIn
  };
});
exports.useUserStore = useUserStore;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/stores/modules/user.js.map
