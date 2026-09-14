# GitBook 跳转异常修复记录

## 需求背景

用户反馈以下两个栏目页在 GitBook 中无法正常跳转：

- `docs/1.计划概览/README.md`
- `docs/6.等级与权益/README.md`

## 涉及文件

- `docs/1.计划概览/README.md`
- `docs/6.等级与权益/README.md`
- `docs/SUMMARY.md`
- `.trae/cache/docs.lark-sync.json`
- `.trae/skills/lark-doc-sync/SKILL.md`

## 逻辑变动点

1. 保留页面标题不变，仅调整这两个栏目的叶子页文件名。
2. 将存在空格、`Pro`、全角问号等字符组合的叶子页文件，重命名为稳定的 ASCII slug 文件名。
3. 同步更新栏目页链接、`SUMMARY.md` 和同步清单中的路径。
4. 在 `lark-doc-sync` Skill 中补充 GitBook 目标目录应优先使用稳定 slug 文件名的约定。

## 删除了哪些旧逻辑

- 删除了这两个栏目下“直接使用标题作为叶子页文件名”的做法。

## 为什么删除这些逻辑

- 本地文件系统允许这类文件名，但 GitBook / URL 解析对空格和特殊标点的兼容性更不稳定。
- 文件标题可以继续保留给页面内容展示，不需要和物理文件名完全绑定。

## 新方案的收益与影响

### 收益

- 这两个栏目下的跳转路径更稳定。
- GitBook、Git、命令行和后续自动同步对路径的兼容性更好。

### 影响

- 这两个栏目下的叶子页文件路径发生变化。
- 本轮已同步更新所有本地引用和同步清单。

## 已完成的校验项

- 检查两个栏目页中的相对链接全部存在。
- 检查 `docs/SUMMARY.md` 中对应链接全部存在。
- 检查 `.trae/cache/docs.lark-sync.json` 中对应路径全部存在。

## 未执行的校验项

- 未执行 TypeScript 校验：仓库中不存在 `tsconfig.json` 或相关命令。
- 未执行 ESLint 校验：仓库中不存在 ESLint 配置或相关命令。
