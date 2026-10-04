# 迁移 mattpocock skills 全量自有化

## 背景与问题

ADR 0003 确立的混合采纳(纪律层订阅 mattpocock-skills 插件、编排层自建)存在可持续性弱点:能力依赖外部订阅,演进不可控,布局与组合方式不适配本体系。用户决定推翻该决策,除 Matt 业务专属与场景不适配的 skills 外,全部重构迁移至本仓库。

## 方案概述

19 个 skills 重构迁移(非 1:1 翻译):两处合并(grilling+grill-with-docs → interview;setup-pre-commit+git-guardrails → guardrails),两处重构新造(implement → run-ticket 消费工单;ask-matt → which-skill 路由我们的链路),其余保持独立迁移并重新命名。迁移后停用 mattpocock-skills 插件,本仓库成为唯一能力来源。

## 现状分析

- 逐文件审计已证明 Matt 纪律层与其编排层零耦合(见 ADR 0003 背景),迁移无断链风险;
- 唯二布局关联点:domain-modeling 已由 agent-docs 替代;code-review 的 Spec 轴来源搜索顺序需改为本体系的任务文档与工单路径;
- 本仓库现有 10 个 skills,迁移后合计 29 个。

## 实现决策

### 命名与处理总表

| Matt 原名 | 我们的名 | 处理 |
|---|---|---|
| grilling + grill-with-docs | `interview` | 合并:访谈+当场沉淀(调 agent-docs 纪律);无 .agentdocs/ 环境退化为纯访谈 |
| setup-pre-commit + git-guardrails-claude-code | `guardrails` | 合并:给项目装守门(pre-commit 检查+危险 git 拦截) |
| implement | `run-ticket` | 重构:读工单→tdd→code-review→commit→更新工单状态,与 team-dev 成轻重双入口 |
| ask-matt | `which-skill` | 重构:本体系链路路由 |
| wayfinder | `wayfinder` | 重构:决策地图落 .agentdocs/workflow/<map>/,决策进 adr/,去 issue tracker 化 |
| handoff | `handoff` | 重构:交接文档落任务目录持久化 |
| improve-codebase-architecture | `improve-arch` | 迁移重构,附 HTML-REPORT.md |
| diagnosing-bugs | `diagnose` | 迁移重构,附 HITL 循环模板 |
| to-questionnaire | `questionnaire` | 迁移重构 |
| tdd / code-review / research / prototype / pr / writing-for-agents / codebase-design / wizard / teach / wait-what | 同名 | 迁移重构,各自附加文件随迁 |

不迁:grill-me(纯访谈场景已被 interview 覆盖)、triage(强依赖 issue tracker)、migrate-to-shoehorn 与 scaffold-exercises(Matt 业务专属)。

### 重构适配规则(每个 skill 统一执行)

- frontmatter:`description` 保持英文并保留触发精髓,`disable-model-invocation` 按调用层设置;
- 正文中文重写,保留纪律骨架与 leading words;
- 布局引用:`GLOSSARY.md` → `.agentdocs/glossary.md`,`docs/adr/` → `.agentdocs/adr/`;
- 组合引用改为本体系 skill 名(grilling → interview 等),全部用"调用 Skill 工具"式显式指令;
- 成品脚本(wizard 的 template.sh、diagnose 的 HITL 模板)原样随迁,不做改写。

## 测试决策

纯 Markdown 仓库,以 AGENTS.md 检查项走查为准:frontmatter 规范、README 链接有效、每个 skill 主路径(触发条件、步骤可达、模板引用一致)。每批完成后走查一次,全部完成后总走查。

## 任务拆解

- 工单见 `tickets/`(01-08 全部 done):立项与方法论 → 核心纪律 → 执行交接 → 日常纪律 → 设计守门 → 场景 → README 与总走查

## 范围外

- 不迁移 grill-me、triage、migrate-to-shoehorn、scaffold-exercises 及 in-progress 桶;
- 不动已有 10 个 skills(仅 README 与 ADR 层面的全局更新);
- mattpocock-skills 插件的停用由用户在验证后自行执行,不在本任务内。
