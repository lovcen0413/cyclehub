// 用户相关类型
export interface User {
  id: string;
  name: string;
  avatar: string;
  phone?: string;
  email?: string;
  bio?: string;
  followers: number;
  following: number;
  likes: number;
  createdAt: string;
}

// 商品相关类型
export interface Product {
  id: string;
  name: string;
  images: string[];
  price: number;
  originalPrice?: number;
  sales: number;
  stock: number;
  description?: string;
  details?: string[];
  specs?: ProductSpec[];
  skus?: ProductSKU[];
  shop?: {
    id: string;
    name: string;
  };
}

export interface ProductSpec {
  name: string;
  values: string[];
}

export interface ProductSKU {
  id: string;
  specs: { name: string; value: string }[];
  price: number;
  stock: number;
}

// 帖子相关类型
export interface Post {
  id: string;
  content: string;
  images: string[];
  video?: string;
  author: User;
  likes: number;
  comments: number;
  isLiked: boolean;
  topics?: Topic[];
  location?: string;
  createdAt: string;
}

// 骑行群相关类型
export interface Group {
  id: string;
  name: string;
  avatar: string;
  coverImage?: string;
  description: string;
  memberCount: number;
  todayActivity?: string;
  city?: string;
  isJoined: boolean;
  createdAt: string;
}

// 话题相关类型
export interface Topic {
  id: string;
  name: string;
  coverImage?: string;
  postCount: number;
  followCount: number;
}

// Feed流类型
export interface FeedItem {
  id: string;
  type: 'post' | 'product';
  title?: string;
  content?: string;
  images: string[];
  author: User;
  likes: number;
  comments: number;
  isLiked: boolean;
  topics?: Topic[];
  createdAt: string;
}

// 地址相关类型
export interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

// 购物车相关类型
export interface CartItem {
  id: string;
  product: Product;
  sku?: ProductSKU;
  quantity: number;
  selected: boolean;
}

// 订单相关类型
export interface Order {
  id: string;
  orderNo: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  payAmount: number;
  address: Address;
  remark?: string;
  createdAt: string;
  payAt?: string;
  shipAt?: string;
  receiveAt?: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  sku?: ProductSKU;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | 'pending_payment'  // 待付款
  | 'pending_shipment' // 待发货
  | 'shipped'         // 已发货
  | 'received'        // 已收货
  | 'completed'       // 已完成
  | 'cancelled';      // 已取消

// API响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  code: number;
  message: string;
  data: {
    list: T[];
    pagination: Pagination;
  };
  timestamp: number;
}
