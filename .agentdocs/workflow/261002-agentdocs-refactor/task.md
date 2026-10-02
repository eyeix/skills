# 将 agent docs 工程组织方式重构为可分发 skills 体系

## 背景与问题

当前工程组织方式定义在用户全局 `CLAUDE.md` 中:靠常驻系统提示词驱动 Agent 读 写 `.agentdocs/` 文档、维护索引、创建与归档任务文档、执行任务回顾。该方式有三个结构性弱点:

1. **不可分发**:能力绑定个人提示词,全新环境(无任何系统提示词)的 Agent 无法获得同等能力;
2. **触发不可靠**:"必读"、"必须"类软指令靠模型自觉执行,常驻 context 却换不来确定性;
3. **常驻成本高**:文档与记忆、任务处理、任务回顾三段规则每个会话全程常驻,无论任务是否相关。

参照 mattpocock/skills 的验证结论:流程纪律装入 skills,由 harness 级触发机制驱动;常驻成本从大段规则收缩为一行 description;文档作为工作流的产物懒创建,而非预先铺设的说明书。

## 方案概述

把工程组织能力(文档读写纪律、任务工作流、知识沉淀、复盘闭环)重构为本仓库的 skills,使全新环境零提示词的 Agent 安装后即获得完整体系。用户全局 `CLAUDE.md` 同步瘦身,个人环境与新环境同构,证明体系不依赖系统提示词。

## 现状分析

- 本仓库现有 skills:`commit-msg`、`sync-readme`、`sync-claude-md`、`team-dev`、`engram`,均为独立能力,无体系性工作流;
- `team-dev` 已具备任务 DAG、模型分档、产物落盘、context pointer 传递,与 mattpocock 的 `implement-spec` 高度同构,缺的是上游(任务文档 → 工单)的标准输入;
- 编码纪律层(tdd、code-review、grilling、domain-modeling、research、prototype 等)不自建,声明与 mattpocock-skills 的组合关系,避免重复建设;
- 本仓库无 `.agentdocs/`,本次按新体系初始化,任务文档自身即新格式首个实例。

## 实现决策

### Skill 清单

| skill | 调用 | 职责 | 对标 |
|-------|------|------|------|
| `agentdocs-setup` | user | 项目初始化:探索现状、确认布局、产出 `.agentdocs/` 骨架与 CLAUDE.md 指针块 | setup-matt-pocock-skills |
| `agent-docs` | model | 文档与记忆读写纪律:何时读索引、何时写回、懒创建、索引与格式维护 | domain-modeling + 文档哲学 |
| `task-spec` | user | 当前对话合成为任务文档,不做二次访谈 | to-spec |
| `task-tickets` | user | 任务文档拆解为带阻塞边的工单文件 | to-tickets(local 模式) |
| `team-dev`(增强) | user | 增加工单驱动模式:消费工单文件构建 DAG | implement-spec |
| `task-retro` | user | 复盘:TODO 更新与归档、知识写回、环境改进建议 | retro |

### 调用架构

- 编排层 skills(user-invoked,`disable-model-invocation: true`)之间不互相调用,只组合纪律层;编排层只被用户键入触发;
- 纪律层(`agent-docs`,model-invoked)的 description 承载全部触发条件,正文按需加载;
- 编排层引用编码纪律(tdd、code-review 等)时条件式表述:已安装则调用,未安装则按内联基准执行。

### 目录与文件约定

```
.agentdocs/
  index.md                 # 索引:是地图不是仓库,每条一行主旨
  glossary.md              # 术语表,首次沉淀术语时懒创建
  adr/                     # 决策记录,首次记录决策时懒创建
  <分类目录>/              # 领域文档(产品/前端/后端等,agentdocs-setup 时定制)
  workflow/
    YYMMDD-slug.md         # 简单任务:单文件任务文档
    YYMMDD-slug/           # 复杂任务:task-tickets 时目录化
      task.md              # 任务文档(从单文件移入)
      tickets/NN-slug.md   # 工单:每张一文件,声明阻塞边与验收标准
    done/                  # 归档:task-retro 时移入
```

- 任务文档拆票时由单文件升级为同名目录,工单编号从 `01` 起按依赖顺序;
- 归档原子化:整目录(或单文件)移入 `done/`,同步从 index 移除条目。

### 上下文卫生

- 对齐 → 任务文档 → 拆票保持在同一 context window,不中途清空;
- 每张工单的执行从全新 context 起步,teammate 间只传 context pointer(工单路径、产物路径),不复制内容;
- 状态的家在文件系统,不在会话。

### 知识沉淀边界

- 术语 → `glossary.md`(纯术语定义,无实现细节);
- 难逆转且无上下文会困惑且真实权衡的决策 → `adr/`(三条全满足才记录);
- 可复用模式与跨文件约束 → 对应领域文档;
- 局部实现,无长期价值 → 不写;
- 跨项目记忆由 engram 承担,`.agentdocs/` 只管项目内知识。

## 测试决策

- 本仓库为纯 Markdown skill 仓库,无测试框架,验证以 `AGENTS.md` 检查项走查为准:frontmatter 规范(name 与目录一致、英文 description)、README 链接有效、node 脚本不涉及;
- 每个 skill 正文完成后做主路径走查(触发条件、步骤可达、模板引用一致);
- `task-tickets` 完成后对本任务文档真实执行一次,工单产物即体系首个实例。

## 任务拆解

- [x] 阶段一:初始化 `.agentdocs/`(index.md 与本任务文档)
- [x] 阶段二:`agent-docs` skill(纪律层核心:读写纪律 + 格式文件)
- [x] 阶段三:`agentdocs-setup` 与 `task-spec` skills(初始化与任务文档合成)
- 阶段四至七经 `/task-tickets` 拆解为 `tickets/` 下的工单,进度以工单状态为准:
  - `tickets/01-task-tickets-and-team-dev.md` - done
  - `tickets/02-task-retro.md` - done
  - `tickets/03-claude-md-and-readme.md` - in-progress(README 完成;全局 CLAUDE.md 瘦身经用户要求延后,待 skills 验证后确认执行)
  - `tickets/04-verify-and-wrap-up.md` - done

## 范围外

- 不重写编码纪律层(tdd、code-review、grilling 等),以组合声明方式引用 mattpocock-skills;
- 不引入 issue tracker 抽象(GitHub Issues / Linear),工单只用本地 markdown;
- 不改动 `engram`、`commit-msg`、`sync-readme`、`sync-claude-md`;
- 不涉及本仓库之外的任何项目的 `.agentdocs/` 迁移。
