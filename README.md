# skills

个人常用的 Skills 合集，用于跨设备共享。

## 安装

```bash
/install-github eyeix/skills
```

## Skills

### [`commit-msg`](./commit-msg/SKILL.md)

分析暂存变更，生成符合 [Conventional Commits](https://www.conventionalcommits.org/) 规范的提交信息。

**触发：** 用户要求生成 / 编写 commit message 时

---

### [`sync-readme`](./sync-readme/SKILL.md)

将代码库实际状态与 README.md 系统性对比，以外科手术式更新（而非重写）保持文档准确。

**触发：** 用户要求更新 README，或对话中出现了文档未记录的用户可见变更时

---

### [`sync-claude-md`](./sync-claude-md/SKILL.md)

将代码库实际状态与 CLAUDE.md 系统性对比，识别过时或缺失内容并精准 patch。

**触发：** 用户要求更新 CLAUDE.md，或代码库架构/约定/命令发生变化时

## License

MIT
