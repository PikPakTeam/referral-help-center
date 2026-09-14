# GitBook 叶子页扁平化记录

## 需求背景

用户确认采用更符合 GitBook 习惯的结构：保留根页和栏目页的 `README.md`，并将所有 FAQ 叶子页从“目录 + README.md”扁平化为直接的 `.md` 文件。

## 涉及文件

- `引荐计划pro帮助中心/SUMMARY.md`
- `引荐计划pro帮助中心/.lark-sync.json`
- `引荐计划pro帮助中心/*/README.md`
- `引荐计划pro帮助中心/*/*.md`
- `.trae/skills/lark-doc-sync/SKILL.md`

## 逻辑变动点

1. 将所有叶子页从 `问题目录/README.md` 改为 `问题.md`。
2. 保留根页与 7 个栏目页的 `README.md`，维持 GitBook 常见的“首页 + 栏目页 + 正文页”结构。
3. 同步更新栏目页链接、`SUMMARY.md` 和 `.lark-sync.json` 中的路径。
4. 将本地 `lark-doc-sync` Skill 的结构约定改为新的扁平化规则，避免后续同步回退到旧结构。

## 删除了哪些旧逻辑

- 删除了“每个叶子页额外包一层目录”的旧结构。
- 删除了所有叶子页目录中的 `README.md` 命名依赖。

## 为什么删除这些逻辑

- 叶子页没有子页面，保留目录只会增加层级，不提供额外价值。
- GitBook 和普通 Markdown 仓库对正文页更常见的写法就是直接使用 `文件名.md`。
- 目录层级过深会让路径、链接维护和 Git diff 都变得更重。

## 新方案的收益与影响

### 收益

- 结构更贴近 GitBook 的常见 docs-as-code 习惯。
- 路径更短，导航文件更容易维护。
- 后续 Git Sync、批量改名、移动页面都更直接。

### 影响

- 所有叶子页路径已变化，因此依赖这些路径的本地链接必须一起更新。
- 本轮已同步更新 `SUMMARY.md`、栏目页链接和 `.lark-sync.json`。

## 已完成的校验项

- 检查叶子页已全部转换为直接 `.md` 文件。
- 检查 `SUMMARY.md` 中的链接是否全部存在。
- 检查栏目页链接是否已指向新的 `.md` 文件。
- 检查 `lark-doc-sync` Skill 中的结构说明是否已更新。

## 未执行的校验项

- 未执行 TypeScript 校验：仓库中不存在 `tsconfig.json` 或相关命令。
- 未执行 ESLint 校验：仓库中不存在 ESLint 配置或相关命令。
