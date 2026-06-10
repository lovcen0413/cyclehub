const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data store
const users = [
  { id: '1', username: 'demo', email: 'demo@cyclehub.app', phone: '13800138000', bikeBrand: '捷安特', bikeModel: 'ATX860', bikeAge: 2, role: 'user', avatar: '', bio: '骑行爱好者', createdAt: new Date().toISOString() }
];
const products = [
  { id: '1', name: '碳纤维公路车轮组', price: 2999, category: 'equipment', condition: '全新', description: ' lightweight carbon fiber wheelset', images: ['https://picsum.photos/400/300?random=1'], sellerId: '1', status: 'available', views: 128, likes: 45, createdAt: new Date().toISOString() },
  { id: '2', name: 'Shimano XT刹车卡钳', price: 680, category: 'parts', condition: '95新', description: '高性能山地刹车系统', images: ['https://picsum.photos/400/300?random=2'], sellerId: '1', status: 'available', views: 89, likes: 23, createdAt: new Date().toISOString() }
];
const posts = [
  { id: '1', userId: '1', content: '周末环湖骑行，有没有人一起？', images: [], likes: 12, comments: 5, tags: ['骑行', '环湖'], createdAt: new Date().toISOString() }
];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'CycleHub API v1.0' });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (user) {
    res.json({ code: 200, message: '登录成功', data: { token: 'mock-jwt-token-' + user.id, user } });
  } else {
    res.status(401).json({ code: 401, message: '用户名或密码错误' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const newUser = { id: uuidv4(), ...req.body, role: 'user', createdAt: new Date().toISOString() };
  users.push(newUser);
  res.json({ code: 200, message: '注册成功', data: { token: 'mock-jwt-token-' + newUser.id, user: newUser } });
});

// User routes
app.get('/api/user/profile', (req, res) => {
  res.json({ code: 200, data: users[0] });
});

app.put('/api/user/profile', (req, res) => {
  Object.assign(users[0], req.body);
  res.json({ code: 200, message: '更新成功', data: users[0] });
});

// Product routes
app.get('/api/product/list', (req, res) => {
  res.json({ code: 200, data: { list: products, total: products.length, page: 1, pageSize: 20 } });
});

app.get('/api/product/detail/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  product ? res.json({ code: 200, data: product }) : res.status(404).json({ code: 404, message: '商品不存在' });
});

app.post('/api/product/create', (req, res) => {
  const newProduct = { id: uuidv4(), ...req.body, status: 'available', views: 0, likes: 0, createdAt: new Date().toISOString() };
  products.push(newProduct);
  res.json({ code: 200, message: '发布成功', data: newProduct });
});

// Post/Feed routes
app.get('/api/feed/list', (req, res) => {
  res.json({ code: 200, data: { list: posts, total: posts.length } });
});

app.post('/api/post/create', (req, res) => {
  const newPost = { id: uuidv4(), userId: '1', ...req.body, likes: 0, comments: 0, createdAt: new Date().toISOString() };
  posts.push(newPost);
  res.json({ code: 200, message: '发布成功', data: newPost });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ code: 404, message: 'Not Found: ' + req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ code: 500, message: 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CycleHub API Server running on http://0.0.0.0:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
});

module.exports = app;
