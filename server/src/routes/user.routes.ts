import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Mock user data
const mockUsers: Record<string, any> = {
  'mock-user-id': {
    id: 'mock-user-id',
    name: '骑行达人',
    avatar: 'https://picsum.photos/100/100?random=profile',
    phone: '138****1234',
    bio: '热爱骑行，享受速度带来的快乐',
    followers: 1234,
    following: 567,
    likes: 8901,
    createdAt: '2024-01-01T00:00:00Z',
  },
};

/**
 * @route   GET /api/user/profile
 * @desc    获取用户资料
 */
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
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
    console.error('Get profile error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   PUT /api/user/profile
 * @desc    更新用户资料
 */
router.put('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, bio, avatar } = req.body;

    if (mockUsers[userId]) {
      if (name) mockUsers[userId].name = name;
      if (bio) mockUsers[userId].bio = bio;
      if (avatar) mockUsers[userId].avatar = avatar;
    }

    res.json({
      code: 200,
      message: 'Profile updated',
      data: mockUsers[userId],
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   GET /api/user/:id
 * @desc    获取指定用户信息
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = mockUsers[id];

    if (!user) {
      // Return mock data for demo
      return res.json({
        code: 200,
        message: 'Success',
        data: {
          id,
          name: `用户${id.slice(0, 4)}`,
          avatar: `https://picsum.photos/100/100?random=${id}`,
          followers: Math.floor(Math.random() * 1000),
          following: Math.floor(Math.random() * 500),
          likes: Math.floor(Math.random() * 5000),
          createdAt: '2024-01-01T00:00:00Z',
        },
        timestamp: Date.now(),
      });
    }

    res.json({
      code: 200,
      message: 'Success',
      data: user,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   POST /api/user/:id/follow
 * @desc    关注用户
 */
router.post('/:id/follow', authMiddleware, async (req: Request, res: Response) => {
  try {
    res.json({
      code: 200,
      message: 'Followed successfully',
      data: { followed: true },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   DELETE /api/user/:id/follow
 * @desc    取消关注
 */
router.delete('/:id/follow', authMiddleware, async (req: Request, res: Response) => {
  try {
    res.json({
      code: 200,
      message: 'Unfollowed successfully',
      data: { followed: false },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

export { router as userRoutes };
