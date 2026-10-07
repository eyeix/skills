---
name: agentdocs-setup
description: "初始化仓库的 .agentdocs/ 工作区:领域文档分类、术语表与 ADR 布局,以及 agent-docs、task-spec、task-tickets、task-retro 共用的任务工作流约定。每仓库首次使用前运行一次。"
disable-model-invocation: true
---

# 初始化工程文档体系

为本仓库生成其他工程 skills 假设的 `.agentdocs/` 工作区:

- **领域文档分类**:架构约束、接口契约等长文档放哪、分几类
- **任务工作流**:`workflow/` 的任务文档与工单约定

本 skill 是提示驱动,非确定性脚本:先探索,呈现发现,与用户逐节确认后写入。

## 流程

### 1. 探索

读已存在的,不假设:

- `git remote -v`:远程与项目性质
- 根目录 `AGENTS.md` 与 `CLAUDE.md`:是否存在,是否已有 Agent docs 指针块
- `.agentdocs/`:是否已初始化(index.md、glossary.md、adr/、workflow/)
- 根目录 `GLOSSARY.md` 与 `docs/adr/`:是否已有其他约定的文档体系
- 技术栈信号(`package.json`、`pyproject.toml`、`go.mod` 等):推断领域文档分类

### 2. 分节确认

每节先给推荐答案,用户一个词即可接受。探索已能确定的节直接跳过。

**A. 领域文档分类。** 按技术栈推断推荐分类(如前端 + 后端 + 产品);用户可增删分类,或全部推迟(空分类起步,文档懒创建)。

**B. 任务工作流。** 默认 `.agentdocs/workflow/`(任务文档、工单、`done/` 归档),几乎不需要改。

### 3. 确认草稿

向用户展示两份草稿,确认后再写入:

- `.agentdocs/index.md` 骨架
- 指针块草稿(载体按第 4 步规则选择)

### 4. 写入

**选择指针块的载体**:已有 Agent docs 指针块的文件原地更新(探索时已知);都没有时写入 `AGENTS.md`(跨工具的通用约定,本 skills 体系面向所有 agent 环境),文件不存在则创建。指针块只写一份,不在多个文件中双写。

仓库存在 `CLAUDE.md` 时,在其中追加一行 `@AGENTS.md` import(已有则跳过):Claude Code 默认在项目存在 `CLAUDE.md` 时不读 `AGENTS.md`,该 import 保证指针块在 Claude Code 下同样可见。

指针块:

```markdown
## Agent docs

- 工程文档、术语、决策与任务状态:`.agentdocs/`(入口 `index.md`,读写纪律见 `agent-docs` skill)
```

`.agentdocs/index.md` 以 [index-template.md](index-template.md) 为种子,按第 2 步的分类定制。

懒创建:`glossary.md` 与 `adr/` 不在此时创建,首次有内容可写时由 `agent-docs` skill 创建。

### 5. 完成

告知用户体系已就绪,哪些 skills 会读取这些文件;后续可直接编辑 `.agentdocs/` 内的文件,只在需要更换布局时重新运行本 skill。
