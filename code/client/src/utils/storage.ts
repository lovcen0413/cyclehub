import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_PREFIX = '@CycleHub:';

/**
 * 本地存储工具
 */
export const storage = {
  /**
   * 获取存储的值
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY_PREFIX + key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  /**
   * 设置存储的值
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  /**
   * 删除存储的值
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_PREFIX + key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },

  /**
   * 清除所有应用存储
   */
  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter((key) => key.startsWith(STORAGE_KEY_PREFIX));
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
};

export default storage;
