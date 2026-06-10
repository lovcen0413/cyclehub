import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware, optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Mock groups
const mockGroups = [
  {
    id: '1',
    name: '城市夜骑团',
    avatar: 'https://picsum.photos/100/100?random=301',
    description: '每晚8点，城市夜骑，风雨无阻',
    memberCount: 234,
    todayActivity: '今晚8点朝阳路集合',
    city: '北京',
    isJoined: false,
    createdAt: '2024-06-01T00:00:00Z',
  },
  {
    id: '2',
    name: '周末山地群',
    avatar: 'https://picsum.photos/100/100?random=302',
    description: '专业山地路线，周周出行',
    memberCount: 156,
    todayActivity: '周六早8点云蒙山',
    city: '北京',
    isJoined: false,
    createdAt: '2024-07-01T00:00:00Z',
  },
  {
    id: '3',
    name: '公路车竞速俱乐部',
    avatar: 'https://picsum.photos/100/100?random=303',
    description: '追求速度与激情，专业竞速训练',
    memberCount: 89,
    todayActivity: '暂无活动',
    city: '上海',
    isJoined: false,
    createdAt: '2024-08-01T00:00:00Z',
  },
  {
    id: '4',
    name: '休闲骑游群',
    avatar: 'https://picsum.photos/100/100?random=304',
    description: '边骑边玩，享受骑行乐趣',
    memberCount: 456,
    todayActivity: '周日环湖骑行',
    city: '杭州',
    isJoined: false,
    createdAt: '2024-05-01T00:00:00Z',
  },
];

/**
 * @route   GET /api/group/list
 * @desc    获取骑行群列表
 */
router.get('/list', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 20, city } = req.query;

    let groups = [...mockGroups];

    // 城市筛选
    if (city) {
      groups = groups.filter((g) => g.city === city);
    }

    const total = groups.length;
    const start = (Number(page) - 1) * Number(pageSize);
    const list = groups.slice(start, start + Number(pageSize));

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
    console.error('Get groups error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   GET /api/group/:id
 * @desc    获取骑行群详情
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const group = mockGroups.find((g) => g.id === id);

    if (!group) {
      return res.status(404).json({ code: 404, message: 'Group not found' });
    }

    res.json({
      code: 200,
      message: 'Success',
      data: group,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   POST /api/group
 * @desc    创建骑行群
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, description, city } = req.body;

    const newGroup = {
      id: uuidv4(),
      name,
      avatar: 'https://picsum.photos/100/100?random=new',
      description,
      city,
      memberCount: 1,
      todayActivity: '暂无活动',
      isJoined: true,
      createdAt: new Date().toISOString(),
    };

    mockGroups.unshift(newGroup);

    res.json({
      code: 200,
      message: 'Group created',
      data: newGroup,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   POST /api/group/:id/join
 * @desc    加入骑行群
 */
router.post('/:id/join', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const group = mockGroups.find((g) => g.id === id);

    if (group) {
      group.isJoined = true;
      group.memberCount += 1;
    }

    res.json({
      code: 200,
      message: 'Joined group',
      data: { joined: true },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   DELETE /api/group/:id/join
 * @desc    退出骑行群
 */
router.delete('/:id/join', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const group = mockGroups.find((g) => g.id === id);

    if (group) {
      group.isJoined = false;
      group.memberCount = Math.max(0, group.memberCount - 1);
    }

    res.json({
      code: 200,
      message: 'Left group',
      data: { joined: false },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

export { router as groupRoutes };
