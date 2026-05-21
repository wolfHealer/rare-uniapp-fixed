# rare-uniapp

罕见病互助平台（uni-app + Vue 3 + Pinia + uview-plus）。

## 项目结构

```
api/                 # 按领域封装的接口（community、charity、medical…）
types/               # 领域类型与 common（分页、地区等）
composables/         # usePagedList 等可复用逻辑
utils/
  request.ts         # HTTP 封装（含 401 → logout）
  download.ts        # 下载并打开 / 保存文件
components/          # 全局组件（含唯一 RegionPicker）
pages/               # 页面（按业务分子目录）
stores/modules/      # Pinia
```

## 开发

```bash
npm install

# H5
npm run dev:h5

# 微信小程序
npm run dev:mp-weixin
```

**微信小程序推荐 HBuilderX**：运行 → 运行到小程序模拟器 → 微信开发者工具，输出目录 `unpackage/dist/dev/mp-weixin`。

命令行需 `UNI_INPUT_DIR=.`（已写入 npm scripts）。若报 `vue-demi` / `pinia` 错误，请用 HBuilderX 或 Node 18 LTS。

## 构建

```bash
npm run build:h5
npm run build:mp-weixin
```

勿直接修改 `unpackage/` 内产物；改源码后需重新运行 dev/build。`unpackage/` 已在 `.gitignore` 中忽略。

## 环境变量

`.env.development` / `.env.production`（可选）：

```env
VITE_API_BASE_URL=https://your-api.example.com
```

## 扩展约定

- 新接口：在 `api/<domain>.ts` 增加方法，类型写在 `types/<domain>.ts`；页面勿直接 `import request`（仅 `api/` 与 `utils/download` 使用）
- 标准分页列表：使用 `usePagedList` + 领域 api（参考 `CaseShareList.vue`、`PolicyList.vue`）
- 下载 PDF：使用 `downloadAndOpenDocument`；导出文件：`downloadAndSaveFile`
- 地区选择：仅维护 `components/RegionPicker.vue`

### 用户中心 `api/user.ts`（预置，对接后端时启用）

| 能力 | 方法 | 路径 |
|------|------|------|
| 登录/注册/验证码 | `login` `register` `sendSmsCode` | `/api/auth/*` |
| 资料/头像 | `getProfile` `updateProfile` `uploadAvatar` | `/api/user/profile` `/api/user/avatar` |
| 我的收藏 | `listFavorites` `removeFavorite` | `/api/user/favorites` |
| 我的发布 | `listMyPosts` `deleteMyPost` | `/api/user/posts` |
| 我的问诊 | `listMyConsultations` | `/api/user/consultations` |
| 设置 | `getSettings` `updateSettings` | `/api/user/settings` |



建议落地顺序（跨模块）
P0 一批：补全 pages.json + 修正 Home / Community 所有跳转 + 修 vite stores 别名 + 401 同步 logout
P1 一批：api/ + 领域 types + 合并 RegionPicker + 列表 composable + 下载工具 + 清理 unpackage / 死代码
P2 一批：DrugResource 改 v-if、统一 Resource Tab 策略、滚动嵌套梳理、请求 loading/竞态、外链资源本地化
P3 一批：ESLint、vue-tsc、统一 import、:key、删无用依赖、注释下沉到类型文档
如需把某一模块（例如「社区」或「医疗」）展开成带文件路径的 checklist，可以指定模块名。




1. api/ — ✅ 已解决（页面直连 request 已清零）
10 个模块：community、charity、medical、medicare、drug、rehab、knowledge、region、user（含 Profile/Favorites 等预置接口）、index.ts
pages/ + components/ 中已无 import request from '@/utils/request'
request 仅出现在：api/*.ts、utils/download.ts、utils/request.ts（符合分层）
已接 api 的页面约 35 个（含 PostDetail、HospitalList、DrugList 等）；未接的多为无接口调用的壳页或 mock 页（见下）。

仍 mock、未调用 userApi 的：ProfileEdit、Favorites、MyPosts、Register、Home、Messages 等（接口已在 api/user.ts 预置）。

2. 领域 types/ — ✅ 已建立，⚠️ 使用不完整
已有：common、community、medical、charity、medicare、drug、rehab、user、filter

已用类型示例：CaseShareList（CaseShareItem）、PolicyList（PolicyItem）、PostCard（CommunityPost）、Login（LoginResponseData）、stores → types/user

仍大量存在：约 20+ 个页面 含 any / ref<any[]>（如 AidProjectList、HospitalList、Community、DonationApply 等）

→ 类型目录问题已解决；强类型未铺满。

3. 合并 RegionPicker — ✅ 已完全解决
仅 components/RegionPicker.vue（1 份）
pages/resource/medical/components/RegionPicker.vue 已删除
SmartFilterPopup、ProvinceCityPicker 均走 regionApi
4. usePagedList — ✅ 已解决
已有：composables/usePagedList.ts
已接入 13 个资源列表页：CaseShareList、PolicyList、HospitalList、DoctorList、ExaminationsList、AidProjectList、HelpChannelList、DrugList、ChannelList、DonationProjectList、RehabGuideList、RehabInstitutionList、PsychologicalOrgList
社区 PostList 仍自管分页（依赖 props 联动，模式不同）

5. 下载工具 — ✅ 已解决
已有：utils/download.ts（downloadAndOpenDocument、downloadAndSaveFile，含鉴权与 401）
已接入 11 个页面：CaseShareList/Detail、AidProjectDetail、PolicyDetail、DoctorList（导出）、RehabGuideList/Detail、DrugList/Detail、DonationProjectDetail、HelpChannelDetail
页面层已无内联 uni.downloadFile，下载逻辑统一走 utils/download.ts

6. 清理 unpackage / 死代码 — ✅ 已解决
项	状态
删除 useHome.ts、main/components/PostList.vue、FeatureGrid.vue、pages/index/index.vue
✅
删除重复 RegionPicker
✅
.gitignore 含 unpackage/
✅
unpackage/ 已从 Git 索引移除（本地编译产物，由 dev:mp-weixin 等命令再生，勿手改 dist）

