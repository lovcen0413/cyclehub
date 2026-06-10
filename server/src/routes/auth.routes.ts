import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Mock user data
const mockUsers: Record<string, any> = {};

// Mock tokens
const tokens: Record<string, any> = {};

// Mock verification codes storage (in production, use Redis)
const verificationCodes: Record<string, { code: string; expiresAt: number }> = {};

/**
 * @route   POST /api/auth/send-code
 * @desc    发送验证码
 */
router.post('/send-code', [
  body('phone').isMobilePhone('zh-CN').withMessage('Invalid phone number'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 400, message: 'Invalid input', errors: errors.array() });
    }

    const { phone } = req.body;
    
    // 生成6位验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 存储验证码，5分钟过期
    const expiresAt = Date.now() + 5 * 60 * 1000;
    verificationCodes[phone] = { code, expiresAt };
    
    // 模拟发送（实际应调用短信服务商API）
    console.log(`[SMS Mock] Phone: ${phone}, Code: ${code}, Expires: ${new Date(expiresAt).toISOString()}`);
    
    res.json({
      code: 200,
      message: 'Code sent successfully',
      data: { message: 'Code sent to phone' },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Send code error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    手机号登录
 */
router.post('/login', [
  body('phone').isMobilePhone('zh-CN').withMessage('Invalid phone number'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Invalid code'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 400, message: 'Invalid input', errors: errors.array() });
    }

    const { phone, code } = req.body;

    // 验证验证码
    const storedData = verificationCodes[phone];
    if (!storedData || storedData.expiresAt < Date.now()) {
      return res.status(401).json({ code: 401, message: 'Verification code expired or not sent' });
    }
    if (storedData.code !== code) {
      return res.status(401).json({ code: 401, message: 'Invalid verification code' });
    }
    
    // 验证成功后删除验证码（一次性）
    delete verificationCodes[phone];

    // 获取或创建用户
    let user = Object.values(mockUsers).find((u: any) => u.phone === phone);
    if (!user) {
      user = {
        id: uuidv4(),
        phone,
        name: `用户${phone.slice(-4)}`,
        avatar: `https://picsum.photos/100/100?random=${phone}`,
        followers: Math.floor(Math.random() * 1000),
        following: Math.floor(Math.random() * 500),
        likes: Math.floor(Math.random() * 5000),
        createdAt: new Date().toISOString(),
      };
      mockUsers[user.id] = user;
    }

    // 生成token
    const token = uuidv4();
    const refreshToken = uuidv4();
    tokens[token] = { userId: user.id, refreshToken };

    res.json({
      code: 200,
      message: 'Login successful',
      data: {
        token,
        refreshToken,
        user,
      },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   POST /api/auth/refresh
 * @desc    刷新Token
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    // 模拟刷新token
    const newToken = uuidv4();
    const newRefreshToken = uuidv4();
    
    res.json({
      code: 200,
      message: 'Token refreshed',
      data: { token: newToken, refreshToken: newRefreshToken },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   GET /api/auth/user-info
 * @desc    获取当前用户信息
 */
router.get('/user-info', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = mockUsers[userId];

    if (!user) {
      return res.status(404).json({ code: 404, message: 'User not found' });
    }

    res.json({
      code: 200,
      message: 'Success',
      data: user,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

export { router as authRoutes };
