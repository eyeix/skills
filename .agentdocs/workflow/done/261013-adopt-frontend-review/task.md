# 新增前端审查 skill review-frontend-production

## 背景与问题

仓库已有编码纪律层(code-review 审查 diff、diagnose 查 bug),缺少面向**整个前端产品**的审查能力:逐页、逐状态、逐组件核对实际行为与证据。

## 方案概述

`review-frontend-production` 提供两层审查:quick 快速体检聚焦选定旅程;full 完整审查逐页逐组件建立证据台账、问题清单、重构方案与验收条件。配套 2 个 Python 标准库脚本(台账校验、只读候选发现)、17 项回归测试与虚构示例。

## 实现决策

| 项 | 决策 | 理由 |
|---|---|---|
| 目录名 / Skill ID | `review-frontend-production` | 正文多处自引用该 ID |
| `description` 语言 | 英文 | 模型可调 skill 的约定(CLAUDE.md),保留触发分支 |
| 标点 | 半角 | 与仓库其余 skill 一致 |
| 形态 | 规则库保持原样,不逐句重构 | 见 ADR-0005 |

## 测试决策

`AGENTS.md` 的 Python 条目已补齐:`python3 -B -m unittest discover -s tests`(17 项通过)、`verify_fixture.py` 通过、示例三个门槛退出码 0/2/2 符合预期。另在虚构搜索项目上演练主路径:发现脚本、台账 init/sync/render/check、快速体检报告形状;演练产物落在 /tmp,不入库。

## 状态

- [x] skill 文件就位,frontmatter 与标点适配
- [x] AGENTS.md 补 Python 检查项
- [x] README 条目与 which-skill 路由登记
- [x] 验证记录(VALIDATION.md)
- [x] 主路径演练
