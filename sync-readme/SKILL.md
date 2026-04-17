---
name: sync-readme
description: Use when user asks to update or sync README.md, or when conversation context reveals the project has new features, commands, configuration options, or changed behavior not reflected in the user-facing documentation.
---

# Sync README.md

## Overview

将对话上下文 + 代码库实际状态与 README.md 进行系统性对比，识别过时或缺失的用户可见内容，以外科手术式更新（而非重写）保持文档准确。

> README 面向**最终用户**（部署者/使用者），不记录内部约定或架构细节——那是 CLAUDE.md 的职责。

## When to Use

**触发条件（任意一条）：**
- 用户明确要求更新 / 同步 / 刷新 README.md
- 刚完成一个新增了用户可见功能、配置项或命令的功能
- 面向用户的信息（端口、依赖前置条件、命令等）发生变化
- 发现 README 描述与实际使用体验不符

**不适用：**
- 仅修改内部实现（重构、优化）但用户体验不变
- 用户只是想读取 README 内容
- 变更只影响 CLAUDE.md 级别的约定（开发内部约定、架构细节）

## Core Pattern

### 三步流程

```
1. GATHER  → 收集对话上下文 + 扫描代码库
2. DIFF    → 与 README.md 逐节对比，标记差异
3. PATCH   → 外科手术式更新差异项，保留原有结构
```

### Step 1: GATHER — 收集信息

**从对话上下文提取：**
- 本次对话中提到的新功能、新页面、新配置项
- 用户描述的行为变更、命令变更、依赖变更

**从代码库扫描（根据项目类型选择适当命令）：**
```bash
# 命令与脚本
cat package.json        # Node.js — scripts 字段
cat Makefile            # 通用 — make targets
cat pyproject.toml      # Python — scripts/tasks

# 项目结构
ls -la                  # 根目录文件
ls src/                 # 源码目录（如存在）

# 配置项
cat .env.example        # 环境变量清单
```

**重点核查清单：**
- [ ] 构建/启动命令与 README "快速开始" / "常用命令" 章节对齐
- [ ] 功能特性列表与实际代码实现对齐
- [ ] 配置项（环境变量/配置文件）与文档描述对齐
- [ ] 技术栈/依赖版本与 README 对齐
- [ ] 前置要求（语言版本、工具等）与实际 setup 流程对齐

### Step 2: DIFF — 识别差异

对 README.md 每个章节打标：

| 标记 | 含义 |
|------|------|
| ✅ 准确 | 与代码库一致，无需修改 |
| ⚠️ 过时 | 描述已不符合当前行为 |
| ➕ 缺失 | 功能/命令已存在但文档未记录 |
| ❓ 待核实 | 不确定，需进一步检查代码 |

**只更新 ⚠️ 和 ➕ 标记的内容。**

### Step 3: PATCH — 外科手术式更新

**先向用户展示变更摘要（见 Output Format），确认后再写入文件。**

- **保留**：原有章节结构、顺序、语言风格
- **新增**：在相关章节内追加，而非创建新章节
- **修改**：只改变不准确的部分，其余原文保留
- **禁止**：整体重写、改变文档风格、加入内部架构细节、删除已准确的内容

> ⚠️ 不要未经确认直接修改 README.md，除非用户明确说"直接更新"

## README vs CLAUDE.md 边界

| 内容类型 | 归属 |
|---------|------|
| 如何安装、启动、配置 | README ✅ |
| 有哪些功能特性 | README ✅ |
| 常用命令（用户视角） | README ✅ |
| 内部架构图、目录结构 | CLAUDE.md |
| 开发约定、代码规范 | CLAUDE.md |
| 实现细节、算法逻辑 | CLAUDE.md |

## Common Mistakes

| 错误 | 正确做法 |
|------|---------|
| 只更新用户明确提到的内容 | 系统扫描所有章节，发现隐式变更 |
| 重写整个 README | 只 patch 差异项，保留原有结构 |
| 把内部架构细节写入 README | 保持用户视角，细节归 CLAUDE.md |
| 不验证就直接写更新 | 先读源文件确认，再写更新内容 |
| 直接修改文件而不先展示 diff | 先展示变更摘要，等用户确认后再 patch |

## Output Format

更新完成后，向用户汇报：

```
## README.md 更新摘要

### 修改项（⚠️ 过时 → 已更正）
- [章节名]：原描述 → 新描述（原因：xxx）

### 新增项（➕ 缺失 → 已补充）
- [章节名]：新增了 xxx 的描述

### 保持不变（✅ 准确）
- [章节名列表]
```
