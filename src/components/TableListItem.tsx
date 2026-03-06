import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';

import { setAlpha } from '../theme/utils';
import type { SqliteExplorerTheme } from '../theme';
import type { TableInfo } from '../types/database';
import type { ExtendedPressableState } from '../types/explorer';
import { GridIcon } from '../icons';

export interface TableListItemProps {
  table: TableInfo;
  isSelected: boolean;
  onPress: () => void;
  theme: SqliteExplorerTheme;
}

export const TableListItem: React.FC<TableListItemProps> = ({
  table,
  isSelected,
  onPress,
  theme,
}) => {
  const isDark = theme.mode === 'dark';
  return (
    <Pressable
      onPress={onPress}
      style={(state) => {
        const { pressed, hovered } = state as ExtendedPressableState;
        return {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: isSelected
            ? setAlpha(theme.colors.primary, isDark ? 0.2 : 0.1)
            : hovered
              ? setAlpha(theme.colors.foreground, 0.05)
              : pressed
                ? setAlpha(theme.colors.foreground, 0.08)
                : 'transparent',
          borderLeftWidth: 3,
          borderLeftColor: isSelected ? theme.colors.primary : 'transparent',
        };
      }}
    >
      <GridIcon
        size={14}
        color={isSelected ? theme.colors.primary : theme.colors.mutedForeground}
        style={{ marginRight: 8 }}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: isSelected ? '600' : '400',
            color: isSelected ? theme.colors.primary : theme.colors.foreground,
            fontFamily: Platform.select({ web: 'monospace', default: undefined }),
          }}
          numberOfLines={1}
        >
          {table.name}
        </Text>
        <Text style={{ fontSize: 11, color: theme.colors.mutedForeground, marginTop: 2 }}>
          {table.rowCount.toLocaleString()} rows
        </Text>
      </View>
    </Pressable>
  );
};
