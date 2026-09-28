# setup — 启用 / 停用自动记忆

管理用户级 `~/.claude/settings.json` 中属于本 skill 的 hooks 登记。全局记忆跨项目生效，因此不写任何项目级 settings。

## enable（默认）

1. **确定本 skill 目录绝对路径**：以 skill 加载时的路径信息为准；上下文不可得时询问用户安装位置，勿猜测；
2. **双重安装检查**：检测另一份 engram 是否仍在启用——用户级 settings.json 或已安装插件（`~/.claude/plugins/`）中存在其他指向 engram 的 hooks 条目（典型特征：命令路径含 `engram` 且不指向本 skill 目录）。存在则提示用户二选一（停用另一份，或放弃本次启用），避免每会话双重注入；
3. **登记条目**（读原文件 → 合并 → 校验 → 写回，见「写入纪律」），在 `hooks.SessionStart` 数组合并：
   ```json
   { "matcher": "", "hooks": [ { "type": "command", "command": "node \"<本skill目录>/hooks/inject.js\"" } ] }
   ```
   `hooks.Stop` 合并同构条目，command 为 `node "<本skill目录>/hooks/consolidate.js"`；
4. **幂等**：已存在等价条目（command 相同）则跳过并说明；repair 即重复执行 enable——路径失效（skill 目录迁移）时先移除失效条目，再按当前路径登记；
5. **生效时机**：SessionStart 自下个会话生效；Stop 在当前会话结束即可生效（v2.1.257 起 settings.json 修改经短暂文件稳定延迟即生效，无需重启）。

## disable

从 `hooks.SessionStart` / `hooks.Stop` 中精确移除指向本 skill `hooks/` 的条目（按路径匹配，其他 hooks 不动）。数据目录与记忆内容保留；确需删除记忆数据时由用户手动处理。

## 写入纪律

- 所有写入先读取原文件、合并后写回；写回前对新内容做 `JSON.parse` 校验，不得破坏或丢失其他 hooks 条目；
- command 字符串中的路径统一加双引号，形如 `node "<绝对路径>"`，兼容 bash / PowerShell / cmd 三种 shell 解析；
- settings.json 为无注释 JSON，条目归属辨识依赖路径中的 `engram` 字样；
- 数据目录初始化（模板、archive、logs、git）由首次 Stop 巩固自动完成，本流程不得创建或复制任何记忆模板——模板单一来源在 consolidate.js，避免双源。
