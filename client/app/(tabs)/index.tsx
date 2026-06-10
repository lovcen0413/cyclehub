import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { colors, spacing, borderRadius, fontSize } from '@/constants/theme';
import { WaterfallList } from '@/components/waterfall';
import { TopicTag } from '@/components/business/TopicTag';
import { useFeedStore } from '@/stores';
import type { FeedItem } from '@/types';

// 模拟热门话题数据
const HOT_TOPICS = [
  { id: '1', name: '#公路车改装#', count: 1234 },
  { id: '2', name: '#山地越野#', count: 987 },
  { id: '3', name: '#夜骑装备#', count: 856 },
  { id: '4', name: '#骑行穿搭#', count: 654 },
  { id: '5', name: '#骑行打卡#', count: 543 },
  { id: '6', name: '#改装分享#', count: 432 },
];

type FeedTab = 'recommend' | 'hot' | 'latest' | 'following';

const TABS: { key: FeedTab; label: string }[] = [
  { key: 'recommend', label: '推荐' },
  { key: 'hot', label: '热门' },
  { key: 'latest', label: '最新' },
  { key: 'following', label: '关注' },
];

// 模拟Feed数据
const mockFeeds: FeedItem[] = [
  {
    id: '1',
    type: 'post',
    title: '公路车碳纤维轮组改装分享',
    content: '最近给爱车换了碳纤维轮组，骑行体验提升明显...',
    images: ['https://picsum.photos/400/500?random=1'],
    author: { id: '1', name: '骑行达人', avatar: 'https://picsum.photos/100/100?random=1' },
    likes: 234,
    comments: 45,
    isLiked: false,
    topics: [{ id: '1', name: '#公路车改装#' }],
    createdAt: '2025-01-01',
  },
  {
    id: '2',
    type: 'post',
    title: '山地车减震器调试心得',
    content: '分享一些减震器调试的经验...',
    images: ['https://picsum.photos/400/600?random=2'],
    author: { id: '2', name: '越野爱好者', avatar: 'https://picsum.photos/100/100?random=2' },
    likes: 189,
    comments: 32,
    isLiked: true,
    topics: [{ id: '2', name: '#山地越野#' }],
    createdAt: '2025-01-02',
  },
  {
    id: '3',
    type: 'post',
    title: '夜骑必备装备清单',
    content: '夜骑安全第一，这些装备必不可少...',
    images: ['https://picsum.photos/400/400?random=3'],
    author: { id: '3', name: '夜骑团团长', avatar: 'https://picsum.photos/100/100?random=3' },
    likes: 456,
    comments: 78,
    isLiked: false,
    topics: [{ id: '3', name: '#夜骑装备#' }],
    createdAt: '2025-01-03',
  },
  {
    id: '4',
    type: 'post',
    title: '骑行服穿搭指南',
    content: '如何穿出骑行者的时尚感...',
    images: ['https://picsum.photos/400/550?random=4'],
    author: { id: '4', name: '时尚骑手', avatar: 'https://picsum.photos/100/100?random=4' },
    likes: 321,
    comments: 56,
    isLiked: false,
    topics: [{ id: '4', name: '#骑行穿搭#' }],
    createdAt: '2025-01-04',
  },
  {
    id: '5',
    type: 'post',
    title: '周末骑行打卡记录',
    content: '今天的骑行路线风景超美...',
    images: ['https://picsum.photos/400/480?random=5'],
    author: { id: '5', name: '骑行打卡王', avatar: 'https://picsum.photos/100/100?random=5' },
    likes: 567,
    comments: 89,
    isLiked: true,
    topics: [{ id: '5', name: '#骑行打卡#' }],
    createdAt: '2025-01-05',
  },
  {
    id: '6',
    type: 'post',
    title: '自己动手改装大灯',
    content: 'DIY改装让你的夜骑更安全...',
    images: ['https://picsum.photos/400/520?random=6'],
    author: { id: '6', name: '改装达人', avatar: 'https://picsum.photos/100/100?random=6' },
    likes: 234,
    comments: 45,
    isLiked: false,
    topics: [{ id: '6', name: '#改装分享#' }],
    createdAt: '2025-01-06',
  },
];

