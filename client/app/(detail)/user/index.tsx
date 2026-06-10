import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { colors, spacing, borderRadius, fontSize } from '@/constants/theme';
import type { Post, Product } from '@/types';
import api from '@/services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function UserProfilePage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'products' | 'likes'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get(`/user/${id}`);
      if (res.code === 200) {
        setUser(res.data);
        setIsFollowing(res.data.isFollowing || false);
      }
    } catch (error) {
      console.error('获取用户资料失败:', error);
      // 使用mock数据
      setUser({
        id: id || '1',
        name: '骑行爱好者',
        avatar: 'https://picsum.photos/200/200?random=profile',
        bio: '热爱骑行，享受速度带来的快乐。每周固定骑行，保持健康生活。',
        followers: 1234,
        following: 567,
        likes: 8901,
        postCount: 89,
        isFollowing: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
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
          content: '给大家推荐这款碳纤维轮组，性价比超高！',
          images: [
            'https://picsum.photos/400/500?random=202',
            'https://picsum.photos/400/500?random=203',
          ],
          author: {
            id: '1',
            name: '骑行爱好者',
            avatar: 'https://picsum.photos/100/100?random=201',
            followers: 1234,
            following: 567,
            likes: 8901,
          },
          likes: 456,
          comments: 67,
          isLiked: true,
          topics: [{ id: '2', name: '#改装分享#' }],
          createdAt: '2025-01-02T11:00:00',
        },
        {
          id: '3',
          content: '周末的山地骑行太刺激了！下次一起去吗？',
          images: ['https://picsum.photos/400/600?random=204'],
          author: {
            id: '1',
            name: '骑行爱好者',
            avatar: 'https://picsum.photos/100/100?random=201',
            followers: 1234,
            following: 567,
            likes: 8901,
          },
          likes: 189,
          comments: 32,
          isLiked: false,
          topics: [{ id: '3', name: '#山地越野#' }],
          createdAt: '2025-01-03T12:00:00',
        },
        {
          id: '4',
          content: '夜骑安全装备清单，看这一篇就够了！',
          images: ['https://picsum.photos/400/400?random=205'],
          author: {
            id: '1',
            name: '骑行爱好者',
            avatar: 'https://picsum.photos/100/100?random=201',
            followers: 1234,
            following: 567,
            likes: 8901,
          },
          likes: 567,
          comments: 89,
          isLiked: false,
          topics: [{ id: '4', name: '#夜骑装备#' }],
          createdAt: '2025-01-04T13:00:00',
        },
      ];
      setPosts(mockPosts);
    } catch (error) {
      console.error('获取用户帖子失败:', error);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setUser({
      ...user,
      followers: isFollowing ? user.followers - 1 : user.followers + 1,
    });
  };

  const handleMessage = () => {
    Alert.alert('提示', '私信功能开发中');
  };

  const handlePostPress = (post: Post) => {
    router.push(`/post/${post.id}`);
  };

  const formatCount = (count: number) => {
    if (count >= 10000) {
      return (count / 10000).toFixed(1) + 'w';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => handlePostPress(item)}
      activeOpacity={0.9}
    >
      <ExpoImage
        source={{ uri: item.images[0] }}
        style={styles.postImage}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.postOverlay}>
        <Text style={styles.postStat}>❤️ {item.likes}</Text>
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

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>用户不存在</Text>
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
        <Text style={styles.headerTitle}>{user.name}</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 用户信息 */}
        <View style={styles.userInfo}>
          <ExpoImage
            source={{ uri: user.avatar }}
            style={styles.avatar}
            contentFit="cover"
          />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatCount(user.postCount)}</Text>
              <Text style={styles.statLabel}>发帖</Text>
            </View>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => Alert.alert('粉丝列表', '粉丝列表开发中')}
            >
              <Text style={styles.statNumber}>{formatCount(user.followers)}</Text>
              <Text style={styles.statLabel}>粉丝</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => Alert.alert('关注列表', '关注列表开发中')}
            >
              <Text style={styles.statNumber}>{formatCount(user.following)}</Text>
              <Text style={styles.statLabel}>关注</Text>
            </TouchableOpacity>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatCount(user.likes)}</Text>
              <Text style={styles.statLabel}>获赞</Text>
            </View>
          </View>
        </View>

        {/* 用户简介 */}
        <View style={styles.bioSection}>
          <Text style={styles.userName}>{user.name}</Text>
          {user.bio && <Text style={styles.bioText}>{user.bio}</Text>}
        </View>

        {/* 操作按钮 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, isFollowing && styles.actionButtonSecondary]}
            onPress={handleFollow}
          >
            <Text style={[styles.actionButtonText, isFollowing && styles.actionButtonTextSecondary]}>
              {isFollowing ? '已关注' : '+ 关注'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonSecondary} onPress={handleMessage}>
            <Text style={styles.actionButtonTextSecondary}>私信</Text>
          </TouchableOpacity>
        </View>

        {/* Tab切换 */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.tabActive]}
            onPress={() => setActiveTab('posts')}
          >
            <Text style={[styles.tabText, activeTab === 'posts' && styles.tabTextActive]}>
              帖子
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'products' && styles.tabActive]}
            onPress={() => setActiveTab('products')}
          >
            <Text style={[styles.tabText, activeTab === 'products' && styles.tabTextActive]}>
              商品
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'likes' && styles.tabActive]}
            onPress={() => setActiveTab('likes')}
          >
            <Text style={[styles.tabText, activeTab === 'likes' && styles.tabTextActive]}>
              点赞
            </Text>
          </TouchableOpacity>
        </View>

        {/* 内容列表 */}
        <View style={styles.contentList}>
          {activeTab === 'posts' && (
            <View style={styles.gridContainer}>
              {posts.map((post) => (
                <View key={post.id}>{renderPost({ item: post })}</View>
              ))}
            </View>
          )}
          {activeTab === 'products' && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>暂无商品</Text>
            </View>
          )}
          {activeTab === 'likes' && (
            <View style={styles.gridContainer}>
              {posts.slice(0, 3).map((post) => (
                <View key={`like-${post.id}`}>{renderPost({ item: post })}</View>
              ))}
            </View>
          )}
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
  },
  userInfo: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  bioSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  bioText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.accent,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: fontSize.md,
    color: colors.white,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  tabText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.accent,
    fontWeight: '600',
  },
  contentList: {
    padding: spacing.xs,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  postItem: {
    width: (SCREEN_WIDTH - 6) / 3,
    aspectRatio: 1,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  postStat: {
    fontSize: fontSize.xs,
    color: colors.white,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
  },
});
