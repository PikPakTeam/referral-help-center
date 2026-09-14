# 文档站首页参考实现迁移记录

## 需求背景

用户希望当前 Vue + Vite 文档站首页参考：

- `/Users/jeffy/Documents/pikpak-code/pikpak_ssr/app/pages/help-center/index.vue`
- `/Users/jeffy/Documents/pikpak-code/pikpak_ssr/app/pages/help-center/[...slug].vue`

的页面形态进行调整，并迁移可复用的资源文件；同时剔除登录、顶部菜单等与纯文档站无关的功能，仅保留文档访问与语言切换能力。

## 涉及文件

- `apps/docs-site/src/pages/HomePage.vue`
- `apps/docs-site/src/components/SearchBox.vue`
- `apps/docs-site/src/components/LanguageSwitcher.vue`
- `apps/docs-site/src/styles.css`
- `apps/docs-site/src/assets/help-center/*`

## 逻辑变动点

1. 参考原 help-center 首页的“分类卡片 + 子文章预览”结构，重写当前站点首页。
2. 迁移参考工程中的 banner、栏目图标和箭头图标资源到当前项目。
3. 首页语言切换改为直接切换当前首页语言视图，不引入全局 header 或登录逻辑。
4. 首页搜索继续复用当前文档站的搜索页能力，但改成更贴近参考页的入口位置与视觉布局。
5. 首页栏目卡片仍然直接基于当前 `docs/**/SUMMARY.md` 解析结果生成，不额外维护一份静态配置。

## 删除了哪些旧逻辑

- 删除了原先极简的首页入口卡片布局。
- 没有引入参考项目中依赖 Nuxt Layout、全局导航、登录状态、顶部菜单的逻辑。

## 为什么删除这些逻辑

- 原首页仅适合作为开发阶段入口，不符合帮助中心首页展示需求。
- 参考项目中的全局布局和登录能力依赖当前仓库不存在的运行时环境，直接迁入会引入无效耦合。
- 当前项目是纯文档站，只保留文档浏览、搜索和语言切换能保持结构最清晰。

## 复用了哪些参考思路

- 复用了参考首页的栏目卡片布局思路。
- 复用了“每个栏目展示若干子文章 + 查看更多入口”的信息结构。
- 复用了参考项目的 help-center 图标与 banner 资源。

## 改动了哪些逻辑

- 将原项目依赖 CMS / Nuxt 内容导航的数据来源，替换为本项目自己的 `SUMMARY.md` 导航树。
- 将语言切换实现为当前首页 query 级别的 locale 切换，而不是依赖全局 i18n 布局。
- 将搜索入口接到当前 Vue 文档站的 `/search` 页面，而不是原项目的 store / Nuxt composable。

## 新方案的收益与影响

### 收益

- 首页视觉结构更接近正式帮助中心。
- 保持了当前文档站“文档源唯一、导航唯一”的架构，不会多出一套手工栏目配置。
- 资源和样式更贴近参考实现，但没有把不需要的全局功能带进来。

### 影响

- 首页布局和样式发生明显变化。
- 新增了若干静态资源文件。

## 已完成的校验项

- 执行 `npm run build`
- 执行 `npm run lint`

## 未完成的校验项

- 未执行浏览器人工验收
- 未执行视觉对比截图校验
