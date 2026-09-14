# 文档页参考优化记录

## 需求背景

用户希望继续优化当前文档站，使文档页体验更接近参考的 help-center 文档页，包括：

- breadcrumb
- 栏目页文章列表态
- 更接近正式帮助中心的正文排版

## 涉及文件

- `apps/docs-site/src/lib/docs.ts`
- `apps/docs-site/src/pages/DocPage.vue`
- `apps/docs-site/src/components/BreadcrumbNav.vue`
- `apps/docs-site/src/components/ArticleList.vue`
- `apps/docs-site/src/styles.css`

## 逻辑变动点

1. 在文档数据层新增 breadcrumb 与栏目文章列表能力。
2. 新增 `BreadcrumbNav` 组件，用于显示当前页面层级路径。
3. 新增 `ArticleList` 组件，用于栏目页展示本栏文章列表。
4. 在 `DocPage.vue` 中根据当前路由判断：
   - 普通正文页显示 breadcrumb + 正文
   - 栏目页显示 breadcrumb + 栏目正文 + 本栏文章列表
5. 调整正文区样式，增加更清晰的标题、段落、表格、引用块和列表排版。

## 删除了哪些旧逻辑

- 删除了文档页顶部仅显示 `All Docs` 的简单入口形式。
- 删除了栏目页与普通正文页完全共用同一展示形态的旧做法。

## 为什么删除这些逻辑

- 单一顶部入口无法表达当前文档所在层级，导航感较弱。
- 栏目页如果只显示一段简介，用户还需要再回侧边栏找文章，效率较低。
- 新结构更接近帮助中心内容浏览习惯。

## 复用了哪些参考思路

- 复用了参考文档页的 breadcrumb 思路。
- 复用了“目录页显示该目录下文章列表”的展示思路。
- 复用了内容区与导航区分栏的整体信息架构。

## 改动了哪些逻辑

- 将原 Nuxt 中基于内容集合和 route 计算 breadcrumb 的思路，替换为当前项目基于 `SUMMARY.md` 导航树的计算方式。
- 将栏目文章列表的数据来源改为当前站点已有的导航树，而不是原项目的内容查询结果。

## 新方案的收益与影响

### 收益

- 文档层级更清晰。
- 栏目页可直接继续浏览子文章，减少跳转成本。
- 正文排版更接近正式帮助中心的阅读体验。

### 影响

- `DocPage.vue` 的结构和样式明显变化。
- 新增了两个文档页相关组件。

## 已完成的校验项

- 执行 `npm run build`
- 执行 `npm run lint`

## 未完成的校验项

- 未执行浏览器人工验收
- 未执行真实设备下的响应式验证
