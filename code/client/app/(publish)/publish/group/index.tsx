import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius, fontSize } from '@/constants/theme';
import api from '@/services/api';

const CITIES = [
  { id: '1', name: '北京' },
  { id: '2', name: '上海' },
  { id: '3', name: '广州' },
  { id: '4', name: '深圳' },
  { id: '5', name: '杭州' },
  { id: '6', name: '成都' },
  { id: '7', name: '武汉' },
  { id: '8', name: '西安' },
];

export default function CreateGroupPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSelectCity = () => {
    Alert.alert('选择城市', '请选择骑友群所在城市', [
      ...CITIES.map((c) => ({
        text: c.name,
        onPress: () => setCity(c.name),
      })),
      { text: '取消', style: 'cancel' },
    ]);
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('提示', '请输入群名称');
      return false;
    }
    if (name.length < 2 || name.length > 20) {
      Alert.alert('提示', '群名称长度需在2-20个字符之间');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('提示', '请输入群介绍');
      return false;
    }
    if (!city) {
      Alert.alert('提示', '请选择所在城市');
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 模拟创建
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert('创建成功', '骑友群已创建，快去邀请骑友加入吧！', [
        {
          text: '确定',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('创建失败', '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>创建骑友群</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 群头像 */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handleSelectAvatar}>
            {avatar ? (
              <ExpoImage source={{ uri: avatar }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarIcon}>+</Text>
                <Text style={styles.avatarText}>添加群头像</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.avatarTip}>建议上传正方形图片</Text>
        </View>

        {/* 群名称 */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>群名称</Text>
          <TextInput
            style={styles.formInput}
            placeholder="请输入骑友群名称"
            placeholderTextColor={colors.textTertiary}
            value={name}
            onChangeText={setName}
            maxLength={20}
          />
          <Text style={styles.formHint}>{name.length}/20</Text>
        </View>

        {/* 群介绍 */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>群介绍</Text>
          <TextInput
            style={[styles.formInput, styles.textArea]}
            placeholder="请描述骑友群的特色、骑行路线、活动频率等..."
            placeholderTextColor={colors.textTertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={200}
          />
          <Text style={styles.formHint}>{description.length}/200</Text>
        </View>

        {/* 所在城市 */}
        <TouchableOpacity style={styles.formSection} onPress={handleSelectCity}>
          <Text style={styles.formLabel}>所在城市</Text>
          <View style={styles.formInput}>
            <Text style={[styles.formInputText, !city && styles.placeholder]}>
              {city || '请选择所在城市'}
            </Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* 骑友群须知 */}
        <View style={styles.noticeSection}>
          <Text style={styles.noticeTitle}>骑友群须知</Text>
          <View style={styles.noticeList}>
            <Text style={styles.noticeItem}>• 群名称需简洁明了，体现骑行特色</Text>
            <Text style={styles.noticeItem}>• 群介绍需真实，不得包含虚假信息</Text>
            <Text style={styles.noticeItem}>• 请选择正确的城市，方便骑友发现</Text>
            <Text style={styles.noticeItem}>• 创建后需遵守平台规则，不得违规</Text>
            <Text style={styles.noticeItem}>• 欢迎组织线下骑行活动，骑行注意安全</Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* 创建按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>{loading ? '创建中...' : '创建骑友群'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    padding: spacing.sm,
    width: 44,
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  avatarContainer: {
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    fontSize: 28,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  avatarText: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  avatarTip: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  formSection: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  formLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  formInput: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formInputText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    flex: 1,
  },
  placeholder: {
    color: colors.textTertiary,
  },
  textArea: {
    alignItems: 'flex-start',
    minHeight: 80,
  },
  formHint: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: spacing.sm,
  },
  arrow: {
    fontSize: 20,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
  },
  noticeSection: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  noticeTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  noticeList: {
    gap: spacing.sm,
  },
  noticeItem: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  bottomPadding: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  createButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    fontSize: fontSize.md,
    color: colors.white,
    fontWeight: '600',
  },
});
