# 文档多语言目录拆分记录

## 需求背景

用户希望将当前每篇文档中的中文与英文内容拆开，不再保留双语同页，而是分别生成：

- `docs/zh-CN`
- `docs/en-US`

## 涉及文件

- `docs/**`
- `.trae/cache/docs.lark-sync.json`
- `.trae/skills/lark-doc-sync/SKILL.md`

## 逻辑变动点

1. 将原来同一 Markdown 文件中的中英文内容拆为两份叶子页。
2. 将原来的 `docs/` 内容根重构为：
   - `docs/README.md` 语言入口页
   - `docs/SUMMARY.md` 根导航页
   - `docs/zh-CN/**`
   - `docs/en-US/**`
3. 为 `zh-CN` 与 `en-US` 分别生成根 `README.md`、`SUMMARY.md`、栏目页和叶子页。
4. 将同步清单中的 `path` 调整为 `zh-CN` 主路径，并新增 `localized_paths` 映射字段。
5. 更新本地 Skill 规则，要求后续同步遇到 `## English` 分段时直接拆成双目录。

## 删除了哪些旧逻辑

- 删除了“中英文内容共存于同一叶子页”的旧结构。
- 删除了旧的单层 `docs/*` 叶子页布局。

## 为什么删除这些逻辑

- 双语同页不适合 GitBook 的多语言目录组织，也不利于独立导航。
- 后续如果只想展示某一种语言，双语同页会带来额外清洗成本。
- 分语言目录后，GitBook、搜索、链接维护和后续增量同步都会更稳定。

## 新方案的收益与影响

### 收益

- 中文与英文目录清晰分离，便于直接作为 GitBook 多语言内容根使用。
- 根目录只保留语言入口和导航，结构更稳定。
- 同一篇文档的多语言版本路径关系明确，可通过清单中的 `localized_paths` 追踪。

### 影响

- 原 `docs/1.*` 到 `docs/7.*` 的直接访问路径已被新结构替代。
- 后续任何 GitBook 同步根都应基于 `docs/`，并从语言入口或某个语言子目录开始。

## 已完成的校验项

- 检查 `docs/zh-CN` 与 `docs/en-US` 目录均已生成。
- 检查根入口页、根 `SUMMARY.md`、语言 `README.md`、语言 `SUMMARY.md` 链接均有效。
- 抽样检查叶子页已成功拆成单语言内容。
- 检查 `.trae/cache/docs.lark-sync.json` 中 `path` 与 `localized_paths` 均指向存在的文件。

## 未执行的校验项

- 未执行 TypeScript 校验：仓库中不存在 `tsconfig.json` 或相关命令。
- 未执行 ESLint 校验：仓库中不存在 ESLint 配置或相关命令。