// Feed卡片组件
function FeedCard({ item, onPress }: { item: FeedItem; onPress: () => void }) {
  const [isLiked, setIsLiked] = useState(item.isLiked);
  const [likes, setLikes] = useState(item.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  // 随机高度模拟不同图片比例
  const imageHeight = 200 + (parseInt(item.id) % 3) * 50;

  return (
    <TouchableOpacity style={styles.feedCard} onPress={onPress} activeOpacity={0.9}>
      <Image
        source={{ uri: item.images[0] }}
        style={[styles.feedImage, { height: imageHeight }]}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.feedContent}>
        <Text style={styles.feedTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.feedFooter}>
          <View style={styles.authorInfo}>
            <Image
              source={{ uri: item.author.avatar }}
              style={styles.authorAvatar}
              contentFit="cover"
            />
            <Text style={styles.authorName} numberOfLines={1}>
              {item.author.name}
            </Text>
          </View>
          <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
            <Text style={[styles.likeIcon, isLiked && styles.likeIconActive]}>
              {isLiked ? '❤️' : '🤍'}
            </Text>
            <Text style={[styles.likeCount, isLiked && styles.likeCountActive]}>
              {likes}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FeedTab>('recommend');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feeds, setFeeds] = useState<FeedItem[]>(mockFeeds);
  const [hasMore, setHasMore] = useState(true);

  const handleTabChange = (tab: FeedTab) => {
    setActiveTab(tab);
    // 模拟切换Tab后重新加载数据
    setLoading(true);
    setTimeout(() => {
      setFeeds([...mockFeeds]);
      setLoading(false);
    }, 500);
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setFeeds([...mockFeeds]);
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!hasMore || loading) return;
    setLoading(true);
    setTimeout(() => {
      setFeeds([...feeds, ...mockFeeds.map(f => ({ ...f, id: f.id + '-' + Date.now() }))]);
      setLoading(false);
      // 模拟更多数据
      if (feeds.length > 30) setHasMore(false);
    }, 1000);
  }, [feeds, hasMore, loading]);

  const handleFeedPress = (item: FeedItem) => {
    router.push(`/post/${item.id}`);
  };

  const handleTopicPress = (topicId: string) => {
    router.push(`/topic/${topicId}`);
  };

  const handleSearchPress = () => {
    router.push('/search');
  };

  const renderFeedItem = useCallback(
    ({ item, index }: { item: FeedItem; index: number }) => (
      <FeedCard item={item} onPress={() => handleFeedPress(item)} />
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 搜索入口 */}
      <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>搜索改装好物、骑行达人...</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
          />
        }
      >
        {/* Tab切换 */}
        <View style={styles.tabContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => handleTabChange(tab.key)}
            >
              <Text
                style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}
              >
                {tab.label}
              </Text>
              {activeTab === tab.key && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* 热门话题 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.topicsContainer}
          contentContainerStyle={styles.topicsContent}
        >
          {HOT_TOPICS.map((topic) => (
            <TopicTag
              key={topic.id}
              name={topic.name}
              onPress={() => handleTopicPress(topic.id)}
            />
          ))}
        </ScrollView>

        {/* 瀑布流内容 */}
        <WaterfallList
          data={feeds}
          renderItem={renderFeedItem}
          columns={2}
          gap={12}
          onEndReached={handleLoadMore}
          onRefresh={handleRefresh}
          loading={loading}
          ListHeaderComponent={<View style={styles.listHeader} />}
          ListFooterComponent={
            loading ? (
              <View style={styles.loadingMore}>
                <Text style={styles.loadingText}>加载中...</Text>
              </View>
            ) : !hasMore ? (
              <View style={styles.noMore}>
                <Text style={styles.noMoreText}>没有更多了</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>暂无内容</Text>
              </View>
            ) : null
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchPlaceholder: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
  },
  scrollView: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  tab: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginRight: spacing.xl,
    position: 'relative',
  },
  tabActive: {},
  tabText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -12 }],
    width: 24,
    height: 3,
    backgroundColor: colors.accent,
    borderRadius: 1.5,
  },
  topicsContainer: {
    marginBottom: spacing.md,
  },
  topicsContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  listHeader: {
    height: spacing.md,
  },
  feedCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  feedImage: {
    width: '100%',
  },
  feedContent: {
    padding: spacing.sm,
  },
  feedTitle: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  feedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: spacing.xs,
  },
  authorName: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  likeIconActive: {},
  likeCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  likeCountActive: {
    color: colors.accent,
  },
  loadingMore: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  noMore: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  noMoreText: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
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
