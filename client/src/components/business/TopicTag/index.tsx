import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '@/constants/theme';

interface TopicTagProps {
  name: string;
  count?: number;
  onPress?: () => void;
  size?: 'sm' | 'md';
}

export function TopicTag({ name, count, onPress, size = 'md' }: TopicTagProps) {
  return (
    <TouchableOpacity
      style={[styles.container, size === 'sm' && styles.containerSm]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.name, size === 'sm' && styles.nameSm]}>{name}</Text>
      {count !== undefined && (
        <Text style={[styles.count, size === 'sm' && styles.countSm]}>
          {count > 9999 ? `${(count / 10000).toFixed(1)}w` : count}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  containerSm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  name: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  nameSm: {
    fontSize: fontSize.sm,
  },
  count: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginLeft: spacing.xs,
  },
  countSm: {
    fontSize: fontSize.xs,
  },
});

export default TopicTag;
