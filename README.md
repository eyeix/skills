# skills

个人常用 Skills 合集,零系统提示词依赖:全新环境安装本仓库即获得完整的工程组织能力(记忆纪律、任务工作流、编码纪律、知识沉淀)。

## 安装

```bash
/install-github eyeix/skills
```

## 工程体系总览

### 主流程:想法 → 交付

```
/agentdocs-setup ─► /interview ─┬─► 直接实现(简单任务)
初始化(一次)        对齐+定稿规格
                                  └─► /team-dev:拆分工单,组队执行,结束后沉淀记忆并清空暂存区
```

- `/interview` 之后判断:任务**一个会话装得下吗**?装得下,访谈结论明确后直接实现;装不下(需要并行、多模块),定稿规格后交给 `/team-dev`;
- 一个会话仍装不下的大工程(全系统重构、新产品线),先用 `/wayfinder` 绘制决策地图,路清晰后经 `/interview` 定稿规格;
- 对齐与定稿保持在**同一上下文窗口**;每张工单的执行从**全新上下文**起步——进行中任务的状态在 `.agentdocs/workflow/` 暂存区,不在会话;
- 执行由纪律层驱动:构建走 **tdd**(红绿循环),收尾走 **code-review**(两轴审查,Spec 轴以工单为源)。

### 组合关系

- 编排层(user-invoked)只被你键入触发,彼此不互调,只组合纪律层;正文不出现"接下来运行 XX"式的链式指引;
- 纪律层(model-invoked)平时不用敲,模型按场景自动到达;
- `.agentdocs/` 是项目的记忆,只放术语、决策与领域知识;规格与工单是过程产物,放 `workflow/` 暂存区,任务结束沉淀后删除,历史由 git 保留;
- `agent-docs` 是唯一持有 `.agentdocs/` 读写规则的 skill。

### 谱系说明

任务编排与记忆体系为本仓库原创;编码纪律层(tdd、code-review、research、prototype、diagnose、pr、codebase-design、writing-for-agents 等)重构自 [mattpocock/skills](https://github.com/mattpocock/skills),保留其纪律骨架,适配 `.agentdocs/` 布局与组合方式。

## Skills

### 任务生命周期(编排层,键入触发)

- [`agentdocs-setup`](./agentdocs-setup/SKILL.md) — 初始化项目 `.agentdocs/` 布局与 AGENTS.md 指针块,每仓库一次
- [`interview`](./interview/SKILL.md) — 无情访谈对齐想法,前沿清空后定稿为规格写入暂存区;也会被模型按 "拷问/grill" 触发词自动到达
- [`team-dev`](./team-dev/SKILL.md) — 执行引擎:读规格拆贯通切片工单,lead 只做规划协调审查,实现委派给按认知密度分档的 teammates;结束后沉淀记忆并清空暂存区
- [`wayfinder`](./wayfinder/SKILL.md) — 超出单会话的大工程:绘制决策地图,四型决策工单逐张解决,雾区渐进毕业,路清晰后移交 `/interview`
- [`handoff`](./handoff/SKILL.md) — 会话压缩为交接文档,写入暂存区,含下一会话建议 skills

### 编码纪律层(模型自动触发,也可键入)

- [`agent-docs`](./agent-docs/SKILL.md) — 工程记忆纪律:开工先 `ls .agentdocs/` 再按需读;知识产生时当场沉淀为术语、决策或领域文档;任务结束清空暂存区
- [`tdd`](./tdd/SKILL.md) — 红绿循环:预定接缝测试、反模式清单、一次一片 tracer bullet
- [`code-review`](./code-review/SKILL.md) — 两轴并行子代理审查:Standards(编码标准+Fowler 气味基线)vs Spec(以规格/工单为源)
- [`research`](./research/SKILL.md) — 后台代理按一手来源调研,发现带引用写入记忆
- [`prototype`](./prototype/SKILL.md) — 一次性原型回答设计问题:逻辑出单 HTML 文件,UI 出多变体对比
- [`diagnose`](./diagnose/SKILL.md) — 硬 bug 诊断纪律:先建紧凑可变红的反馈回路,再最小化、假设、插桩、修复、回归
- [`pr`](./pr/SKILL.md) — PR 描述形状:最小可视化 Summary、前后证据、单向/双向门与爆炸半径
- [`codebase-design`](./codebase-design/SKILL.md) — 深模块设计词汇:module/interface/depth/seam/adapter/leverage/locality
- [`review-frontend-production`](./review-frontend-production/SKILL.md) — 前端审查助手:快速体检或逐页逐组件完整审查,输出有证据的问题、修复方案与验收条件;配套 Python 标准库台账脚本

### 方法与工具

- [`writing-for-agents`](./writing-for-agents/SKILL.md) — 写 agent 消费文档的元方法论:上下文指针、两种负载、信息层级、领词、修剪(维护本仓库必读)
- [`env-review`](./env-review/SKILL.md) — 审查 agent 工作环境,按严重度给出导航指针、自动检查、编码标准、提示词瘦身等改进建议
- [`setup-gates`](./setup-gates/SKILL.md) — 给项目装门禁:pre-commit 检查(husky+lint-staged+prettier)与危险 git 命令拦截
- [`wizard`](./wizard/SKILL.md) — 生成交互式 bash 向导,带人做只有人能做的操作
- [`questionnaire`](./questionnaire/SKILL.md) — 答案在别人手里时,生成给对方填写的决策问卷
- [`teach`](./teach/SKILL.md) — 当前目录作教学工作区,多会话学一个主题
- [`wait-what`](./wait-what/SKILL.md) — 上一条没看懂,一键用术语表词汇重讲

### 独立工具

- [`commit-msg`](./commit-msg/SKILL.md) — 生成 Conventional Commits 提交信息
- [`sync-readme`](./sync-readme/SKILL.md) — README 与实际状态系统性对账
- [`sync-claude-md`](./sync-claude-md/SKILL.md) — CLAUDE.md 与实际状态系统性对账
- [`engram`](./engram/SKILL.md) — 跨项目全局记忆:`setup` 登记 hooks、`review` 整理、`sync` 多机同步、`status` 查看状态

> engram 由[同名插件](https://github.com/eyeix/engram)改造而来,hooks 脚本复制自基线提交 `0062298`,上游变更需手动同步。

## License

MIT
