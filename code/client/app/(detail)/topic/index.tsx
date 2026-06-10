import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { colors, spacing, borderRadius, fontSize } from '@/constants/theme';
import type { Post } from '@/types';
import api from '@/services/api';

export default function TopicDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [topic, setTopic] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'hot' | 'new'>('hot');

  useEffect(() => {
    fetchTopicDetail();
    fetchTopicPosts();
  }, [id]);

  const fetchTopicDetail = async () => {
    try {
      // 模拟获取话题详情
      setTopic({
        id: id || '1',
        name: '#骑行打卡#',
        description: '记录每一次骑行的精彩瞬间，分享骑行路上的风景与故事',
        postCount: 12345,
        followerCount: 5678,
        isFollowing: false,
      });
    } catch (error) {
      console.error('获取话题详情失败:', error);
    }
  };

  const fetchTopicPosts = async () => {
    try {
      // 模拟获取话题帖子
      const mockPosts: Post[] = [
        {
          id: '1',
          content: '今天完成了一次环湖骑行，风景超美！分享一些骑行中的小技巧给大家...',
          images: ['https://picsum.photos/400/500?random=201'],
          author: {
            id: '1',
            name: '骑行爱好者',
            avatar: 'https://picsum.photos/100/100?random=201',
            followers: 1234,
            following: 567,
            likes: 8901,
          },
          likes: 234,
          comments: 45,
          isLiked: false,
          topics: [{ id: '1', name: '#骑行打卡#' }],
          createdAt: '2025-01-01T10:00:00',
        },
        {
          id: '2',
          content: '周末的山地骑行太刺激了！下次一起去吗？',
          images: ['https://picsum.photos/400/600?random=204'],
          author: {
            id: '3',
            name: '山地狂人',
            avatar: 'https://picsum.photos/100/100?random=203',
            followers: 3456,
            following: 789,
            likes: 6789,
          },
          likes: 189,
          comments: 32,
          isLiked: false,
          topics: [{ id: '1', name: '#骑行打卡#' }],
          createdAt: '2025-01-03T12:00:00',
        },
        {
          id: '3',
          content: '夜骑安全装备清单，看这一篇就够了！',
          images: ['https://picsum.photos/400/400?random=205'],
          author: {
            id: '4',
            name: '安全骑手',
            avatar: 'https://picsum.photos/100/100?random=204',
            followers: 2345,
            following: 456,
            likes: 5678,
          },
          likes: 567,
          comments: 89,
          isLiked: true,
          topics: [{ id: '1', name: '#骑行打卡#' }],
          createdAt: '2025-01-04T13:00:00',
        },
        {
          id: '4',
          content: '清晨的骑行，空气清新，风景如画！',
          images: [
            'https://picsum.photos/400/500?random=206',
            'https://picsum.photos/400/500?random=207',
          ],
          author: {
            id: '5',
            name: '晨骑达人',
            avatar: 'https://picsum.photos/100/100?random=205',
            followers: 4567,
            following: 234,
            likes: 3456,
          },
          likes: 345,
          comments: 56,
          isLiked: false,
          topics: [{ id: '1', name: '#骑行打卡#' }],
          createdAt: '2025-01-05T06:00:00',
        },
      ];
      setPosts(mockPosts);
    } catch (error) {
      console.error('获取话题帖子失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTopicPosts();
    setRefreshing(false);
  };

  const handleFollow = () => {
    if (topic) {
      setTopic({
        ...topic,
        isFollowing: !topic.isFollowing,
        followerCount: topic.isFollowing ? topic.followerCount - 1 : topic.followerCount + 1,
      });
    }
  };

  const handlePostPress = (post: Post) => {
    router.push(`/post/${post.id}`);
  };

  const handleUserPress = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => handlePostPress(item)}
      activeOpacity={0.9}
    >
      <ExpoImage
        source={{ uri: item.images[0] }}
        style={styles.postImage}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.postContent}>
        <Text style={styles.postText} numberOfLines={3}>
          {item.content}
        </Text>
        <View style={styles.postFooter}>
          <TouchableOpacity
            style={styles.authorInfo}
            onPress={() => handleUserPress(item.author.id)}
          >
            <ExpoImage
              source={{ uri: item.author.avatar }}
              style={styles.authorAvatar}
              contentFit="cover"
            />
            <Text style={styles.authorName}>{item.author.name}</Text>
          </TouchableOpacity>
          <View style={styles.likeInfo}>
            <Text style={styles.likeIcon}>{item.isLiked ? '❤️' : '🤍'}</Text>
            <Text style={styles.likeCount}>{item.likes}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>加载中...</Text>
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
        <Text style={styles.headerTitle} numberOfLines={1}>
          {topic?.name || '话题'}
        </Text>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 话题信息 */}
        <View style={styles.topicHeader}>
          <View style={styles.topicInfo}>
            <Text style={styles.topicName}>{topic?.name}</Text>
            <Text style={styles.topicDesc}>{topic?.description}</Text>
            <View style={styles.topicStats}>
              <Text style={styles.statText}>
                <Text style={styles.statNumber}>{topic?.postCount}</Text> 帖子
              </Text>
              <Text style={styles.statDivider}>·</Text>
              <Text style={styles.statText}>
                <Text style={styles.statNumber}>{topic?.followerCount}</Text> 关注
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.followButton, topic?.isFollowing && styles.followButtonActive]}
            onPress={handleFollow}
          >
            <Text
              style={[
                styles.followButtonText,
                topic?.isFollowing && styles.followButtonTextActive,
              ]}
            >
              {topic?.isFollowing ? '已关注' : '+ 关注'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 排序Tab */}
        <View style={styles.sortTabs}>
          <TouchableOpacity
            style={[styles.sortTab, activeTab === 'hot' && styles.sortTabActive]}
            onPress={() => setActiveTab('hot')}
          >
            <Text style={[styles.sortText, activeTab === 'hot' && styles.sortTextActive]}>
              热门
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortTab, activeTab === 'new' && styles.sortTabActive]}
            onPress={() => setActiveTab('new')}
          >
            <Text style={[styles.sortText, activeTab === 'new' && styles.sortTextActive]}>
              最新
            </Text>
          </TouchableOpacity>
        </View>

        {/* 帖子列表 */}
        <View style={styles.postList}>
          {posts.map((post) => (
            <View key={post.id}>{renderPost({ item: post })}</View>
          ))}
        </View>
      </ScrollView>
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
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  topicHeader: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  topicDesc: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  topicStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  statNumber: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statDivider: {
    marginHorizontal: spacing.sm,
    color: colors.textTertiary,
  },
  followButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.lg,
    alignSelf: 'flex-start',
  },
  followButtonActive: {
    backgroundColor: colors.backgroundSecondary,
  },
  followButtonText: {
    fontSize: fontSize.sm,
    color: colors.white,
    fontWeight: '600',
  },
  followButtonTextActive: {
    color: colors.textSecondary,
  },
  sortTabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sortTab: {
    paddingVertical: spacing.md,
    marginRight: spacing.xl,
  },
  sortTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  sortText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  sortTextActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  postList: {
    padding: spacing.md,
  },
  postCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  postContent: {
    padding: spacing.md,
  },
  postText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: spacing.sm,
  },
  authorName: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  likeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  likeCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
