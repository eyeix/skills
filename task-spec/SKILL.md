---
name: task-spec
description: "把当前对话定稿为任务规格(背景、方案、决策、分阶段 TODO),落 .agentdocs/workflow/。不做二次访谈,只综合已讨论过的内容。需要拆分执行时接 /task-tickets。"
disable-model-invocation: true
---

# 定稿任务规格

把当前对话与代码库理解合成为任务文档,写入 `.agentdocs/workflow/`。不访谈用户,只综合已知内容。

前置:`.agentdocs/` 应已初始化。未初始化时,告诉用户先运行 `/agentdocs-setup`。

## 流程

1. **前置判断**:需求仍有未解决的关键分歧时,先向用户澄清少量关键问题再继续;已清晰则直接进入下一步。

2. **探索代码库**(若本次会话尚未探索):遵循 `agent-docs` skill 的读纪律,index.md、相关领域文档、术语表。输出使用术语表词汇,尊重相关决策记录。

3. **确定测试边界**:找出将要验证本功能的既有接缝(seam),优先复用既有接缝,新接缝放在尽可能高的位置,全库接缝越少越好。与用户确认接缝选择。

4. **合成任务文档**:按 [task-doc-template.md](task-doc-template.md) 写入 `.agentdocs/workflow/YYMMDD-slug.md`。`YYMMDD` 为当日日期,`slug` 为短横线连接的英文任务简述。

5. **更新索引**:`.agentdocs/index.md` 的"当前任务文档"下追加一行主旨。

6. **收尾提示**:任务需要拆分执行时,建议用户运行 `/task-tickets`。

## 边界

- 任务文档是合成的产物,不是访谈记录:对话里没有的决策不发明,标注"待定"留给后续;
- 简单任务(单文件、单步、低风险)不需要任务文档,直接实现。
