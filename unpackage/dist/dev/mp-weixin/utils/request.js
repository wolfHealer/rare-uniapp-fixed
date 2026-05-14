"use strict";
const common_vendor = require("../common/vendor.js");
var define_import_meta_env_default = { VITE_CJS_IGNORE_WARNING: "true", VITE_USER_NODE_ENV: "development", VITE_ROOT_DIR: "/Users/zhonghua/Downloads/rare-uniapp-fixed", BASE_URL: "/", MODE: "development", DEV: true, PROD: false, SSR: false };
const BASE_URL = (define_import_meta_env_default.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/+$/, "");
const buildQuery = (params) => {
  if (!params)
    return "";
  const query = Object.keys(params).filter((key) => params[key] !== void 0 && params[key] !== null && params[key] !== "").map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join("&");
  return query ? `?${query}` : "";
};
const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = common_vendor.index.getStorageSync("token");
    if (options.showLoading) {
      common_vendor.index.showLoading({ title: "加载中...", mask: true });
    }
    common_vendor.index.request({
      ...options,
      url: `${BASE_URL}${options.url}`,
      method: options.method || "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...options.header || {}
      },
      success: (res) => {
        if (options.showLoading) {
          common_vendor.index.hideLoading();
        }
        const body = res.data || {};
        if (res.statusCode === 200 && body.code === 200) {
          resolve(body);
          return;
        }
        if (body.code === 401) {
          common_vendor.index.removeStorageSync("token");
          common_vendor.index.removeStorageSync("userInfo");
          common_vendor.index.showToast({ title: "登录已过期，请重新登录", icon: "none" });
          setTimeout(() => {
            common_vendor.index.reLaunch({ url: "/pages/user/login/Login" });
          }, 1200);
          reject(body);
          return;
        }
        common_vendor.index.showToast({ title: body.message || "请求失败", icon: "none" });
        reject(body);
      },
      fail: (error) => {
        if (options.showLoading) {
          common_vendor.index.hideLoading();
        }
        common_vendor.index.showToast({ title: "网络异常，请检查网络连接", icon: "none" });
        reject(error);
      }
    });
  });
};
const request$1 = {
  get(url, params, options) {
    return request({
      url: `${url}${buildQuery(params)}`,
      method: "GET",
      ...options
    });
  },
  post(url, data, options) {
    return request({ url, method: "POST", data, ...options });
  },
  put(url, data, options) {
    return request({ url, method: "PUT", data, ...options });
  },
  delete(url, data, options) {
    return request({ url, method: "DELETE", data, ...options });
  },
  download(url, params) {
    const token = common_vendor.index.getStorageSync("token");
    return new Promise((resolve, reject) => {
      common_vendor.index.downloadFile({
        url: `${BASE_URL}${url}${buildQuery(params)}`,
        header: {
          Authorization: token ? `Bearer ${token}` : ""
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res);
            return;
          }
          reject(res);
        },
        fail: reject
      });
    });
  }
};
exports.request = request$1;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
