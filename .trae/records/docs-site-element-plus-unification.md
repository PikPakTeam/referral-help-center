# 文档站 Element Plus 页面统一改造记录

## 需求背景

用户希望当前文档站的页面组件尽量统一使用 `Element Plus`，避免首页、搜索页、文档页仍混用较多原生页面容器，导致组件体系不一致、后续样式维护成本偏高。

## 涉及文件

- `apps/docs-site/src/pages/HomePage.vue`
- `apps/docs-site/src/pages/DocPage.vue`
- `apps/docs-site/src/pages/SearchPage.vue`
- `apps/docs-site/src/styles.css`

## 逻辑变动点

1. 修复 `HomePage.vue` 中“查看更多”区域遗留的错误闭合标签，恢复模板可编译状态。
2. 首页 Hero 区改为 `ElCard` 承载，分类卡片统一以 `ElCard` 作为页面级卡片组件。
3. 文档页和搜索页的整体布局改为 `ElContainer / ElAside / ElHeader / ElMain`。
4. 对 `ElCard`、`ElInput`、`ElMenu` 的内层结构补充样式，使视觉间距与原帮助中心风格保持一致。
5. 保留 `RouterLink` 负责站内路由跳转，只将页面容器与交互卡片统一到 `Element Plus` 体系。

## 删除了哪些旧逻辑

- 删除了首页“查看更多”区域残留的旧 `RouterLink` 闭合片段。
- 删除了文档页、搜索页基于原生 `main / aside / section / header` 的页面主布局写法。
- 删除了若干只适用于原生输入框和原生列表导航的旧样式规则。

## 为什么删除这些逻辑

- 残留闭合标签会直接导致模板解析失败，页面无法构建。
- 页面主布局继续保留原生容器，会让“基础组件已切换、页面骨架未切换”的状态长期存在，后续维护时需要同时兼顾两套结构。
- 原生输入框和原生导航样式直接套在 `Element Plus` 组件根节点上会失效，保留这些规则会增加误导。

## 复用了哪些既有思路

- 复用了此前已经完成的 `SearchBox`、`LanguageSwitcher`、`SidebarNav`、`ArticleList`、`DocOutline` 等 `Element Plus` 组件化方向。
- 复用了原帮助中心首页和文档页的视觉信息层次，没有改变原有文档站的数据组织和路由方式。

## 改动了哪些逻辑

- 将页面层改为 `Element Plus` 布局组件，但文档跳转仍然由 Vue Router 负责，避免把路由职责转移到 UI 组件层。
- 将卡片间距控制从卡片根节点迁移到 `.el-card__body`，以适配 `Element Plus` 的实际 DOM 结构。

## 新方案的收益与影响

### 收益

- 页面层和基础组件层统一到同一套 UI 体系。
- 后续继续调整主题色、圆角、间距时，规则更集中。
- 首页、搜索页、文档页的卡片和布局行为更一致。

### 影响

- 样式选择器需要更多面向 `Element Plus` 内部结构。
- 页面 DOM 结构相较之前有调整，需要重新经过 TypeScript / ESLint / 构建校验。

## 已完成的校验项

- 已执行 `npm --prefix ./apps/docs-site run typecheck`
- 已执行 `npm --prefix ./apps/docs-site run lint`
- 已执行 `npm --prefix ./apps/docs-site run build`

## 校验结果

- `typecheck` 通过
- `lint` 通过
- `build` 通过
- 构建仍保留既有的大包体 warning，当前未进一步处理懒加载和拆包
