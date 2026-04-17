---
name: commit-msg
description: Generate a git commit message for the currently staged changes. Use when the user asks to generate, write, or suggest a commit message.
---

# Commit Message Generator

## Overview

分析当前暂存的变更，参考近期提交风格，生成符合 [Conventional Commits](https://www.conventionalcommits.org/) 规范的提交信息。

## Steps

### 1. 收集上下文

```bash
git diff --staged          # 查看暂存的变更内容
git log --oneline -10      # 了解近期提交风格与粒度
git status                 # 确认暂存范围
```

### 2. 分析变更

根据 diff 内容判断：

| 问题 | 目的 |
|------|------|
| 改了什么？ | 确定 scope 和描述 |
| 为什么改？ | 决定 type（feat/fix/refactor…） |
| 影响范围？ | 判断是否需要 `!` 或 BREAKING CHANGE |

### 3. 生成提交信息

**格式：**
```
<type>(<scope>): <subject>

[body]

[footer]
```

**type 选择：**

| type | 适用场景 |
|------|---------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `refactor` | 重构（不改变行为） |
| `docs` | 仅文档变更 |
| `test` | 添加或修改测试 |
| `chore` | 构建、依赖、工具配置 |
| `style` | 格式、空白、分号（不影响逻辑） |
| `perf` | 性能优化 |
| `ci` | CI/CD 配置 |

**规则：**
- subject 使用祈使句，首字母小写，不加句号
- subject 不超过 72 个字符
- scope 为受影响的模块/目录（可省略）
- 破坏性变更在 footer 加 `BREAKING CHANGE:` 或 type 后加 `!`
- body 说明"为什么"而非"改了什么"（diff 已经说明了什么）

### 4. 输出

直接给出提交命令，无需额外解释：

```bash
git commit -m "$(cat <<'EOF'
feat(auth): add OAuth2 login support

Replaces the custom session-based flow with OAuth2 to support
third-party identity providers without managing credentials.
EOF
)"
```

若 subject 已足够清晰，省略 body。

## Common Mistakes

| 错误 | 正确做法 |
|------|---------|
| `fix: fixed the bug` | `fix(parser): handle empty input gracefully` |
| subject 超过 72 字符 | 拆成 subject + body |
| body 描述"改了什么" | body 描述"为什么改" |
| 多个不相关变更写一条 | 提示用户拆分暂存区 |
| 翻译成中文再提交 | 与仓库现有提交语言保持一致 |
