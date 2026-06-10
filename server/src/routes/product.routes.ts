import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Mock product data
const mockProducts = [
  {
    id: '1',
    name: '碳纤维公路车轮组 50mm',
    images: [
      'https://picsum.photos/800/800?random=101',
      'https://picsum.photos/800/800?random=102',
    ],
    price: 299900,
    originalPrice: 399900,
    sales: 1234,
    stock: 99,
    description: '专业级碳纤维轮组，轻量化设计，提升骑行效率',
    details: [
      '材质：T800碳纤维',
      '框高：50mm',
      '重量：1450g',
      '刹车边：可选碳纤维/铝合金',
    ],
    specs: [
      { name: '框高', values: ['40mm', '50mm', '60mm'] },
      { name: '刹车边', values: ['碳纤维', '铝合金'] },
    ],
    category: 'parts',
    shop: { id: '1', name: 'BikePro旗舰店' },
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: '专业骑行头盔 安全防护',
    images: ['https://picsum.photos/800/800?random=201'],
    price: 49900,
    originalPrice: 69900,
    sales: 2345,
    stock: 88,
    description: 'MIPS安全防护系统，有效降低撞击伤害',
    details: ['MIPS防护系统', 'EPS缓冲层', '一体成型', '透气孔设计'],
    specs: [{ name: '尺码', values: ['S', 'M', 'L', 'XL'] }],
    category: 'gear',
    shop: { id: '2', name: 'SafeRide运动专营店' },
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'GPS码表 速度心率监测',
    images: ['https://picsum.photos/800/800?random=301'],
    price: 89900,
    originalPrice: 119900,
    sales: 876,
    stock: 66,
    description: '双星定位，精准记录骑行数据',
    details: ['GPS+GLONASS双星定位', '心率监测', '踏频监测', '海拔记录', 'IPX7防水'],
    specs: [],
    category: 'parts',
    shop: { id: '3', name: 'TechCycle科技店' },
    createdAt: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    name: '锁鞋 专业竞速款',
    images: ['https://picsum.photos/800/800?random=401'],
    price: 69900,
    originalPrice: 89900,
    sales: 543,
    stock: 55,
    description: '碳纤维鞋底，高效能量传导',
    details: ['碳纤维强化鞋底', 'BOA旋钮调节', '透气网面', '可替换锁片'],
    specs: [
      { name: '尺码', values: ['38', '39', '40', '41', '42', '43', '44'] },
      { name: '颜色', values: ['黑色', '白色', '红色'] },
    ],
    category: 'gear',
    shop: { id: '4', name: 'SpeedMaster运动店' },
    createdAt: '2024-01-04T00:00:00Z',
  },
  {
    id: '5',
    name: '骑行服套装 透气速干',
    images: ['https://picsum.photos/800/800?random=501'],
    price: 39900,
    originalPrice: 59900,
    sales: 1567,
    stock: 77,
    description: '专业骑行服套装，骑行更舒适',
    details: ['意大利进口面料', 'UPF50+防晒', '3D剪裁', '速干透气'],
    specs: [
      { name: '尺码', values: ['S', 'M', 'L', 'XL', 'XXL'] },
      { name: '款式', values: ['男款', '女款'] },
    ],
    category: 'gear',
    shop: { id: '5', name: 'ComfortRide服饰店' },
    createdAt: '2024-01-05T00:00:00Z',
  },
  {
    id: '6',
    name: '山地车前叉 油簧可调',
    images: ['https://picsum.photos/800/800?random=601'],
    price: 189900,
    originalPrice: 229900,
    sales: 321,
    stock: 44,
    description: '130mm行程，油簧可调，适合各种地形',
    details: ['行程：130mm', '阻尼：油簧可调', '筒径：34mm', '开槽：110x15mm'],
    specs: [],
    category: 'parts',
    shop: { id: '6', name: 'MountainKing配件店' },
    createdAt: '2024-01-06T00:00:00Z',
  },
];

/**
 * @route   GET /api/product/list
 * @desc    获取商品列表
 */
router.get('/list', async (req: Request, res: Response) => {
  try {
    const { category, sort, keyword, page = 1, pageSize = 20 } = req.query;

    let products = [...mockProducts];

    // 分类筛选
    if (category && category !== 'all') {
      products = products.filter((p) => p.category === category);
    }

    // 关键词搜索
    if (keyword) {
      const k = keyword as string;
      products = products.filter((p) => p.name.includes(k));
    }

    // 排序
    if (sort === 'sales') {
      products.sort((a, b) => b.sales - a.sales);
    } else if (sort === 'price_asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      products.sort((a, b) => b.price - a.price);
    }

    // 分页
    const total = products.length;
    const start = (Number(page) - 1) * Number(pageSize);
    const list = products.slice(start, start + Number(pageSize));

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
    console.error('Get products error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   GET /api/product/:id
 * @desc    获取商品详情
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = mockProducts.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({ code: 404, message: 'Product not found' });
    }

    res.json({
      code: 200,
      message: 'Success',
      data: product,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   GET /api/product/categories
 * @desc    获取商品分类
 */
router.get('/meta/categories', async (req: Request, res: Response) => {
  try {
    const categories = [
      { key: 'all', label: '全部' },
      { key: 'bike', label: '整车' },
      { key: 'parts', label: '配件' },
      { key: 'gear', label: '装备' },
      { key: 'peripheral', label: '周边' },
      { key: 'maintenance', label: '保养' },
    ];

    res.json({
      code: 200,
      message: 'Success',
      data: categories,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

export { router as productRoutes };
