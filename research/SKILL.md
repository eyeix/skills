---
name: research
description: Investigate a question against high-trust primary sources and capture the findings as a Markdown file under .agentdocs/. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent.
---

# 调研

派一个**后台代理**去做调研,你继续手头工作,它在旁边读。

后台代理的工作:

1. 只对**一手来源**(官方文档、源码、规范、第一方 API)调查,不采信对它们的转述文章。每条主张追溯到拥有它的源头;
2. 调研结果写成单个 Markdown 文件,每条主张附来源引用;
3. 落盘位置:有活动任务目录(`.agentdocs/workflow/<task>/`)时写 `research/<主题>.md`;没有时写 `.agentdocs/research/<主题>.md`。项目已有其他调研笔记约定的,从其约定。
