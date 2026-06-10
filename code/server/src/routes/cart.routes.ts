import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Mock cart data
const carts: Record<string, any[]> = {};

/**
 * @route   GET /api/cart
 * @desc    获取购物车列表
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const cart = carts[userId] || [];

    const totalAmount = cart.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const totalCount = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);

    res.json({
      code: 200,
      message: 'Success',
      data: {
        list: cart,
        totalAmount,
        totalCount,
      },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   POST /api/cart
 * @desc    添加商品到购物车
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { productId, skuId, quantity = 1 } = req.body;

    if (!carts[userId]) {
      carts[userId] = [];
    }

    const cart = carts[userId];
    const existItem = cart.find(
      (item) => item.productId === productId && item.skuId === skuId
    );

    if (existItem) {
      existItem.quantity += quantity;
    } else {
      cart.push({
        id: uuidv4(),
        productId,
        skuId,
        quantity,
        selected: true,
        addedAt: new Date().toISOString(),
      });
    }

    res.json({
      code: 200,
      message: 'Added to cart',
      data: { success: true },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   PUT /api/cart/:id
 * @desc    更新购物车商品数量
 */
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { quantity } = req.body;

    if (carts[userId]) {
      const item = carts[userId].find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    }

    res.json({
      code: 200,
      message: 'Updated',
      data: { success: true },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   DELETE /api/cart/:id
 * @desc    删除购物车商品
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    if (carts[userId]) {
      carts[userId] = carts[userId].filter((item) => item.id !== id);
    }

    res.json({
      code: 200,
      message: 'Deleted',
      data: { success: true },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Delete cart error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   DELETE /api/cart
 * @desc    清空购物车
 */
router.delete('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    carts[userId] = [];

    res.json({
      code: 200,
      message: 'Cart cleared',
      data: { success: true },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

export { router as cartRoutes };
