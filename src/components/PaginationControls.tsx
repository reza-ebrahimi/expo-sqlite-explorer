import React from 'react';
import { View, Text, Pressable } from 'react-native';

import { setAlpha } from '../theme/utils';
import type { SqliteExplorerTheme } from '../theme';
import type { PaginationState } from '../types/explorer';
import { ChevronBackIcon, ChevronForwardIcon } from '../icons';

export interface PaginationControlsProps {
  pagination: PaginationState;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  theme: SqliteExplorerTheme;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  hasPreviousPage,
  hasNextPage,
  onPreviousPage,
  onNextPage,
  theme,
}) => {
  const isDark = theme.mode === 'dark';
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: setAlpha(theme.colors.border, isDark ? 0.3 : 0.5),
        backgroundColor: theme.colors.card,
      }}
    >
      <Text style={{ fontSize: 12, color: theme.colors.mutedForeground }}>
        {pagination.totalRecords.toLocaleString()} total records
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable
          onPress={onPreviousPage}
          disabled={!hasPreviousPage}
          style={({ pressed }) => ({
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            backgroundColor: pressed && hasPreviousPage
              ? setAlpha(theme.colors.foreground, 0.1)
              : 'transparent',
            opacity: hasPreviousPage ? 1 : 0.4,
          })}
        >
          <ChevronBackIcon size={16} color={theme.colors.foreground} />
        </Pressable>
        <Text style={{ fontSize: 13, color: theme.colors.foreground }}>
          Page {pagination.currentPage} of {pagination.totalPages || 1}
        </Text>
        <Pressable
          onPress={onNextPage}
          disabled={!hasNextPage}
          style={({ pressed }) => ({
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            backgroundColor: pressed && hasNextPage
              ? setAlpha(theme.colors.foreground, 0.1)
              : 'transparent',
            opacity: hasNextPage ? 1 : 0.4,
          })}
        >
          <ChevronForwardIcon size={16} color={theme.colors.foreground} />
        </Pressable>
      </View>
      <Text style={{ fontSize: 12, color: theme.colors.mutedForeground }}>
        {pagination.pageSize} per page
      </Text>
    </View>
  );
};
