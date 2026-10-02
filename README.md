# skills

个人常用的 Skills 合集，用于跨设备共享。

## 安装

```bash
/install-github eyeix/skills
```

## 工程组织体系

不依赖任何系统提示词：全新环境安装本仓库 skills 后即获得完整的工程组织能力(文档纪律、任务工作流、知识沉淀、复盘闭环)。项目首次使用先运行 `/agentdocs-setup` 初始化 `.agentdocs/` 工作区。

```
想法 ──► /task-spec ──► /task-tickets ──► /team-dev ──► /task-retro
         合成任务文档      拆解为工单       组队执行       收口复盘
                    (agent-docs 纪律贯穿全程)
```

- `/task-spec` 把当前对话合成为任务文档，`/task-tickets` 拆解为带阻塞边的工单文件(每张一个文件，状态持久在文件系统而非会话)；
- `agent-docs` 由模型自动触发：编码任务开始前读索引与相关文档，知识产生时当场写回术语表、决策记录或领域文档；
- `/team-dev` 组队执行：存在工单时直接消费工单构建任务 DAG；
- `/task-retro` 收口：TODO 与工单状态核对、归档、知识写回、agent 环境改进建议；
- 编码纪律(TDD、代码审查、需求访谈、领域建模)推荐组合 [mattpocock/skills](https://github.com/mattpocock/skills)(`claude plugins install mattpocock-skills`)，与本体系正交。

## Skills

### [`agentdocs-setup`](./agentdocs-setup/SKILL.md)

初始化项目的 `.agentdocs/` 工作区:领域文档分类、术语与决策记录布局、任务工作流约定,并写入 CLAUDE.md 指针块。

**触发：** 用户输入 /agentdocs-setup(每仓库一次)

---

### [`agent-docs`](./agent-docs/SKILL.md)

工程文档纪律:任务开始前读什么、知识产生时写哪里、索引与懒创建规则如何维护,含术语表与决策记录格式。

**触发：** `.agentdocs/` 项目中的编码任务、文档读写、知识沉淀判断(模型自动)

---

### [`task-spec`](./task-spec/SKILL.md)

把当前对话与代码库理解合成为任务文档(背景、方案、决策、阶段拆解),不做二次访谈。

**触发：** 用户输入 /task-spec

---

### [`task-tickets`](./task-tickets/SKILL.md)

把任务文档拆解为工单:贯通切片、阻塞边、验收标准,每张工单一个文件。

**触发：** 用户输入 /task-tickets

---

### [`task-retro`](./task-retro/SKILL.md)

任务复盘:状态收口与归档、知识写回判断、agent 环境改进建议(按严重度)。

**触发：** 用户输入 /task-retro

---

### [`team-dev`](./team-dev/SKILL.md)

复杂开发任务的组队执行模式：主对话(lead)只负责规划、协调与审查，具体实现全部委派给快模型 teammates(coder → sonnet，explorer → haiku)执行;存在工单时直接消费工单构建任务 DAG。

**触发：** 用户输入 /team-dev 或明确要求“组队开发”“协作模式”时

---

### [`commit-msg`](./commit-msg/SKILL.md)

分析暂存变更，生成符合 [Conventional Commits](https://www.conventionalcommits.org/) 规范的提交信息。

**触发：** 用户要求生成 / 编写 commit message 时

---

### [`sync-readme`](./sync-readme/SKILL.md)

将代码库实际状态与 README.md 系统性对比，以外科手术式更新（而非重写）保持文档准确。

**触发：** 用户要求更新 README，或对话中出现了文档未记录的用户可见变更时

---

### [`sync-claude-md`](./sync-claude-md/SKILL.md)

将代码库实际状态与 CLAUDE.md 系统性对比，识别过时或缺失内容并精准 patch。

**触发：** 用户要求更新 CLAUDE.md，或代码库架构/约定/命令发生变化时

---

### [`engram`](./engram/SKILL.md)

全局自进化记忆：`/engram setup` 将会话启动注入与会话结束巩固两个 hooks 登记进用户级 settings，此后全自动生效；`review` 审查整理记忆，`sync` 经 git 远程多机同步，`status` 查看状态。跨项目记忆(用户偏好、机器差异)与项目内 `.agentdocs/` 互补。

**触发：** 用户输入 /engram，或要求设置、整理、检查、同步记忆时

> 由 [engram](https://github.com/eyeix/engram) 插件形态改造而来，hooks 脚本复制自基线提交 `0062298`；上游后续变更需手动同步到本仓库副本。

---

## License

MIT
