/**
 * 格式化价格
 * @param price 价格（单位：分）
 * @returns 格式化后的价格字符串
 */
export const formatPrice = (price: number): string => {
  return `¥${(price / 100).toFixed(2)}`;
};

/**
 * 格式化数字（超过万显示为万）
 * @param num 数字
 * @returns 格式化后的字符串
 */
export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}w`;
  }
  return num.toString();
};

/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 * @param format 格式模板
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  date: string | Date,
  format: string = 'YYYY-MM-DD'
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  const second = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second);
};

/**
 * 相对时间（刚刚、几分钟前等）
 * @param date 日期字符串或Date对象
 * @returns 相对时间字符串
 */
export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  return formatDate(d, 'YYYY-MM-DD');
};

/**
 * 格式化手机号（中间四位隐藏）
 * @param phone 手机号
 * @returns 格式化后的手机号
 */
export const formatPhone = (phone: string): string => {
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
};

/**
 * 验证手机号
 * @param phone 手机号
 * @returns 是否为有效手机号
 */
export const validatePhone = (phone: string): boolean => {
  return /^1[3-9]\d{9}$/.test(phone);
};

/**
 * 验证邮箱
 * @param email 邮箱
 * @returns 是否为有效邮箱
 */
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * 防抖函数
 * @param fn 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

/**
 * 节流函数
 * @param fn 要节流的函数
 * @param delay 间隔时间（毫秒）
 * @returns 节流后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastTime = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      fn(...args);
    }
  };
};

export default {
  formatPrice,
  formatNumber,
  formatDate,
  formatRelativeTime,
  formatPhone,
  validatePhone,
  validateEmail,
  debounce,
  throttle,
};
