# 何时 Mock

只在**系统边界** mock:

- 外部 API(支付、邮件等)
- 数据库(视情况——优先测试数据库)
- 时间/随机性
- 文件系统(视情况)

不 mock:

- 你自己的类/模块
- 内部协作者
- 任何你控制的东西

## 为可 Mock 性设计

在系统边界,设计易于 mock 的接口:

**1. 用依赖注入**

外部依赖传进来,而不是内部创建:

```typescript
// 易于 mock
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// 难以 mock
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**2. 优先 SDK 式接口,而非泛用 fetcher**

为每个外部操作建具体函数,而不是一个带条件逻辑的泛用函数:

```typescript
// GOOD: 每个函数独立可 mock
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// BAD: mock 需要在 mock 里写条件逻辑
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

SDK 式的好处:

- 每个 mock 只返回一种形状
- 测试准备里没有条件逻辑
- 一眼看出测试用了哪些端点
- 每个端点独立的类型安全
