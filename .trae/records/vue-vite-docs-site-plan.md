# Vue + Vite 文档站方案

## 需求背景

当前仓库已经具备整理好的 Markdown 文档源：

- `docs/zh-CN/**`
- `docs/en-US/**`

目标是基于 Vue + Vite 搭建一个：

- 可浏览 Markdown 文档
- 可全文搜索
- 可切换语言
- 可直接消费现有 `docs/` 目录

的文档站点。

## 当前现状

仓库当前还没有现成的 Vue / Vite 前端工程。

已有内容更适合作为文档数据源直接接入，而不是再手工搬运一次。

## 推荐方案

### 技术栈

- Vue 3
- Vite
- TypeScript
- Vue Router
- UnoCSS 或基础 CSS Modules / SCSS
- `markdown-it` 用于 Markdown 渲染
- `minisearch` 用于前端搜索索引

## 为什么这样选

### Vue 3 + Vite

- 启动快
- 结构轻
- 后续扩展交互组件方便

### markdown-it

- 足够轻
- 易于定制标题、代码块、链接、表格样式
- 不强绑定文档框架

### MiniSearch

- 纯前端可用
- 对几十到几百篇文档很合适
- 支持标题、正文摘要、关键词检索
- 比自己手写搜索逻辑稳定很多

## 站点结构建议

建议新增一个独立前端目录：

```text
apps/docs-site/
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  src/
    main.ts
    App.vue
    router/
      index.ts
    pages/
      HomePage.vue
      DocPage.vue
      SearchPage.vue
    components/
      AppHeader.vue
      SidebarNav.vue
      LanguageSwitcher.vue
      SearchBox.vue
      DocToc.vue
    composables/
      useDocsTree.ts
      useDocContent.ts
      useSearch.ts
      useLocale.ts
    lib/
      markdown.ts
      summary.ts
      search-index.ts
      path-map.ts
    styles/
      index.css
```

## 文档源目录

继续直接使用仓库根目录下的：

```text
docs/
  README.md
  SUMMARY.md
  zh-CN/
  en-US/
```

不建议把 Markdown 再复制一份到前端目录，否则后面 Lark 同步后会出现双份维护。

## 路由设计

推荐采用这种 URL 结构：

```text
/
/zh-CN
/zh-CN/1.计划概览/加入引荐计划Pro后可以退出吗
/en-US
/en-US/1.计划概览/加入引荐计划Pro后可以退出吗
/search?locale=zh-CN&q=提现
```

### 路由规则

- 首页：语言入口页
- 文档页：`/:locale/:section/:slug`
- 栏目页：`/:locale/:section`
- 搜索页：独立页面或顶部浮层

## 文档数据加载方案

推荐使用 `import.meta.glob` 直接扫描 Markdown 文件。

### 方案要点

1. 启动时扫描：
   - `../../docs/zh-CN/**/*.md`
   - `../../docs/en-US/**/*.md`
2. 基于文件路径生成：
   - 文档唯一 id
   - locale
   - section
   - slug
   - 原始 markdown
3. 再结合各语言的 `SUMMARY.md` 生成侧边栏树

### 这样做的好处

- 不需要单独维护一份 JSON 菜单
- 文档增删后重新构建即可生效
- 和你现在的目录组织天然一致

## 语言切换方案

### 推荐策略

使用“同路径切语言”。

比如当前页面是：

```text
/zh-CN/6.等级与权益/什么是引荐计划Pro等级
```

切换语言后跳到：

```text
/en-US/6.等级与权益/什么是引荐计划Pro等级
```

### 前提

你现在的中英文叶子页文件名已经统一，所以这个切换非常好做：

- 只替换 locale
- 其余 section 与 slug 保持不变

### 特殊情况

如果某篇文档只存在单语版本：

- 优先跳对应语言栏目页
- 同时给一个“该语言暂无该页面”的提示

## 搜索方案

### 推荐实现

构建时为每种语言生成独立索引：

- `zh-CN` 索引
- `en-US` 索引

### 搜索字段

每篇文档建议至少索引：

- `title`
- `content`
- `section`
- `path`

### 搜索行为

- 默认只搜当前语言
- 支持切换“跨语言搜索”
- 结果展示：
  - 标题
  - 所属栏目
  - 命中摘要
  - 跳转链接

### 中文搜索注意点

MiniSearch 对中文分词能力一般。

所以建议第一版这样处理：

- 中文先按整段文本做模糊包含匹配 + 简单 token 切分
- 英文走 MiniSearch 正常索引

如果后面中文搜索效果不够，再升级成：

- `flexsearch`
- 或构建期接入中文分词

## 页面结构建议

### 左侧

- 文档导航树

### 顶部

- Logo / 站点名
- 搜索框
- 语言切换

### 右侧

- 当前页目录 TOC

### 中间

- Markdown 正文

## Markdown 渲染建议

至少支持：

- 标题锚点
- 代码块高亮
- 表格
- 引用块
- 内部链接跳转

### 建议补充处理

- 自动提取 h2 / h3 生成右侧 TOC
- 统一外链新窗口打开
- 图片懒加载

## 文档导航生成方案

推荐以各语言下的 `SUMMARY.md` 作为单一事实来源。

### 原因

- 你已经有整理好的 `SUMMARY.md`
- 它最适合作为 GitBook 和自建站共用导航
- 避免再维护第二套路由菜单配置

### 具体做法

1. 解析 `docs/zh-CN/SUMMARY.md`
2. 解析 `docs/en-US/SUMMARY.md`
3. 转成前端可用的树结构

## 首页方案

首页不直接堆文档正文，建议只做：

- 品牌标题
- 一句简介
- 语言入口
- 热门问题入口
- 搜索入口

这样比把 `docs/README.md` 原样渲染成首页更干净。

## 推荐的实现边界

### 第一阶段

先做这些：

- 文档树加载
- Markdown 页面渲染
- 左侧导航
- 搜索
- 语言切换
- 基础响应式

### 第二阶段

再加这些：

- 代码高亮主题切换
- 最近浏览
- 搜索高亮
- 404 文档兜底
- sitemap / SEO 元信息

## 与当前同步流程的衔接

后续流程建议是：

```text
Lark -> docs/zh-CN + docs/en-US -> Vue/Vite 文档站
```

也就是前端站点只消费 `docs/`，不介入 Lark 同步逻辑。

这样职责最清晰：

- `lark-doc-sync` 负责产出文档
- docs-site 负责展示文档

## 推荐的最小实现步骤

1. 初始化 `apps/docs-site`
2. 接入 Vue Router
3. 用 `import.meta.glob` 读取 `docs/**`
4. 解析 `SUMMARY.md` 生成导航树
5. 实现 Markdown 渲染页
6. 实现语言切换
7. 实现搜索索引与搜索框
8. 做基础样式和响应式

## 我对这个项目的建议

如果你要的是“可控、可扩展、后面还能加业务组件”的文档站，**自建 Vue + Vite 是合理的**。

如果你只要纯文档展示，其实 VitePress 会更省事。  
但按你现在已经在做：

- 双语目录
- 自定义同步
- 后续可能还要接搜索与业务化入口

我更推荐继续走 **Vue + Vite 自建**，灵活度更高。

## 下一步建议

下一步可以直接进入实现，我建议按下面顺序开工：

1. 先搭 `apps/docs-site` 基础工程
2. 先打通 `SUMMARY.md + Markdown 渲染`
3. 再补搜索
4. 最后补语言切换细节和样式
