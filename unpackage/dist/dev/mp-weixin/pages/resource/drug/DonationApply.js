"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_form_item2 = common_vendor.resolveComponent("u-form-item");
  const _easycom_u_form2 = common_vendor.resolveComponent("u-form");
  const _easycom_u_textarea2 = common_vendor.resolveComponent("u-textarea");
  const _easycom_u_upload2 = common_vendor.resolveComponent("u-upload");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_datetime_picker2 = common_vendor.resolveComponent("u-datetime-picker");
  (_easycom_u_icon2 + _easycom_u_tag2 + _easycom_u_input2 + _easycom_u_form_item2 + _easycom_u_form2 + _easycom_u_textarea2 + _easycom_u_upload2 + _easycom_u_button2 + _easycom_u_datetime_picker2)();
}
const _easycom_u_icon = () => "../../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_tag = () => "../../../node-modules/uview-plus/components/u-tag/u-tag.js";
const _easycom_u_input = () => "../../../node-modules/uview-plus/components/u-input/u-input.js";
const _easycom_u_form_item = () => "../../../node-modules/uview-plus/components/u-form-item/u-form-item.js";
const _easycom_u_form = () => "../../../node-modules/uview-plus/components/u-form/u-form.js";
const _easycom_u_textarea = () => "../../../node-modules/uview-plus/components/u-textarea/u-textarea.js";
const _easycom_u_upload = () => "../../../node-modules/uview-plus/components/u-upload/u-upload.js";
const _easycom_u_button = () => "../../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_datetime_picker = () => "../../../node-modules/uview-plus/components/u-datetime-picker/u-datetime-picker.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_tag + _easycom_u_input + _easycom_u_form_item + _easycom_u_form + _easycom_u_textarea + _easycom_u_upload + _easycom_u_button + _easycom_u_datetime_picker)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "DonationApply",
  setup(__props) {
    const projectInfo = common_vendor.ref(null);
    const submitting = common_vendor.ref(false);
    const projectId = common_vendor.ref(null);
    const showDatePicker = common_vendor.ref(false);
    const currentDate = common_vendor.ref((/* @__PURE__ */ new Date()).getTime());
    const uFormRef = common_vendor.ref(null);
    const form = common_vendor.reactive({
      patientName: "",
      patientIdCard: "",
      contactPhone: "",
      diagnosisHospital: "",
      diagnosisTime: "",
      incomeProof: "",
      remark: ""
    });
    const rules = {
      patientName: {
        type: "string",
        required: true,
        message: "请填写患者姓名",
        trigger: ["blur", "change"]
      },
      patientIdCard: [
        {
          type: "string",
          required: true,
          message: "请填写身份证号",
          trigger: ["blur", "change"]
        },
        {
          validator: (rule, value, callback) => {
            return /^\d{17}[\dXx]$/.test(value);
          },
          message: "身份证号格式不正确",
          trigger: ["blur", "change"]
        }
      ],
      contactPhone: [
        {
          type: "string",
          required: true,
          message: "请填写联系电话",
          trigger: ["blur", "change"]
        },
        {
          validator: (rule, value, callback) => {
            return /^1[3-9]\d{9}$/.test(value);
          },
          message: "手机号格式不正确",
          trigger: ["blur", "change"]
        }
      ],
      diagnosisHospital: {
        type: "string",
        required: true,
        message: "请填写诊断医院",
        trigger: ["blur", "change"]
      },
      diagnosisTime: {
        type: "string",
        required: true,
        message: "请选择确诊时间",
        trigger: ["blur", "change"]
      },
      incomeProof: {
        type: "string",
        required: true,
        message: "请填写收入情况",
        trigger: ["blur", "change"]
      }
    };
    const fileList = common_vendor.ref([]);
    const uploadedFileUrls = common_vendor.ref([]);
    const loadProjectInfo = async (id) => {
      try {
        const res = await utils_request.request.get(`/api/resource/drug/donations/${id}`);
        projectInfo.value = res.data;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/resource/drug/DonationApply.vue:286", "加载项目信息失败:", error);
        common_vendor.index.showToast({ title: "项目信息加载失败", icon: "none" });
      }
    };
    const deletePic = (event) => {
      fileList.value.splice(event.index, 1);
      uploadedFileUrls.value.splice(event.index, 1);
    };
    const afterRead = async (event) => {
      const files = Array.isArray(event) ? event : [event];
      for (const file of files) {
        file.status = "uploading";
        file.message = "上传中...";
        try {
          const uploadRes = await new Promise((resolve, reject) => {
            var _a;
            common_vendor.index.uploadFile({
              url: `${((_a = utils_request.request.defaults) == null ? void 0 : _a.baseURL) || "https://api.yourserver.com"}/api/upload`,
              filePath: file.url,
              name: "file",
              success: (res) => {
                try {
                  const data = JSON.parse(res.data);
                  if (data.code === 200 || data.success) {
                    resolve(data.data.url);
                  } else {
                    reject(new Error(data.message || "上传失败"));
                  }
                } catch (e) {
                  reject(e);
                }
              },
              fail: (err) => {
                reject(err);
              }
            });
          });
          file.status = "success";
          file.message = "";
          file.serverUrl = uploadRes;
          uploadedFileUrls.value.push(uploadRes);
        } catch (error) {
          file.status = "failed";
          file.message = "上传失败";
          common_vendor.index.showToast({ title: error.message || "文件上传失败", icon: "none" });
        }
      }
    };
    const confirmDate = (e) => {
      const date = new Date(e.value);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      form.diagnosisTime = `${year}-${month}-${day}`;
      showDatePicker.value = false;
    };
    const submitForm = async () => {
      if (!uFormRef.value)
        return;
      try {
        await uFormRef.value.validate();
      } catch (err) {
        return;
      }
      if (!projectId.value) {
        common_vendor.index.showToast({ title: "项目ID缺失", icon: "none" });
        return;
      }
      const failedFiles = fileList.value.filter((f) => f.status === "failed");
      if (failedFiles.length > 0) {
        common_vendor.index.showToast({ title: "存在上传失败的文件，请重试或删除", icon: "none" });
        return;
      }
      submitting.value = true;
      common_vendor.index.showLoading({ title: "提交中...", mask: true });
      try {
        await utils_request.request.post(`/api/resource/drug/donations/${projectId.value}/apply`, {
          projectId: projectId.value,
          patientName: form.patientName,
          patientIdCard: form.patientIdCard,
          contactPhone: form.contactPhone,
          diagnosisHospital: form.diagnosisHospital,
          diagnosisTime: form.diagnosisTime,
          incomeProof: form.incomeProof,
          remark: form.remark,
          attachmentUrls: uploadedFileUrls.value
        });
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "申请提交成功，请等待审核", icon: "success" });
        setTimeout(() => {
          goBack();
        }, 1500);
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/resource/drug/DonationApply.vue:398", "提交申请失败:", error);
        common_vendor.index.showToast({ title: "申请提交失败，请稍后再试", icon: "none" });
      } finally {
        submitting.value = false;
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    common_vendor.onLoad((options) => {
      if (options.projectId) {
        projectId.value = Number(options.projectId);
        loadProjectInfo(projectId.value);
      } else {
        common_vendor.index.showToast({ title: "缺少项目ID", icon: "none" });
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
        c: projectInfo.value
      }, projectInfo.value ? {
        d: common_vendor.t(projectInfo.value.name),
        e: common_vendor.p({
          text: projectInfo.value.auditStatus === 1 ? "进行中" : "已结束",
          type: projectInfo.value.auditStatus === 1 ? "success" : "info",
          size: "mini"
        }),
        f: common_vendor.t(projectInfo.value.organizer || "暂无"),
        g: common_vendor.t(projectInfo.value.period || "暂无"),
        h: common_vendor.t(projectInfo.value.condition)
      } : {}, {
        i: common_vendor.o(($event) => form.patientName = $event),
        j: common_vendor.p({
          placeholder: "请输入患者真实姓名",
          border: "surround",
          clearable: true,
          modelValue: form.patientName
        }),
        k: common_vendor.p({
          label: "患者姓名",
          prop: "patientName",
          required: true
        }),
        l: common_vendor.o(($event) => form.patientIdCard = $event),
        m: common_vendor.p({
          placeholder: "请输入18位身份证号",
          border: "surround",
          clearable: true,
          modelValue: form.patientIdCard
        }),
        n: common_vendor.p({
          label: "身份证号",
          prop: "patientIdCard",
          required: true
        }),
        o: common_vendor.o(($event) => form.contactPhone = $event),
        p: common_vendor.p({
          type: "number",
          placeholder: "请输入手机号",
          border: "surround",
          clearable: true,
          modelValue: form.contactPhone
        }),
        q: common_vendor.p({
          label: "联系电话",
          prop: "contactPhone",
          required: true
        }),
        r: common_vendor.o(($event) => form.diagnosisHospital = $event),
        s: common_vendor.p({
          placeholder: "请输入确诊医院全称",
          border: "surround",
          clearable: true,
          modelValue: form.diagnosisHospital
        }),
        t: common_vendor.p({
          label: "诊断医院",
          prop: "diagnosisHospital",
          required: true
        }),
        v: common_vendor.o(($event) => form.diagnosisTime = $event),
        w: common_vendor.p({
          placeholder: "请选择确诊日期",
          border: "surround",
          disabled: true,
          suffixIcon: "calendar",
          modelValue: form.diagnosisTime
        }),
        x: common_vendor.o(($event) => showDatePicker.value = true),
        y: common_vendor.p({
          label: "确诊时间",
          prop: "diagnosisTime",
          required: true
        }),
        z: common_vendor.sr(uFormRef, "a0a77835-2", {
          "k": "uFormRef"
        }),
        A: common_vendor.p({
          model: form,
          rules,
          ["label-width"]: "90"
        }),
        B: common_vendor.o(($event) => form.incomeProof = $event),
        C: common_vendor.p({
          placeholder: "请简要描述家庭年收入情况及经济困难原因...",
          count: true,
          height: "100",
          border: "surround",
          modelValue: form.incomeProof
        }),
        D: common_vendor.p({
          label: "收入证明",
          prop: "incomeProof",
          required: true,
          ["label-position"]: "top"
        }),
        E: common_vendor.o(($event) => form.remark = $event),
        F: common_vendor.p({
          placeholder: "其他需要补充说明的情况（选填）",
          count: true,
          height: "80",
          border: "surround",
          modelValue: form.remark
        }),
        G: common_vendor.p({
          label: "备注说明",
          prop: "remark",
          ["label-position"]: "top"
        }),
        H: common_vendor.sr(uFormRef, "a0a77835-13", {
          "k": "uFormRef"
        }),
        I: common_vendor.p({
          model: form,
          rules,
          ["label-width"]: "90"
        }),
        J: common_vendor.o(afterRead),
        K: common_vendor.o(deletePic),
        L: common_vendor.p({
          fileList: fileList.value,
          name: "1",
          multiple: true,
          maxCount: 5,
          maxSize: 10 * 1024 * 1024,
          width: "100%",
          height: "100px"
        }),
        M: common_vendor.p({
          name: "info-circle",
          size: "14",
          color: "#9ca3af"
        }),
        N: common_vendor.o(submitForm),
        O: common_vendor.p({
          type: "primary",
          shape: "circle",
          customStyle: "width: 100%; height: 44px; font-size: 16px;",
          loading: submitting.value
        }),
        P: common_vendor.o(confirmDate),
        Q: common_vendor.o(($event) => showDatePicker.value = false),
        R: common_vendor.o(($event) => currentDate.value = $event),
        S: common_vendor.p({
          show: showDatePicker.value,
          mode: "date",
          modelValue: currentDate.value
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a0a77835"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/resource/drug/DonationApply.js.map
