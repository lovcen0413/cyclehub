import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, fontSize } from '@/constants/theme';
import api from '@/services/api';

export default function AddressEditPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [detail, setDetail] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      fetchAddressDetail();
    }
  }, [id]);

  const fetchAddressDetail = async () => {
    try {
      const res = await api.get(`/address/${id}`);
      if (res.code === 200) {
        const addr = res.data;
        setName(addr.name);
        setPhone(addr.phone);
        setProvince(addr.province);
        setCity(addr.city);
        setDistrict(addr.district);
        setDetail(addr.detail);
        setIsDefault(addr.isDefault);
      }
    } catch (error) {
      console.error('获取地址详情失败:', error);
      // 使用mock数据
      setName('张三');
      setPhone('13812345678');
      setProvince('北京市');
      setCity('北京市');
      setDistrict('朝阳区');
      setDetail('某街道某小区1号楼101');
      setIsDefault(true);
    } finally {
      setLoadingAddress(false);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('提示', '请输入收货人姓名');
      return false;
    }
    if (!phone.trim() || phone.length !== 11) {
      Alert.alert('提示', '请输入正确的手机号');
      return false;
    }
    if (!province.trim()) {
      Alert.alert('提示', '请选择省份');
      return false;
    }
    if (!city.trim()) {
      Alert.alert('提示', '请选择城市');
      return false;
    }
    if (!detail.trim()) {
      Alert.alert('提示', '请输入详细地址');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 模拟保存
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert('成功', '地址保存成功', [
        {
          text: '确定',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('错误', '保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRegion = (type: 'province' | 'city' | 'district') => {
    Alert.alert(
      '选择地区',
      '地区选择功能开发中，请手动输入',
      [
        {
          text: '北京',
          onPress: () => {
            if (type === 'province') {
              setProvince('北京市');
              setCity('北京市');
              setDistrict('朝阳区');
            }
          },
        },
        {
          text: '上海',
          onPress: () => {
            if (type === 'province') {
              setProvince('上海市');
              setCity('上海市');
              setDistrict('浦东新区');
            }
          },
        },
        {
          text: '广东',
          onPress: () => {
            if (type === 'province') {
              setProvince('广东省');
              setCity('深圳市');
              setDistrict('南山区');
            }
          },
        },
      ]
    );
  };

  if (loadingAddress) {
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
        <Text style={styles.headerTitle}>{isEditing ? '编辑地址' : '新增地址'}</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 收货人 */}
        <View style={styles.formItem}>
          <Text style={styles.formLabel}>收货人</Text>
          <TextInput
            style={styles.formInput}
            placeholder="请输入收货人姓名"
            placeholderTextColor={colors.textTertiary}
            value={name}
            onChangeText={setName}
            maxLength={20}
          />
        </View>

        {/* 手机号 */}
        <View style={styles.formItem}>
          <Text style={styles.formLabel}>手机号</Text>
          <TextInput
            style={styles.formInput}
            placeholder="请输入手机号"
            placeholderTextColor={colors.textTertiary}
            value={phone}
            onChangeText={setPhone}
            keyboardType="number-pad"
            maxLength={11}
          />
        </View>

        {/* 省份 */}
        <TouchableOpacity
          style={styles.formItem}
          onPress={() => handleSelectRegion('province')}
        >
          <Text style={styles.formLabel}>省份</Text>
          <View style={styles.formInput}>
            <Text style={[styles.formInputText, !province && styles.placeholder]}>
              {province || '请选择省份'}
            </Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* 城市 */}
        <TouchableOpacity
          style={styles.formItem}
          onPress={() => handleSelectRegion('city')}
        >
          <Text style={styles.formLabel}>城市</Text>
          <View style={styles.formInput}>
            <Text style={[styles.formInputText, !city && styles.placeholder]}>
              {city || '请选择城市'}
            </Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* 区县 */}
        <TouchableOpacity
          style={styles.formItem}
          onPress={() => handleSelectRegion('district')}
        >
          <Text style={styles.formLabel}>区县</Text>
          <View style={styles.formInput}>
            <Text style={[styles.formInputText, !district && styles.placeholder]}>
              {district || '请选择区县'}
            </Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* 详细地址 */}
        <View style={styles.formItem}>
          <Text style={styles.formLabel}>详细地址</Text>
          <TextInput
            style={[styles.formInput, styles.textArea]}
            placeholder="请输入详细地址，如街道、门牌号等"
            placeholderTextColor={colors.textTertiary}
            value={detail}
            onChangeText={setDetail}
            multiline
            numberOfLines={3}
            maxLength={100}
          />
        </View>

        {/* 设为默认 */}
        <TouchableOpacity
          style={styles.defaultItem}
          onPress={() => setIsDefault(!isDefault)}
        >
          <Text style={styles.defaultLabel}>设为默认地址</Text>
          <View style={[styles.checkbox, isDefault && styles.checkboxActive]}>
            {isDefault && <Text style={styles.checkboxIcon}>✓</Text>}
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* 保存按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>{loading ? '保存中...' : '保存地址'}</Text>
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
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
  formItem: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  formLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  formInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 28,
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
  arrow: {
    fontSize: 20,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
  },
  defaultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  defaultLabel: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkboxIcon: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: fontSize.md,
    color: colors.white,
    fontWeight: '600',
  },
});
