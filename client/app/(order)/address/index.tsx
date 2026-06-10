import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { colors, spacing, borderRadius, fontSize } from '@/constants/theme';
import api from '@/services/api';

export default function AddressListPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/address/list');
      if (res.code === 200) {
        setAddresses(res.data);
      }
    } catch (error) {
      console.error('获取地址列表失败:', error);
      // 使用mock数据
      setAddresses([
        {
          id: '1',
          name: '张三',
          phone: '138****1234',
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          detail: '某街道某小区1号楼101',
          isDefault: true,
        },
        {
          id: '2',
          name: '李四',
          phone: '139****5678',
          province: '上海市',
          city: '上海市',
          district: '浦东新区',
          detail: '某某路100号2单元201',
          isDefault: false,
        },
        {
          id: '3',
          name: '王五',
          phone: '137****9012',
          province: '广东省',
          city: '深圳市',
          district: '南山区',
          detail: '科技园某某大厦',
          isDefault: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    router.push('/address/edit');
  };

  const handleEditAddress = (address: any) => {
    router.push(`/address/edit?id=${address.id}`);
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert('确认删除', '确定要删除这个收货地址吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          setAddresses(addresses.filter((a) => a.id !== addressId));
        },
      },
    ]);
  };

  const handleSetDefault = (addressId: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === addressId,
      }))
    );
  };

  const handleSelectAddress = (address: any) => {
    // 从结算页进入时返回选中地址
    router.back();
  };

  const isFromCheckout = false; // 可根据路由参数判断

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>收货地址</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleAddAddress}>
          <Text style={styles.headerIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loading}>
            <Text style={styles.loadingText}>加载中...</Text>
          </View>
        ) : addresses.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📍</Text>
            <Text style={styles.emptyText}>暂无收货地址</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
              <Text style={styles.addButtonText}>添加地址</Text>
            </TouchableOpacity>
          </View>
        ) : (
          addresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={styles.addressCard}
              onPress={() => handleSelectAddress(address)}
            >
              <View style={styles.addressInfo}>
                <View style={styles.addressHeader}>
                  <Text style={styles.addressName}>{address.name}</Text>
                  <Text style={styles.addressPhone}>{address.phone}</Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>默认</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addressDetail}>
                  {address.province} {address.city} {address.district} {address.detail}
                </Text>
              </View>
              <View style={styles.addressActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEditAddress(address)}
                >
                  <Text style={styles.actionIcon}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteAddress(address.id)}
                >
                  <Text style={styles.actionIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
              {!address.isDefault && (
                <TouchableOpacity
                  style={styles.setDefaultButton}
                  onPress={() => handleSetDefault(address.id)}
                >
                  <Text style={styles.setDefaultText}>设为默认</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* 添加地址按钮 */}
      {addresses.length > 0 && (
        <TouchableOpacity style={styles.bottomButton} onPress={handleAddAddress}>
          <Text style={styles.bottomButtonText}>+ 添加新地址</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    padding: spacing.sm,
  },
  headerIcon: {
    fontSize: 20,
    color: colors.textPrimary,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  loading: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  empty: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  addButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  addButtonText: {
    fontSize: fontSize.md,
    color: colors.white,
    fontWeight: '600',
  },
  addressCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
  },
  addressInfo: {
    marginBottom: spacing.md,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  addressName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: spacing.md,
  },
  addressPhone: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    flex: 1,
  },
  defaultBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  defaultBadgeText: {
    fontSize: fontSize.xs,
    color: colors.white,
    fontWeight: '600',
  },
  addressDetail: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  actionButton: {
    padding: spacing.sm,
    marginLeft: spacing.md,
  },
  actionIcon: {
    fontSize: 18,
  },
  setDefaultButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
  },
  setDefaultText: {
    fontSize: fontSize.sm,
    color: colors.accent,
  },
  bottomButton: {
    margin: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  bottomButtonText: {
    fontSize: fontSize.md,
    color: colors.white,
    fontWeight: '600',
  },
});
