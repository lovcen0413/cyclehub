# 骑改App (CycleHub)

> 🚴 骑行好物分享社区 - 发现骑行改装之美

## 项目简介

骑改App是一款面向骑行爱好者的改装好物分享社区APP，融合潮流社区与品质电商，为用户提供从内容发现到商品交易的完整闭环体验。

**产品slogan：** 「骑行，从发现开始」

## 技术栈

| 层级 | 技术选型 |
|------|---------|
| 移动端框架 | Expo (React Native) |
| 路由方案 | Expo Router |
| 样式方案 | TailwindCSS (Uniwind) |
| 状态管理 | Zustand |
| 后端框架 | Express.js |
| 包管理器 | pnpm monorepo |

## 项目结构

```
cyclehub/
├── client/                    # 前端代码
│   ├── app/                   # Expo Router 路由
│   │   ├── (tabs)/           # 底部Tab路由组
│   │   ├── (auth)/           # 认证路由组
│   │   ├── (detail)/         # 详情页路由组
│   │   ├── (order)/          # 订单流程路由组
│   │   └── (publish)/         # 发布流程路由组
│   ├── src/
│   │   ├── components/       # 组件库
│   │   ├── hooks/            # 自定义Hooks
│   │   ├── stores/           # 状态管理
│   │   ├── services/          # API服务
│   │   ├── types/            # TypeScript类型
│   │   ├── utils/            # 工具函数
│   │   └── constants/         # 常量定义
│   └── assets/               # 静态资源
│
├── server/                    # 后端代码
│   └── src/
│       ├── controllers/       # 控制器
│       ├── routes/           # 路由定义
│       ├── middlewares/      # 中间件
│       └── utils/            # 工具函数
│
├── package.json              # Monorepo根配置
└── README.md
```

## 设计规范

### 配色方案（得物风格）

| 用途 | 色值 |
|------|------|
| 主色 | #111111（近纯黑） |
| 强调色 | #FF2442（得物红） |
| 背景色 | #FFFFFF |
| 次级背景 | #F7F7F7 |
| 边框色 | #ECECEC |
| 文字主色 | #111111 |
| 文字副色 | #888888 |

### 页面导航

| Tab | 页面 | 路径 |
|-----|------|------|
| 首页 | 首页 | / |
| 商城 | 商城 | /shop |
| 社区 | 社区 | /community |
| 我的 | 我的 | /profile |

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
# 安装所有依赖
pnpm install

# 安装前端依赖
cd client && pnpm install

# 安装后端依赖
cd server && pnpm install
```

### 开发模式

```bash
# 启动前端开发服务器
pnpm dev:client

# 启动后端开发服务器
pnpm dev:server

# 并行启动前后端
pnpm dev
```

### 构建

```bash
# 构建前端
pnpm build

# 构建后端
pnpm build:server
```

## 功能模块

### 首页 (Home)
- 瀑布流内容展示
- Tab频道切换（推荐/热门/最新/关注）
- 热门话题横向滚动
- 下拉刷新/上拉加载

### 商城 (Shop)
- 商品分类Tab
- 排序筛选（综合/销量/价格）
- 商品详情页
- 购物车

### 社区 (Community)
- 帖子/骑行群Tab切换
- 小红书风格瀑布流
- 右下角发布按钮
- 骑行群列表

### 我的 (Profile)
- 登录/未登录状态区分
- 手机号登录
- 个人资料管理
- 订单管理

## API接口

后端API运行在 `http://localhost:3000/api`

### 认证接口
- `POST /api/auth/send-code` - 发送验证码
- `POST /api/auth/login` - 手机号登录
- `GET /api/auth/user-info` - 获取用户信息

### 商品接口
- `GET /api/product/list` - 商品列表
- `GET /api/product/:id` - 商品详情

### Feed接口
- `GET /api/feed/:type` - Feed列表
- `GET /api/feed/topics/hot` - 热门话题

### 帖子接口
- `GET /api/post/list` - 帖子列表
- `GET /api/post/:id` - 帖子详情
- `POST /api/post` - 发布帖子

### 骑行群接口
- `GET /api/group/list` - 骑行群列表
- `GET /api/group/:id` - 骑行群详情
- `POST /api/group/:id/join` - 加入骑行群

### 购物车接口
- `GET /api/cart` - 获取购物车
- `POST /api/cart` - 添加到购物车
- `PUT /api/cart/:id` - 更新数量
- `DELETE /api/cart/:id` - 删除商品

### 订单接口
- `GET /api/order/list` - 订单列表
- `POST /api/order/create` - 创建订单
- `POST /api/order/:id/pay` - 支付订单

## 开发规范

### 代码规范
- TypeScript 严格模式
- 组件文件使用 PascalCase
- 工具文件使用 kebab-case
- 样式使用 TailwindCSS (Uniwind)

### 组件规范
- 类型定义单独文件 (ComponentName.types.ts)
- 样式单独文件 (ComponentName.styles.ts)
- 主文件和index.ts统一导出

## License

MIT
