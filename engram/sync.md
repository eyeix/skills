# 记忆同步

数据目录：`${ENGRAM_MEMORY_DIR:-$HOME/.engram}`（下称 `$GM`）。以下 git 操作均加 `-C "$GM"` 执行；分支名 `$B` 指当前分支（`git -C "$GM" branch --show-current`）。

## 前置检查（按序，任一不满足先解决再同步）

1. **未 git 初始化**（`git -C "$GM" rev-parse --is-inside-work-tree` 失败）：提示用户数据目录通常由首次会话结束的巩固自动初始化；
   - 记忆文件已齐全时，可经确认后立即 `git init`、`git add -A`、`git commit -m "chore: 初始化全局记忆"`；
   - 目录或记忆模板缺失时，勿手动创建文件（模板单一来源在 consolidate.js），建议开一轮会话触发自动初始化后重试。
2. **未配置远程**（`git -C "$GM" remote` 为空）：询问用户远程仓库地址（建议私有仓库），确认后 `git remote add origin <url>`；用户暂不提供则停止。
3. **有未提交变更**（`git -C "$GM" status --porcelain` 非空）：自动巩固不产生 git 提交，脏工作区属常态；展示变更文件摘要，经确认后 `git add -A && git commit -m "chore: 巩固记忆"`。

## 同步流程

1. `git -C "$GM" fetch origin`，失败则提示检查网络或远程地址；
2. 远程无 `$B` 分支（新仓库首推）→ 建议执行 `git push -u origin $B`，确认后执行，结束；
3. `git -C "$GM" rev-list --left-right --count HEAD...origin/$B`（输出「本地领先 远程领先」）：
   - `0 N` 仅落后 → 建议拉取，确认后 `git -C "$GM" merge --ff-only origin/$B`；
   - `N 0` 仅领先 → 建议推送，确认后 `git -C "$GM" push`；
   - `N M` 分叉 → 进入合并与推送。

## 合并与推送（分叉时）

1. 执行 `git -C "$GM" merge --no-commit origin/$B`；
2. **无冲突**（两侧改动在不同文件）：展示暂存的变更摘要，确认后 `git -C "$GM" commit -m "chore: 合并远程记忆" && git -C "$GM" push`；
3. **有冲突**（记忆文件带 `<<<<<<<` 标记，属预期，不要中止）：
   - 用 `git -C "$GM" show HEAD:<file>` 与 `git -C "$GM" show origin/$B:<file>` 取两侧干净版本（勿解析冲突标记），覆盖 `MEMORY.md`、`USER.md`；`archive/` 同名日期文件做条目并集去重；
   - 记忆条目按 `[YY-MM-DD] 主题:` 前缀配对，逐条给出建议：
     - 仅一侧存在 → 保留该条；
     - 两侧相同 → 去重保留一份；
     - 同主题内容不同 → 以日期较新者为准，另一侧作参考并入或淘汰，列出对照表；
   - 合并结果守硬上限（MEMORY.md ≤ 3000、USER.md ≤ 1500 字符），超限时一并给出浓缩/淘汰建议；
   - 以对照表向用户呈现完整合并方案，征得确认（允许调整）后：写入合并结果 → `git add -A` → `git commit -m "chore: 合并本地与远程记忆"`（自然完成 merge，保留双父历史）→ `git push`。

## 原则

- 一切覆盖性操作（合并写入、push、--ff-only 拉取）均先取得用户确认；
- 淘汰内容按约定移入 `$GM/archive/YYYY-MM-DD.md`，不做无归档丢弃；
- 同步只动 `$GM` 内文件，不触碰本 skill 所在仓库。
