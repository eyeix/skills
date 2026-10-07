---
name: handoff
description: "把当前会话压缩为交接文档,落 .agentdocs/ 持久化,供新上下文的 agent 接手继续。"
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

# 会话交接

把当前会话压缩成交接文档,让全新上下文的 agent 能继续这项工作。

## 落盘位置

- 有活动任务目录(`.agentdocs/workflow/<task>/`)时,写入该目录:`handoff-<NN>.md`,编号递增;
- 没有任务目录时,写入 `.agentdocs/workflow/handoff-<YYMMDD>-<slug>.md`。

交接文档是持久产物,不写系统临时目录。

## 内容

- **目标**:这项工作要到达哪里,当前进行到哪一步;
- **已完成**:已定稿的决策与原因(引用 `.agentdocs/adr/` 编号,不复述内容);
- **进行中**:当前卡点、未决问题、下一步;
- **产物指针**:任务文档、工单、原型分支、研究笔记、相关 commit——全部以路径或 URL 引用,不复制内容。已有产物(spec、ADR、工单、commit、diff)里的一切,引用而不转述;
- **建议 skills**:下一个 agent 应该调用的 skill 清单(如"继续执行剩余工单:调 Skill 工具执行 run-ticket;收口:调 Skill 工具执行 task-retro");
- 用户传了参数时,参数即下一会话的用途,据此裁剪文档重点。

## 脱敏

API key、密码、个人身份信息一律脱敏,写入前逐段检查。
