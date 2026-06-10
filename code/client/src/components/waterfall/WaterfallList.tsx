import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  Dimensions,
  ListRenderItem,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WaterfallListProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
  columns?: 2 | 3;
  gap?: number;
  onEndReached?: () => void;
  onRefresh?: () => void;
  ListHeaderComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
  ListEmptyComponent?: React.ReactElement | null;
  loading?: boolean;
  refreshing?: boolean;
}

export function WaterfallList<T>({
  data,
  renderItem,
  columns = 2,
  gap = 12,
  onEndReached,
  onRefresh,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  loading = false,
  refreshing = false,
}: WaterfallListProps<T>) {
  const columnWidth = useMemo(() => {
    const totalGap = gap * (columns + 1);
    return (SCREEN_WIDTH - totalGap) / columns;
  }, [columns, gap]);

  // 将数据分配到各列（简单轮询分配）
  const columnsData = useMemo(() => {
    const result: T[][] = Array.from({ length: columns }, () => []);
    data.forEach((item, index) => {
      result[index % columns].push(item);
    });
    return result;
  }, [data, columns]);

  const renderColumn = useCallback(
    (columnData: T[], columnIndex: number) => (
      <View
        key={columnIndex}
        style={[
          styles.column,
          {
            width: columnWidth,
            marginLeft: columnIndex === 0 ? gap : gap / 2,
            marginRight: columnIndex === columns - 1 ? gap : gap / 2,
          },
        ]}
      >
        {columnData.map((item, index) => {
          // 计算正确的全局索引
          const globalIndex = columnIndex + index * columns;
          return (
            <React.Fragment key={item ? (item as { id?: string }).id || globalIndex : globalIndex}>
              {renderItem({ item, index: globalIndex, separators: null })}
            </React.Fragment>
          );
        })}
      </View>
    ),
    [columnWidth, columns, gap, renderItem]
  );

  return (
    <FlatList
      data={[1]} // 使用一个假的data来包装自定义内容
      renderItem={() => (
        <View style={styles.container}>
          {columnsData.map((columnData, index) => renderColumn(columnData, index))}
        </View>
      )}
      keyExtractor={() => 'waterfall'}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF2442"
          />
        ) : undefined
      }
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  column: {
    flexDirection: 'column',
  },
});

export default WaterfallList;
