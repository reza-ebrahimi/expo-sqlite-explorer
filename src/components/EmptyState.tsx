import React from 'react';
import { View, Text } from 'react-native';

import type { SqliteExplorerTheme } from '../theme';
import { ServerIcon, DocumentIcon, CodeIcon } from '../icons';

export interface EmptyStateProps {
  icon: 'server' | 'document' | 'code';
  title: string;
  message: string;
  theme: SqliteExplorerTheme;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, theme }) => {
  const IconComponent = icon === 'server' ? ServerIcon : icon === 'document' ? DocumentIcon : CodeIcon;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <IconComponent size={48} color={theme.colors.mutedForeground} style={{ marginBottom: 16 }} />
      <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.foreground, marginBottom: 8 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 14, color: theme.colors.mutedForeground, textAlign: 'center' }}>
        {message}
      </Text>
    </View>
  );
};
