import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { useUserStore } from '@/stores';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

/**
 * 创建Axios实例
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 请求拦截器
 */
api.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          // 未登录或token过期，跳转登录
          useUserStore.getState().logout();
          break;
        case 403:
          // 无权限
          console.error('无权限访问');
          break;
        case 500:
          // 服务器错误
          console.error('服务器错误');
          break;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
