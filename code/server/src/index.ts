import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { authRoutes } from './routes/auth.routes.js';
import { userRoutes } from './routes/user.routes.js';
import { productRoutes } from './routes/product.routes.js';
import { cartRoutes } from './routes/cart.routes.js';
import { feedRoutes } from './routes/feed.routes.js';
import { postRoutes } from './routes/post.routes.js';
import { groupRoutes } from './routes/group.routes.js';
import { orderRoutes } from './routes/order.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/post', postRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/order', orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ code: 404, message: 'Not Found' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ code: 500, message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 CycleHub API Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
});

export default app;
