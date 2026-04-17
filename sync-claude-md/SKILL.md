---
name: sync-claude-md
description: Use when user asks to update or sync CLAUDE.md, or when conversation context reveals the codebase has diverged from what CLAUDE.md documents - new tools, commands, conventions, architecture, or features not reflected in the file.
---

# Sync CLAUDE.md

## Overview

将对话上下文 + 代码库实际状态与 CLAUDE.md 进行系统性对比，识别过时或缺失内容，以外科手术式更新（而非重写）保持文档准确。

## When to Use

**触发条件（任意一条）：**
- 用户明确要求更新 / 同步 / 刷新 CLAUDE.md
- 刚完成一个改变了技术栈、约定、命令或架构的功能
- 对话中出现了 CLAUDE.md 未记录的新组件、路由、约定等
- 发现 CLAUDE.md 描述与代码现状不一致

**不适用：**
- 仅修改业务逻辑但不影响架构/约定/命令
- 用户只是想读取 CLAUDE.md 内容

## Core Pattern

### 三步流程

```
1. GATHER  → 收集对话上下文 + 扫描代码库
2. DIFF    → 与 CLAUDE.md 逐节对比，标记差异
3. PATCH   → 外科手术式更新差异项，保留原有结构
```

### Step 1: GATHER — 收集信息

**从对话上下文提取：**
- 本次对话中提到的新功能、新文件、新依赖
- 用户描述的行为变更、命令变更、约定变更

**从代码库扫描（根据项目类型选择适当命令）：**
```bash
# 查看项目结构（目录树是否与 CLAUDE.md 架构图一致？）
ls -la
ls src/                 # 源码目录（如存在）

# 命令与依赖（是否与文档一致？）
cat package.json        # Node.js
cat pyproject.toml      # Python
cat Makefile            # 通用

# 针对性扫描（根据对话线索，检查相关子目录）
```

**重点核查清单：**
- [ ] 构建/运行命令与 CLAUDE.md "常用命令" 章节对齐
- [ ] 目录结构与 CLAUDE.md 架构章节对齐
- [ ] 技术栈声明与实际依赖对齐
- [ ] 开发约定（命名规范、代码规范）描述准确
- [ ] 新增的模块/组件已在文档中记录

### Step 2: DIFF — 识别差异

对 CLAUDE.md 每个章节打标：

| 标记 | 含义 |
|------|------|
| ✅ 准确 | 与代码库一致，无需修改 |
| ⚠️ 过时 | 描述已不符合当前代码 |
| ➕ 缺失 | 代码库存在但文档未记录 |
| ❓ 待核实 | 不确定，需进一步检查代码 |

**只更新 ⚠️ 和 ➕ 标记的内容。**

### Step 3: PATCH — 外科手术式更新

**先向用户展示变更摘要（见 Output Format），确认后再写入文件。**

- **保留**：原有章节结构、顺序、语言风格
- **新增**：在相关章节内追加，而非创建新章节
- **修改**：只改变不准确的部分，其余原文保留
- **禁止**：整体重写、改变文档风格、删除已准确的内容

> ⚠️ 不要未经确认直接修改 CLAUDE.md，除非用户明确说"直接更新"

## Common Mistakes

| 错误 | 正确做法 |
|------|---------|
| 只更新用户明确提到的内容 | 系统扫描所有章节，发现隐式变更 |
| 重写整个 CLAUDE.md | 只 patch 差异项，保留原有结构 |
| 不验证就直接写更新 | 先读代码文件确认，再写更新内容 |
| 把"可扩展 X"改成"已实现 X"但不查代码 | 用 `ls` / `Read` 确认文件存在再更新 |
| 直接修改文件而不先展示 diff | 先展示变更摘要，等用户确认后再 patch |
| 更新后不展示变更摘要 | 结尾列出所有 ⚠️/➕ 变更项及原因 |

## Output Format

更新完成后，向用户汇报：

```
## CLAUDE.md 更新摘要

### 修改项（⚠️ 过时 → 已更正）
- [章节名]：原描述 → 新描述（原因：xxx）

### 新增项（➕ 缺失 → 已补充）
- [章节名]：新增了 xxx 的描述

### 保持不变（✅ 准确）
- [章节名列表]
```
