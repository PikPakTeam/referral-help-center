---
name: "lark-doc-sync"
description: "Syncs Lark Wiki/Doc content into local Markdown folders and manifest files. Invoke when user asks to pull docs/help-center data from Lark or refresh local synced docs."
---

# Lark Doc Sync

用于把 Lark Wiki / Doc 中的文档数据同步到当前仓库的本地 Markdown 目录。

当前 Skill 面向的是：

- 帮助中心
- FAQ
- 运营文档归档
- 需要把 Lark 文档树落盘到本地目录的场景

当前版本只处理：

1. `Lark -> 本地 Markdown`
2. 根 Wiki 及其目录下的子文档递归同步
3. 生成本地同步清单文件，便于后续增量刷新或校验

不默认处理：

- 本地回写 Lark
- 富文本图片下载与重写
- 从正文中抽取结构化 JSON 并写回业务配置

## 何时使用

在以下场景调用本 Skill：

- 用户给出 Lark Wiki / Doc 链接，要求同步到当前目录
- 用户要求刷新本地帮助中心、FAQ、知识库 Markdown
- 用户要求比对本地同步结果与线上 Lark 文档是否一致
- 用户要求把一棵 Wiki 目录完整拉到本地

如果只是读取某一篇文档内容、回答文档问题，而不是同步成本地文件，不必使用本 Skill。

## 输入来源

支持两类来源：

1. 根 Wiki 链接
2. 单篇 Doc / Wiki 子文档链接

示例：

- `https://xx.sg.larksuite.com/wiki/xxxxx`
- `https://xx.sg.larksuite.com/docx/xxxxx`

## 默认同步模式

若用户未特别说明，默认按：

1. **直接同步**
2. **覆盖本地已同步目录**
3. **默认同步到 `docs/`**
4. **保留目录结构**
5. **生成或刷新 `.trae/cache/docs.lark-sync.json` 清单**

如果用户明确说“先对比不要改文件”，则改为只读比对模式。

## 本地落盘规则

### 1. 目录结构

同步结果默认采用：

- 文档根目录固定为：`docs/`
- 根节点正文写入 `docs/README.md`
- 一级栏目保留目录，并使用 `栏目目录/README.md` 作为栏目首页
- 无子节点的叶子页直接写成同级 `文件名.md`

例如：

```text
docs/
  README.md
  1.计划概览/
    README.md
    加入引荐计划 Pro 后可以退出吗？.md
```

### 2. 一级目录命名

如果 `docs/` 下已经使用了带序号的一级栏目命名，例如：

- `1.计划概览`
- `2.邀请与分享`

则后续同步时应尽量保持这类命名风格，避免无意义目录漂移。

如果目标目录尚不存在，则可按以下优先级决定：

1. 若根文档显然是帮助中心栏目，一级目录可使用 `序号.标题`
2. 其他普通 Wiki 默认直接使用标题

### 3. 文件命名约束

- 目录名使用文档标题
- 只有“带子页面的栏目节点”才保留 `目录/README.md`
- 叶子页优先使用 `文件名.md`
- 对非法文件名字符进行清洗
- 若同级标题重名，追加稳定后缀避免冲突
- 不要为纯叶子页额外创建一层只包含 `README.md` 的目录

### 4. 清单文件

同步后需在仓库的非文档目录生成：

- `.trae/cache/docs.lark-sync.json`

这样做的目的是：

- 不把同步元数据暴露给 GitBook 内容根
- 避免清单文件被误当成文档资源
- 让发布目录只保留 `README.md`、`SUMMARY.md` 和正文页面

清单至少应包含：

- 根 Wiki / Doc 链接
- `space_id`
- 根节点 `node_token`
- 各节点标题
- 各节点 `node_token`
- 各节点本地路径
- 各节点对应的源链接

## 身份与权限规则

### 1. 优先使用 `user`

对目录型同步任务，优先使用 `user` 身份而不是 `bot`，因为：

- 根节点读取可能 bot 可用
- 子节点枚举常常需要 `wiki:node:retrieve`
- bot 经常缺少列目录 scope

