---
name: wizard
description: Generate an interactive bash wizard that walks a human through steps only they can perform. Use when provisioning infrastructure, setting up credentials or CI secrets, walking an unfamiliar third-party dashboard, or running a one-off migration or cutover. Don't invoke this for steps the agent can perform itself.
---

# 向导

**向导**是一个 bash 脚本,带人一步一步走完一段手动程序:手工做繁琐、每次向 AI 重述也繁琐的那种。它打开每个 URL、明说点什么复制什么、捕获值、写到该去的地方(`.env`、GitHub secrets)、每阶段确认、显示还剩几阶段。它可以配置第三方服务、跑一次性迁移,或把项目从一种状态带到另一种。

体验层已由 [template.sh](template.sh) 解决:分阶段进度、确认门、跨平台开 URL(含 WSL)、密钥隐式输入、幂等 `.env` upsert、`gh secret`/`gh variable` 写入、收尾汇总。**你的工作只有两件:界定程序范围、编写各阶段。**`STAGES` 标记以上的库在每个向导里逐字节相同;一致性就是意义:永不手改它。

向导默认一次性:为一次运行而建,存到 scratch 或 `scripts/` 路径,用完即删。只有用户想要可复用的安装路径时才提交进仓库。

## 流程

### 1. 界定程序范围

理清人必须执行的每个手动步骤、沿途捕获的每个值。先读仓库,不冷启动就问:

- 安装类:`.env`、`.env.example`、`.env.*`、`README`、`docker-compose*`、框架配置、`.github/workflows/*`(每个 `secrets.*` / `vars.*` 引用都是向导必须产出的值);
- 迁移/过渡类:当前状态、目标状态、之间的不可逆动作。

然后向用户展示排好序的阶段清单与各阶段产出的值,确认:他们可以增删、重排。

**完成判据**:每个阶段按序命名;每个被捕获的值,你知道 它从哪里获取(哪个控制台、哪个页面), 写到哪里(`.env`、GitHub secret、两者、或无处可写——有些阶段是纯动作), 是否机密(隐式输入)。

### 2. 规划每个阶段的路径

为每个阶段写人要走的精确路径:开哪个 URL、在那里做什么、值显示在哪、填进哪个变量。例如"控制台 → 开发者 → API 密钥 → 显示测试密钥 → 复制"。不清楚当前 UI 或确切命令时,直说并问用户或查文档:绝不编造可能不存在的步骤。

### 3. 编写向导

把 `template.sh` 复制到目标路径。把示例阶段替换为每个步骤一个 `stage`,按依赖排序。用库里的助手:`stage`、`say`/`step`、`open_url`、`ask`/`ask_secret`、`write_env`、`set_secret`/`set_var`、`pause`/`confirm`。`TOTAL_STAGES` 设为你写的阶段数。

守住模板立下的杆:先开 URL 再要它的值;任何机密用 `ask_secret`;每个持久化的值都 `write_env`;只有 CI 真正需要的值才 `set_secret`;任何不可逆动作前 `confirm`。每个 `stage` 清屏,只显示当前步骤:一个阶段保持一个聚焦任务,人需要的东西不被滚走。标记以上的库不碰。

### 4. 验证与交付

- `bash -n <script>`;有 `shellcheck` 就跑;
- `chmod +x <script>`;
- 不要自己端到端跑:它会开浏览器并阻塞在人的输入上。改为静态走查:第 1 步的每个值都被捕获并落到第 1 步说的地方;每个 `set_secret` 的名字与 CI 里 `secrets.*` 引用逐一对上;
- 告诉用户怎么跑。若是可复用的安装路径,提交它并在 README 链接,让下一个人跑脚本而不是问 AI。
