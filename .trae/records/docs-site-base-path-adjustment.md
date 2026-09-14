# 文档站子路径根调整记录

## 需求背景

用户希望将当前文档站的访问根路径调整为 `/referral/help-center`，以便后续部署到站点子目录时，静态资源加载、首屏直达和前端路由跳转都能保持一致。

## 涉及文件

- `apps/docs-site/vite.config.ts`
- `apps/docs-site/src/router/index.ts`

## 逻辑变动点

1. 在 `vite.config.ts` 中新增统一的 `base` 配置，设置为 `/referral/help-center/`。
2. 在 `router/index.ts` 中将 `createWebHistory()` 改为 `createWebHistory(import.meta.env.BASE_URL)`。
3. 让构建阶段和运行时路由都复用同一个 base 来源，避免资源路径和页面路径出现分裂。

## 删除了哪些旧逻辑

- 删除了 Router 侧默认使用站点根 `/` 作为 history base 的旧行为。

## 为什么删除这些逻辑

- 默认 history base 只适用于站点部署在域名根路径的场景。
- 一旦部署到 `/referral/help-center` 这样的子路径，旧行为会导致刷新 404、资源引用错位或跳转回根目录。

## 新方案相对旧方案的收益与影响

### 收益

- 构建产物会自动带上正确的静态资源前缀。
- `RouterLink`、`router.push`、浏览器直达页面都能正确落在子路径下。
- 后续如果需要继续调整部署前缀，只需同步修改同一处 base 配置。

### 影响

- 构建后的访问入口将从 `/` 变为 `/referral/help-center/`。
- 如果外部反向代理或静态托管还未同步该前缀，需要一并更新部署配置。

## 已完成的校验项

- 已执行 `npm --prefix ./apps/docs-site run typecheck`
- 已执行 `npm --prefix ./apps/docs-site run lint`
- 已执行 `npm --prefix ./apps/docs-site run build`

## 校验结果

- `typecheck` 通过
- `lint` 通过
- `build` 通过
- 构建产物中的资源引用已变为 `/referral/help-center/assets/...`
- 构建仍保留既有的大包体 warning，当前未处理拆包
