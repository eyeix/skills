---
name: guardrails
description: "Install guardrails for a repo: pre-commit checks (Husky + lint-staged + Prettier + typecheck + tests) and Claude Code hooks that block dangerous git commands (push, reset --hard, clean, branch -D). Use when the user wants commit-time checks, git safety hooks, or to prevent destructive git operations."
disable-model-invocation: true
---

# 项目守门

给仓库装两类守门,按用户需要各装各的:

1. **提交时检查**(pre-commit):lint、格式、类型、测试在提交时强制执行;
2. **危险 git 拦截**(PreToolUse hook):agent 执行危险 git 命令前阻断。

## 一、提交时检查(Husky + lint-staged + Prettier)

面向 JS/TS 项目。安装:

- **Husky** pre-commit 钩子
- **lint-staged** 对暂存文件跑 Prettier
- **Prettier** 配置(缺才建)
- pre-commit 里的 **typecheck** 与 **test** 脚本

### 步骤

1. **探测包管理器**:看 `package-lock.json`(npm)、`pnpm-lock.yaml`(pnpm)、`yarn.lock`(yarn)、`bun.lockb`(bun)。都不明确默认 npm;
2. **装依赖**(devDependencies):`husky lint-staged prettier`;
3. **初始化 Husky**:`npx husky init`,生成 `.husky/` 并在 package.json 加 `prepare: "husky"`;
4. **写 `.husky/pre-commit`**(Husky v9+ 无需 shebang):

   ```
   npx lint-staged
   npm run typecheck
   npm run test
   ```

   **适配**:把 `npm` 换成探测到的包管理器;package.json 没有 `typecheck` 或 `test` 脚本就删掉对应行并告知用户;

5. **写 `.lintstagedrc`**:

   ```json
   { "*": "prettier --ignore-unknown --write" }
   ```

6. **写 `.prettierrc`**(仅在无既有配置时):

   ```json
   {
     "useTabs": false,
     "tabWidth": 2,
     "printWidth": 80,
     "singleQuote": false,
     "trailingComma": "es5",
     "semi": true,
     "arrowParens": "always"
   }
   ```

7. **验证**:`.husky/pre-commit` 存在且可执行;`.lintstagedrc` 存在;`prepare` 脚本正确;跑一次 `npx lint-staged` 确认可用;
8. **提交**:暂存全部变更,提交信息 `Add pre-commit hooks (husky + lint-staged + prettier)`——这次提交会穿过新装的钩子,正好是冒烟测试。

## 二、危险 git 命令拦截

装一个 PreToolUse hook,在 agent 执行前阻断危险 git 命令。被拦的命令:

- `git push`(含 `--force` 的所有变体)
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .` / `git restore .`

被拦时,agent 会看到一条"无权使用这些命令"的消息。

### 步骤

1. **问范围**:只装**本项目**(`.claude/settings.json`)还是**所有项目**(`~/.claude/settings.json`);
2. **复制脚本**:把本 skill 的 [scripts/block-dangerous-git.sh](scripts/block-dangerous-git.sh) 复制到:
   - 项目:`~/.claude 项目根`/.claude/hooks/block-dangerous-git.sh
   - 全局:`~/.claude/hooks/block-dangerous-git.sh`

   `chmod +x`;
3. **登记 hook**(合并进既有 `hooks.PreToolUse` 数组,不覆盖其他设置):

   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "Bash",
           "hooks": [
             {
               "type": "command",
               "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-dangerous-git.sh"
             }
           ]
         }
       ]
     }
   }
   ```

   全局安装时 command 用 `~/.claude/hooks/block-dangerous-git.sh`;
4. **问定制**:是否要在拦截清单上增删模式,相应修改复制后的脚本;
5. **验证**:

   ```bash
   echo '{"tool_input":{"command":"git push origin main"}}' | <脚本路径>
   ```

   应以退出码 2 结束,stderr 打出 BLOCKED 消息。
