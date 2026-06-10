import { create } from 'zustand';
import { storage } from '@/utils/storage';
import type { User } from '@/types';

interface UserState {
  // 状态
  isLoggedIn: boolean;
  token: string | null;
  refreshToken: string | null;
  userInfo: User | null;
  loading: boolean;

  // 操作
  login: (user: User, token: string, refreshToken?: string) => void;
  logout: () => void;
  setToken: (token: string, refreshToken?: string) => void;
  updateUserInfo: (user: Partial<User>) => void;
  fetchUserInfo: () => Promise<void>;
}

// 模拟获取用户信息
const mockFetchUserInfo = async (): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '1',
        name: '骑行达人',
        avatar: 'https://picsum.photos/100/100?random=profile',
        followers: 1234,
        following: 567,
        likes: 8901,
        createdAt: '2024-01-01',
      });
    }, 500);
  });
};

export const useUserStore = create<UserState>((set, get) => ({
  isLoggedIn: false,
  token: null,
  refreshToken: null,
  userInfo: null,
  loading: false,

  login: (user, token, refreshToken) => {
    set({
      isLoggedIn: true,
      token,
      refreshToken: refreshToken || null,
      userInfo: user,
    });
    // 持久化存储
    storage.set('user', { isLoggedIn: true, token, refreshToken, userInfo: user });
  },

  logout: () => {
    set({
      isLoggedIn: false,
      token: null,
      refreshToken: null,
      userInfo: null,
    });
    // 清除存储
    storage.remove('user');
  },

  setToken: (token, refreshToken) => {
    set({ token, refreshToken: refreshToken || null });
  },

  updateUserInfo: (userInfo) => {
    const currentUser = get().userInfo;
    if (currentUser) {
      set({ userInfo: { ...currentUser, ...userInfo } });
    }
  },

  fetchUserInfo: async () => {
    set({ loading: true });
    try {
      const user = await mockFetchUserInfo();
      set({ userInfo: user, loading: false });
    } catch (error) {
      console.error('获取用户信息失败', error);
      set({ loading: false });
    }
  },
}));

// 初始化时恢复登录状态
export const initUserStore = async () => {
  const userData = await storage.get<{
    isLoggedIn: boolean;
    token: string;
    refreshToken?: string;
    userInfo: User;
  }>('user');

  if (userData) {
    useUserStore.setState({
      isLoggedIn: userData.isLoggedIn,
      token: userData.token,
      refreshToken: userData.refreshToken || null,
      userInfo: userData.userInfo,
    });
  }
};
