import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, Platform } from 'react-native';

import { setAlpha } from '../theme/utils';
import type { SqliteExplorerTheme } from '../theme';
import type { ColumnInfo } from '../types/database';
import { FunnelIcon, CloseCircleIcon } from '../icons';

export interface FilterBarProps {
  columns: ColumnInfo[];
  filterColumn: string | null;
  filterValue: string;
  onSetFilterColumn: (column: string | null) => void;
  onSetFilterValue: (value: string) => void;
  onClearFilter: () => void;
  theme: SqliteExplorerTheme;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  columns,
  filterColumn,
  filterValue,
  onSetFilterColumn,
  onSetFilterValue,
  onClearFilter,
  theme,
}) => {
  const isDark = theme.mode === 'dark';
  const [localValue, setLocalValue] = useState(filterValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleValueChange = (text: string) => {
    setLocalValue(text);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      onSetFilterValue(text);
    }, 300);
  };

  const handleClear = () => {
    setLocalValue('');
    onClearFilter();
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: setAlpha(theme.colors.border, isDark ? 0.3 : 0.5),
        backgroundColor: theme.colors.card,
      }}
    >
      <FunnelIcon size={16} color={theme.colors.mutedForeground} />

      {/* Column Selector */}
      <View
        style={{
          backgroundColor: isDark
            ? setAlpha(theme.colors.background, 0.5)
            : theme.colors.background,
          borderWidth: 1,
          borderColor: setAlpha(theme.colors.border, 0.5),
          borderRadius: 6,
          paddingHorizontal: 8,
          paddingVertical: 4,
          minWidth: 120,
        }}
      >
        <Pressable
          onPress={() => {
            const currentIdx = filterColumn
              ? columns.findIndex((c) => c.name === filterColumn)
              : -1;
            const nextIdx = (currentIdx + 1) % (columns.length + 1);
            onSetFilterColumn(nextIdx === columns.length ? null : columns[nextIdx]?.name ?? null);
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: filterColumn ? theme.colors.foreground : theme.colors.mutedForeground,
              fontFamily: Platform.select({ web: 'monospace', default: undefined }),
            }}
          >
            {filterColumn || 'Select column...'}
          </Text>
        </Pressable>
      </View>

      {/* Filter Input */}
      <TextInput
        value={localValue}
        onChangeText={handleValueChange}
        placeholder="Filter value..."
        placeholderTextColor={theme.colors.mutedForeground}
        style={{
          flex: 1,
          backgroundColor: isDark
            ? setAlpha(theme.colors.background, 0.5)
            : theme.colors.background,
          borderWidth: 1,
          borderColor: setAlpha(theme.colors.border, 0.5),
          borderRadius: 6,
          paddingHorizontal: 12,
          paddingVertical: 6,
          fontSize: 12,
          color: theme.colors.foreground,
          fontFamily: Platform.select({ web: 'monospace', default: undefined }),
        }}
        editable={!!filterColumn}
      />

      {/* Clear Button */}
      {(filterColumn || localValue) && (
        <Pressable
          onPress={handleClear}
          style={({ pressed }) => ({
            padding: 6,
            borderRadius: 6,
            backgroundColor: pressed ? setAlpha(theme.colors.foreground, 0.1) : 'transparent',
          })}
        >
          <CloseCircleIcon size={18} color={theme.colors.mutedForeground} />
        </Pressable>
      )}
    </View>
  );
};
