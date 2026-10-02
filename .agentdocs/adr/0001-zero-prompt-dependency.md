# 工程组织能力自包含于 skills,零系统提示词依赖

工程组织能力(文档纪律、任务工作流、知识沉淀、复盘闭环)全部由本仓库的 skills 承载,不依赖任何系统提示词:全新环境安装本仓库 skills 后即获得完整能力。各 skill 正文自包含,规则不引用任何提示词中的概念;用户的全局 CLAUDE.md 在其中的角色降级为个人偏好与可选指针。

## 背景

原方式把工程组织规则写在用户全局 CLAUDE.md 中:不可分发(能力绑定个人提示词)、触发不可靠("必读"类软指令靠模型自觉)、常驻成本高(三段规则每会话全程常驻)。备选方案是保留 CLAUDE.md 为能力载体、skills 仅作辅助,该方案延续了不可分发与常驻成本问题。

## 决策

能力全部装入 skills:user-invoked 编排层(agentdocs-setup、task-spec、task-tickets、task-retro)只被用户键入触发,model-invoked 纪律层(agent-docs)靠 description 自动触发;常驻成本收缩为 description 一行,正文按需加载。

## 后果

- CLAUDE.md 与 skills 双写同一规则成为禁止项:规则改动只改 skill,CLAUDE.md 至多留一行指针;
- skills 必须可独立成立:引用其他 skill(如 tdd)时条件式表述,未安装时按内联基准执行;
- 编排层 skills 之间不互相调用,只组合纪律层,与 mattpocock/skills 的调用架构一致。
