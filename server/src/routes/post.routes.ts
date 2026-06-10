import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware, optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Mock posts
const mockPosts = [
  {
    id: '1',
    content: '今天完成了一次环湖骑行，风景超美！分享一些骑行中的小技巧给大家...',
    images: ['https://picsum.photos/400/500?random=201'],
    author: {
      id: '1',
      name: '骑行爱好者',
      avatar: 'https://picsum.photos/100/100?random=201',
      followers: 1234,
      following: 567,
      likes: 8901,
    },
    likes: 234,
    comments: 45,
    isLiked: false,
    topics: [{ id: '1', name: '#骑行打卡#' }],
    location: '西湖',
    createdAt: '2025-01-01T10:00:00Z',
  },
  {
    id: '2',
    content: '给大家推荐这款碳纤维轮组，性价比超高！',
    images: [
      'https://picsum.photos/400/500?random=202',
      'https://picsum.photos/400/500?random=203',
    ],
    author: {
      id: '2',
      name: '装备测评师',
      avatar: 'https://picsum.photos/100/100?random=202',
      followers: 5678,
      following: 234,
      likes: 12345,
    },
    likes: 456,
    comments: 67,
    isLiked: true,
    topics: [{ id: '2', name: '#改装分享#' }],
    createdAt: '2025-01-02T11:00:00Z',
  },
];

/**
 * @route   GET /api/post/list
 * @desc    获取帖子列表
 */
router.get('/list', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 20 } = req.query;

    const total = mockPosts.length;
    const start = (Number(page) - 1) * Number(pageSize);
    const list = mockPosts.slice(start, start + Number(pageSize));

    res.json({
      code: 200,
      message: 'Success',
      data: {
        list,
        pagination: {
          page: Number(page),
          pageSize: Number(pageSize),
          total,
          totalPages: Math.ceil(total / Number(pageSize)),
        },
      },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   GET /api/post/:id
 * @desc    获取帖子详情
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = mockPosts.find((p) => p.id === id);

    if (!post) {
      return res.status(404).json({ code: 404, message: 'Post not found' });
    }

    res.json({
      code: 200,
      message: 'Success',
      data: post,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   POST /api/post
 * @desc    发布帖子
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { content, images, video, topics, location } = req.body;

    const newPost = {
      id: uuidv4(),
      content,
      images: images || [],
      video,
      topics: topics || [],
      location,
      author: {
        id: userId,
        name: '骑行达人',
        avatar: 'https://picsum.photos/100/100?random=profile',
      },
      likes: 0,
      comments: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };

    mockPosts.unshift(newPost);

    res.json({
      code: 200,
      message: 'Post created',
      data: newPost,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   POST /api/post/:id/like
 * @desc    点赞帖子
 */
router.post('/:id/like', async (req: Request, res: Response) => {
  try {
    res.json({
      code: 200,
      message: 'Liked',
      data: { liked: true },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   DELETE /api/post/:id/like
 * @desc    取消点赞
 */
router.delete('/:id/like', async (req: Request, res: Response) => {
  try {
    res.json({
      code: 200,
      message: 'Unliked',
      data: { liked: false },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Unlike error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   GET /api/post/:id/comments
 * @desc    获取帖子评论
 */
router.get('/:id/comments', async (req: Request, res: Response) => {
  try {
    // Mock comments
    const comments = [
      {
        id: '1',
        content: '太棒了！',
        author: {
          id: '1',
          name: '骑友甲',
          avatar: 'https://picsum.photos/100/100?random=c1',
        },
        likes: 12,
        createdAt: '2025-01-01T11:00:00Z',
      },
      {
        id: '2',
        content: '请问在哪里买的？',
        author: {
          id: '2',
          name: '骑友乙',
          avatar: 'https://picsum.photos/100/100?random=c2',
        },
        likes: 5,
        createdAt: '2025-01-01T12:00:00Z',
      },
    ];

    res.json({
      code: 200,
      message: 'Success',
      data: comments,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

export { router as postRoutes };
