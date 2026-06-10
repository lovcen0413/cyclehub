/**
 * 数据存储服务 - 基于JSON文件持久化
 * 替代内存存储，确保服务重启后数据不丢失
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据存储目录
const DATA_DIR = path.join(__dirname, '../../data');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 数据文件路径
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TOKENS_FILE = path.join(DATA_DIR, 'tokens.json');
const CODES_FILE = path.join(DATA_DIR, 'codes.json');
const ADDRESSES_FILE = path.join(DATA_DIR, 'addresses.json');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const GROUPS_FILE = path.join(DATA_DIR, 'groups.json');

// 初始化数据文件
const initDataFile = (filePath: string, defaultData: any) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
};

// 初始化所有数据文件
initDataFile(USERS_FILE, {});
initDataFile(TOKENS_FILE, {});
initDataFile(CODES_FILE, {});
initDataFile(ADDRESSES_FILE, {});
initDataFile(POSTS_FILE, []);
initDataFile(ORDERS_FILE, []);
initDataFile(GROUPS_FILE, []);

/**
 * 读取JSON文件
 */
const readJsonFile = <T>(filePath: string, defaultValue: T): T => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultValue;
  }
};

/**
 * 写入JSON文件
 */
const writeJsonFile = <T>(filePath: string, data: T): void => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    throw error;
  }
};

/**
 * 数据存储服务类
 */
class DataStoreService {
  // ==================== 验证码管理 ====================
  
  /**
   * 存储验证码
   */
  async setVerificationCode(phone: string, codeData: any): Promise<void> {
    const codes = readJsonFile<Record<string, any>>(CODES_FILE, {});
    codes[phone] = codeData;
    writeJsonFile(CODES_FILE, codes);
  }
  
  /**
   * 获取验证码
   */
  async getVerificationCode(phone: string): Promise<any | null> {
    const codes = readJsonFile<Record<string, any>>(CODES_FILE, {});
    return codes[phone] || null;
  }
  
  /**
   * 标记验证码已使用
   */
  async markCodeUsed(phone: string): Promise<void> {
    const codes = readJsonFile<Record<string, any>>(CODES_FILE, {});
    if (codes[phone]) {
      codes[phone].used = true;
      writeJsonFile(CODES_FILE, codes);
    }
  }
  
  /**
   * 清理过期验证码（定时任务）
   */
  async cleanupExpiredCodes(): Promise<void> {
    const codes = readJsonFile<Record<string, any>>(CODES_FILE, {});
    const now = Date.now();
    const validCodes: Record<string, any> = {};
    
    for (const [phone, codeData] of Object.entries(codes)) {
      if ((codeData as any).expiresAt > now) {
        validCodes[phone] = codeData;
      }
    }
    
    writeJsonFile(CODES_FILE, validCodes);
  }

  // ==================== 用户管理 ====================
  
  /**
   * 创建用户
   */
  async createUser(user: any): Promise<void> {
    const users = readJsonFile<Record<string, any>>(USERS_FILE, {});
    users[user.id] = user;
    writeJsonFile(USERS_FILE, users);
  }
  
  /**
   * 获取用户（通过ID）
   */
  async getUserById(userId: string): Promise<any | null> {
    const users = readJsonFile<Record<string, any>>(USERS_FILE, {});
    return users[userId] || null;
  }
  
  /**
   * 获取用户（通过手机号）
   */
  async getUserByPhone(phone: string): Promise<any | null> {
    const users = readJsonFile<Record<string, any>>(USERS_FILE, {});
    return Object.values(users).find((u: any) => u.phone === phone) || null;
  }
  
  /**
   * 更新用户
   */
  async updateUser(userId: string, updates: any): Promise<void> {
    const users = readJsonFile<Record<string, any>>(USERS_FILE, {});
    if (users[userId]) {
      users[userId] = { ...users[userId], ...updates };
      writeJsonFile(USERS_FILE, users);
    }
  }

  // ==================== Token管理 ====================
  
  /**
   * 存储Token
   */
  async storeToken(token: string, tokenData: any): Promise<void> {
    const tokens = readJsonFile<Record<string, any>>(TOKENS_FILE, {});
    tokens[token] = tokenData;
    writeJsonFile(TOKENS_FILE, tokens);
  }
  
  /**
   * 获取Token数据
   */
  async getToken(token: string): Promise<any | null> {
    const tokens = readJsonFile<Record<string, any>>(TOKENS_FILE, {});
    return tokens[token] || null;
  }
  
  /**
   * 通过refreshToken获取Token数据
   */
  async getTokenByRefreshToken(refreshToken: string): Promise<any | null> {
    const tokens = readJsonFile<Record<string, any>>(TOKENS_FILE, {});
    return Object.values(tokens).find((t: any) => t.refreshToken === refreshToken) || null;
  }
  
  /**
   * 删除Token
   */
  async deleteToken(token: string): Promise<void> {
    const tokens = readJsonFile<Record<string, any>>(TOKENS_FILE, {});
    delete tokens[token];
    writeJsonFile(TOKENS_FILE, tokens);
  }

  // ==================== 地址管理 ====================
  
