import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, fontSize } from '@/constants/theme';
import { useUserStore } from '@/stores';
import type { User } from '@/types';

// 快捷入口配置
const QUICK_ENTRIES = [
  { key: 'favorites', label: '收藏', icon: '⭐', path: '/favorites' },
  { key: 'history', label: '历史', icon: '🕐', path: '/history' },
  { key: 'messages', label: '消息', icon: '💬', path: '/messages' },
];

// 功能菜单配置
const MENU_ITEMS = [
  { key: 'groups', label: '我的骑行群', icon: '🚴', path: '/my-groups' },
  { key: 'orders', label: '订单管理', icon: '📦', path: '/orders' },
  { key: 'assets', label: '我的资产', icon: '💰', path: '/assets' },
  { key: 'address', label: '收货地址', icon: '📍', path: '/address' },
];

const SETTINGS_ITEMS = [
  { key: 'notifications', label: '消息通知', icon: '🔔' },
  { key: 'privacy', label: '隐私设置', icon: '🔒' },
  { key: 'about', label: '关于我们', icon: 'ℹ️' },
];

// 未登录状态组件
function UnLoggedView({ onLogin }: { onLogin: () => void }) {
  return (
    <View style={styles.unloggedContainer}>
      <View style={styles.logoSection}>
        <Text style={styles.logoIcon}>🚴</Text>
        <Text style={styles.appName}>CycleHub</Text>
        <Text style={styles.slogan}>骑行好物分享社区</Text>
      </View>

      <View style={styles.loginButtons}>
        <TouchableOpacity style={styles.primaryButton} onPress={onLogin}>
          <Text style={styles.primaryButtonIcon}>📱</Text>
          <Text style={styles.primaryButtonText}>手机号登录</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={onLogin}>
          <Text style={styles.secondaryButtonIcon}>📧</Text>
          <Text style={styles.secondaryButtonText}>邮箱登录</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>其他登录方式</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialButtons}>
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

      <View style={styles.quickEntriesUnlogged}>
        {QUICK_ENTRIES.map((entry) => (
          <TouchableOpacity key={entry.key} style={styles.quickEntryUnlogged}>
            <Text style={styles.quickEntryIcon}>{entry.icon}</Text>
            <Text style={styles.quickEntryLabel}>{entry.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// 已登录状态组件
function LoggedView({ user, onLogout }: { user: User; onLogout: () => void }) {
  const router = useRouter();
  const [activeContentTab, setActiveContentTab] = useState<'notes' | 'favorites' | 'following'>('notes');

  return (
    <ScrollView style={styles.loggedContainer} showsVerticalScrollIndicator={false}>
      {/* 用户信息头部 */}
      <View style={styles.profileHeader}>
        <View style={styles.profileMain}>
          <Image
            source={{ uri: user.avatar || 'https://picsum.photos/100/100?random=profile' }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user.name}</Text>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>编辑资料</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.statsRow}>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statValue}>{user.followers}</Text>
                <Text style={styles.statLabel}>粉丝</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statValue}>{user.following}</Text>
                <Text style={styles.statLabel}>关注</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statValue}>{user.likes}</Text>
                <Text style={styles.statLabel}>获赞</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/settings')}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 内容Tab */}
      <View style={styles.contentTabContainer}>
        {(['notes', 'favorites', 'following'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.contentTab, activeContentTab === tab && styles.contentTabActive]}
            onPress={() => setActiveContentTab(tab)}
          >
            <Text style={[styles.contentTabText, activeContentTab === tab && styles.contentTabTextActive]}>
              {tab === 'notes' ? '笔记' : tab === 'favorites' ? '收藏' : '关注'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 内容区域 */}
      <View style={styles.contentGrid}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.contentItem}>
            <Image
              source={{ uri: `https://picsum.photos/150/150?random=content${i}` }}
              style={styles.contentImage}
            />
          </View>
        ))}
      </View>

      {/* 骑行群入口 */}
      <TouchableOpacity style={styles.groupsSection} onPress={() => router.push('/my-groups')}>
        <View style={styles.groupsHeader}>
          <Text style={styles.groupsIcon}>🚴</Text>
          <Text style={styles.groupsTitle}>骑行群</Text>
          <Text style={styles.groupsCount}>(5)</Text>
        </View>
        <Text style={styles.groupsArrow}>›</Text>
      </TouchableOpacity>

      {/* 功能菜单 */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/orders')}>
          <View style={styles.menuItemLeft}>
            <Text style={styles.menuIcon}>📦</Text>
            <Text style={styles.menuLabel}>订单管理</Text>
          </View>
          <View style={styles.orderTabs}>
            <Text style={styles.orderTab}>待付款</Text>
            <Text style={styles.orderTab}>待发货</Text>
            <Text style={styles.orderTab}>待收货</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/assets')}>
          <View style={styles.menuItemLeft}>
            <Text style={styles.menuIcon}>💰</Text>
            <Text style={styles.menuLabel}>我的资产</Text>
          </View>
          <View style={styles.assetInfo}>
            <Text style={styles.assetItem}>优惠券</Text>
            <Text style={styles.assetItem}>积分</Text>
            <Text style={styles.assetItem}>卡券</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 设置菜单 */}
      <View style={styles.settingsSection}>
        {SETTINGS_ITEMS.map((item) => (
          <TouchableOpacity key={item.key} style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Text style={styles.settingIcon}>{item.icon}</Text>
              <Text style={styles.settingLabel}>{item.label}</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 退出登录 */}
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn, userInfo, logout } = useUserStore();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    logout();
  };

  // 模拟用户数据
  const mockUser: User = {
    id: '1',
    name: '骑行达人',
    avatar: 'https://picsum.photos/100/100?random=profile',
    followers: 1234,
    following: 567,
    likes: 8901,
    createdAt: '2024-01-01',
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {!isLoggedIn ? (
        <UnLoggedView onLogin={handleLogin} />
      ) : (
        <LoggedView user={userInfo || mockUser} onLogout={handleLogout} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // 未登录样式
  unloggedContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoIcon: {
    fontSize: 60,
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  slogan: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  loginButtons: {
    marginBottom: spacing.xl,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  primaryButtonIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  primaryButtonText: {
    fontSize: fontSize.lg,
    color: colors.white,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  secondaryButtonIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  secondaryButtonText: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginHorizontal: spacing.md,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  socialButton: {
    alignItems: 'center',
    marginHorizontal: spacing.xl,
  },
  socialIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  socialLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  quickEntriesUnlogged: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  quickEntryUnlogged: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  quickEntryIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  quickEntryLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  // 已登录样式
  loggedContainer: {
    flex: 1,
  },
  profileHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  profileMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: spacing.md,
  },
  editButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editButtonText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statItem: {
    marginRight: spacing.xl,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  settingsButton: {
    padding: spacing.sm,
  },
  settingsIcon: {
    fontSize: 22,
  },
  contentTabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contentTab: {
    paddingVertical: spacing.md,
    marginRight: spacing.xl,
  },
  contentTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  contentTabText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  contentTabTextActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.xs,
  },
  contentItem: {
    width: '33.33%',
    padding: spacing.xs,
  },
  contentImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: borderRadius.sm,
  },
  groupsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  groupsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupsIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  groupsTitle: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  groupsCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  groupsArrow: {
    fontSize: 20,
    color: colors.textTertiary,
  },
  menuSection: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  menuLabel: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  orderTabs: {
    flexDirection: 'row',
  },
  orderTab: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.lg,
  },
  assetInfo: {
    flexDirection: 'row',
  },
  assetItem: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.lg,
  },
  settingsSection: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  settingArrow: {
    fontSize: 20,
    color: colors.textTertiary,
  },
  logoutButton: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  bottomPadding: {
    height: 100,
  },
});
