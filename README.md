# skills

个人常用 Skills 合集,零系统提示词依赖:全新环境安装本仓库即获得完整的工程组织能力(文档纪律、任务工作流、编码纪律、知识沉淀、复盘闭环)。

## 安装

```bash
/install-github eyeix/skills
```

## 工程体系总览

### 主流程:想法 → 交付

```
/agentdocs-setup ─► /interview ─┬─► /task-spec ─► /task-tickets ─► /run-ticket 或 /team-dev ─► /task-retro
初始化(一次)        对齐+沉淀术语   定稿任务规格  拆分执行工单     执行(轻/重双入口)           收口复盘
                                └─► /wayfinder:一个会话装不下时画决策地图,路清晰后回到 /task-spec
```

- `/interview` 之后判断:这个任务**一个会话装得下吗**?装得下走主干 `/task-spec`;装不下(全系统重构、新产品线)先进 `/wayfinder` 画决策地图,路清晰后回到 `/task-spec`;
- 对齐 → 定稿 → 拆票保持在**同一上下文窗口**;每张工单的执行从**全新上下文**起步——状态的家在 `.agentdocs/` 文件系统,不在会话;
- 执行由纪律层驱动:构建走 **tdd**(红绿循环),收尾走 **code-review**(两轴审查,Spec 轴以工单为源);
- 路线不确定时先问 **`/which-skill`**,它是全部 skills 的路由器。

### 组合关系

- 编排层(user-invoked)只被你键入触发,彼此不互调,只组合纪律层;
- 纪律层(model-invoked)平时不用敲,模型按场景自动到达;
- 任务状态即文件形态:`workflow/YYMMDD-slug.md`(已定稿)→ `workflow/YYMMDD-slug/`(执行中,tickets/ 状态即进度)→ `done/`(已完结)。

### 谱系说明

任务编排与文档体系为本仓库原创;编码纪律层(tdd、code-review、research、prototype、diagnose、pr、codebase-design、writing-for-agents 等)重构自 [mattpocock/skills](https://github.com/mattpocock/skills),保留其纪律骨架,适配 `.agentdocs/` 布局与组合方式。

## Skills

### 任务生命周期(编排层,键入触发)

- [`agentdocs-setup`](./agentdocs-setup/SKILL.md) — 初始化项目 `.agentdocs/` 工作区与 AGENTS.md 指针块,每仓库一次
- [`interview`](./interview/SKILL.md) — 无情访谈对齐想法,术语与决策当场沉淀;也会被模型按 "拷问/grill" 触发词自动到达
- [`task-spec`](./task-spec/SKILL.md) — 把当前对话定稿为任务规格,不做二次访谈
- [`task-tickets`](./task-tickets/SKILL.md) — 把任务规格拆为带阻塞边的贯通切片工单
- [`run-ticket`](./run-ticket/SKILL.md) — 轻量执行单张工单:测试先行 → 两轴审查 → 提交 → 更新状态
- [`team-dev`](./team-dev/SKILL.md) — 组队执行:lead 只做规划协调审查,实现委派给按认知密度分档的 teammates;存在工单时直接消费
- [`task-retro`](./task-retro/SKILL.md) — 收口:状态核对、归档、知识写回、agent 环境改进建议
- [`wayfinder`](./wayfinder/SKILL.md) — 超出单会话的大工程:绘制决策地图,四型决策工单逐张解决,雾区渐进毕业,路清晰后移交 `/task-spec`
- [`handoff`](./handoff/SKILL.md) — 会话压缩为交接文档,落 `.agentdocs/` 持久化,含下一会话建议 skills
- [`which-skill`](./which-skill/SKILL.md) — 路由器:这个场景用哪个 skill

### 编码纪律层(模型自动触发,也可键入)

- [`agent-docs`](./agent-docs/SKILL.md) — 文档读写纪律:任务前读索引与相关文档,知识产生时当场写回术语表、决策记录或领域文档
- [`tdd`](./tdd/SKILL.md) — 红绿循环:预定接缝测试、反模式清单、一次一片 tracer bullet
- [`code-review`](./code-review/SKILL.md) — 两轴并行子代理审查:Standards(编码标准+Fowler 气味基线)vs Spec(以任务文档/工单为源)
- [`research`](./research/SKILL.md) — 后台代理按一手来源调研,发现带引用落盘
- [`prototype`](./prototype/SKILL.md) — 一次性原型回答设计问题:逻辑出单 HTML 文件,UI 出多变体对比
- [`diagnose`](./diagnose/SKILL.md) — 硬 bug 诊断纪律:先建紧凑可变红的反馈回路,再最小化、假设、插桩、修复、回归
- [`pr`](./pr/SKILL.md) — PR 描述形状:最小可视化 Summary、前后证据、单向/双向门与爆炸半径
- [`codebase-design`](./codebase-design/SKILL.md) — 深模块设计词汇:module/interface/depth/seam/adapter/leverage/locality

### 方法与工具

- [`writing-for-agents`](./writing-for-agents/SKILL.md) — 写 agent 消费文档的元方法论:上下文指针、两种负载、信息层级、领词、修剪(维护本仓库必读)
- [`setup-gates`](./setup-gates/SKILL.md) — 给项目装门禁:pre-commit 检查(husky+lint-staged+prettier)与危险 git 命令拦截
- [`wizard`](./wizard/SKILL.md) — 生成交互式 bash 向导,带人做只有人能做的操作
- [`questionnaire`](./questionnaire/SKILL.md) — 答案在别人手里时,生成给对方填的决策问卷
- [`teach`](./teach/SKILL.md) — 当前目录作教学工作区,多会话学一个主题
- [`wait-what`](./wait-what/SKILL.md) — 上一条没听懂,一键用术语表词汇重讲

### 独立工具

- [`commit-msg`](./commit-msg/SKILL.md) — 生成 Conventional Commits 提交信息
- [`sync-readme`](./sync-readme/SKILL.md) — README 与实际状态系统性对账
- [`sync-claude-md`](./sync-claude-md/SKILL.md) — CLAUDE.md 与实际状态系统性对账
- [`engram`](./engram/SKILL.md) — 跨项目全局记忆:`setup` 登记 hooks、`review` 整理、`sync` 多机同步、`status` 查看状态

> engram 由[同名插件](https://github.com/eyeix/engram)改造而来,hooks 脚本复制自基线提交 `0062298`,上游变更需手动同步。

## License

MIT
