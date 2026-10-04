---
name: run-ticket
description: "Implement a single ticket from .agentdocs/workflow/<task>/tickets/: build test-first, close out with code-review, commit, and update the ticket status. The lightweight counterpart to /team-dev."
disable-model-invocation: true
---

# 执行工单

单张工单、单会话的轻量执行入口;需要组队并行时用 `/team-dev`。

前置:工单存在于 `.agentdocs/workflow/<task>/tickets/`。没有时告诉用户先运行 `/task-tickets`。

## 流程

1. **读工单全文**:理解构建内容与验收标准。工单是唯一任务源,验收标准逐条对照实现;
2. **读相关文档**:遵循 `agent-docs` 的读纪律,任务涉及的领域文档按 index.md 定位阅读;
3. **测试先行构建**:调 Skill 工具执行 `tdd`,在任务文档"测试决策"约定的接缝上红绿循环,一次一片;
4. **检查节奏**:定期跑类型检查与单个测试文件,结束时跑完整测试套件;
5. **收尾审查**:调 Skill 工具执行 `code-review`,固定点为开工前的分支状态,并告知规格为工单文件路径;
6. **修复与提交**:修复审查发现后提交到当前分支(Conventional Commits);
7. **收口工单**:勾选工单验收标准,状态改为 `done`。后续工单因此就绪(阻塞边清空)时提醒用户可继续。

## 边界

- 工单存在拆分缺陷(粒度不对、遗漏依赖)时,先修订工单再继续,与 `team-dev` 同规则;
- 实现中出现方案分歧,回任务文档(`task.md`)找答案;文档没有答案时问用户,不擅自定稿。
