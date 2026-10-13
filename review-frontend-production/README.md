# 前端审查助手

版本:0.3.0-beta · 2026-10-10

一个面向 Vibe Coding 和原型前端的工程审查 Skill,逐页、逐状态、逐组件梳理问题,输出有证据、可追踪的修复与重构方案。

## 适合什么任务

- 快速体检:优先找核心流程的问题,产出一份简短报告。
- 完整审查:逐页逐组件建立证据台账、问题清单、重构方案和验收条件。
- 按明确授权修复:小批实施、复验并记录仍未解决的限制。

没有指定深度时默认快速体检;用户明确要求全站或完整审查时使用完整流程。截图只能证明所展示的视觉状态,源码审查不能证明交互已运行成功。

## 使用入口

Skill ID 与目录名一致,均为 `review-frontend-production`。安装本仓库后由模型自动到达,也可直接键入 `/review-frontend-production`。实际能读取文件、运行脚本、访问网页的能力取决于所使用的宿主;宿主缺少某项能力时,对应检查降级为待验证并在报告中说明。

示例请求:

1. /review-frontend-production 快速体检这个前端项目,优先检查注册、登录和提交失败恢复,先输出主要问题,不修改源码。
2. /review-frontend-production 完整审查这个项目,逐页逐组件建立台账,输出修复计划和未验证范围。
3. /review-frontend-production 修复这份审查报告中已确认的 P1 问题,并复验受影响流程;保留现有设计。

附上项目路径或网址,以及已知的核心任务即可;有测试账号、设备范围和设计标准时一并提供。

## 环境与产物

两个辅助脚本只依赖 Python 3 标准库,建议 Python 3.9 或更高版本;已验证版本见 VALIDATION.md。rg 可选,缺少时发现脚本回退到目录遍历。实际页面检查需宿主具备浏览器或测试工具;项目构建工具沿用项目自身配置,不随本 skill 安装。

- quick:quick-review.md,以及必要证据。
- full:review.md、audit.json、coverage.md、页面报告、组件方案及任务计划。
- 示例:examples/source-only/,包含虚构输入、实际静态检查、台账、报告与重跑方法。

完整审查可能产生较多记录,规模取决于页面、组件契约和场景差异。台账校验只检查声明的结构与关联,不能认证证据真实性或保证没有漏洞。

## 验证脚本

在本技能目录运行:

```sh
python3 -B -m unittest discover -s tests -v
python3 -B examples/source-only/verify_fixture.py
python3 -B scripts/audit_ledger.py check examples/source-only/audit.json --require-plan
```

最后一条应返回 0;示例使用源码访问,--require-complete 和 --require-ready 应返回 2,表示未满足完整验证/发布条件。

## 隐私

示例数据全部虚构,不包含真实业务数据。审查产物可能包含项目绝对路径、包名、路由和源码位置;向他人分享运行结果前另做脱敏,报告本身不写密钥和真实个人数据。

## 边界

输入可以是源码、网址或截图;脚本与浏览器均为可选的宿主能力。只有截图时仅作视觉检查;没有 Python 时人工整理台账,并说明未执行机械校验;无文件写入能力时在对话中交付。

版本变化见 CHANGELOG.md。
