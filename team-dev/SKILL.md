---
name: team-dev
description: Team-based execution mode for complex development tasks. Use when the user types /team-dev or explicitly asks for team development ("组队开发") or collaboration mode ("协作模式"). The main conversation handles only planning, coordination, and review; implementation is delegated to teammates with model tiers matched to each task's cognitive complexity. When tracer-bullet tickets exist under .agentdocs/workflow/, they replace on-the-fly task breakdown.
---

# 组队开发协议

## 角色与模型分档

模型档位跟随任务认知密度；lead 不做执行，也不在主对话展开深度分析（防止 context 膨胀）：

- **lead**（你自己，主对话，当前模型）：需求澄清、任务拆解与定级、模型分档、结果审查、与用户沟通。不直接执行代码修改与命令。
- **analyst teammate**：分析型任务——代码审阅、架构评审、风险识别、方案设计。spawn 时指定 opus。
- **coder teammate**：执行型任务——按明确 spec 的代码修改、重构、测试运行。spawn 时指定 sonnet。
- **explorer teammate**（按需）：取证型任务——读文件、按 pattern 扫描、跑指定命令并回报。spawn 时指定 haiku。

## 任务分级（拆解时必做）

| 类型 | 特征 | 承接方 |
|------|------|--------|
| 分析型 | 需要自行决定「怎么审/怎么判断」，产出结论或清单 | analyst（opus） |
| 执行型 | 方案明确，照 spec 落地，验收可验证 | coder（sonnet） |
| 取证型 | 收集证据回报，不做判断 | explorer（haiku） |

自检：teammate 拿到任务后还需要自己决定「该怎么做/怎么判断」吗？需要 → 这是分析型，配 opus 或继续拆细。

## 执行流程

### 0. 工单驱动模式（存在工单时）

`.agentdocs/workflow/<task>/tickets/` 下存在工单时，规划由工单承载，第 1 节的拆解步骤让位于工单：

- lead 读取全部工单与阻塞边，直接构建任务 DAG：无阻塞边且未完成的工单构成就绪前沿，可并行派发
- 工单的验收标准即子任务验收标准；委派消息引用工单路径，由 teammate 自行读取，不复制内容
- 工单状态由 lead 维护：派发时改为 in-progress，验收通过后改为 done 并勾选验收标准
- 发现工单拆分缺陷（粒度、遗漏依赖）时，先修订工单再继续：工单是唯一任务源，会话内的口头补充不构成任务

### 1. 现场规划（lead，无工单时）

- 澄清需求、确定方案；涉及多模块时按项目规范创建任务文档
- 拆解为可独立验收的子任务并按上表定级，写明：目标文件、修改要点、验收标准
- 标注依赖关系构建任务 DAG：独立的并行，有依赖的串行；分析型通常是前置节点，其产出决定后续执行任务的拆分

### 2. 组队（lead）

- 按子任务档位 spawn teammates，调用 Agent 工具时：
  - 传 model 参数（analyst → opus，coder → sonnet，explorer → haiku）
  - 同时在 prompt 里点名模型（如 "Use opus"），双保险
  - 不要用 fork（fork 强制继承主对话模型，model 覆盖失效）
  - 给 teammate 起 name（如 analyst-1），便于后续 SendMessage 续聊
- 相互独立的子任务在同一条消息里并行 spawn

### 3. 产物落盘与上下文传递

lead 是路由器，不是复读机：teammate 间的上下文通过文件传递，不经过主对话中转。

- 分析型产物（疑点清单、检查点、改进建议）必须写入文件（任务文档或 `.agentdocs/` 下的分析报告），返回 lead 的只有精炼摘要
- 后续任务的委派消息直接引用产物文件路径（如「依据 analysis/security-review.md 第 3、5 条修复」），由 teammate 自行读取

### 4. 协调（lead）

- teammate 独立上下文、不继承主对话历史，委派消息必须自带完整上下文，模板：

  ```
  ## 任务
  <目标与修改要点；执行/取证型任务应展开为可逐条勾选的检查项>
  ## lead 已知上下文
  <lead 已掌握的关键信息、相关产物文件路径，避免 teammate 从零理解>
  ## 范围
  <涉及文件路径列表>
  ## 验收标准
  <可验证的完成条件，如 lint/format/test 通过>
  ## 返回格式
  精炼总结：改动点、测试结果、遗留问题。不贴大段代码原文；大段产物写文件，只回摘要。
  ```

- teammate 完成会自动通知；等待靠通知，不要轮询
- 追问/纠偏用 SendMessage 发给原 teammate（保留其上下文），不要重开新的

### 5. 审查与收尾（lead）

- 审查返回摘要与关键 diff；分析结论需要深入时读落盘产物，不让 teammate 重述
- 发现问题让原 teammate 修复
- 架构层面歧义 → 与用户讨论；分析层面不确定 → 追问 analyst；实现细节 → 让 coder 自行决策并在返回中说明
- 全部通过后向用户汇报；工单驱动模式下更新工单状态，否则更新任务文档 TODO 状态

## 约束

- teammate 数量按子任务数定，起步 2–3 个
- 单个委派任务要足够具体，一个模糊的大任务不如拆成多个明确的小任务
- opus 只为认知密度买单：纯执行/纯取证的机械任务不得配高档位
- 每轮控制返回信息量，避免吃掉主对话上下文
