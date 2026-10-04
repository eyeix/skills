# Skill 机制

[`writing-for-agents`](SKILL.md) 的 skill 专有分支:文档是 skill 时变了什么(frontmatter、调用方式选择、路由 skill)。其余写作法则是 SKILL.md 的通用参考。

## 调用方式

两种选择,交换的是两种负载:

- **model-invoked**(模型可调):保留 `description`,agent 能自主触发,其他 skill 也能到达它。人仍然可以键入:模型可调永远**包含**人的可达——description 只增加 agent 的发现,从不剥夺人的。description 是 skill 的顶层上下文指针,强制常驻:用常驻上下文负载换取可发现性。全参考型内容的 model-invoked skill 还可以当共享参考的家:别的 skill 能调它,多个 skill 都要的参考就放一处。机制:省略 `disable-model-invocation`,写面向模型的 description,携带触发分支(SKILL.md 的指针写法规则全部适用);
- **user-invoked**(仅人可调):把 description 从 agent 的可达里剥掉,只有人键入才能触发,任何 skill 都不能。零上下文负载,但花认知负载:你就是必须记得它存在的索引。机制:`disable-model-invocation: true`,description 变为面向人的一行摘要,剥掉触发列表。

只在 agent 必须自主到达、或其他 skill 必须到达时选 model-invoked;只靠人手的,user-invoked,不付上下文负载。两个 user-invoked skill 都需要的共享参考,两边都放不了:没有 description,谁也触发不了谁。推到 skill 体系之外的普通文件:任何 skill 都能指向的外部参考。

## 按调用拆分

拆分的调用切面(时序切面见 SKILL.md):当有一个该独立触发的领词(你在提示里真的会用的触发词),或其他 skill 必须到达时,拆出 model-invoked skill。新 skill 的 description 常驻,这个独立可达要配得上这份上下文负载。

## 路由 skill

user-invoked skills 多到记不住时,堆高的认知负载由**路由 skill** 化解:一个 user-invoked skill 点名其余 skills 与各自何时使用,人只需记住一个。它只能提示,永远不能触发它们:user-invoked skills 没有 description,除人以外谁也够不着。
