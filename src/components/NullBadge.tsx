import React from 'react';
import { View, Text, Platform } from 'react-native';

import { setAlpha } from '../theme/utils';
import type { SqliteExplorerTheme } from '../theme';

export interface NullBadgeProps {
  theme: SqliteExplorerTheme;
}

export const NullBadge: React.FC<NullBadgeProps> = ({ theme }) => (
  <View
    style={{
      backgroundColor: setAlpha(theme.colors.mutedForeground, 0.2),
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    }}
  >
    <Text
      style={{
        fontSize: 11,
        fontWeight: '500',
        color: theme.colors.mutedForeground,
        fontFamily: Platform.select({ web: 'monospace', default: undefined }),
      }}
    >
      NULL
    </Text>
  </View>
);