  /**
   * 获取用户地址列表
   */
  async getAddresses(userId: string): Promise<any[]> {
    const addresses = readJsonFile<any[]>(ADDRESSES_FILE, []);
    return addresses.filter((a: any) => a.userId === userId);
  }
  
  /**
   * 获取默认地址
   */
  async getDefaultAddress(userId: string): Promise<any | null> {
    const addresses = await this.getAddresses(userId);
    return addresses.find((a: any) => a.isDefault) || addresses[0] || null;
  }
  
  /**
   * 创建地址
   */
  async createAddress(address: any): Promise<void> {
    const addresses = readJsonFile<any[]>(ADDRESSES_FILE, []);
    
    // 如果是默认地址，先取消其他默认
    if (address.isDefault) {
      addresses.forEach((a: any) => {
        if (a.userId === address.userId) {
          a.isDefault = false;
        }
      });
    }
    
    addresses.push(address);
    writeJsonFile(ADDRESSES_FILE, addresses);
  }
  
  /**
   * 更新地址
   */
  async updateAddress(addressId: string, updates: any): Promise<void> {
    const addresses = readJsonFile<any[]>(ADDRESSES_FILE, []);
    const index = addresses.findIndex((a: any) => a.id === addressId);
    
    if (index !== -1) {
      // 如果设置为默认，先取消其他默认
      if (updates.isDefault) {
        addresses.forEach((a: any) => {
          if (a.userId === addresses[index].userId) {
            a.isDefault = false;
          }
        });
      }
      
      addresses[index] = { ...addresses[index], ...updates };
      writeJsonFile(ADDRESSES_FILE, addresses);
    }
  }
  
  /**
   * 删除地址
   */
  async deleteAddress(addressId: string): Promise<void> {
    const addresses = readJsonFile<any[]>(ADDRESSES_FILE, []);
    const filtered = addresses.filter((a: any) => a.id !== addressId);
    writeJsonFile(ADDRESSES_FILE, filtered);
  }

  // ==================== 帖子管理 ====================
  
  /**
   * 获取帖子列表
   */
  async getPosts(page: number = 1, pageSize: number = 20): Promise<any[]> {
    const posts = readJsonFile<any[]>(POSTS_FILE, []);
    const start = (page - 1) * pageSize;
    return posts.slice(start, start + pageSize);
  }
  
  /**
   * 创建帖子
   */
  async createPost(post: any): Promise<void> {
    const posts = readJsonFile<any[]>(POSTS_FILE, []);
    posts.unshift(post);
    writeJsonFile(POSTS_FILE, posts);
  }
  
  /**
   * 获取帖子
   */
  async getPost(postId: string): Promise<any | null> {
    const posts = readJsonFile<any[]>(POSTS_FILE, []);
    return posts.find((p: any) => p.id === postId) || null;
  }

  // ==================== 订单管理 ====================
  
  /**
   * 获取订单列表
   */
  async getOrders(userId: string, status?: string): Promise<any[]> {
    const orders = readJsonFile<any[]>(ORDERS_FILE, []);
    let filtered = orders.filter((o: any) => o.userId === userId);
    if (status) {
      filtered = filtered.filter((o: any) => o.status === status);
    }
    return filtered;
  }
  
  /**
   * 创建订单
   */
  async createOrder(order: any): Promise<void> {
    const orders = readJsonFile<any[]>(ORDERS_FILE, []);
    orders.unshift(order);
    writeJsonFile(ORDERS_FILE, orders);
  }
  
  /**
   * 更新订单
   */
  async updateOrder(orderId: string, updates: any): Promise<void> {
    const orders = readJsonFile<any[]>(ORDERS_FILE, []);
    const index = orders.findIndex((o: any) => o.id === orderId);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      writeJsonFile(ORDERS_FILE, orders);
    }
  }
  
  /**
   * 获取订单
   */
  async getOrder(orderId: string): Promise<any | null> {
    const orders = readJsonFile<any[]>(ORDERS_FILE, []);
    return orders.find((o: any) => o.id === orderId) || null;
  }

  // ==================== 骑行群管理 ====================
  
  /**
   * 获取骑行群列表
   */
  async getGroups(city?: string): Promise<any[]> {
    const groups = readJsonFile<any[]>(GROUPS_FILE, []);
    if (city) {
      return groups.filter((g: any) => g.city === city);
    }
    return groups;
  }
  
  /**
   * 创建骑行群
   */
  async createGroup(group: any): Promise<void> {
    const groups = readJsonFile<any[]>(GROUPS_FILE, []);
    groups.unshift(group);
    writeJsonFile(GROUPS_FILE, groups);
  }
  
  /**
   * 获取骑行群
   */
  async getGroup(groupId: string): Promise<any | null> {
    const groups = readJsonFile<any[]>(GROUPS_FILE, []);
    return groups.find((g: any) => g.id === groupId) || null;
  }
  
  /**
   * 更新骑行群
   */
  async updateGroup(groupId: string, updates: any): Promise<void> {
    const groups = readJsonFile<any[]>(GROUPS_FILE, []);
    const index = groups.findIndex((g: any) => g.id === groupId);
    if (index !== -1) {
      groups[index] = { ...groups[index], ...updates };
      writeJsonFile(GROUPS_FILE, groups);
    }
  }
}

// 导出单例
export const DataStore = new DataStoreService();
