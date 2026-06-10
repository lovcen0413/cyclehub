# 骑改App v2.1 Patch Notes

## 修复日期
2024年

## P0-2 验证码硬编码修复

### P0-2-1: 后端硬编码验证码 ✅ 已修复

**文件**: `server/src/routes/auth.routes.ts`

**问题**: 第65-67行存在硬编码的验证码验证 `code !== '123456' && code !== '000000'`

**修复内容**:

1. 添加验证码存储变量（模拟Redis）:
```typescript
// Mock verification codes storage (in production, use Redis)
const verificationCodes: Record<string, { code: string; expiresAt: number }> = {};
```

2. `/send-code` 端点现在存储验证码并设置5分钟过期时间:
```typescript
const expiresAt = Date.now() + 5 * 60 * 1000;
verificationCodes[phone] = { code, expiresAt };
```

3. `/login` 端点改为验证存储的验证码:
```typescript
const storedData = verificationCodes[phone];
if (!storedData || storedData.expiresAt < Date.now()) {
  return res.status(401).json({ code: 401, message: 'Verification code expired or not sent' });
}
if (storedData.code !== code) {
  return res.status(401).json({ code: 401, message: 'Invalid verification code' });
}
// 验证成功后删除验证码（一次性）
delete verificationCodes[phone];
```

---

### P0-2-2: 前端未调用验证码API ✅ 已修复

**文件**: `client/app/(auth)/login/index.tsx`

**问题**: `handleSendCode` 函数没有实际调用后端API

**修复内容**:
```typescript
const handleSendCode = async () => {
  if (!phone || phone.length !== 11) {
    Alert.alert('提示', '请输入正确的手机号');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/auth/send-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });
    const result = await response.json();

    if (result.code === 200) {
      Alert.alert('提示', '验证码已发送');
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      Alert.alert('发送失败', result.message || '请稍后重试');
    }
  } catch (error) {
    console.error('Send code error:', error);
    Alert.alert('发送失败', '网络错误，请稍后重试');
  }
};
```

---

## 验证结果
- ✅ 代码中不再包含 `123456` 和 `000000` 硬编码
- ✅ 前端正确调用 `/api/auth/send-code` 接口
- ✅ 后端验证码验证逻辑完整（存储+过期+匹配）
