---
name: task-tickets
description: "Break a task doc, plan, or the current conversation into tracer-bullet tickets under .agentdocs/workflow/, each ticket one file declaring its blocking edges and acceptance criteria. Follow up with /team-dev to execute."
disable-model-invocation: true
---

# 拆分执行工单

把任务文档(或计划、当前对话)拆解为工单:贯通切片,每张声明阻塞它的其他工单。

前置:`.agentdocs/` 已初始化且存在任务文档;没有时告诉用户先运行 `/task-spec`。

## 流程

### 1. 获取上下文

用户给出任务文档路径时读取全篇;否则从当前对话或 `.agentdocs/index.md` 的"当前任务文档"定位。

### 2. 探索代码库(可选)

尚未探索时先探索。工单标题与描述使用术语表词汇,尊重相关决策记录。寻找 prefactor 机会:先让变更容易,再做容易的变更。

### 3. 拆贯通切片

<贯通切片规则>

- 每张切片窄而完整地贯穿所有层(schema、API、UI、测试):纵向,不是单层的横向切片
- 完成的切片可独立演示或验证
- 每张切片的量级适配一个全新 context window
- prefactor 工单排在最前

</贯通切片规则>

每张工单声明**阻塞边**:必须先完成的其他工单。无阻塞边的工单可立即开始。

**宽改造是贯通切片的例外**:一次机械变更(重命名列、改共享符号类型)的影响面覆盖全库时,单次编辑同时破坏大量调用点,没有切片能独立保持测试通过。按 expand-contract 排序:先 expand(新旧并存,无破坏),再分批迁移调用点(每批一张工单,阻塞于 expand),最后 contract(删除旧形式,阻塞于全部迁移批)。

### 4. 用户确认

以编号列表呈现拆分,每张工单展示:标题、阻塞于、交付的端到端行为。询问用户:

- 粒度是否合适(过粗或过细)
- 阻塞边是否正确:每张工单只依赖真正卡住它的工单
- 是否需要合并或再拆

迭代到用户认可。

### 5. 写入工单

目录化:任务文档从 `YYMMDD-slug.md` 移入同名目录 `YYMMDD-slug/task.md`,工单写入 `YYMMDD-slug/tickets/NN-slug.md`,编号从 `01` 起按依赖顺序(被阻塞者在前)。

每张工单按 [ticket-template.md](ticket-template.md)。

同步更新 `.agentdocs/index.md` 中该任务的条目路径。

### 6. 执行提示

建议用户:`/team-dev` 组队执行工单,或逐张以新会话执行、验收后勾选。

## 边界

- 工单不写具体文件路径与代码片段(易过期);例外同任务文档:原型产出的关键形状可内联;
- 不修改任务文档的内容,只做目录化移动。