### 2. 首次授权流程

如果 `user` 未授权，先执行：

```bash
lark-cli auth login --scope "wiki:node:retrieve" --no-wait --json
```

拿到 `verification_url` 后：

1. 必须把链接原样发给用户
2. 必须生成二维码并展示
3. 等用户确认完成授权后，再执行：

```bash
lark-cli auth login --device-code "<device_code>"
```

### 3. 正文读取

正文抓取优先使用：

```bash
lark-cli docs +fetch --doc "<url_or_token>" --as user --doc-format markdown --format json
```

不要使用浏览器手工复制正文替代 API 拉取。

## 执行流程

### 步骤 1：确认同步对象

先判断用户给的是：

- 根 Wiki
- 单篇子文档
- 已有本地目录的刷新任务

如果是根 Wiki，不要只抓根页正文，必须继续递归子节点。

### 步骤 2：读取根节点

先获取根节点信息：

```bash
lark-cli wiki +node-get --node-token "<wiki_url_or_token>" --as user --format json
```

目标是拿到：

- `space_id`
- `node_token`
- `title`
- `has_child`
- `obj_token`

### 步骤 3：列目录树

若根节点有子节点，递归列出目录：

```bash
lark-cli wiki +node-list --space-id "<space_id>" --parent-node-token "<node_token>" --as user --page-all --format json
```

要求：

- 递归所有子节点
- 保留层级关系
- 不要只同步一级目录

### 步骤 4：抓取正文

对每个节点抓取 Markdown 正文：

```bash
lark-cli docs +fetch --doc "<obj_token>" --as user --doc-format markdown --format json
```

正文写入规则：

- 根节点正文写入根目录 `README.md`
- 带子页面的栏目节点写入对应目录的 `README.md`
- 叶子节点正文写入同级 `文件名.md`
- 正文保持 Markdown 原样，不额外改写文案

### 步骤 5：写入本地目录

同步时建议采用“临时目录构建完成后再整体替换”的方式，避免中途中断留下半成品。

要求：

- 目录结构一次性生成完整
- 若目标目录已存在，完成新目录构建后再覆盖旧目录
- 不要边删边写

### 步骤 6：生成清单

刷新 `.trae/cache/docs.lark-sync.json`，用于记录：

- 当前同步来源
- 节点总数
- 本地路径映射
- 源节点映射

### 步骤 7：校验结果

同步完成后至少检查：

1. `docs/` 是否生成
2. 根页和栏目页是否使用 `README.md`
3. 叶子页是否为直接 `.md` 文件而不是多余目录
4. `.trae/cache/docs.lark-sync.json` 是否存在且路径正确
5. 抽样检查 1 到 3 篇正文是否成功落盘

## 对比模式

如果用户要求“先看差异”，只做以下动作：

1. 读取线上节点树
2. 读取本地 `.trae/cache/docs.lark-sync.json`
3. 输出以下差异：
   - 本地缺失的节点
   - 线上已删除但本地仍存在的节点
   - 标题变化
   - 正文变化

此模式下：

- 不写文件
- 不覆盖目录

## 输出要求

最终回复至少说明：

- 本次来源是根 Wiki 还是单篇文档
- 是否使用了 `user` 授权
- 同步到了哪个本地目录（默认 `docs/`）
- 共同步多少节点
- 生成了多少个 `README.md`
- 是否刷新了 `.trae/cache/docs.lark-sync.json`
- 如果是对比模式，要明确说明“未写文件”

## 注意事项

- 不要把根 Wiki 首页误当成整棵树的全部内容
- 不要跳过子目录递归
- 不要用浏览器复制替代 `lark-cli`
- 不要默认依赖 bot scope
- 不要修改正文语义，只做格式导出与目录同步
- 不要在没有用户明确要求的情况下，顺手把 Markdown 再转成 JSON、HTML 或站点路由

## 推荐配合

若后续用户要求：

- 从同步后的 Markdown 中抽取结构化数据：可再创建专门的数据抽取 Skill
- 将同步结果发布为帮助中心站点：可再配合站点生成或发布类 Skill
