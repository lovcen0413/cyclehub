import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { colors, spacing, borderRadius, fontSize } from '@/constants/theme';

// 搜索历史
const SEARCH_HISTORY = ['碳纤维轮组', '骑行头盔', '夜骑装备', '公路车'];

// 热门搜索
const HOT_SEARCH = [
  { id: '1', keyword: '公路车轮组', hot: 9999 },
  { id: '2', keyword: '骑行头盔', hot: 8888 },
  { id: '3', keyword: 'GPS码表', hot: 7777 },
  { id: '4', keyword: '锁鞋', hot: 6666 },
  { id: '5', keyword: '骑行服', hot: 5555 },
  { id: '6', keyword: '尾灯', hot: 4444 },
];

// 搜索结果模拟数据
const mockResults = [
  {
    id: '1',
    type: 'product',
    name: '碳纤维公路车轮组 50mm',
    image: 'https://picsum.photos/200/200?random=101',
    price: 2999,
    sales: 1234,
  },
  {
    id: '2',
    type: 'post',
    name: '公路车改装分享帖',
    image: 'https://picsum.photos/200/200?random=201',
    content: '给大家分享一下我的改装经验...',
    likes: 234,
  },
];

export default function SearchPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'product' | 'post'>(
    (params.type as 'all' | 'product' | 'post') || 'all'
  );
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (searchText.trim()) {
      setHasSearched(true);
    }
  };

  const handleHistoryPress = (keyword: string) => {
    setSearchText(keyword);
    setHasSearched(true);
  };

  const handleResultPress = (item: any) => {
    if (item.type === 'product') {
      router.push(`/product/${item.id}`);
    } else {
      router.push(`/post/${item.id}`);
    }
  };

  const renderResult = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleResultPress(item)}>
      <Image source={{ uri: item.image }} style={styles.resultImage} contentFit="cover" />
      <View style={styles.resultInfo}>
        <Text style={styles.resultName} numberOfLines={2}>
          {item.name}
        </Text>
        {item.type === 'product' ? (
          <View style={styles.resultMeta}>
            <Text style={styles.resultPrice}>¥{item.price}</Text>
            <Text style={styles.resultSales}>已售 {item.sales}</Text>
          </View>
        ) : (
          <Text style={styles.resultLikes}>❤️ {item.likes}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 搜索头部 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索商品/帖子/用户"
            placeholderTextColor={colors.textTertiary}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            autoFocus
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelText}>取消</Text>
        </TouchableOpacity>
      </View>

      {/* 搜索类型Tab */}
      <View style={styles.typeTabs}>
        {(['all', 'product', 'post'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.typeTab, searchType === type && styles.typeTabActive]}
            onPress={() => setSearchType(type)}
          >
            <Text style={[styles.typeTabText, searchType === type && styles.typeTabTextActive]}>
              {type === 'all' ? '综合' : type === 'product' ? '商品' : '帖子'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {!hasSearched ? (
        <View style={styles.suggestions}>
          {/* 搜索历史 */}
          {SEARCH_HISTORY.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>搜索历史</Text>
                <TouchableOpacity>
                  <Text style={styles.clearHistory}>清空</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.tagList}>
                {SEARCH_HISTORY.map((keyword, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.tag}
                    onPress={() => handleHistoryPress(keyword)}
                  >
                    <Text style={styles.tagText}>{keyword}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* 热门搜索 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>热门搜索</Text>
            <View style={styles.hotList}>
              {HOT_SEARCH.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.hotItem}
                  onPress={() => handleHistoryPress(item.keyword)}
                >
                  <Text style={[styles.hotRank, index < 3 && styles.hotRankTop]}>
                    {index + 1}
                  </Text>
                  <Text style={styles.hotKeyword}>{item.keyword}</Text>
                  <Text style={styles.hotCount}>🔥 {item.hot}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      ) : (
        <FlatList
          data={mockResults}
          renderItem={renderResult}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.results}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>未找到相关结果</Text>
            </View>
          }
        />
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: colors.textPrimary,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 40,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  clearIcon: {
    fontSize: 14,
    color: colors.textTertiary,
    padding: spacing.xs,
  },
  cancelButton: {
    paddingLeft: spacing.md,
  },
  cancelText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  typeTabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  typeTab: {
    paddingVertical: spacing.md,
    marginRight: spacing.xl,
  },
  typeTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  typeTabText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  typeTabTextActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  suggestions: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  clearHistory: {
    fontSize: fontSize.sm,
    color: colors.accent,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  tagText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  hotList: {},
  hotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  hotRank: {
    width: 20,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  hotRankTop: {
    color: colors.accent,
    fontWeight: '600',
  },
  hotKeyword: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  hotCount: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  results: {
    padding: spacing.md,
  },
  resultItem: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  resultInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  resultName: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultPrice: {
    fontSize: fontSize.lg,
    color: colors.accent,
    fontWeight: '600',
    marginRight: spacing.md,
  },
  resultSales: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  resultLikes: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  empty: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
});
