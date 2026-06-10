import { create } from 'zustand';
import type { CartItem, Product, ProductSKU } from '@/types';

// 模拟购物车数据
const mockCartItems: CartItem[] = [
  {
    id: '1',
    product: {
      id: '1',
      name: '碳纤维公路车轮组 50mm',
      images: ['https://picsum.photos/300/300?random=101'],
      price: 2999,
      originalPrice: 3999,
      sales: 1234,
      stock: 99,
    },
    quantity: 1,
    selected: true,
  },
  {
    id: '2',
    product: {
      id: '2',
      name: '专业骑行头盔 安全防护',
      images: ['https://picsum.photos/300/300?random=102'],
      price: 499,
      originalPrice: 699,
      sales: 2345,
      stock: 88,
    },
    quantity: 2,
    selected: false,
  },
];

interface CartState {
  // 状态
  items: CartItem[];
  totalAmount: number;
  totalCount: number;
  loading: boolean;

  // 操作
  fetchCart: () => Promise<void>;
  addItem: (product: Product, sku?: ProductSKU, quantity?: number) => Promise<void>;
  updateQuantity: (cartId: string, quantity: number) => void;
  removeItem: (cartId: string) => void;
  toggleSelect: (cartId: string) => void;
  selectAll: (selected: boolean) => void;
  clearCart: () => void;

  // 计算属性
  get selectedItems(): CartItem[];
  get selectedAmount(): number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalAmount: 0,
  totalCount: 0,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      // 模拟API请求
      await new Promise((resolve) => setTimeout(resolve, 500));
      const items = mockCartItems;
      const totalAmount = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
      set({ items, totalAmount, totalCount, loading: false });
    } catch (error) {
      console.error('获取购物车失败', error);
      set({ loading: false });
    }
  },

  addItem: async (product, sku, quantity = 1) => {
    const items = get().items;
    const existItem = items.find(
      (item) => item.product.id === product.id && item.sku?.id === sku?.id
    );

    if (existItem) {
      // 更新数量
      get().updateQuantity(existItem.id, existItem.quantity + quantity);
    } else {
      // 添加新商品
      const newItem: CartItem = {
        id: Date.now().toString(),
        product,
        sku,
        quantity,
        selected: true,
      };
      set({ items: [...items, newItem] });
      // 更新总价和数量
      set({
        totalAmount: get().totalAmount + product.price * quantity,
        totalCount: get().totalCount + quantity,
      });
    }
  },

  updateQuantity: (cartId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(cartId);
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.id === cartId ? { ...item, quantity } : item
      ),
    }));

    // 重新计算总价
    const items = get().items;
    set({
      totalAmount: items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
      totalCount: items.reduce((sum, item) => sum + item.quantity, 0),
    });
  },

  removeItem: (cartId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== cartId),
    }));

    // 重新计算总价
    const items = get().items;
    set({
      totalAmount: items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
      totalCount: items.reduce((sum, item) => sum + item.quantity, 0),
    });
  },

  toggleSelect: (cartId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === cartId ? { ...item, selected: !item.selected } : item
      ),
    }));
  },

  selectAll: (selected) => {
    set((state) => ({
      items: state.items.map((item) => ({ ...item, selected })),
    }));
  },

  clearCart: () => {
    set({ items: [], totalAmount: 0, totalCount: 0 });
  },
}));

// 动态属性
Object.defineProperty(useCartStore.getState(), 'selectedItems', {
  get() {
    return this.items.filter((item) => item.selected);
  },
});

Object.defineProperty(useCartStore.getState(), 'selectedAmount', {
  get() {
    return this.items
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },
});
