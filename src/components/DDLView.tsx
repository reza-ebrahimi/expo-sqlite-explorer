import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { setAlpha } from '../theme/utils';
import type { SqliteExplorerTheme } from '../theme';
import { CodeBracketsIcon, CopyIcon } from '../icons';

export interface DDLViewProps {
  tableName: string;
  ddl: string;
  isLoading: boolean;
  theme: SqliteExplorerTheme;
}

export const DDLView: React.FC<DDLViewProps> = ({
  ddl,
  isLoading,
  theme,
}) => {
  const isDark = theme.mode === 'dark';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(ddl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ fontSize: 14, color: theme.colors.mutedForeground, marginTop: 16 }}>
          Loading DDL...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <CodeBracketsIcon size={16} color={theme.colors.primary} style={{ marginRight: 8 }} />
        <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground, flex: 1 }}>
          CREATE TABLE Statement
        </Text>
        <Pressable
          onPress={handleCopy}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            backgroundColor: pressed
              ? setAlpha(theme.colors.foreground, 0.1)
              : 'transparent',
          })}
        >
          <CopyIcon size={14} color={theme.colors.mutedForeground} />
          <Text style={{ fontSize: 12, color: theme.colors.mutedForeground, marginLeft: 4 }}>
            {copied ? 'Copied!' : 'Copy'}
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          backgroundColor: isDark
            ? setAlpha(theme.colors.background, 0.5)
            : theme.colors.card,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: setAlpha(theme.colors.border, 0.3),
          padding: 16,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            color: theme.colors.foreground,
            fontFamily: Platform.select({ web: 'monospace', default: undefined }),
            lineHeight: 20,
          }}
          selectable
        >
          {ddl || 'DDL not available for this table'}
        </Text>
      </View>
    </ScrollView>
  );
};
