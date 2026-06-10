import { Router, Request, Response } from 'express';
import { optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Mock feed data
const mockFeeds = [
  {
    id: '1',
    type: 'post',
    title: '公路车碳纤维轮组改装分享',
    content: '最近给爱车换了碳纤维轮组，骑行体验提升明显...',
    images: ['https://picsum.photos/400/500?random=1'],
    author: {
      id: '1',
      name: '骑行达人',
      avatar: 'https://picsum.photos/100/100?random=1',
    },
    likes: 234,
    comments: 45,
    isLiked: false,
    topics: [{ id: '1', name: '#公路车改装#' }],
    createdAt: '2025-01-01T10:00:00Z',
  },
  {
    id: '2',
    type: 'post',
    title: '山地车减震器调试心得',
    content: '分享一些减震器调试的经验...',
    images: ['https://picsum.photos/400/600?random=2'],
    author: {
      id: '2',
      name: '越野爱好者',
      avatar: 'https://picsum.photos/100/100?random=2',
    },
    likes: 189,
    comments: 32,
    isLiked: true,
    topics: [{ id: '2', name: '#山地越野#' }],
    createdAt: '2025-01-02T11:00:00Z',
  },
  {
    id: '3',
    type: 'post',
    title: '夜骑必备装备清单',
    content: '夜骑安全第一，这些装备必不可少...',
    images: ['https://picsum.photos/400/400?random=3'],
    author: {
      id: '3',
      name: '夜骑团团长',
      avatar: 'https://picsum.photos/100/100?random=3',
    },
    likes: 456,
    comments: 78,
    isLiked: false,
    topics: [{ id: '3', name: '#夜骑装备#' }],
    createdAt: '2025-01-03T12:00:00Z',
  },
  {
    id: '4',
    type: 'post',
    title: '骑行服穿搭指南',
    content: '如何穿出骑行者的时尚感...',
    images: ['https://picsum.photos/400/550?random=4'],
    author: {
      id: '4',
      name: '时尚骑手',
      avatar: 'https://picsum.photos/100/100?random=4',
    },
    likes: 321,
    comments: 56,
    isLiked: false,
    topics: [{ id: '4', name: '#骑行穿搭#' }],
    createdAt: '2025-01-04T13:00:00Z',
  },
  {
    id: '5',
    type: 'post',
    title: '周末骑行打卡记录',
    content: '今天的骑行路线风景超美...',
    images: ['https://picsum.photos/400/480?random=5'],
    author: {
      id: '5',
      name: '骑行打卡王',
      avatar: 'https://picsum.photos/100/100?random=5',
    },
    likes: 567,
    comments: 89,
    isLiked: true,
    topics: [{ id: '5', name: '#骑行打卡#' }],
    createdAt: '2025-01-05T14:00:00Z',
  },
  {
    id: '6',
    type: 'post',
    title: '自己动手改装大灯',
    content: 'DIY改装让你的夜骑更安全...',
    images: ['https://picsum.photos/400/520?random=6'],
    author: {
      id: '6',
      name: '改装达人',
      avatar: 'https://picsum.photos/100/100?random=6',
    },
    likes: 234,
    comments: 45,
    isLiked: false,
    topics: [{ id: '6', name: '#改装分享#' }],
    createdAt: '2025-01-06T15:00:00Z',
  },
];

// Mock topics
const mockTopics = [
  { id: '1', name: '#公路车改装#', count: 1234 },
  { id: '2', name: '#山地越野#', count: 987 },
  { id: '3', name: '#夜骑装备#', count: 856 },
  { id: '4', name: '#骑行穿搭#', count: 654 },
  { id: '5', name: '#骑行打卡#', count: 543 },
  { id: '6', name: '#改装分享#', count: 432 },
];

/**
 * @route   GET /api/feed/:type
 * @desc    获取Feed列表
 */
router.get('/:type', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const { page = 1, pageSize = 20 } = req.query;

    let feeds = [...mockFeeds];

    // 模拟不同类型
    if (type === 'hot') {
      feeds.sort((a, b) => b.likes - a.likes);
    } else if (type === 'latest') {
      feeds.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = feeds.length;
    const start = (Number(page) - 1) * Number(pageSize);
    const list = feeds.slice(start, start + Number(pageSize));

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
    console.error('Get feed error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   GET /api/feed/topics/hot
 * @desc    获取热门话题
 */
router.get('/topics/hot', async (req: Request, res: Response) => {
  try {
    res.json({
      code: 200,
      message: 'Success',
      data: mockTopics,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   POST /api/feed/:id/like
 * @desc    点赞Feed
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
 * @route   DELETE /api/feed/:id/like
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

export { router as feedRoutes };
