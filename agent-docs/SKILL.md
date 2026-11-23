---
name: agent-docs
description: Project memory discipline for repos with an .agentdocs/ workspace. Use when starting a coding task in such a repo (ls .agentdocs/ first, then read what the task touches), when a term or decision crystallizes during discussion, when deciding what to persist after finishing a task, or when .agentdocs/ is missing but the task needs it.
---

# 工程记忆纪律

`.agentdocs/` 是项目的记忆,不是文档库,更不是流程引擎:知识库里只放记忆(术语、决策、领域知识),过程产物(规格、工单)只进暂存区,任务结束即清空。

本 skill 是唯一持有 `.agentdocs/` 读写规则的 skill,其他 skill 不自带写规则。

本 skill 假设所在仓库已由 `/agentdocs-setup` 初始化。若 `.agentdocs/` 不存在而任务需要它,告诉用户运行 `/agentdocs-setup`,不自行创建目录结构。

## 布局:约定即索引

```
.agentdocs/
  glossary.md        # 术语表,懒创建
  adr/NNNN-slug.md   # 决策记录,懒创建
  <领域>.md          # 领域知识(架构、约束、复用规则),懒创建
  workflow/          # 暂存区:仅进行中任务,任务结束清空,空则不存在
```

没有索引文件。导航由三层静态机制承担,均不需要运行时维护:目录位置语义、文件名自述、领域文档首行的"何时读"(如 `frontend.md` 首行:改任何前端代码前读)。开工 `ls .agentdocs/` 得到的视图永远不过期。

## 读:任务开始前

1. `ls .agentdocs/`;领域文档按文件名与首行"何时读"判断与当前任务的相关性,逐一定位阅读相关者;
2. 涉及领域术语时读 `glossary.md`(若存在)。输出中的命名使用术语表规定的词,不使用其标记为避免的同义词;
3. 产出与既有决策记录(`adr/`)冲突时,显式指出冲突与理由,不静默覆盖;
4. 目录或文件不存在时静默继续,不标记缺失,不建议预先创建。

## 写:知识沉淀

判断只有一个问题:**不写这条,下次改代码会违反什么?** 有答案则按路由写入,没有则什么都不写。写下的内容只描述当前约束,不描述任务如何完成;历史由 git 保留。

| 内容 | 位置 | 判断标准 |
|------|------|---------|
| 术语 | `glossary.md` | 代码、配置或 UI 中存在的词,且同义词会写错代码 |
| 决策 | `adr/NNNN-slug.md` | 难逆转、无约束会误改、真实权衡,三条全满足 |
| 跨文件约束 | 对应领域 `.md` | 多个任务里都要求同样写法 |
| 局部实现、任务过程 | 不写 | 无长期价值 |

- 讨论中产生时当场写,不攒批;创建领域文档前先问读取场景:没有明确"谁在什么任务里会读它"的文档不创建,工作汇报与任务总结性质的文档属于此类;
- 已有相关文档时更新它,不新建平行文档;更新按原格式重新组织全文,不在末尾追加;
- `glossary.md` 不收流程术语,ADR 与领域文档不写决策过程或某次任务的发现;
- 新建领域文档时首行写"何时读"。

## 讨论中的主动纪律

术语与知识在对话中产生时,不等人问,主动做:

- **挑战术语冲突**:用户使用的词与 `glossary.md` 已有定义冲突时,当场指出("术语表定义 X 为 A,你现在似乎指 B,是哪个?");
- **精确化模糊词**:一词多义时要求区分("你说的'账户'指 Customer 还是 User,这是两个概念");
- **边界场景压测**:讨论领域概念间关系时,构造边界场景探明概念的分界;
- **与代码交叉验证**:用户的说法与代码矛盾时指出,不默认用户正确。

## 暂存区:workflow/

任务的规格与工单是过程产物,生命周期止于任务结束:

- 进行中任务的规格与工单放 `workflow/YYMMDD-slug/`(规格 `task.md`,工单 `tickets/NN-slug.md`),由 `/interview` 定稿与 `/team-dev` 拆解时写入;
- 任务结束时:先完成上面的知识沉淀,然后删除该任务目录;`workflow/` 清空后目录本身不保留;
- 历史归档依赖 git,不设 `done/`;跨会话恢复长任务靠暂存区里的规格与工单。

## 格式

- 术语表:读 [GLOSSARY-FORMAT.md](GLOSSARY-FORMAT.md) 后再写 `glossary.md`
- 决策记录:读 [ADR-FORMAT.md](ADR-FORMAT.md) 后再写 `adr/`

## 边界

- 跨项目记忆(用户偏好、机器差异)不写入 `.agentdocs/`,属 engram 的范围。
