# AGENTS.md

本仓库为纯 Markdown 与少量 Node 脚本构成的 skill 合集，不引入测试框架。所有变更须通过以下本地检查后才可提交：

- **frontmatter**：每个 skill 的 `SKILL.md` 必含 `name`（与目录名一致、kebab-case）与英文 `description`；带参数分发的 skill 附 `argument-hint`；
- **脚本**：新增或改动的 JS（如 `engram/hooks/*.js`）一律 `node --check` 通过；纯 node 实现（路径用 `path.join` 拼接），不引入 npm 依赖；
- **链接**：README 中各 skill 条目链接指向实际存在的 `./<skill>/SKILL.md`；
- **行为验证**：skill 行为以真实会话演练为准，新增 skill 至少演练主路径一次。
