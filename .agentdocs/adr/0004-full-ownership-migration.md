# 推翻混合采纳,工程 skills 全量自有化

本仓库全部工程 skills 自有,不再依赖 mattpocock-skills 插件订阅:纪律层(tdd、code-review、interview、research、prototype、diagnose、pr 等)重构迁移为中文自有版,布局与组合方式适配 `.agentdocs/` 体系;编码纪律的原版设计源自 mattpocock/skills,重构保留其纪律骨架。

## 背景

ADR 0003 确立混合采纳(纪律层订阅、编排层自建)。订阅模式的弱点:上游演进不可控、布局(GLOSSARY.md 根目录)与 `.agentdocs/` 体系冲突、无法按需改造组合关系。审计(见 0003)已证明纪律层与 Matt 编排层零耦合,迁移无断链风险,全量自有化可行。

## 决策

- 19 个 skills 重构迁移,含两处合并:grilling+grill-with-docs → `interview`(访谈+当场沉淀一体,无文档环境退化为纯访谈),setup-pre-commit+git-guardrails → `guardrails`(项目守门一体);
- 两处重构新造:`implement` → `run-ticket`(消费本体系工单文件),`ask-matt` → `which-skill`(路由本体系链路);
- 布局引用统一改 `.agentdocs/`;code-review 的 Spec 轴来源改为任务文档与工单路径;
- 不迁:grill-me、triage、migrate-to-shoehorn、scaffold-exercises。

## 后果

- 本仓库成为唯一能力来源,全新环境一条安装命令获得完整能力(不再需要 mattpocock-skills 插件);
- 上游演进不再自动到达,跟踪 mattpocock/skills 的改进需人工评估引入;
- 迁移完成后用户自行停用 mattpocock-skills 插件;本 ADR 取代 0003 的"纪律层订阅"部分。
