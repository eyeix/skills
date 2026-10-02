# 01: task-tickets skill 与 team-dev 工单驱动增强

**构建内容:** `.agentdocs/workflow/` 的任务可拆解为带阻塞边的工单文件,team-dev 可消费工单构建任务 DAG,本任务自身完成首次拆票。

**阻塞于:** 无(可立即开始)

**状态:** done

- [x] `task-tickets/SKILL.md` 存在,含贯通切片规则、宽改造例外、目录化流程与用户确认步骤
- [x] `task-tickets/ticket-template.md` 存在,含构建内容、阻塞于、状态、验收标准
- [x] `team-dev` 增加工单驱动模式(执行流程第 0 节),description 反映工单输入
- [x] 本任务文档完成目录化(task.md + tickets/),`.agentdocs/index.md` 条目路径同步
