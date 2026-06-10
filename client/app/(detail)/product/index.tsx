import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { colors, spacing, borderRadius, fontSize } from '@/constants/theme';
import { useCartStore } from '@/stores';
import api from '@/services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSpec, setSelectedSpec] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      const res = await api.get(`/product/${id}`);
      if (res.code === 200) {
        setProduct(res.data);
        // 初始化规格选项
        const defaultSpec: Record<string, string> = {};
        if (res.data.specs) {
          res.data.specs.forEach((spec: any) => {
            defaultSpec[spec.name] = spec.values[0];
          });
        }
        setSelectedSpec(defaultSpec);
      }
    } catch (error) {
      console.error('获取商品详情失败:', error);
      // 使用mock数据
      setProduct({
        id: id || '1',
        name: '碳纤维公路车轮组 50mm',
        images: [
          'https://picsum.photos/800/800?random=101',
          'https://picsum.photos/800/800?random=102',
          'https://picsum.photos/800/800?random=103',
        ],
        price: 299900,
        originalPrice: 399900,
        sales: 1234,
        stock: 99,
        description: '专业级碳纤维轮组，轻量化设计，提升骑行效率',
        details: [
          '材质：T800碳纤维',
          '框高：50mm',
          '重量：1450g',
          '刹车边：可选碳纤维/铝合金',
        ],
        specs: [
          { name: '框高', values: ['40mm', '50mm', '60mm'] },
          { name: '刹车边', values: ['碳纤维', '铝合金'] },
        ],
        shop: { id: '1', name: 'BikePro旗舰店' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      Alert.alert('提示', '商品已售罄');
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity,
      specs: selectedSpec,
    });
    Alert.alert('成功', '已加入购物车', [
      { text: '继续浏览', style: 'cancel' },
      { text: '去购物车', onPress: () => router.push('/cart') },
    ]);
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) {
      Alert.alert('提示', '商品已售罄');
      return;
    }
    // 将商品添加到购物车后跳转到结算页
    addItem({
      id: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity,
      specs: selectedSpec,
    });
    router.push('/checkout');
  };

  const handleShare = () => {
    Alert.alert('分享', '分享功能开发中');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>商品不存在</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTabs}>
          <Text style={[styles.headerTab, styles.headerTabActive]}>商品</Text>
          <Text style={styles.headerTab}>详情</Text>
          <Text style={styles.headerTab}>评价</Text>
        </View>
        <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
          <Text style={styles.headerIcon}>↗</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 商品图片 */}
        <View style={styles.imageContainer}>
          <ExpoImage
            source={{ uri: product.images[selectedImage] }}
            style={styles.mainImage}
            contentFit="cover"
          />
          {product.images.length > 1 && (
            <View style={styles.thumbnailContainer}>
              {product.images.map((img: string, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImage(index)}
                  style={[
                    styles.thumbnail,
                    selectedImage === index && styles.thumbnailActive,
                  ]}
                >
                  <ExpoImage
                    source={{ uri: img }}
                    style={styles.thumbnailImage}
                    contentFit="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* 价格和销量 */}
        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>¥{(product.price / 100).toFixed(2)}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                ¥{(product.originalPrice / 100).toFixed(2)}
              </Text>
            )}
          </View>
          <Text style={styles.sales}>已售 {product.sales}</Text>
        </View>

        {/* 商品名称 */}
        <View style={styles.nameSection}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDesc}>{product.description}</Text>
        </View>

        {/* 规格选择 */}
        {product.specs && product.specs.length > 0 && (
          <View style={styles.specSection}>
            <Text style={styles.sectionTitle}>选择规格</Text>
            {product.specs.map((spec: any, specIndex: number) => (
              <View key={specIndex} style={styles.specGroup}>
                <Text style={styles.specName}>{spec.name}</Text>
                <View style={styles.specValues}>
                  {spec.values.map((value: string, valueIndex: number) => (
                    <TouchableOpacity
                      key={valueIndex}
                      style={[
                        styles.specValue,
                        selectedSpec[spec.name] === value && styles.specValueActive,
                      ]}
                      onPress={() =>
                        setSelectedSpec({ ...selectedSpec, [spec.name]: value })
                      }
                    >
                      <Text
                        style={[
                          styles.specValueText,
                          selectedSpec[spec.name] === value && styles.specValueTextActive,
                        ]}
                      >
                        {value}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 数量选择 */}
        <View style={styles.quantitySection}>
          <Text style={styles.sectionTitle}>数量</Text>
          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 商品详情 */}
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>商品详情</Text>
          {product.details?.map((detail: string, index: number) => (
            <Text key={index} style={styles.detailText}>
              • {detail}
            </Text>
          ))}
        </View>

        {/* 店铺信息 */}
        {product.shop && (
          <View style={styles.shopSection}>
            <View style={styles.shopInfo}>
              <ExpoImage
                source={{ uri: 'https://picsum.photos/60/60?random=shop' }}
                style={styles.shopAvatar}
              />
              <View style={styles.shopDetail}>
                <Text style={styles.shopName}>{product.shop.name}</Text>
                <Text style={styles.shopStats}>
                  在售商品 666 | 评分 4.9
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.shopButton}>
              <Text style={styles.shopButtonText}>进店逛逛</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 评价区域 */}
        <View style={styles.commentSection}>
          <View style={styles.commentHeader}>
            <Text style={styles.sectionTitle}>商品评价</Text>
            <TouchableOpacity>
              <Text style={styles.moreText}>查看全部 ></Text>
            </TouchableOpacity>
          </View>
          <View style={styles.emptyComment}>
            <Text style={styles.emptyCommentText}>暂无评价</Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setIsLiked(!isLiked)}
        >
          <Text style={styles.actionIcon}>{isLiked ? '❤️' : '🤍'}</Text>
          <Text style={styles.actionLabel}>收藏</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>🛒</Text>
          <Text style={styles.actionLabel}>购物车</Text>
        </TouchableOpacity>
        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={styles.addCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addCartText}>加入购物车</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
            <Text style={styles.buyText}>立即购买</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
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
  headerTabs: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  headerTab: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    paddingVertical: spacing.sm,
  },
  headerTabActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: colors.backgroundSecondary,
  },
  mainImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: colors.accent,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 28,
    color: colors.accent,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
    textDecorationLine: 'line-through',
  },
  sales: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  nameSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  productName: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  productDesc: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  specSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  specGroup: {
    marginBottom: spacing.md,
  },
  specName: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  specValues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  specValue: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  specValueActive: {
    backgroundColor: '#FFF0F2',
    borderColor: colors.accent,
  },
  specValueText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  specValueTextActive: {
    color: colors.accent,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  quantityText: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    minWidth: 40,
    textAlign: 'center',
  },
  detailSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.xs,
  },
  shopSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  shopAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.md,
  },
  shopDetail: {
    flex: 1,
  },
  shopName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  shopStats: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  shopButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  shopButtonText: {
    fontSize: fontSize.sm,
    color: colors.accent,
  },
  commentSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  moreText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  emptyComment: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyCommentText: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
  },
  bottomPadding: {
    height: 100,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  actionLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  footerButtons: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: spacing.md,
    gap: spacing.sm,
  },
  addCartButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  addCartText: {
    fontSize: fontSize.md,
    color: colors.white,
    fontWeight: '600',
  },
  buyButton: {
    flex: 1,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  buyText: {
    fontSize: fontSize.md,
    color: colors.white,
    fontWeight: '600',
  },
});
