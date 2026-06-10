import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { DataStore } from '../services/data.service.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

/**
 * @route   GET /api/address/list
 * @desc    获取地址列表
 */
router.get('/list', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const addresses = await DataStore.getAddresses(userId);

    res.json({
      code: 200,
      message: 'Success',
      data: addresses,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   GET /api/address/default
 * @desc    获取默认地址
 */
router.get('/default', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const address = await DataStore.getDefaultAddress(userId);

    res.json({
      code: 200,
      message: 'Success',
      data: address,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Get default address error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   GET /api/address/:id
 * @desc    获取地址详情
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const addresses = await DataStore.getAddresses((req as any).userId);
    const address = addresses.find((a: any) => a.id === id);

    if (!address) {
      return res.status(404).json({ code: 404, message: 'Address not found' });
    }

    res.json({
      code: 200,
      message: 'Success',
      data: address,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Get address error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   POST /api/address
 * @desc    创建地址
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, phone, province, city, district, detail, isDefault } = req.body;

    const newAddress = {
      id: uuidv4(),
      userId,
      name,
      phone,
      province,
      city,
      district,
      detail,
      isDefault: isDefault || false,
      createdAt: new Date().toISOString(),
    };

    await DataStore.createAddress(newAddress);

    res.json({
      code: 200,
      message: 'Address created',
      data: newAddress,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   PUT /api/address/:id
 * @desc    更新地址
 */
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, province, city, district, detail, isDefault } = req.body;

    const updates: any = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (province) updates.province = province;
    if (city) updates.city = city;
    if (district) updates.district = district;
    if (detail) updates.detail = detail;
    if (isDefault !== undefined) updates.isDefault = isDefault;

    await DataStore.updateAddress(id, updates);

    res.json({
      code: 200,
      message: 'Address updated',
      data: { id, ...updates },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   DELETE /api/address/:id
 * @desc    删除地址
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await DataStore.deleteAddress(id);

    res.json({
      code: 200,
      message: 'Address deleted',
      data: { id },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

/**
 * @route   PUT /api/address/:id/default
 * @desc    设置默认地址
 */
router.put('/:id/default', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await DataStore.updateAddress(id, { isDefault: true });

    res.json({
      code: 200,
      message: 'Default address updated',
      data: { id },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

export { router as addressRoutes };
