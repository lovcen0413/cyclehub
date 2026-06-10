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
import type { Post, Group } from '@/types';

// Tab类型
type CommunityTab = 'posts' | 'groups';

// 模拟帖子数据
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
      id: '2',
      name: '装备测评师',
      avatar: 'https://picsum.photos/100/100?random=202',
      followers: 5678,
      following: 234,
      likes: 12345,
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
    topics: [{ id: '3', name: '#山地越野#' }],
    createdAt: '2025-01-03T12:00:00',
  },
  {
    id: '4',
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
    isLiked: false,
    topics: [{ id: '4', name: '#夜骑装备#' }],
    createdAt: '2025-01-04T13:00:00',
  },
];

// 模拟骑行群数据
const mockGroups: Group[] = [
  {
    id: '1',
    name: '城市夜骑团',
    avatar: 'https://picsum.photos/100/100?random=301',
    description: '每晚8点，城市夜骑，风雨无阻',
    memberCount: 234,
    todayActivity: '今晚8点朝阳路集合',
    city: '北京',
    isJoined: true,
    createdAt: '2024-06-01',
  },
  {
    id: '2',
    name: '周末山地群',
    avatar: 'https://picsum.photos/100/100?random=302',
    description: '专业山地路线，周周出行',
    memberCount: 156,
    todayActivity: '周六早8点云蒙山',
    city: '北京',
    isJoined: false,
    createdAt: '2024-07-01',
  },
  {
    id: '3',
    name: '公路车竞速俱乐部',
    avatar: 'https://picsum.photos/100/100?random=303',
    description: '追求速度与激情，专业竞速训练',
    memberCount: 89,
    todayActivity: '暂无活动',
    city: '上海',
    isJoined: false,
    createdAt: '2024-08-01',
  },
  {
    id: '4',
    name: '休闲骑游群',
    avatar: 'https://picsum.photos/100/100?random=304',
    description: '边骑边玩，享受骑行乐趣',
    memberCount: 456,
    todayActivity: '周日环湖骑行',
    city: '杭州',
    isJoined: true,
    createdAt: '2024-05-01',
  },
];

// 帖子卡片组件
function PostCard({ post, onPress }: { post: Post; onPress: () => void }) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const imageHeight = 180 + (parseInt(post.id) % 3) * 40;

  return (
    <TouchableOpacity style={styles.postCard} onPress={onPress} activeOpacity={0.9}>
      <Image
        source={{ uri: post.images[0] }}
        style={[styles.postImage, { height: imageHeight }]}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.postContent}>
        <Text style={styles.postText} numberOfLines={3}>
          {post.content}
        </Text>
        <View style={styles.postFooter}>
          <View style={styles.authorInfo}>
            <Image
              source={{ uri: post.author.avatar }}
              style={styles.authorAvatar}
              contentFit="cover"
            />
            <Text style={styles.authorName}>{post.author.name}</Text>
          </View>
          <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
            <Text style={styles.likeIcon}>{isLiked ? '❤️' : '🤍'}</Text>
            <Text style={[styles.likeCount, isLiked && styles.likeCountActive]}>
              {likes}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// 骑行群卡片组件
function GroupCard({ group, onPress, onJoin }: { 
  group: Group; 
  onPress: () => void;
  onJoin: () => void;
}) {
  return (
    <TouchableOpacity style={styles.groupCard} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.groupHeader}>
        <Image
          source={{ uri: group.avatar }}
          style={styles.groupAvatar}
          contentFit="cover"
        />
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.groupDesc} numberOfLines={1}>
            {group.description}
          </Text>
        </View>
      </View>
      <View style={styles.groupFooter}>
        <View style={styles.groupStats}>
          <Text style={styles.memberCount}>成员 {group.memberCount}</Text>
          {group.todayActivity !== '暂无活动' && (
            <View style={styles.activityBadge}>
              <Text style={styles.activityText}>🔥 {group.todayActivity}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={[styles.joinButton, group.isJoined && styles.joinButtonJoined]}
          onPress={onJoin}
        >
          <Text style={[styles.joinButtonText, group.isJoined && styles.joinButtonTextJoined]}>
            {group.isJoined ? '已加入' : '加入群聊'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function CommunityPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CommunityTab>('posts');
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(mockPosts);
  const [groups, setGroups] = useState(mockGroups);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setPosts(mockPosts);
      setGroups(mockGroups);
      setRefreshing(false);
    }, 1000);
  }, []);

  const handlePostPress = (post: Post) => {
    router.push(`/post/${post.id}`);
  };

  const handleGroupPress = (group: Group) => {
    router.push(`/group/${group.id}`);
  };

  const handleJoinGroup = (groupId: string) => {
    setGroups(groups.map(g => 
      g.id === groupId 
        ? { ...g, isJoined: !g.isJoined, memberCount: g.isJoined ? g.memberCount - 1 : g.memberCount + 1 }
        : g
    ));
  };

  const handlePublish = () => {
    router.push('/publish');
  };

  const renderPost = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard post={item} onPress={() => handlePostPress(item)} />
    ),
    []
  );

  const renderGroup = useCallback(
    ({ item }: { item: Group }) => (
      <GroupCard 
        group={item} 
        onPress={() => handleGroupPress(item)}
        onJoin={() => handleJoinGroup(item.id)}
      />
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 头部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>发现社区</Text>
      </View>

      {/* Tab切换 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.tabActive]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.tabTextActive]}>
            帖子
          </Text>
          {activeTab === 'posts' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'groups' && styles.tabActive]}
          onPress={() => setActiveTab('groups')}
        >
          <Text style={[styles.tabText, activeTab === 'groups' && styles.tabTextActive]}>
            骑行群
          </Text>
          {activeTab === 'groups' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        {activeTab === 'groups' && (
          <TouchableOpacity style={styles.createGroupButton}>
            <Text style={styles.createGroupIcon}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 内容区域 */}
      {activeTab === 'posts' ? (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.postRow}
          contentContainerStyle={styles.contentList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.accent}
            />
          }
        />
      ) : (
        <FlatList
          data={groups}
          renderItem={renderGroup}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentList}
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
              <Text style={styles.emptyText}>暂无骑行群</Text>
            </View>
          }
        />
      )}

      {/* 发布按钮 */}
      <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
        <Text style={styles.publishIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  tab: {
    paddingVertical: spacing.md,
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
  createGroupButton: {
    marginLeft: 'auto',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createGroupIcon: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '600',
  },
  contentList: {
    padding: spacing.md,
  },
  postRow: {
    justifyContent: 'space-between',
  },
  postCard: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
  },
  postContent: {
    padding: spacing.sm,
  },
  postText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  postFooter: {
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
    width: 20,
    height: 20,
    borderRadius: 10,
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
    fontSize: 12,
  },
  likeCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  likeCountActive: {
    color: colors.accent,
  },
  groupCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  groupHeader: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  groupAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing.md,
  },
  groupInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  groupName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  groupDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  groupFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupStats: {
    flex: 1,
  },
  memberCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  activityBadge: {
    backgroundColor: '#FFF5F5',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xs,
  },
  activityText: {
    fontSize: fontSize.xs,
    color: colors.accent,
  },
  joinButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  joinButtonJoined: {
    backgroundColor: colors.backgroundSecondary,
  },
  joinButtonText: {
    fontSize: fontSize.sm,
    color: colors.white,
    fontWeight: '600',
  },
  joinButtonTextJoined: {
    color: colors.textSecondary,
  },
  publishButton: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  publishIcon: {
    fontSize: 28,
    color: colors.white,
    fontWeight: '300',
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
