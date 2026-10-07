# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 仓库用途

存放个人常用的 Claude Code Skills，通过 GitHub 在多台机器间共享，使用 `/install-github eyeix/skills` 安装。

## Skill 结构

每个 skill 独占一个目录，目录名即 skill 名（kebab-case）：

```
<skill-name>/
  SKILL.md       # 必需入口，简单 skill 仅此一文件
```

需要子流程文档或脚本时，附加文件随 skill 目录一同分发（如 `engram/` 下的 `setup.md` 与 `hooks/`）。

`SKILL.md` 必须包含 frontmatter：

```markdown
---
name: <skill-name>          # 与目录名一致
description: <描述>          # 模型可调的用英文（触发判断），仅人可调的用中文
---
```

## 约定

- **命名**：目录名与 `name` 字段保持一致，使用 kebab-case，动词用动词原形（`sync-*` 而非 `syncing-*`）
- **语言**：正文内容用中文；仅人可调的 skill（`disable-model-invocation: true`）的 `description` 与 `argument-hint` 用中文，模型可调的保留英文 `description` 以保证自动触发的匹配质量
- **内容**：面向公共使用，不包含项目特定路径或章节名
- **提交**：遵循 Conventional Commits 规范，提交信息使用中文

@AGENTS.md
