import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, Platform } from 'react-native';

import { setAlpha } from '../theme/utils';
import type { SqliteExplorerTheme } from '../theme';
import type { SchemaColumn, SchemaIndex, SchemaForeignKey } from '../types/explorer';
import {
  KeyIcon,
  LinkIcon,
  ListIcon,
  CheckCircleIcon,
  CloseCircleIcon,
  ArrowForwardIcon,
} from '../icons';

export interface SchemaViewProps {
  tableName: string;
  columns: SchemaColumn[];
  indexes: SchemaIndex[];
  foreignKeys: SchemaForeignKey[];
  isLoading: boolean;
  theme: SqliteExplorerTheme;
}

export const SchemaView: React.FC<SchemaViewProps> = ({
  columns,
  indexes,
  foreignKeys,
  isLoading,
  theme,
}) => {
  const isDark = theme.mode === 'dark';

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ fontSize: 14, color: theme.colors.mutedForeground, marginTop: 16 }}>
          Loading schema...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      {/* Columns Section */}
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.foreground,
            marginBottom: 12,
          }}
        >
          Columns ({columns.length})
        </Text>
        <View
          style={{
            backgroundColor: theme.colors.card,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: setAlpha(theme.colors.border, 0.3),
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: isDark ? setAlpha(theme.colors.muted, 0.8) : theme.colors.muted,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: setAlpha(theme.colors.border, 0.3),
            }}
          >
            <Text style={{ flex: 2, fontSize: 11, fontWeight: '600', color: theme.colors.foreground }}>
              Name
            </Text>
            <Text style={{ flex: 1, fontSize: 11, fontWeight: '600', color: theme.colors.foreground }}>
              Type
            </Text>
            <Text style={{ width: 60, fontSize: 11, fontWeight: '600', color: theme.colors.foreground, textAlign: 'center' }}>
              Nullable
            </Text>
            <Text style={{ flex: 1, fontSize: 11, fontWeight: '600', color: theme.colors.foreground }}>
              Default
            </Text>
            <Text style={{ width: 40, fontSize: 11, fontWeight: '600', color: theme.colors.foreground, textAlign: 'center' }}>
              PK
            </Text>
          </View>
          {/* Rows */}
          {columns.map((col, idx) => (
            <View
              key={col.cid}
              style={{
                flexDirection: 'row',
                paddingHorizontal: 12,
                paddingVertical: 8,
                backgroundColor: idx % 2 === 1 ? setAlpha(theme.colors.muted, isDark ? 0.3 : 0.5) : 'transparent',
                borderBottomWidth: idx < columns.length - 1 ? 1 : 0,
                borderBottomColor: setAlpha(theme.colors.border, 0.2),
              }}
            >
              <Text
                style={{
                  flex: 2,
                  fontSize: 12,
                  color: theme.colors.foreground,
                  fontFamily: Platform.select({ web: 'monospace', default: undefined }),
                }}
              >
                {col.name}
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontSize: 12,
                  color: theme.colors.mutedForeground,
                  fontFamily: Platform.select({ web: 'monospace', default: undefined }),
                }}
              >
                {col.type || 'ANY'}
              </Text>
              <View style={{ width: 60, alignItems: 'center' }}>
                {col.notnull ? (
                  <CloseCircleIcon size={14} color={theme.colors.destructive} />
                ) : (
                  <CheckCircleIcon size={14} color={theme.colors.success} />
                )}
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 12,
                  color: theme.colors.mutedForeground,
                  fontFamily: Platform.select({ web: 'monospace', default: undefined }),
                }}
              >
                {col.dflt_value ?? '-'}
              </Text>
              <View style={{ width: 40, alignItems: 'center' }}>
                {col.pk && (
                  <KeyIcon size={14} color={theme.colors.warning} />
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Indexes Section */}
      {indexes.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: theme.colors.foreground,
              marginBottom: 12,
            }}
          >
            Indexes ({indexes.length})
          </Text>
          <View
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: setAlpha(theme.colors.border, 0.3),
              overflow: 'hidden',
            }}
          >
            {indexes.map((idx, i) => (
              <View
                key={idx.name}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: i % 2 === 1 ? setAlpha(theme.colors.muted, isDark ? 0.3 : 0.5) : 'transparent',
                  borderBottomWidth: i < indexes.length - 1 ? 1 : 0,
                  borderBottomColor: setAlpha(theme.colors.border, 0.2),
                }}
              >
                <ListIcon
                  size={14}
                  color={theme.colors.mutedForeground}
                  style={{ marginRight: 8 }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: theme.colors.foreground,
                      fontFamily: Platform.select({ web: 'monospace', default: undefined }),
                    }}
                  >
                    {idx.name}
                  </Text>
                  <Text style={{ fontSize: 11, color: theme.colors.mutedForeground, marginTop: 2 }}>
                    {idx.columns.join(', ')}
                  </Text>
                </View>
                {idx.unique && (
                  <View
                    style={{
                      backgroundColor: setAlpha(theme.colors.primary, 0.2),
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ fontSize: 10, color: theme.colors.primary, fontWeight: '600' }}>
                      UNIQUE
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Foreign Keys Section */}
      {foreignKeys.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: theme.colors.foreground,
              marginBottom: 12,
            }}
          >
            Foreign Keys ({foreignKeys.length})
          </Text>
          <View
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: setAlpha(theme.colors.border, 0.3),
              overflow: 'hidden',
            }}
          >
            {foreignKeys.map((fk, i) => (
              <View
                key={`${fk.from}-${fk.to}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: i % 2 === 1 ? setAlpha(theme.colors.muted, isDark ? 0.3 : 0.5) : 'transparent',
                  borderBottomWidth: i < foreignKeys.length - 1 ? 1 : 0,
                  borderBottomColor: setAlpha(theme.colors.border, 0.2),
                }}
              >
                <LinkIcon
                  size={14}
                  color={theme.colors.mutedForeground}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: theme.colors.foreground,
                    fontFamily: Platform.select({ web: 'monospace', default: undefined }),
                  }}
                >
                  {fk.from}
                </Text>
                <ArrowForwardIcon
                  size={12}
                  color={theme.colors.mutedForeground}
                  style={{ marginHorizontal: 8 }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: theme.colors.primary,
                    fontFamily: Platform.select({ web: 'monospace', default: undefined }),
                  }}
                >
                  {fk.table}.{fk.to}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* No indexes/FKs message */}
      {indexes.length === 0 && foreignKeys.length === 0 && (
        <View
          style={{
            padding: 20,
            alignItems: 'center',
            backgroundColor: theme.colors.card,
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 13, color: theme.colors.mutedForeground }}>
            No indexes or foreign keys defined for this table
          </Text>
        </View>
      )}
    </ScrollView>
  );
};
