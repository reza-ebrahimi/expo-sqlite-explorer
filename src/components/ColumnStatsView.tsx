import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, Platform } from 'react-native';

import { setAlpha } from '../theme/utils';
import type { SqliteExplorerTheme } from '../theme';
import type { ColumnStatistics, SqlParameter } from '../types/database';
import { StatsIcon } from '../icons';
import { EmptyState } from './EmptyState';

export interface ColumnStatsViewProps {
  tableName: string;
  statistics: ColumnStatistics[];
  isLoading: boolean;
  theme: SqliteExplorerTheme;
}

export const ColumnStatsView: React.FC<ColumnStatsViewProps> = ({
  statistics,
  isLoading,
  theme,
}) => {
  const isDark = theme.mode === 'dark';

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ fontSize: 14, color: theme.colors.mutedForeground, marginTop: 16 }}>
          Calculating statistics...
        </Text>
      </View>
    );
  }

  if (statistics.length === 0) {
    return (
      <EmptyState
        icon="document"
        title="No Statistics"
        message="Statistics could not be calculated for this table"
        theme={theme}
      />
    );
  }

  const formatValue = (value: SqlParameter): string => {
    if (value === null) return 'NULL';
    if (typeof value === 'string' && value.length > 30) {
      return value.substring(0, 30) + '...';
    }
    return String(value);
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <StatsIcon size={16} color={theme.colors.primary} style={{ marginRight: 8 }} />
        <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }}>
          Column Statistics
        </Text>
      </View>

      {statistics.map((stat) => (
        <View
          key={stat.columnName}
          style={{
            backgroundColor: theme.colors.card,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: setAlpha(theme.colors.border, 0.3),
            marginBottom: 12,
            overflow: 'hidden',
          }}
        >
          {/* Column Header */}
          <View
            style={{
              backgroundColor: isDark ? setAlpha(theme.colors.muted, 0.8) : theme.colors.muted,
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: setAlpha(theme.colors.border, 0.3),
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: theme.colors.foreground,
                fontFamily: Platform.select({ web: 'monospace', default: undefined }),
              }}
            >
              {stat.columnName}
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {/* Total Count */}
            <View style={{ width: '50%', padding: 12, borderRightWidth: 1, borderBottomWidth: 1, borderColor: setAlpha(theme.colors.border, 0.2) }}>
              <Text style={{ fontSize: 10, color: theme.colors.mutedForeground, marginBottom: 4 }}>
                Total Rows
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }}>
                {stat.totalCount.toLocaleString()}
              </Text>
            </View>

            {/* Distinct Count */}
            <View style={{ width: '50%', padding: 12, borderBottomWidth: 1, borderColor: setAlpha(theme.colors.border, 0.2) }}>
              <Text style={{ fontSize: 10, color: theme.colors.mutedForeground, marginBottom: 4 }}>
                Distinct Values
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }}>
                {stat.distinctCount.toLocaleString()}
              </Text>
            </View>

            {/* Null Count */}
            <View style={{ width: '50%', padding: 12, borderRightWidth: 1, borderBottomWidth: 1, borderColor: setAlpha(theme.colors.border, 0.2) }}>
              <Text style={{ fontSize: 10, color: theme.colors.mutedForeground, marginBottom: 4 }}>
                NULL Count
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }}>
                {stat.nullCount.toLocaleString()}
              </Text>
            </View>

            {/* Null Percentage */}
            <View style={{ width: '50%', padding: 12, borderBottomWidth: 1, borderColor: setAlpha(theme.colors.border, 0.2) }}>
              <Text style={{ fontSize: 10, color: theme.colors.mutedForeground, marginBottom: 4 }}>
                NULL %
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: stat.nullPercentage > 50 ? theme.colors.warning : theme.colors.foreground }}>
                {stat.nullPercentage.toFixed(1)}%
              </Text>
            </View>

            {/* Min Value */}
            <View style={{ width: '50%', padding: 12, borderRightWidth: 1, borderColor: setAlpha(theme.colors.border, 0.2) }}>
              <Text style={{ fontSize: 10, color: theme.colors.mutedForeground, marginBottom: 4 }}>
                Min Value
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: theme.colors.foreground,
                  fontFamily: Platform.select({ web: 'monospace', default: undefined }),
                }}
                numberOfLines={1}
              >
                {formatValue(stat.minValue)}
              </Text>
            </View>

            {/* Max Value */}
            <View style={{ width: '50%', padding: 12 }}>
              <Text style={{ fontSize: 10, color: theme.colors.mutedForeground, marginBottom: 4 }}>
                Max Value
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: theme.colors.foreground,
                  fontFamily: Platform.select({ web: 'monospace', default: undefined }),
                }}
                numberOfLines={1}
              >
                {formatValue(stat.maxValue)}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};
