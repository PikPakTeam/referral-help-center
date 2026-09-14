# Vue + Vite 文档站实现记录

## 需求背景

基于仓库内现有的：

- `docs/zh-CN/**`
- `docs/en-US/**`

实现一个可搜索、可切换语言的 Markdown 文档站。

## 涉及文件

- `apps/docs-site/**`
- `.trae/records/vue-vite-docs-site-plan.md`

## 逻辑变动点

1. 新增 `apps/docs-site` 前端工程，基于 Vue 3 + Vite + TypeScript。
2. 通过 `import.meta.glob` 直接读取仓库根目录下的 `docs/zh-CN/**` 与 `docs/en-US/**`，不复制文档源文件。
3. 通过各语言目录下的 `SUMMARY.md` 解析侧边栏导航树。
4. 在运行时将 Markdown 相对链接重写为站内路由，保证文档源仍可保持 GitBook 友好格式。
5. 基于 `markdown-it` 渲染正文，并抽取 `h2/h3` 生成右侧页面目录。
6. 基于 `MiniSearch + 字符串兜底匹配` 实现搜索。
7. 基于“同路径切语言”实现中英文切换。

## 删除了哪些旧逻辑

- 没有删除仓库中已有业务逻辑。
- 没有改动现有 `docs/**` 文档源内容。

## 为什么删除这些逻辑

- 本次实现是新增站点工程，不涉及替换既有站点代码。

## 新方案的收益与影响

### 收益

- 文档站直接消费现有双语 Markdown 目录，和 Lark 同步链路解耦。
- `SUMMARY.md` 同时可服务 GitBook 和自建站，减少重复导航配置。
- 语言切换基于统一文件路径，维护成本较低。

### 影响

- 新增了独立前端工程目录 `apps/docs-site`。
- 构建产物会打包全部 Markdown 文档，因此当前首版包体较大，构建时会出现 chunk size 提示。

## 已完成的校验项

- 执行 `npm run build`
- 执行 `npm run lint`
- 两项命令均已通过

## 未完成的校验项

- 未执行浏览器端人工点选验证
- 未执行视觉回归测试
