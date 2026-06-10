import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Mock orders
const mockOrders = [
  {
    id: '1',
    orderNo: 'CH20250101123456',
    status: 'pending_payment',
    items: [
      {
        id: '1',
        product: {
          id: '1',
          name: '碳纤维公路车轮组 50mm',
          images: ['https://picsum.photos/200/200?random=101'],
          price: 2999,
        },
        quantity: 1,
        price: 2999,
      },
    ],
    totalAmount: 2999,
    payAmount: 2999,
    address: {
      id: '1',
      name: '张三',
      phone: '138****1234',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '某街道某小区1号楼101',
      isDefault: true,
    },
    createdAt: '2025-01-01T10:00:00Z',
  },
  {
    id: '2',
    orderNo: 'CH20250101123457',
    status: 'shipped',
    items: [
      {
        id: '1',
        product: {
          id: '2',
          name: '专业骑行头盔',
          images: ['https://picsum.photos/200/200?random=102'],
          price: 499,
        },
        quantity: 1,
        price: 499,
      },
    ],
    totalAmount: 499,
    payAmount: 499,
    address: {
      id: '1',
      name: '张三',
      phone: '138****1234',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '某街道某小区1号楼101',
      isDefault: true,
    },
    createdAt: '2025-01-02T10:00:00Z',
    shipAt: '2025-01-03T10:00:00Z',
  },
];

/**
 * @route   GET /api/order/list
 * @desc    获取订单列表
 */
router.get('/list', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { status, page = 1, pageSize = 20 } = req.query;

    let orders = [...mockOrders];

    // 状态筛选
    if (status) {
      orders = orders.filter((o) => o.status === status);
    }

    const total = orders.length;
    const start = (Number(page) - 1) * Number(pageSize);
    const list = orders.slice(start, start + Number(pageSize));

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
    console.error('Get orders error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   GET /api/order/:id
 * @desc    获取订单详情
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = mockOrders.find((o) => o.id === id);

    if (!order) {
      return res.status(404).json({ code: 404, message: 'Order not found' });
    }

    res.json({
      code: 200,
      message: 'Success',
      data: order,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   POST /api/order/create
 * @desc    创建订单
 */
router.post('/create', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { items, addressId, remark } = req.body;

    // 计算总价
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const newOrder = {
      id: uuidv4(),
      orderNo: `CH${Date.now()}`,
      status: 'pending_payment',
      items,
      totalAmount,
      payAmount: totalAmount,
      address: {
        id: addressId,
        name: '张三',
        phone: '138****1234',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        detail: '某街道某小区1号楼101',
        isDefault: true,
      },
      remark,
      createdAt: new Date().toISOString(),
    };

    mockOrders.unshift(newOrder);

    res.json({
      code: 200,
      message: 'Order created',
      data: newOrder,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   POST /api/order/:id/pay
 * @desc    支付订单
 */
router.post('/:id/pay', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = mockOrders.find((o) => o.id === id);

    if (order) {
      order.status = 'pending_shipment';
      order.payAt = new Date().toISOString();
    }

    res.json({
      code: 200,
      message: 'Payment successful',
      data: { success: true },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Pay order error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   POST /api/order/:id/cancel
 * @desc    取消订单
 */
router.post('/:id/cancel', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = mockOrders.find((o) => o.id === id);

    if (order) {
      order.status = 'cancelled';
    }

    res.json({
      code: 200,
      message: 'Order cancelled',
      data: { success: true },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   POST /api/order/:id/confirm
 * @desc    确认收货
 */
router.post('/:id/confirm', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = mockOrders.find((o) => o.id === id);

    if (order) {
      order.status = 'completed';
      order.receiveAt = new Date().toISOString();
    }

    res.json({
      code: 200,
      message: 'Order completed',
      data: { success: true },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Confirm order error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

export { router as orderRoutes };
