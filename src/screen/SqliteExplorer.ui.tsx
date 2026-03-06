import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { useTheme } from '../theme/context';
import { setAlpha } from '../theme/utils';
import type { ColumnInfo, TableInfo, SqlParameter, ColumnStatistics } from '../types/database';
import type {
  TableRecord,
  PaginationState,
  SortDirection,
  SchemaColumn,
  SchemaIndex,
  SchemaForeignKey,
  ColumnWidths,
} from '../types/explorer';
import {
  RefreshIcon,
  CloseIcon,
  WarningIcon,
  DownloadIcon,
  CodeIcon,
} from '../icons';
import {
  TableListItem,
  EmptyState,
  PaginationControls,
  DataGrid,
  FilterBar,
  SchemaView,
  DDLView,
  ColumnStatsView,
  SqlQueryPanel,
  RowDetailsModal,
} from '../components';

// ========================================
// Props Interface
// ========================================

interface SqliteExplorerUIProps {
  // Database state
  tables: TableInfo[];
  isDatabaseLoading: boolean;

  // Table state
  selectedTable: string | null;
  columns: ColumnInfo[];
  records: TableRecord[];
  isTableLoading: boolean;
  pagination: PaginationState;
  selectedRowIndex: number | null;
  sortColumn: string | null;
  sortDirection: SortDirection;

  // Filter state
  filterColumn: string | null;
  filterValue: string;

  // View mode
  viewMode: 'data' | 'schema' | 'ddl' | 'stats';

  // Column widths
  columnWidths: ColumnWidths;

  // Schema state
  schemaColumns: SchemaColumn[];
  schemaIndexes: SchemaIndex[];
  schemaForeignKeys: SchemaForeignKey[];
  tableDDL: string;
  columnStatistics: ColumnStatistics[];
  isSchemaLoading: boolean;

  // Row details
  detailRow: TableRecord | null;
  detailRowIndex: number | null;

  // SQL Query state
  isSqlMode: boolean;
  sqlQuery: string;
  sqlResults: TableRecord[];
  sqlColumns: ColumnInfo[];
  sqlError: string | null;
  isSqlLoading: boolean;

  // Derived state
  hasRecords: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;

  // Error
  error: string | null;

  // Table actions
  onSelectTable: (tableName: string) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onClearError: () => void;
  onRefresh: () => void;
  onToggleSort: (columnName: string) => void;

  // Filter actions
  onSetFilterColumn: (column: string | null) => void;
  onSetFilterValue: (value: string) => void;
  onClearFilter: () => void;

  // View mode actions
  onSetViewMode: (mode: 'data' | 'schema' | 'ddl' | 'stats') => void;

  // Export actions
  onExportCSV: () => void;
  onExportJSON: () => void;

  // Column resize actions
  onSetColumnWidth: (columnName: string, width: number) => void;
  onResetColumnWidths: () => void;

  // Copy actions
  onCopyRowAsJSON: (rowIndex: number) => string | null;

  // Row actions
  onSelectRow: (index: number) => void;
  onSelectNextRow: () => void;
  onSelectPreviousRow: () => void;
  onOpenRowDetails: (index: number) => void;
  onOpenSelectedRowDetails: () => void;
  onCloseRowDetails: () => void;

  // SQL actions
  onToggleSqlMode: () => void;
  onSetSqlQuery: (query: string) => void;
  onExecuteQuery: () => void;
  onClearQueryResults: () => void;
}

// ========================================
// Main Component
// ========================================

