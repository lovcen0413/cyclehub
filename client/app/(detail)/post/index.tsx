import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { colors, spacing, borderRadius, fontSize } from '@/constants/theme';
import api from '@/services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchPostDetail();
    fetchComments();
  }, [id]);

  const fetchPostDetail = async () => {
    try {
      const res = await api.get(`/post/${id}`);
      if (res.code === 200) {
        setPost(res.data);
        setIsLiked(res.data.isLiked);
        setLikes(res.data.likes);
      }
    } catch (error) {
      console.error('获取帖子详情失败:', error);
      // 使用mock数据
      setPost({
        id: id || '1',
        content: '今天完成了一次环湖骑行，风景超美！分享一些骑行中的小技巧给大家：\n\n1. 出发前检查胎压\n2. 保持匀速骑行\n3. 及时补水\n4. 注意安全\n\n#骑行打卡# #周末骑游#',
        images: [
          'https://picsum.photos/400/600?random=201',
          'https://picsum.photos/400/600?random=202',
          'https://picsum.photos/400/600?random=203',
        ],
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
        topics: [
          { id: '1', name: '#骑行打卡#' },
          { id: '2', name: '#周末骑游#' },
        ],
        location: '西湖',
        createdAt: '2025-01-01T10:00:00Z',
      });
      setLikes(234);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/post/${id}/comments`);
      if (res.code === 200) {
        setComments(res.data);
      }
    } catch (error) {
      console.error('获取评论失败:', error);
      setComments([
        {
          id: '1',
          content: '太棒了！风景确实很美',
          author: {
            id: '2',
            name: '骑友甲',
            avatar: 'https://picsum.photos/100/100?random=c1',
          },
          likes: 12,
          createdAt: '2025-01-01T11:00:00Z',
        },
        {
          id: '2',
          content: '请问骑行路线是怎么规划的？',
          author: {
            id: '3',
            name: '骑友乙',
            avatar: 'https://picsum.photos/100/100?random=c2',
          },
          likes: 5,
          createdAt: '2025-01-01T12:00:00Z',
        },
      ]);
    }
  };

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    try {
      if (isLiked) {
        await api.delete(`/post/${id}/like`);
      } else {
        await api.post(`/post/${id}/like`);
      }
    } catch (error) {
      console.error('点赞操作失败:', error);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleComment = () => {
    if (!newComment.trim()) return;
    Alert.alert('提示', '评论功能开发中');
    setNewComment('');
  };

  const handleShare = () => {
    Alert.alert('分享', '分享功能开发中');
  };

  const handleTopicPress = (topic: any) => {
    router.push(`/topic/${topic.id}`);
  };

  const handleUserPress = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  const formatTime = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString();
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

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>帖子不存在</Text>
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
        <Text style={styles.headerTitle}>帖子详情</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
          <Text style={styles.headerIcon}>↗</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 作者信息 */}
        <TouchableOpacity
          style={styles.authorSection}
          onPress={() => handleUserPress(post.author.id)}
        >
          <ExpoImage
            source={{ uri: post.author.avatar }}
            style={styles.authorAvatar}
            contentFit="cover"
          />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{post.author.name}</Text>
            <Text style={styles.postTime}>
              {formatTime(post.createdAt)}
              {post.location && ` · ${post.location}`}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.followButton, isFollowing && styles.followButtonActive]}
            onPress={handleFollow}
          >
            <Text
              style={[styles.followButtonText, isFollowing && styles.followButtonTextActive]}
            >
              {isFollowing ? '已关注' : '关注'}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* 帖子内容 */}
        <View style={styles.contentSection}>
          <Text style={styles.postContent}>{post.content}</Text>

          {/* 话题标签 */}
          {post.topics && post.topics.length > 0 && (
            <View style={styles.topicsContainer}>
              {post.topics.map((topic: any) => (
                <TouchableOpacity
                  key={topic.id}
                  style={styles.topicTag}
                  onPress={() => handleTopicPress(topic)}
                >
                  <Text style={styles.topicText}>{topic.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* 图片 */}
          {post.images && post.images.length > 0 && (
            <View style={styles.imagesContainer}>
              {post.images.map((image: string, index: number) => (
                <ExpoImage
                  key={index}
                  source={{ uri: image }}
                  style={[
                    styles.postImage,
                    post.images.length === 1 && styles.singleImage,
                    post.images.length === 2 && styles.doubleImage,
                  ]}
                  contentFit="cover"
                />
              ))}
            </View>
          )}
        </View>

        {/* 互动栏 */}
        <View style={styles.actionBar}>
          <View style={styles.actionItem}>
            <Text style={styles.actionIcon}>🔍</Text>
            <Text style={styles.actionText}>{post.views || 0}</Text>
          </View>
          <TouchableOpacity style={styles.actionItem} onPress={handleLike}>
            <Text style={styles.actionIcon}>{isLiked ? '❤️' : '🤍'}</Text>
            <Text style={[styles.actionText, isLiked && styles.actionTextActive]}>
              {likes}
            </Text>
          </TouchableOpacity>
          <View style={styles.actionItem}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>{comments.length}</Text>
          </View>
        </View>

        {/* 评论区 */}
        <View style={styles.commentSection}>
          <Text style={styles.commentTitle}>评论 {comments.length}</Text>

          {comments.length === 0 ? (
            <View style={styles.emptyComment}>
              <Text style={styles.emptyCommentText}>暂无评论，快来抢沙发</Text>
            </View>
          ) : (
            comments.map((comment: any) => (
              <TouchableOpacity
                key={comment.id}
                style={styles.commentItem}
                onPress={() => handleUserPress(comment.author.id)}
              >
                <ExpoImage
                  source={{ uri: comment.author.avatar }}
                  style={styles.commentAvatar}
                  contentFit="cover"
                />
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>{comment.author.name}</Text>
                    <Text style={styles.commentTime}>{formatTime(comment.createdAt)}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.content}</Text>
                  <View style={styles.commentActions}>
                    <TouchableOpacity style={styles.commentAction}>
                      <Text style={styles.commentActionIcon}>🤍</Text>
                      <Text style={styles.commentActionText}>{comment.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.commentAction}>
                      <Text style={styles.commentActionIcon}>回复</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* 底部评论输入 */}
      <View style={styles.commentInput}>
        <TouchableOpacity style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="写评论..."
            placeholderTextColor={colors.textTertiary}
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={handleComment}>
          <Text style={styles.sendButtonText}>发送</Text>
        </TouchableOpacity>
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
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  authorInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  authorName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  postTime: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  followButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.lg,
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
  contentSection: {
    paddingHorizontal: spacing.lg,
  },
  postContent: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  topicTag: {
    backgroundColor: '#FFF5F5',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  topicText: {
    fontSize: fontSize.sm,
    color: colors.accent,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  postImage: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.xs * 2) / 3,
    height: (SCREEN_WIDTH - spacing.lg * 2 - spacing.xs * 2) / 3,
    borderRadius: borderRadius.sm,
  },
  singleImage: {
    width: SCREEN_WIDTH - spacing.lg * 2,
    height: 300,
  },
  doubleImage: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.sm) / 2,
    height: 200,
  },
  actionBar: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginTop: spacing.md,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.xl,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  actionText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  actionTextActive: {
    color: colors.accent,
  },
  commentSection: {
    padding: spacing.lg,
  },
  commentTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  emptyComment: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyCommentText: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  commentContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  commentAuthor: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  commentTime: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
  },
  commentText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentActionIcon: {
    fontSize: 12,
    marginRight: 2,
  },
  commentActionText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  bottomPadding: {
    height: 100,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
  },
  textInput: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    minHeight: 24,
  },
  sendButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.lg,
  },
  sendButtonText: {
    fontSize: fontSize.md,
    color: colors.white,
    fontWeight: '600',
  },
});
