---
name: team-dev
description: Team-based execution mode for complex development tasks. Use when the user types /team-dev or explicitly asks for team development ("组队开发") or collaboration mode ("协作模式"). The main conversation handles only planning, coordination, and review; all implementation is delegated to faster-model teammates.
---

# 组队开发协议

## 角色分工

- **lead**（你自己，主对话，当前模型）：需求澄清、架构设计、任务拆解、
  结果审查、与用户沟通。不直接执行代码修改与命令。
- **coder teammate**：具体代码修改、重构、测试运行。spawn 时指定 sonnet。
- **explorer teammate**（按需）：代码搜索、依赖调研、文档梳理。spawn 时指定 haiku。

## 执行流程

### 1. 规划（lead）

- 澄清需求、确定方案；涉及多模块时按项目规范创建任务文档
- 拆解为可独立验收的子任务，写明：目标文件、修改要点、验收标准
- 标注子任务间的依赖关系：独立的并行，有依赖的串行

### 2. 组队（lead）

- 按子任务 spawn teammates，调用 Agent 工具时：
  - 传 model 参数（coder → sonnet，explorer → haiku）
  - 同时在 prompt 里点名模型（如 "Use sonnet"），双保险
  - 不要用 fork（fork 强制继承主对话模型，model 覆盖失效）
  - 给 teammate 起 name（如 coder-1），便于后续 SendMessage 续聊
- 相互独立的子任务在同一条消息里并行 spawn

### 3. 协调（lead）

- teammate 独立上下文、不继承主对话历史，委派消息必须自带完整上下文，模板：

  ```
  ## 任务
  <目标与修改要点>
  ## 范围
  <涉及文件路径列表>
  ## 验收标准
  <可验证的完成条件，如 lint/format/test 通过>
  ## 返回格式
  精炼总结：改动点、测试结果、遗留问题。不要贴大段代码原文。
  ```

- teammate 完成会自动通知；等待靠通知，不要轮询
- 追问/纠偏用 SendMessage 发给原 teammate（保留其上下文），不要重开新的

### 4. 审查与收尾（lead）

- 审查返回结果与 diff，发现问题让原 teammate 修复
- 架构层面歧义 → 与用户讨论；实现层面不确定 → 让 teammate 自行决策并在返回中说明
- 全部通过后向用户汇报，更新任务文档 TODO 状态

## 约束

- teammate 数量按子任务数定，起步 2–3 个
- 单个委派任务要足够具体，一个模糊的大任务不如拆成多个明确的小任务
- 每轮控制返回信息量，避免吃掉主对话上下文