export const SqliteExplorerUI: React.FC<SqliteExplorerUIProps> = ({
  tables,
  isDatabaseLoading,
  selectedTable,
  columns,
  records,
  isTableLoading,
  pagination,
  selectedRowIndex,
  sortColumn,
  sortDirection,
  filterColumn,
  filterValue,
  viewMode,
  columnWidths,
  schemaColumns,
  schemaIndexes,
  schemaForeignKeys,
  tableDDL,
  columnStatistics,
  isSchemaLoading,
  detailRow,
  detailRowIndex,
  isSqlMode,
  sqlQuery,
  sqlResults,
  sqlColumns,
  sqlError,
  isSqlLoading,
  hasRecords,
  hasPreviousPage,
  hasNextPage,
  error,
  onSelectTable,
  onNextPage,
  onPreviousPage,
  onClearError,
  onRefresh,
  onToggleSort,
  onSetFilterColumn,
  onSetFilterValue,
  onClearFilter,
  onSetViewMode,
  onExportCSV,
  onExportJSON,
  onSetColumnWidth,
  onCopyRowAsJSON,
  onSelectRow,
  onSelectNextRow,
  onSelectPreviousRow,
  onOpenRowDetails,
  onOpenSelectedRowDetails,
  onCloseRowDetails,
  onToggleSqlMode,
  onSetSqlQuery,
  onExecuteQuery,
  onClearQueryResults,
}) => {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [copiedCell, setCopiedCell] = useState(false);

  // Stable keyboard handler - uses onOpenSelectedRowDetails which reads current state from ViewModel
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (isSqlMode) return;
    if (!selectedTable || !hasRecords) return;

    // Blur any focused row to prevent browser's Enter->click behavior
    if (Platform.OS === 'web') {
      (document.activeElement as HTMLElement)?.blur();
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        onSelectNextRow();
        break;
      case 'ArrowUp':
        event.preventDefault();
        onSelectPreviousRow();
        break;
      case 'Enter':
        event.preventDefault();
        onOpenSelectedRowDetails();
        break;
    }
  }, [isSqlMode, selectedTable, hasRecords, onSelectNextRow, onSelectPreviousRow, onOpenSelectedRowDetails]);

  // Keyboard navigation
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleCopyRowAsJSON = async (rowIndex: number) => {
    const json = onCopyRowAsJSON(rowIndex);
    if (json) {
      await Clipboard.setStringAsync(json);
      setCopiedCell(true);
      setTimeout(() => setCopiedCell(false), 1500);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Error Banner */}
      {error && (
        <Pressable
          onPress={onClearError}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: setAlpha(theme.colors.destructive, 0.1),
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: setAlpha(theme.colors.destructive, 0.3),
          }}
        >
          <WarningIcon size={20} color={theme.colors.destructive} style={{ marginRight: 12 }} />
          <Text style={{ flex: 1, fontSize: 13, color: theme.colors.destructive }}>{error}</Text>
          <CloseIcon size={20} color={theme.colors.destructive} />
        </Pressable>
      )}

      {/* Copy Feedback */}
      {copiedCell && (
        <View
          style={{
            position: 'absolute',
            top: 60,
            right: 20,
            backgroundColor: theme.colors.success,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            zIndex: 100,
          }}
        >
          <Text style={{ fontSize: 12, color: theme.colors.successForeground }}>Copied to clipboard!</Text>
        </View>
      )}

      {/* Main Layout */}
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Sidebar */}
        <View
          style={{
            width: 220,
            borderRightWidth: 1,
            borderRightColor: setAlpha(theme.colors.border, isDark ? 0.3 : 0.5),
            backgroundColor: isDark ? setAlpha(theme.colors.card, 0.5) : theme.colors.card,
          }}
        >
          {/* Sidebar Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: setAlpha(theme.colors.border, isDark ? 0.3 : 0.5),
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: theme.colors.mutedForeground,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Tables
              </Text>
              <Text style={{ fontSize: 12, color: theme.colors.mutedForeground, marginTop: 2 }}>
                {tables.length} tables
              </Text>
            </View>
            <Pressable
              onPress={onRefresh}
              style={({ pressed }) => ({
                padding: 6,
                borderRadius: 6,
                backgroundColor: pressed ? setAlpha(theme.colors.foreground, 0.1) : 'transparent',
              })}
            >
              <RefreshIcon size={16} color={theme.colors.foreground} />
            </Pressable>
          </View>

          {/* Table List */}
          {isDatabaseLoading ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : (
            <ScrollView>
              {tables.map((table) => (
                <TableListItem
                  key={table.name}
                  table={table}
                  isSelected={selectedTable === table.name}
                  onPress={() => onSelectTable(table.name)}
                  theme={theme}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Main Content */}
        <View style={{ flex: 1 }}>
          {/* Mode Toggle + Export Buttons */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: setAlpha(theme.colors.border, 0.3),
              backgroundColor: theme.colors.card,
            }}
          >
            {/* Left: Mode tabs */}
            <View style={{ flexDirection: 'row' }}>
              <Pressable
                onPress={() => isSqlMode && onToggleSqlMode()}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 6,
                  backgroundColor: !isSqlMode
                    ? setAlpha(theme.colors.primary, isDark ? 0.2 : 0.1)
                    : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: !isSqlMode ? '600' : '400',
                    color: !isSqlMode ? theme.colors.primary : theme.colors.foreground,
                  }}
                >
                  Table Browser
                </Text>
              </Pressable>
              <Pressable
                onPress={() => !isSqlMode && onToggleSqlMode()}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 6,
                  marginLeft: 8,
                  backgroundColor: isSqlMode
                    ? setAlpha(theme.colors.primary, isDark ? 0.2 : 0.1)
                    : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: isSqlMode ? '600' : '400',
                    color: isSqlMode ? theme.colors.primary : theme.colors.foreground,
                  }}
                >
                  SQL Query
                </Text>
              </Pressable>
            </View>

            {/* Right: Export buttons */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable
                onPress={onExportCSV}
                disabled={!hasRecords && sqlResults.length === 0}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 6,
                  backgroundColor: pressed
                    ? setAlpha(theme.colors.foreground, 0.1)
                    : 'transparent',
                  opacity: !hasRecords && sqlResults.length === 0 ? 0.4 : 1,
                })}
              >
                <DownloadIcon size={14} color={theme.colors.foreground} />
                <Text style={{ fontSize: 12, color: theme.colors.foreground, marginLeft: 4 }}>
                  CSV
                </Text>
              </Pressable>
              <Pressable
                onPress={onExportJSON}
                disabled={!hasRecords && sqlResults.length === 0}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 6,
                  backgroundColor: pressed
                    ? setAlpha(theme.colors.foreground, 0.1)
                    : 'transparent',
                  opacity: !hasRecords && sqlResults.length === 0 ? 0.4 : 1,
                })}
              >
                <CodeIcon size={14} color={theme.colors.foreground} />
                <Text style={{ fontSize: 12, color: theme.colors.foreground, marginLeft: 4 }}>
                  JSON
                </Text>
              </Pressable>
            </View>
          </View>

          {isSqlMode ? (
            <SqlQueryPanel
              query={sqlQuery}
              results={sqlResults}
              columns={sqlColumns}
              error={sqlError}
              isLoading={isSqlLoading}
              onQueryChange={onSetSqlQuery}
              onExecute={onExecuteQuery}
              onClear={onClearQueryResults}
              theme={theme}
            />
          ) : !selectedTable ? (
            <EmptyState
              icon="server"
              title="Select a Table"
              message="Choose a table from the sidebar to view its records"
              theme={theme}
            />
          ) : isTableLoading ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={{ fontSize: 14, color: theme.colors.mutedForeground, marginTop: 16 }}>
                Loading {selectedTable}...
              </Text>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {/* Table Header with View Mode Toggle */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: setAlpha(theme.colors.border, isDark ? 0.3 : 0.5),
                  backgroundColor: theme.colors.card,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: theme.colors.foreground,
                      fontFamily: Platform.select({ web: 'monospace', default: undefined }),
                    }}
                  >
                    {selectedTable}
                  </Text>
                  <Text style={{ fontSize: 12, color: theme.colors.mutedForeground, marginTop: 2 }}>
                    {pagination.totalRecords.toLocaleString()} rows • {columns.length} columns
                  </Text>
                </View>
                {/* View Mode Toggle */}
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  {(['data', 'schema', 'ddl', 'stats'] as const).map((mode) => (
                    <Pressable
                      key={mode}
                      onPress={() => onSetViewMode(mode)}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 6,
                        backgroundColor: viewMode === mode
                          ? setAlpha(theme.colors.primary, isDark ? 0.2 : 0.1)
                          : 'transparent',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: viewMode === mode ? '600' : '400',
                          color: viewMode === mode ? theme.colors.primary : theme.colors.foreground,
                          textTransform: 'capitalize',
                        }}
                      >
                        {mode === 'ddl' ? 'DDL' : mode}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {viewMode === 'schema' ? (
                <SchemaView
                  tableName={selectedTable}
                  columns={schemaColumns}
                  indexes={schemaIndexes}
                  foreignKeys={schemaForeignKeys}
                  isLoading={isSchemaLoading}
                  theme={theme}
                />
              ) : viewMode === 'ddl' ? (
                <DDLView
                  tableName={selectedTable}
                  ddl={tableDDL}
                  isLoading={isSchemaLoading}
                  theme={theme}
                />
              ) : viewMode === 'stats' ? (
                <ColumnStatsView
                  tableName={selectedTable}
                  statistics={columnStatistics}
                  isLoading={isSchemaLoading}
                  theme={theme}
                />
              ) : (
                <>
                  {/* Filter Bar */}
                  <FilterBar
                    columns={columns}
                    filterColumn={filterColumn}
                    filterValue={filterValue}
                    onSetFilterColumn={onSetFilterColumn}
                    onSetFilterValue={onSetFilterValue}
                    onClearFilter={onClearFilter}
                    theme={theme}
                  />

                  {/* Keyboard hints */}
                  <View
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 6,
                      borderBottomWidth: 1,
                      borderBottomColor: setAlpha(theme.colors.border, isDark ? 0.2 : 0.3),
                      backgroundColor: setAlpha(theme.colors.muted, isDark ? 0.3 : 0.5),
                    }}
                  >
                    <Text style={{ fontSize: 11, color: theme.colors.mutedForeground }}>
                      ↑↓ navigate • Enter open details • Long press row for details
                    </Text>
                  </View>

                  {/* Data Grid */}
                  {!hasRecords ? (
                    <EmptyState
                      icon="document"
                      title="No Records"
                      message={filterValue ? 'No records match your filter' : 'This table is empty'}
                      theme={theme}
                    />
                  ) : (
                    <DataGrid
                      columns={columns}
                      records={records}
                      selectedRowIndex={selectedRowIndex}
                      hoveredRowIndex={hoveredRowIndex}
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                      columnWidths={columnWidths}
                      onRowClick={onSelectRow}
                      onRowDoubleClick={onOpenRowDetails}
                      onRowHover={setHoveredRowIndex}
                      onSort={onToggleSort}
                      onColumnResize={onSetColumnWidth}
                      onCopyRowAsJSON={handleCopyRowAsJSON}
                      onSelectNextRow={onSelectNextRow}
                      onSelectPreviousRow={onSelectPreviousRow}
                      onOpenSelectedRowDetails={onOpenSelectedRowDetails}
                      theme={theme}
                    />
                  )}

                  {/* Pagination */}
                  {hasRecords && (
                    <PaginationControls
                      pagination={pagination}
                      hasPreviousPage={hasPreviousPage}
                      hasNextPage={hasNextPage}
                      onPreviousPage={onPreviousPage}
                      onNextPage={onNextPage}
                      theme={theme}
                    />
                  )}
                </>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Row Details Modal */}
      <RowDetailsModal
        visible={detailRowIndex !== null}
        columns={columns}
        record={detailRow}
        tableName={selectedTable}
        onClose={onCloseRowDetails}
        theme={theme}
      />
    </View>
  );
};
