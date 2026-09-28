// engram · 会话结束后的后台巩固：Haiku 提炼本次会话，更新全局有界记忆
const fs = require('fs');
const os = require('os');
const p = require('path');
const { spawn, spawnSync } = require('child_process');

// ---- 可调参数 ----
const DEBOUNCE = 1800;   // 巩固最小间隔（秒），Stop 每轮响应都会触发，靠此去抖
const MIN_SIZE = 30000;  // transcript 小于此字节数时跳过，不值得巩固
const MEMORY_LIMIT = 3000;
const USER_LIMIT = 1500;
const CONSOLIDATE_MODEL = 'claude-haiku-4-5-20251001';

const GM = process.env.ENGRAM_MEMORY_DIR || p.join(os.homedir(), '.engram');

// 防递归：子 Claude 的 Stop hook 再次触发本脚本时直接退出
if (process.env.ENGRAM_CHILD === '1') process.exit(0);

function localDate() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// 记忆文件模板（即插即用：首次巩固时自动落盘，保证格式与上限约定一致）
const TEMPLATES = {
  'MEMORY.md': `# 全局记忆（硬上限 ${MEMORY_LIMIT} 字符）
<!-- 条目格式：- [YY-MM-DD] 主题: 内容。一行一事。
     超限时自主浓缩/淘汰最旧或最低价值条目，淘汰内容移入 archive/ -->

（暂无条目）
`,
  'USER.md': `# 用户画像（硬上限 ${USER_LIMIT} 字符）
<!-- 只放"用户是谁/怎么协作"：沟通偏好、技术背景、环境事实。不放"做过什么" -->

（暂无条目）
`,
};

// 运行时状态不入库：去抖时间戳与巩固日志
const GITIGNORE = '.last_run\nlogs/\n';

// 即插即用：目录结构、记忆模板、git 仓库在首次巩固时自动初始化，无需手动步骤
function ensureDataDir() {
  fs.mkdirSync(p.join(GM, 'logs'), { recursive: true });
  fs.mkdirSync(p.join(GM, 'archive'), { recursive: true });
  for (const name of Object.keys(TEMPLATES)) {
    const file = p.join(GM, name);
    if (!fs.existsSync(file)) fs.writeFileSync(file, TEMPLATES[name]);
  }
  // .gitignore 在 git init 前落盘，确保首次 add -A 不带入运行时文件；存量目录升级插件后也会在此补上
  const ignoreFile = p.join(GM, '.gitignore');
  if (!fs.existsSync(ignoreFile)) fs.writeFileSync(ignoreFile, GITIGNORE);
  if (!fs.existsSync(p.join(GM, '.git'))) {
    // git 不可用或未配置身份时静默跳过，不影响核心巩固功能
    try {
      const opt = { cwd: GM, stdio: 'ignore' };
      spawnSync('git', ['init'], opt);
      spawnSync('git', ['add', '-A'], opt);
      spawnSync('git', ['commit', '-m', 'chore: 初始化全局记忆'], opt);
    } catch {}
  }
}

let raw = '';
process.stdin.on('data', c => (raw += c));
process.stdin.on('end', () => {
  // 从 hook stdin JSON 解析本次会话 transcript 路径
  let transcript = '';
  try { transcript = JSON.parse(raw).transcript_path || ''; } catch {}
  if (!transcript || !fs.existsSync(transcript)) process.exit(0);

  // 去抖检查
  const now = Math.floor(Date.now() / 1000);
  let last = 0;
  try { last = parseInt(fs.readFileSync(p.join(GM, '.last_run'), 'utf8'), 10) || 0; } catch {}
  if (now - last < DEBOUNCE) process.exit(0);

  // 会话太短不巩固
  let size = 0;
  try { size = fs.statSync(transcript).size; } catch {}
  if (size < MIN_SIZE) process.exit(0);

  // 通过全部门槛，标记本次运行时间并确保数据目录就绪
  ensureDataDir();
  fs.writeFileSync(p.join(GM, '.last_run'), String(now));

  const prompt = `你是记忆巩固器。任务：
1) 读取 ${transcript}（JSONL 会话记录，过大则只读尾部若干条）；
2) 读取 ${p.join(GM, 'MEMORY.md')} 与 ${p.join(GM, 'USER.md')}；
3) 提炼跨项目长期有价值的：用户偏好、纠错教训、工作方式、环境事实；
4) 约束：只允许修改这两个文件；写入前先查重合并，矛盾以最新为准；
   MEMORY.md ≤ ${MEMORY_LIMIT} 字符、USER.md ≤ ${USER_LIMIT} 字符，超限时自主浓缩，
   淘汰条目追加到 ${p.join(GM, 'archive', localDate() + '.md')}；项目专属细节不写入；
   无值得记录的内容则不修改任何文件。
完成后输出一行变更摘要。`;

  // 后台异步执行，不阻塞会话退出；prompt 走 stdin，避免命令行引号转义问题
  const logFd = fs.openSync(p.join(GM, 'logs', 'consolidate.log'), 'a');
  const child = spawn(
    'claude',
    [
      '-p',
      '--model', CONSOLIDATE_MODEL,
      '--permission-mode', 'acceptEdits',
      '--allowedTools', 'Read,Edit,Write,Glob',
      '--settings', '{"env":{"ENABLE_TOOL_SEARCH":"false"}}',
    ],
    {
      stdio: ['pipe', logFd, logFd],
      detached: true,
      // Windows 上 claude 为 .cmd shim，需 shell 才能解析；prompt 走 stdin 不受引号影响
      shell: process.platform === 'win32',
      env: { ...process.env, ENGRAM_CHILD: '1' },
    },
  );
  child.stdin.write(prompt);
  child.stdin.end();
  child.unref();
  process.exit(0);
});
