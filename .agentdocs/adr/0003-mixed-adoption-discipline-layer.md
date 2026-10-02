# 纪律层订阅原版、编排层自建,唯二的关联点轻量化解

工程 skills 采取混合采纳:编码纪律层(tdd、code-review、grilling、research、prototype、diagnosing-bugs、codebase-design、pr、wizard、writing-for-agents、improve 等)订阅 mattpocock-skills 官方插件原版,不自建中文版;编排层(setup、任务文档、拆票、执行、复盘)全部自建于本仓库。停用 mattpocock 的 domain-modeling,文档纪律统一走自建的 agent-docs。

## 背景

担心纪律层与 Matt 的编排层存在耦合(串联执行),导致"只装纪律层 + 自有编排层"的组合断链。逐文件审计证明:Matt 的调用方向是单向的(编排层组合纪律层),纪律层正文零回调编排层;唯二关联是 domain-modeling 的布局硬约定(根目录 GLOSSARY.md + docs/adr/,与 `.agentdocs/` 相反)及其与 agent-docs 的职责重叠,和 code-review 的 Spec 轴对 spec 来源的搜索顺序(issue 引用 → `docs/`、`specs/`、`.scratch/` → 问用户 → 跳过)。

## 决策

- 纪律层订阅不自建:触发与纪律是模型行为,英文 description 对中文对话同样有效;自建等于放弃上游演进、重复造轮子;
- domain-modeling 停用:它的主动纪律(挑战术语冲突、边界场景压测、代码交叉验证)已吸收进 agent-docs 的"讨论中的主动纪律",布局统一到 `.agentdocs/`;
- code-review 保留:自有编排层(run-ticket、team-dev)调用它时显式告知 spec 为工单文件路径,绕开其搜索顺序;最坏情况 Spec 轴自我降级为跳过,无害。

## 后果

- 全新环境的完整能力 = 两条安装命令:本仓库 skills + mattpocock-skills 插件;
- 上游纪律层演进自动到达,本仓库只维护编排层与文档体系;
- 双触发风险收敛:文档纪律只有 agent-docs 一个入口;若 domain-modeling 仍被触发,按 agent-docs 布局归一(迁移至 `.agentdocs/glossary.md`);
- 插件内单个 skill 的禁用机制待验证(整体 disable 或换 skills.sh 按需安装为备选路径)。
