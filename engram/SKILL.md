---
name: engram
description: Self-evolving global memory for Claude Code, shared across projects. Single entry with subcommands - setup to enable or disable automatic memory by registering/removing SessionStart and Stop hooks in user settings, review to audit and tidy memory entries, sync to sync memory across machines via a git remote, status to show hook registration and data state. Use when the user asks to set up, enable, check, tidy, review, back up, or sync memory, or mentions engram.
argument-hint: sync | review | setup | status
---

# engram · 全局自进化记忆

数据目录 `${ENGRAM_MEMORY_DIR:-$HOME/.engram}`（下称 `$GM`）中的有界记忆：
MEMORY.md（跨项目事实，≤3000 字符）、USER.md（用户画像，≤1500 字符）、archive/（淘汰条目）。

自动能力由本 skill 目录下 `hooks/` 的两个脚本提供，经 `/engram setup` 登记进用户级 settings 后生效：

- **会话启动注入**（SessionStart · `hooks/inject.js`）：维护规则与记忆内容进入会话上下文；
- **会话结束巩固**（Stop · `hooks/consolidate.js`）：后台子进程提炼本次会话，更新有界记忆。

## 分发

按 `$ARGUMENTS` 依序分支；命中子命令后读取本 skill 目录下对应文件执行，分发器不承载子流程细节：

1. 空或 `status` → 执行下方「状态与提示」；
2. `setup`（enable / disable / repair 视为同义）→ 读取同目录 `setup.md` 执行；
3. `review` 或 `memory-review` → 读取同目录 `memory-review.md` 执行；
4. `sync` → 读取同目录 `sync.md` 执行；
5. 其他文本 → 按语义就近匹配，复述理解并经用户确认后进入对应流程；无法匹配时列出四个子命令及一句话说明。

## 状态与提示（status / 无参数）

- **hooks 登记**：读取 `~/.claude/settings.json`，检查 `hooks.SessionStart` / `hooks.Stop` 中是否存在指向本 skill `hooks/` 的条目；未启用时提示运行 `/engram setup`；
- **数据目录**：`$GM` 是否存在、MEMORY.md 与 USER.md 是否初始化及当前字符量（上限 3000 / 1500）、是否为 git 仓库、工作区是否干净；
- 最后输出子命令提示：

```
/engram setup   启用或停用自动记忆（hooks 登记）
/engram review  审查、整理记忆条目
/engram sync    经 git 远程多机同步记忆
/engram status  查看登记与数据状态
```

## 跨平台注意

- **数据目录**：由 hooks 脚本经 `os.homedir()` 与 `path.join` 计算——macOS/Linux 为 `~/.engram`，Windows 为 `%USERPROFILE%\.engram`；`ENGRAM_MEMORY_DIR` 覆盖在各平台行为一致；
- **文档记法**：本文档及子流程文档中的 `${ENGRAM_MEMORY_DIR:-$HOME/.engram}`、`git -C "$GM"`、`~/.claude/settings.json` 为 bash 系记法，macOS/Linux 原生适用；Windows 下经 Claude Code 的 Bash 工具（Git Bash）执行同样可用，若需在 PowerShell / cmd 中手动执行等效命令，改用对应 shell 的变量语法与路径写法；
- **已登记的 hooks 无上述限制**：settings.json 中的 command 为双引号包裹的绝对路径，bash / PowerShell / cmd 均按字面解析（详见 `setup.md` 写入纪律）。
