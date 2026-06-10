import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius, fontSize } from '@/constants/theme';
import api from '@/services/api';

export default function PublishPostPage() {
  const router = useRouter();

  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHotTopics();
  }, []);

  const fetchHotTopics = async () => {
    try {
      const res = await api.get('/topic/hot');
      if (res.code === 200) {
        setTopics(res.data);
      }
    } catch (error) {
      console.error('获取热门话题失败:', error);
      setTopics([
        { id: '1', name: '#骑行打卡#', postCount: 12345 },
        { id: '2', name: '#周末骑游#', postCount: 8765 },
        { id: '3', name: '#装备分享#', postCount: 6543 },
        { id: '4', name: '#夜骑安全#', postCount: 4321 },
        { id: '5', name: '#长途骑行#', postCount: 3210 },
      ]);
    }
  };

  const handleAddImage = async () => {
    if (images.length >= 9) {
      Alert.alert('提示', '最多只能添加9张图片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleToggleTopic = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter((id) => id !== topicId));
    } else {
      if (selectedTopics.length >= 3) {
        Alert.alert('提示', '最多只能选择3个话题');
        return;
      }
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleLocation = () => {
    Alert.alert('定位', '定位功能开发中', [
      { text: '取消', style: 'cancel' },
      { text: '北京市朝阳区', onPress: () => setLocation('北京市朝阳区' ) },
    ]);
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      Alert.alert('提示', '请输入内容');
      return;
    }

    setLoading(true);
    try {
      // 模拟发布
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert('发布成功', '帖子已发布', [
        {
          text: '确定',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('发布失败', '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const charCount = content.length;
  const selectedTopicNames = topics
    .filter((t) => selectedTopics.includes(t.id))
    .map((t) => t.name);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Text style={styles.headerIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>发布帖子</Text>
        <TouchableOpacity
          style={[styles.publishButton, !content.trim() && styles.publishButtonDisabled]}
          onPress={handlePublish}
          disabled={!content.trim() || loading}
        >
          <Text style={[styles.publishButtonText, !content.trim() && styles.publishButtonTextDisabled]}>
            {loading ? '发布中...' : '发布'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 内容输入 */}
        <View style={styles.contentInput}>
          <TextInput
            style={styles.textInput}
            placeholder="分享你的骑行故事..."
            placeholderTextColor={colors.textTertiary}
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={2000}
          />
          <Text style={styles.charCount}>{charCount}/2000</Text>
        </View>

        {/* 图片添加 */}
        <View style={styles.imageSection}>
          <View style={styles.imageGrid}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageItem}>
                <ExpoImage source={{ uri }} style={styles.imagePreview} contentFit="cover" />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <Text style={styles.removeIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 9 && (
              <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
                <Text style={styles.addImageIcon}>+</Text>
                <Text style={styles.addImageText}>添加图片</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 话题选择 */}
        <View style={styles.topicSection}>
          <Text style={styles.sectionTitle}>添加话题</Text>
          <View style={styles.topicGrid}>
            {topics.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                style={[
                  styles.topicTag,
                  selectedTopics.includes(topic.id) && styles.topicTagActive,
                ]}
                onPress={() => handleToggleTopic(topic.id)}
              >
                <Text
                  style={[
                    styles.topicText,
                    selectedTopics.includes(topic.id) && styles.topicTextActive,
                  ]}
                >
                  {topic.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 位置 */}
        <TouchableOpacity style={styles.locationSection} onPress={handleLocation}>
          <Text style={styles.locationIcon}>📍</Text>
          {location ? (
            <Text style={styles.locationText}>{location}</Text>
          ) : (
            <Text style={styles.locationPlaceholder}>添加位置</Text>
          )}
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* 已选话题展示 */}
        {selectedTopicNames.length > 0 && (
          <View style={styles.selectedTopicsSection}>
            <Text style={styles.sectionTitle}>已选话题</Text>
            <Text style={styles.selectedTopicsText}>{selectedTopicNames.join(' ')}</Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  publishButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.lg,
  },
  publishButtonDisabled: {
    backgroundColor: colors.backgroundSecondary,
  },
  publishButtonText: {
    fontSize: fontSize.md,
    color: colors.white,
    fontWeight: '600',
  },
  publishButtonTextDisabled: {
    color: colors.textTertiary,
  },
  content: {
    flex: 1,
  },
  contentInput: {
    padding: spacing.lg,
    minHeight: 200,
  },
  textInput: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 24,
    minHeight: 180,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: spacing.sm,
  },
  imageSection: {
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  imageItem: {
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  addImageButton: {
    width: 100,
    height: 100,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  addImageIcon: {
    fontSize: 28,
    color: colors.textTertiary,
  },
  addImageText: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  topicSection: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  topicTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topicTagActive: {
    backgroundColor: '#FFF5F5',
    borderColor: colors.accent,
  },
  topicText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  topicTextActive: {
    color: colors.accent,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  locationIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  locationText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  locationPlaceholder: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textTertiary,
  },
  arrow: {
    fontSize: 20,
    color: colors.textTertiary,
  },
  selectedTopicsSection: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  selectedTopicsText: {
    fontSize: fontSize.md,
    color: colors.accent,
    lineHeight: 24,
  },
  bottomPadding: {
    height: 50,
  },
});
