---
name: agent-docs
description: Project documentation and memory discipline for repos with an .agentdocs/ workspace. Use when starting a coding task in such a repo (before touching code, read the index and the docs it points to), when creating or updating any project doc, glossary term, or decision record, when deciding where to persist knowledge after finishing a task, or when .agentdocs/ is missing but the task needs it.
---

# 工程文档纪律

项目知识与任务状态的家在 `.agentdocs/`,不在会话里。本 skill 定义何时读、读什么、何时写、写哪里。

本 skill 假设所在仓库已由 `/agentdocs-setup` 初始化。若 `.agentdocs/` 不存在而任务需要它,告诉用户运行 `/agentdocs-setup`,不自行创建目录结构。

## 读:编码任务开始前

1. 读 `.agentdocs/index.md`,按其中一行主旨判断与当前任务相关的领域文档(架构约束、接口契约、复用规则),逐一定位阅读。判断依据:任务涉及的模块、层次或约定是否在某条主旨覆盖范围内。
2. 涉及领域术语时读 `glossary.md`(若存在)。输出中的命名使用术语表规定的词,不使用其标记为避免的同义词。
3. 产出与既有决策记录(`adr/`)冲突时,显式指出冲突与理由,不静默覆盖。
4. index 或相关文档不存在时静默继续,不标记缺失,不建议预先创建。

## 写:知识沉淀

任务或讨论中产生以下内容时,当场写入对应位置,不攒批:

| 内容 | 位置 | 判断标准 |
|------|------|---------|
| 术语 | `glossary.md` | 项目特有的概念被精确命名,同义词被排除 |
| 决策 | `adr/NNNN-slug.md` | 难逆转、无上下文会困惑、真实权衡,三条全满足 |
| 可复用模式、跨文件约束 | 对应领域文档 | 跨任务或跨文件适用 |
| 局部实现 | 不写 | 无长期价值 |

- 跨文件约束的典型形态:统一请求管理器、优先复用的滚动容器、禁止自行实现的通道。沉淀时写明"做什么"与"为什么",让后续任务不需要重新发现它;
- 创建文档前先问读取场景:没有明确"谁在什么任务里会读它"的文档不创建,工作汇报与任务总结性质的文档属于此类;
- 已有相关文档时更新它,不新建平行文档;更新按原格式重新组织全文,不在末尾追加;
- 新增文档时在 index.md 对应分类下追加一行主旨;文档废弃时同步删除该行。

## 讨论中的主动纪律

术语与知识在对话中产生时,不等人问,主动做:

- **挑战术语冲突**:用户使用的词与 `glossary.md` 已有定义冲突时,当场指出("术语表定义 X 为 A,你现在似乎指 B,是哪个?");
- **精确化模糊词**:一词多义时要求区分("你说的'账户'指 Customer 还是 User,这是两个概念");
- **边界场景压测**:讨论领域概念间关系时,构造边界场景探明概念的分界;
- **与代码交叉验证**:用户的说法与代码矛盾时指出,不默认用户正确。

## 索引纪律

索引是地图,不是仓库:每条只记一行主旨,细节只存在于文档本身。不在索引里复述文档内容。

## 格式

- 术语表:读 [GLOSSARY-FORMAT.md](GLOSSARY-FORMAT.md) 后再写 `glossary.md`
- 决策记录:读 [ADR-FORMAT.md](ADR-FORMAT.md) 后再写 `adr/`

## 边界

- 任务文档(现状分析、方案、拆解)由 `/task-spec` 创建,不在本 skill 范围;
- 任务完成后的 TODO 更新与归档由 `/task-retro` 执行;
- 跨项目记忆(用户偏好、机器差异)不写入 `.agentdocs/`,属 engram 的范围。
