import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, fontSize } from '@/constants/theme';
import { useUserStore } from '@/stores';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUserStore();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const handleLogin = async () => {
    if (!phone || phone.length !== 11) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }
    if (!code || code.length !== 6) {
      Alert.alert('提示', '请输入6位验证码');
      return;
    }

    setLoading(true);
    try {
      // 模拟登录
      await new Promise((resolve) => setTimeout(resolve, 1000));
      login({
        id: '1',
        name: '骑行达人',
        avatar: 'https://picsum.photos/100/100?random=profile',
        phone,
        followers: 1234,
        following: 567,
        likes: 8901,
        createdAt: new Date().toISOString(),
      }, 'mock_token');
      router.back();
    } catch (error) {
      Alert.alert('登录失败', '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* 关闭按钮 */}
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        {/* 标题 */}
        <View style={styles.header}>
          <Text style={styles.title}>手机号登录</Text>
          <Text style={styles.subtitle}>未注册的手机号将自动创建账号</Text>
        </View>

        {/* 输入框 */}
        <View style={styles.form}>
          <View style={styles.inputRow}>
            <Text style={styles.prefix}>+86</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入手机号"
              placeholderTextColor={colors.textTertiary}
              keyboardType="number-pad"
              maxLength={11}
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.codeInput]}
              placeholder="请输入验证码"
              placeholderTextColor={colors.textTertiary}
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
            />
            <TouchableOpacity
              style={styles.codeButton}
              onPress={handleSendCode}
              disabled={countdown > 0}
            >
              <Text style={[styles.codeButtonText, countdown > 0 && styles.codeButtonTextDisabled]}>
                {countdown > 0 ? `${countdown}s` : '获取验证码'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 登录按钮 */}
        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? '登录中...' : '登录'}
          </Text>
        </TouchableOpacity>

        {/* 其他登录方式 */}
        <View style={styles.otherLogin}>
          <Text style={styles.otherLoginText}>其他登录方式</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>💬</Text>
              <Text style={styles.socialLabel}>微信</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>🍎</Text>
              <Text style={styles.socialLabel}>苹果</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>📱</Text>
              <Text style={styles.socialLabel}>抖音</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 协议 */}
        <View style={styles.agreement}>
          <Text style={styles.agreementText}>
            登录即表示同意
            <Text style={styles.agreementLink}>《用户协议》</Text>
            和
            <Text style={styles.agreementLink}>《隐私政策》</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  closeIcon: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  header: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  form: {
    marginBottom: spacing.xl,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    height: 56,
  },
  prefix: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  codeInput: {
    flex: 1,
  },
  codeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  codeButtonText: {
    fontSize: fontSize.md,
    color: colors.accent,
    fontWeight: '600',
  },
  codeButtonTextDisabled: {
    color: colors.textTertiary,
  },
  loginButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.lg,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: fontSize.lg,
    color: colors.white,
    fontWeight: '600',
  },
  otherLogin: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  otherLoginText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginBottom: spacing.lg,
  },
  socialRow: {
    flexDirection: 'row',
  },
  socialButton: {
    alignItems: 'center',
    marginHorizontal: spacing.xl,
  },
  socialIcon: {
    fontSize: 36,
    marginBottom: spacing.xs,
  },
  socialLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  agreement: {
    alignItems: 'center',
  },
  agreementText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  agreementLink: {
    color: colors.accent,
  },
});
