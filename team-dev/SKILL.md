---
name: team-dev
description: "Team-based execution mode for complex development tasks. Use when the user types /team-dev or explicitly asks for team development (“组队开发”) or collaboration mode (“协作模式”). The main conversation handles only planning, coordination, and review; implementation is delegated to teammates with model tiers matched to each task's cognitive complexity. When a task spec exists under .agentdocs/workflow/, it drives execution end to end."
disable-model-invocation: true
---

# 组队执行协议

## 输入:规格驱动与现场规划

`.agentdocs/workflow/<task>/` 下存在规格(`task.md`)时进入**规格驱动模式**:

- 读规格全篇(现象、目标行为、改动清单);
- `tickets/` 下已有工单时,直接按"执行"节构建 DAG;
- 尚无工单时,按"拆解:贯通切片"节拆分,与用户确认后写入 `tickets/NN-slug.md`(`NN` 从 `01` 起按依赖顺序,被阻塞者在前),每张按 [ticket-template.md](ticket-template.md);
- 工单是唯一任务源:会话内的口头补充不构成任务,变更先改工单。

没有规格时**现场规划**:澄清需求、确定方案,涉及多模块时建议用户先经 `/interview` 定稿规格;任务不复杂则直接按下文拆解。

## 拆解:贯通切片

- 每张切片窄而完整地贯穿所有层(schema、API、UI、测试):纵向,不是单层的横向切片;
- 完成的切片可独立演示或验证;
- 每张切片的量级适配一个全新 context window;
- 每张工单声明**阻塞边**:必须先完成的其他工单。无阻塞边的工单可立即开始;
- 寻找 prefactor 机会:先让变更容易,再做容易的变更;prefactor 工单排在最前;
- 工单不写具体文件路径与代码片段(易过期);例外:原型产出的关键形状可内联。

**宽改造是贯通切片的例外**:一次机械变更(重命名列、改共享符号类型)的影响面覆盖全库时,单次编辑同时破坏大量调用点,没有切片能独立保持测试通过。按 expand-contract 排序:先 expand(新旧并存,无破坏),再分批迁移调用点(每批一张工单,阻塞于 expand),最后 contract(删除旧形式,阻塞于全部迁移批)。

拆分结果以编号列表呈现(每张:标题、阻塞于、交付的端到端行为),与用户确认粒度、阻塞边、是否需要合并或再拆,迭代到用户认可后写入。

**工单存在拆分缺陷**(粒度不对、遗漏依赖)时,先修订工单再继续。实现中出现方案分歧,回规格(`task.md`)找答案;规格没有答案时问用户,不擅自定稿。

## 角色与模型分档

模型档位跟随任务认知密度;lead 不做执行,也不在主对话展开深度分析(防止 context 膨胀):

- **lead**(你自己,主对话,当前模型):需求澄清、任务拆解与定级、模型分档、结果审查、与用户沟通。不直接执行代码修改与命令。
- **analyst teammate**:分析型任务——代码审阅、架构评审、风险识别、方案设计。spawn 时指定 opus。
- **coder teammate**:执行型任务——按明确 spec 的代码修改、重构、测试运行。spawn 时指定 sonnet。
- **explorer teammate**(按需):取证型任务——读文件、按 pattern 扫描、跑指定命令并回报。spawn 时指定 haiku。

## 任务分级(拆解时必做)

| 类型 | 特征 | 承接方 |
|------|------|--------|
| 分析型 | 需要自行决定「怎么审/怎么判断」,产出结论或清单 | analyst(opus) |
| 执行型 | 方案明确,照 spec 落地,验收可验证 | coder(sonnet) |
| 取证型 | 收集证据回报,不做判断 | explorer(haiku) |

自检:teammate 拿到任务后还需要自己决定「该怎么做/怎么判断」吗?需要 → 这是分析型,配 opus 或继续拆细。

## 执行

- lead 读取全部工单与阻塞边,构建任务 DAG:无阻塞边且未完成的工单构成就绪前沿,可并行派发;
- 工单的验收标准即子任务验收标准;委派消息引用工单路径,由 teammate 自行读取,不复制内容;
- 工单状态由 lead 维护:派发时改为 in-progress,验收通过后改为 done 并勾选验收标准;
- teammate 遵循仓库的编码纪律 skills(已安装时):构建走 tdd,收尾走 code-review(固定点为开工前的分支状态,规格轴以工单文件路径为源)。

## 组队(lead)

- 按子任务档位 spawn teammates,调用 Agent 工具时:
  - 传 model 参数(analyst → opus,coder → sonnet,explorer → haiku)
  - 同时在 prompt 里点名模型(如 "Use opus"),双保险
  - 不要用 fork(fork 强制继承主对话模型,model 覆盖失效)
  - 给 teammate 起 name(如 analyst-1),便于后续 SendMessage 续聊
- 相互独立的子任务在同一条消息里并行 spawn

## 产物落盘与上下文传递

lead 是路由器,不是复读机:teammate 间的上下文通过文件传递,不经过主对话中转。

- 分析型产物(疑点清单、检查点、改进建议)必须写入文件(暂存区的任务目录下),返回 lead 的只有精炼摘要;
- 后续任务的委派消息直接引用产物文件路径(如「依据 analysis/security-review.md 第 3、5 条修复」),由 teammate 自行读取。

## 协调(lead)

- teammate 独立上下文、不继承主对话历史,委派消息必须自带完整上下文,模板:

  ```
  ## 任务
  <目标与修改要点;执行/取证型任务应展开为可逐条勾选的检查项>
  ## lead 已知上下文
  <lead 已核对的文件、命令、接口与用户裁决,附产物路径,避免 teammate 从零理解>
  ## 范围
  <涉及文件路径列表>
  ## 验收标准
  <可验证的完成条件,如 lint/format/test 通过>
  ## 返回格式
  精炼总结:改动点、测试结果、遗留问题。不贴大段代码原文;大段产物写文件,只回摘要。
  ```

- teammate 完成会自动通知;等待靠通知,不要轮询;
- 追问/纠偏用 SendMessage 发给原 teammate(保留其上下文),不要重开新的。

## 审查与收尾(lead)

- 审查返回摘要与关键 diff;分析结论需要深入时读落盘产物,不让 teammate 重述;
- 发现问题让原 teammate 修复;
- 架构层面歧义 → 与用户讨论;分析层面不确定 → 追问 analyst;实现细节 → 让 coder 自行决策并在返回中说明;
- 全部通过后:向用户汇报,然后调 Skill 工具执行 `agent-docs` 的知识沉淀判断,写入值得留下的记忆,删除暂存区中该任务的目录(规格与工单完成历史使命,git 保留其历史)。

## 约束

- teammate 数量按子任务数定,起步 2–3 个;
- 单个委派任务要足够具体,一个模糊的大任务不如拆成多个明确的小任务;
- opus 只为认知密度买单:纯执行/纯取证的机械任务不得配高档位;
- 每轮控制返回信息量,避免吃掉主对话上下文。
