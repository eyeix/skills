// engram · 会话启动注入：维护规则 + 全局记忆内容（stdout 直接进入会话上下文）
const fs = require('fs');
const os = require('os');
const p = require('path');

const GM = process.env.ENGRAM_MEMORY_DIR || p.join(os.homedir(), '.engram');

const RULES = `[engram 记忆维护规则]
- 全局记忆位于数据目录 ${GM}：MEMORY.md（跨项目事实，≤3000 字符）、USER.md（用户画像，≤1500 字符）、archive/（被淘汰条目）。目录由首次 Stop 巩固自动初始化。
- 任务回顾时，发现跨项目通用的偏好/教训/事实：先读现有条目查重 → 矛盾以最新为准并改写旧条目 → 写入；超限时自主浓缩，淘汰内容移入 archive/（注明日期）。项目专属信息不写入全局层。
- Skill 蒸馏触发条件（满足其一）：同类纠错累计 ≥3 次 / 用户明确纠正错误做法 / 完成有复用价值的复杂排查。将解法蒸馏为 ~/.claude/skills/<name>/SKILL.md（YAML frontmatter 含 name、description）；已有相近 skill 时更新而非新建。`;

function main() {
  console.log('=== engram 全局记忆（自动注入） ===');
  console.log(RULES);

  for (const f of ['MEMORY.md', 'USER.md']) {
    try {
      const content = fs.readFileSync(p.join(GM, f), 'utf8');
      console.log(`--- ${f} ---`);
      console.log(content);
    } catch {
      console.log(`（${f} 尚未初始化，运行 /engram review 完成初始化）`);
    }
  }
}

main();
