import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { colors, spacing, borderRadius, fontSize } from '@/constants/theme';
import { useCartStore } from '@/stores';
import api from '@/services/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, addressId } = useCartStore();

  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [coupon, setCoupon] = useState<any>(null);
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDefaultAddress();
  }, []);

  const fetchDefaultAddress = async () => {
    try {
      const res = await api.get('/address/default');
      if (res.code === 200) {
        setSelectedAddress(res.data);
      }
    } catch (error) {
      console.error('获取默认地址失败:', error);
      // 使用mock数据
      setSelectedAddress({
        id: '1',
        name: '张三',
        phone: '138****1234',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        detail: '某街道某小区1号楼101',
        isDefault: true,
      });
    }
  };

  const handleSelectAddress = () => {
    router.push('/address');
  };

  const handleSelectCoupon = () => {
    Alert.alert('提示', '优惠券功能开发中');
  };

  const handlePayment = () => {
    if (!selectedAddress) {
      Alert.alert('提示', '请选择收货地址');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('支付成功', '订单已提交', [
        {
          text: '查看订单',
          onPress: () => {
            router.back();
            router.back();
          },
        },
      ]);
    }, 1500);
  };

  // 计算总价
  const calculateTotal = () => {
    const itemTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = coupon ? coupon.value : 0;
    return itemTotal - discount + 0; // +0 是运费
  };

  const total = calculateTotal();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>确认订单</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 收货地址 */}
        <TouchableOpacity style={styles.addressSection} onPress={handleSelectAddress}>
          {selectedAddress ? (
            <View style={styles.addressContent}>
              <View style={styles.addressInfo}>
                <View style={styles.addressRow}>
                  <Text style={styles.addressName}>{selectedAddress.name}</Text>
                  <Text style={styles.addressPhone}>{selectedAddress.phone}</Text>
                </View>
                <Text style={styles.addressDetail}>
                  {selectedAddress.province} {selectedAddress.city} {selectedAddress.district}{' '}
                  {selectedAddress.detail}
                </Text>
              </View>
              <Text style={styles.addressArrow}>›</Text>
            </View>
          ) : (
            <View style={styles.addAddress}>
              <Text style={styles.addAddressIcon}>📍</Text>
              <Text style={styles.addAddressText}>添加收货地址</Text>
              <Text style={styles.addressArrow}>›</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 商品列表 */}
        <View style={styles.goodsSection}>
          {items.map((item) => (
            <View key={item.id} style={styles.goodsItem}>
              <ExpoImage
                source={{ uri: item.image }}
                style={styles.goodsImage}
                contentFit="cover"
              />
              <View style={styles.goodsInfo}>
                <Text style={styles.goodsName} numberOfLines={2}>
                  {item.name}
                </Text>
                {item.specs && (
                  <Text style={styles.goodsSpec}>
                    {Object.values(item.specs).join(' / ')}
                  </Text>
                )}
                <View style={styles.goodsPriceRow}>
                  <Text style={styles.goodsPrice}>
                    ¥{(item.price / 100).toFixed(2)}
                  </Text>
                  <Text style={styles.goodsQuantity}>x{item.quantity}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 优惠券 */}
        <TouchableOpacity style={styles.couponSection} onPress={handleSelectCoupon}>
          <Text style={styles.couponLabel}>优惠券</Text>
          <View style={styles.couponContent}>
            {coupon ? (
              <Text style={styles.couponValue}>-¥{(coupon.value / 100).toFixed(2)}</Text>
            ) : (
              <Text style={styles.couponPlaceholder}>暂无可用</Text>
            )}
            <Text style={styles.couponArrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* 配送方式 */}
        <View style={styles.deliverySection}>
          <Text style={styles.deliveryLabel}>配送方式</Text>
          <View style={styles.deliveryOptions}>
            <TouchableOpacity style={[styles.deliveryOption, styles.deliveryOptionActive]}>
              <Text style={[styles.deliveryText, styles.deliveryTextActive]}>
                快递配送 ¥0
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 订单备注 */}
        <View style={styles.remarkSection}>
          <Text style={styles.remarkLabel}>订单备注</Text>
          <View style={styles.remarkInput}>
            <Text style={styles.remarkPlaceholder}>
              {remark || '选填，可备注特殊需求'}
            </Text>
          </View>
        </View>

        {/* 价格明细 */}
        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>商品金额</Text>
            <Text style={styles.priceValue}>
              ¥{(items.reduce((sum, item) => sum + (item.price * item.quantity), 0) / 100).toFixed(2)}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>运费</Text>
            <Text style={styles.priceValue}>¥0.00</Text>
          </View>
          {coupon && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>优惠券</Text>
              <Text style={styles.priceDiscount}>
                -¥{(coupon.value / 100).toFixed(2)}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 底部支付栏 */}
      <View style={styles.footer}>
        <View style={styles.totalAmount}>
          <Text style={styles.totalLabel}>合计：</Text>
          <Text style={styles.totalValue}>¥{(total / 100).toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          <Text style={styles.payButtonText}>{loading ? '提交中...' : '提交订单'}</Text>
        </TouchableOpacity>
      </View>
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
    width: 44,
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
  addressSection: {
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  addressInfo: {
    flex: 1,
  },
  addressRow: {
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
  },
  addressDetail: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  addressArrow: {
    fontSize: 24,
    color: colors.textTertiary,
  },
  addAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  addAddressIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  addAddressText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.accent,
  },
  goodsSection: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  goodsItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  goodsImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.sm,
  },
  goodsInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  goodsName: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  goodsSpec: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  goodsPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goodsPrice: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  goodsQuantity: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  couponSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  couponLabel: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  couponContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponValue: {
    fontSize: fontSize.md,
    color: colors.accent,
    fontWeight: '600',
  },
  couponPlaceholder: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
  },
  couponArrow: {
    fontSize: 20,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
  },
  deliverySection: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  deliveryLabel: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  deliveryOptions: {
    flexDirection: 'row',
  },
  deliveryOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  deliveryOptionActive: {
    borderColor: colors.accent,
    backgroundColor: '#FFF5F5',
  },
  deliveryText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  deliveryTextActive: {
    color: colors.accent,
  },
  remarkSection: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  remarkLabel: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  remarkInput: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  remarkPlaceholder: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
  },
  priceSection: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginBottom: 120,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  priceLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  priceDiscount: {
    fontSize: fontSize.md,
    color: colors.accent,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  totalValue: {
    fontSize: 24,
    color: colors.accent,
    fontWeight: '700',
  },
  payButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    fontSize: fontSize.lg,
    color: colors.white,
    fontWeight: '600',
  },
});
