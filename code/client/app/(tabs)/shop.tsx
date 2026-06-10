import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { colors, spacing, borderRadius, fontSize } from '@/constants/theme';
import { useCartStore } from '@/stores';
import type { Product } from '@/types';

// 商品分类
const CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'bike', label: '整车' },
  { key: 'parts', label: '配件' },
  { key: 'gear', label: '装备' },
  { key: 'peripheral', label: '周边' },
  { key: 'maintenance', label: '保养' },
];

// 排序方式
const SORT_OPTIONS = [
  { key: 'default', label: '综合' },
  { key: 'sales', label: '销量' },
  { key: 'price_asc', label: '价格↑' },
  { key: 'price_desc', label: '价格↓' },
];

// 模拟商品数据
const mockProducts: Product[] = [
  {
    id: '1',
    name: '碳纤维公路车轮组 50mm',
    images: ['https://picsum.photos/300/300?random=101'],
    price: 2999,
    originalPrice: 3999,
    sales: 1234,
    stock: 99,
  },
  {
    id: '2',
    name: '专业骑行头盔 安全防护',
    images: ['https://picsum.photos/300/300?random=102'],
    price: 499,
    originalPrice: 699,
    sales: 2345,
    stock: 88,
  },
  {
    id: '3',
    name: 'GPS码表 速度心率监测',
    images: ['https://picsum.photos/300/300?random=103'],
    price: 899,
    originalPrice: 1199,
    sales: 876,
    stock: 66,
  },
  {
    id: '4',
    name: '锁鞋 专业竞速款',
    images: ['https://picsum.photos/300/300?random=104'],
    price: 699,
    originalPrice: 899,
    sales: 543,
    stock: 55,
  },
  {
    id: '5',
    name: '骑行服套装 透气速干',
    images: ['https://picsum.photos/300/300?random=105'],
    price: 399,
    originalPrice: 599,
    sales: 1567,
    stock: 77,
  },
  {
    id: '6',
    name: '山地车前叉 油簧可调',
    images: ['https://picsum.photos/300/300?random=106'],
    price: 1899,
    originalPrice: 2299,
    sales: 321,
    stock: 44,
  },
  {
    id: '7',
    name: '尾灯 LED警示灯 USB充电',
    images: ['https://picsum.photos/300/300?random=107'],
    price: 99,
    originalPrice: 149,
    sales: 4567,
    stock: 200,
  },
  {
    id: '8',
    name: '水壶架 轻量化铝合金',
    images: ['https://picsum.photos/300/300?random=108'],
    price: 69,
    originalPrice: 99,
    sales: 2345,
    stock: 150,
  },
];

// 商品卡片组件
function ProductCard({ product, onPress }: { product: Product; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress} activeOpacity={0.9}>
      <Image
        source={{ uri: product.images[0] }}
        style={styles.productImage}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>¥{product.price}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>¥{product.originalPrice}</Text>
          )}
        </View>
        <Text style={styles.salesCount}>已售 {product.sales}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ShopPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSort, setActiveSort] = useState('default');
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState(mockProducts);
  const cartCount = useCartStore((state) => state.totalCount);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    // 模拟筛选
    setProducts(mockProducts);
  };

  const handleSortChange = (sort: string) => {
    setActiveSort(sort);
    // 模拟排序
    let sorted = [...products];
    if (sort === 'price_asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sort === 'sales') {
      sorted.sort((a, b) => b.sales - a.sales);
    }
    setProducts(sorted);
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setProducts(mockProducts);
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleSearchPress = () => {
    router.push('/search?type=product');
  };

  const handleCartPress = () => {
    router.push('/cart');
  };

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onPress={() => handleProductPress(item)} />
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>搜索商品/品牌</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartButton} onPress={handleCartPress}>
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* 分类Tab */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.categoryTab, activeCategory === cat.key && styles.categoryTabActive]}
            onPress={() => handleCategoryChange(cat.key)}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === cat.key && styles.categoryTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 排序选项 */}
      <View style={styles.sortContainer}>
        {SORT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={styles.sortOption}
            onPress={() => handleSortChange(option.key)}
          >
            <Text
              style={[styles.sortText, activeSort === option.key && styles.sortTextActive]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 商品列表 */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>暂无商品</Text>
          </View>
        }
      />
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchPlaceholder: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
  },
  cartButton: {
    padding: spacing.sm,
    position: 'relative',
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.accent,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: '600',
  },
  categoryContainer: {
    maxHeight: 50,
  },
  categoryContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  categoryTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginRight: spacing.sm,
  },
  categoryTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  categoryText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sortOption: {
    marginRight: spacing.xl,
  },
  sortText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  sortTextActive: {
    color: colors.accent,
    fontWeight: '600',
  },
  productList: {
    padding: spacing.md,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
  },
  productInfo: {
    padding: spacing.sm,
  },
  productName: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.xs,
  },
  productPrice: {
    fontSize: fontSize.lg,
    color: colors.accent,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
    textDecorationLine: 'line-through',
  },
  salesCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  empty: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
});
