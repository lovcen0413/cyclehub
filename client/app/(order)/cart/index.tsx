import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, fontSize } from '@/constants/theme';
import { useCartStore, useUserStore } from '@/stores';
import type { CartItem } from '@/types';

export default function CartPage() {
  const router = useRouter();
  const { isLoggedIn } = useUserStore();
  const {
    items,
    totalAmount,
    loading,
    fetchCart,
    updateQuantity,
    removeItem,
    toggleSelect,
    selectAll,
  } = useCartStore();

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn]);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const selectedCount = items.filter((item) => item.selected).length;
  const allSelected = items.length > 0 && items.every((item) => item.selected);

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleSelect(item.id)}
      >
        <Text style={styles.checkboxIcon}>
          {item.selected ? '✅' : '⬜'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleProductPress(item.product.id)}>
        <Image
          source={{ uri: item.product.images[0] }}
          style={styles.productImage}
          contentFit="cover"
        />
      </TouchableOpacity>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>¥{item.product.price}</Text>
          {item.product.originalPrice && (
            <Text style={styles.originalPrice}>¥{item.product.originalPrice}</Text>
          )}
        </View>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => removeItem(item.id)}
          >
            <Text style={styles.deleteText}>删除</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>购物车</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.notLoggedIn}>
          <Text style={styles.notLoggedInText}>登录后查看购物车</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>去登录</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>购物车</Text>
        <TouchableOpacity>
          <Text style={styles.editText}>编辑</Text>
        </TouchableOpacity>
      </View>

      {/* 购物车列表 */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyText}>购物车是空的</Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => router.push('/shop')}
            >
              <Text style={styles.shopButtonText}>去逛逛</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* 底部结算栏 */}
      {items.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.selectAllButton}
            onPress={() => selectAll(!allSelected)}
          >
            <Text style={styles.checkboxIcon}>
              {allSelected ? '✅' : '⬜'}
            </Text>
            <Text style={styles.selectAllText}>全选</Text>
          </TouchableOpacity>
          <View style={styles.totalInfo}>
            <Text style={styles.totalLabel}>合计：</Text>
            <Text style={styles.totalAmount}>¥{totalAmount.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>
              结算({selectedCount})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backIcon: {
    fontSize: 28,
    color: colors.textPrimary,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerRight: {
    width: 40,
  },
  editText: {
    fontSize: fontSize.md,
    color: colors.accent,
  },
  list: {
    padding: spacing.md,
    flexGrow: 1,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkbox: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  checkboxIcon: {
    fontSize: 20,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.sm,
  },
  productInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  productName: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  productPrice: {
    fontSize: fontSize.lg,
    color: colors.accent,
    fontWeight: '600',
  },
  originalPrice: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
    textDecorationLine: 'line-through',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.xs,
  },
  quantityButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  quantity: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    marginHorizontal: spacing.md,
  },
  deleteButton: {
    marginLeft: 'auto',
  },
  deleteText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  totalInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    marginRight: spacing.md,
  },
  totalLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  totalAmount: {
    fontSize: fontSize.xl,
    color: colors.accent,
    fontWeight: '700',
  },
  checkoutButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  checkoutButtonText: {
    fontSize: fontSize.md,
    color: colors.white,
    fontWeight: '600',
  },
  notLoggedIn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notLoggedInText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  loginButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  loginButtonText: {
    fontSize: fontSize.md,
    color: colors.white,
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  shopButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  shopButtonText: {
    fontSize: fontSize.md,
    color: colors.white,
    fontWeight: '600',
  },
});
