---
name: agentdocs-setup
description: "初始化仓库的 .agentdocs/ 记忆工作区(布局约定与 AGENTS.md 指针块)。每仓库首次使用前运行一次。"
disable-model-invocation: true
---

# 初始化工程记忆工作区

为本仓库生成 `agent-docs` skill 假设的 `.agentdocs/` 布局与入口指针。

本 skill 是提示驱动,非确定性脚本:先探索,呈现发现,与用户确认后写入。

## 流程

### 1. 探索

读已存在的,不假设:

- `git remote -v`:远程与项目性质
- 根目录 `AGENTS.md` 与 `CLAUDE.md`:是否存在,是否已有 Agent docs 指针块
- `.agentdocs/`:是否已初始化(glossary.md、adr/、领域文档、workflow/)
- 根目录 `GLOSSARY.md` 与 `docs/adr/`:是否已有其他约定的文档体系
- 技术栈信号(`package.json`、`pyproject.toml`、`go.mod` 等):推断领域文档将涉及哪些领域

### 2. 确认

向用户呈现两份草稿,确认后再写入:

- **指针块**(载体按第 3 步规则选择);
- **计划创建的领域文档清单**:按技术栈推断(如 `frontend.md`、`backend.md`),每份附一句首行"何时读"。用户也可全部推迟:空目录起步,文档懒创建,首次有内容可写时由 `agent-docs` skill 创建。

### 3. 写入

**选择指针块的载体**:已有 Agent docs 指针块的文件原地更新(探索时已知);都没有时写入 `AGENTS.md`(跨工具的通用约定,本 skills 体系面向所有 agent 环境),文件不存在则创建。指针块只写一份,不在多个文件中双写。

仓库存在 `CLAUDE.md` 时,在其中追加一行 `@AGENTS.md` import(已有则跳过):Claude Code 默认在项目存在 `CLAUDE.md` 时不读 `AGENTS.md`,该 import 保证指针块在 Claude Code 下同样可见。

指针块:

```markdown
## Agent docs

- 项目记忆(术语、决策、领域知识)与进行中任务的暂存区:`.agentdocs/`,开工先 `ls` 再按需读,读写纪律见 `agent-docs` skill
```

然后创建 `.agentdocs/` 与已确认的领域文档(首行"何时读"),`glossary.md`、`adr/`、`workflow/` 均不预先创建,首次有内容可写时由 `agent-docs` skill 创建。

### 4. 完成

告知用户体系已就绪,哪些 skills 会读取这些文件;后续可直接编辑 `.agentdocs/` 内的文件,只在需要更换布局时重新运行本 skill。
