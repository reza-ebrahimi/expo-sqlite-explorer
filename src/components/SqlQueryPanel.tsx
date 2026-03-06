import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Platform } from 'react-native';

import { setAlpha } from '../theme/utils';
import type { SqliteExplorerTheme } from '../theme';
import type { ColumnInfo } from '../types/database';
import type { TableRecord } from '../types/explorer';
import { PlayIcon } from '../icons';
import { DataGrid } from './DataGrid';
import { EmptyState } from './EmptyState';

export interface SqlQueryPanelProps {
  query: string;
  results: TableRecord[];
  columns: ColumnInfo[];
  error: string | null;
  isLoading: boolean;
  onQueryChange: (query: string) => void;
  onExecute: () => void;
  onClear: () => void;
  theme: SqliteExplorerTheme;
}

export const SqlQueryPanel: React.FC<SqlQueryPanelProps> = ({
  query,
  results,
  columns,
  error,
  isLoading,
  onQueryChange,
  onExecute,
  onClear,
  theme,
}) => {
  const isDark = theme.mode === 'dark';
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

  return (
    <View style={{ flex: 1 }}>
      {/* Query Editor */}
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: setAlpha(theme.colors.border, 0.3),
          backgroundColor: theme.colors.card,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground, flex: 1 }}>
            SQL Query
          </Text>
          <Pressable
            onPress={onClear}
            style={({ pressed }) => ({
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              marginRight: 8,
              backgroundColor: pressed
                ? setAlpha(theme.colors.foreground, 0.1)
                : 'transparent',
            })}
          >
            <Text style={{ fontSize: 13, color: theme.colors.mutedForeground }}>Clear</Text>
          </Pressable>
          <Pressable
            onPress={onExecute}
            disabled={isLoading}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 6,
              backgroundColor: pressed
                ? setAlpha(theme.colors.primary, 0.8)
                : theme.colors.primary,
              opacity: isLoading ? 0.6 : 1,
            })}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.colors.primaryForeground} />
            ) : (
              <>
                <PlayIcon size={14} color={theme.colors.primaryForeground} />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: theme.colors.primaryForeground,
                    marginLeft: 6,
                  }}
                >
                  Execute
                </Text>
              </>
            )}
          </Pressable>
        </View>

        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder="SELECT * FROM table_name WHERE ..."
          placeholderTextColor={theme.colors.mutedForeground}
          multiline
          numberOfLines={4}
          style={{
            backgroundColor: isDark
              ? setAlpha(theme.colors.background, 0.5)
              : theme.colors.background,
            borderWidth: 1,
            borderColor: setAlpha(theme.colors.border, 0.5),
            borderRadius: 8,
            padding: 12,
            fontSize: 13,
            color: theme.colors.foreground,
            fontFamily: Platform.select({ web: 'monospace', default: undefined }),
            minHeight: 100,
            textAlignVertical: 'top',
          }}
        />

        {error && (
          <View
            style={{
              marginTop: 12,
              padding: 12,
              backgroundColor: setAlpha(theme.colors.destructive, 0.1),
              borderRadius: 6,
            }}
          >
            <Text style={{ fontSize: 12, color: theme.colors.destructive }}>{error}</Text>
          </View>
        )}
      </View>

      {/* Results */}
      {results.length > 0 ? (
        <View style={{ flex: 1 }}>
          <View
            style={{
              padding: 12,
              borderBottomWidth: 1,
              borderBottomColor: setAlpha(theme.colors.border, 0.3),
            }}
          >
            <Text style={{ fontSize: 12, color: theme.colors.mutedForeground }}>
              {results.length} rows returned
            </Text>
          </View>
          <DataGrid
            columns={columns}
            records={results}
            selectedRowIndex={null}
            hoveredRowIndex={hoveredRowIndex}
            sortColumn={null}
            sortDirection={null}
            columnWidths={{}}
            onRowClick={() => {}}
            onRowDoubleClick={() => {}}
            onRowHover={setHoveredRowIndex}
            onSort={() => {}}
            onColumnResize={() => {}}
            onCopyRowAsJSON={() => {}}
            theme={theme}
          />
        </View>
      ) : (
        <EmptyState
          icon="code"
          title="No Results"
          message="Execute a query to see results"
          theme={theme}
        />
      )}
    </View>
  );
};
