import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';

import { setAlpha } from '../theme/utils';
import type { SqliteExplorerTheme } from '../theme';
import type { ColumnInfo, SqlParameter } from '../types/database';
import type { TableRecord, SortDirection, ColumnWidths, ExtendedPressableState } from '../types/explorer';
import { formatCellValue } from '../utils/formatters';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CopyIcon,
  CodeIcon,
  CalendarIcon,
} from '../icons';
import { NullBadge } from './NullBadge';

const DEFAULT_COLUMN_WIDTH = 150;
const ROW_HEIGHT = 36;
const HEADER_HEIGHT = 52;

export interface DataGridProps {
  columns: ColumnInfo[];
  records: TableRecord[];
  selectedRowIndex: number | null;
  hoveredRowIndex: number | null;
  sortColumn: string | null;
  sortDirection: SortDirection;
  columnWidths: ColumnWidths;
  onRowClick: (index: number) => void;
  onRowDoubleClick: (index: number) => void;
  onRowHover: (index: number | null) => void;
  onSort: (columnName: string) => void;
  onColumnResize: (columnName: string, width: number) => void;
  onCopyRowAsJSON: (rowIndex: number) => void;
  // Keyboard navigation callbacks
  onSelectNextRow?: () => void;
  onSelectPreviousRow?: () => void;
  onOpenSelectedRowDetails?: () => void;
  theme: SqliteExplorerTheme;
}

export const DataGrid: React.FC<DataGridProps> = ({
  columns,
  records,
  selectedRowIndex,
  hoveredRowIndex,
  sortColumn,
  sortDirection,
  columnWidths,
  onRowClick,
  onRowDoubleClick,
  onRowHover,
  onSort,
  onColumnResize,
  onCopyRowAsJSON,
  onSelectNextRow,
  onSelectPreviousRow,
  onOpenSelectedRowDetails,
  theme,
}) => {
  const isDark = theme.mode === 'dark';
  const [resizing, setResizing] = useState<{ column: string; startX: number; startWidth: number } | null>(null);

  const getColumnWidth = (columnName: string): number => {
    return columnWidths[columnName] ?? DEFAULT_COLUMN_WIDTH;
  };

  const totalWidth = columns.reduce((sum, col) => sum + getColumnWidth(col.name), 0) + 40;

  const getRowBackground = (index: number): string => {
    if (selectedRowIndex === index) {
      return setAlpha(theme.colors.primary, isDark ? 0.25 : 0.15);
    }
    if (hoveredRowIndex === index) {
      return setAlpha(theme.colors.primary, isDark ? 0.1 : 0.05);
    }
    if (index % 2 === 1) {
      return setAlpha(theme.colors.muted, isDark ? 0.3 : 0.5);
    }
    return 'transparent';
  };

  const getSortIcon = (columnName: string): React.ReactNode => {
    if (sortColumn !== columnName) return null;
    return sortDirection === 'asc'
      ? <ArrowUpIcon size={12} color={theme.colors.primary} />
      : <ArrowDownIcon size={12} color={theme.colors.primary} />;
  };

  useEffect(() => {
    if (Platform.OS !== 'web' || !resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.pageX - resizing.startX;
      const newWidth = Math.max(50, resizing.startWidth + deltaX);
      onColumnResize(resizing.column, newWidth);
    };

    const handleMouseUp = () => {
      setResizing(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing, onColumnResize]);

  // Ref for keyboard focus container
  const containerRef = useRef<View>(null);

  // Handle keyboard events when grid has focus
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (!onSelectNextRow || !onSelectPreviousRow || !onOpenSelectedRowDetails) return;

    const container = containerRef.current;
    if (!container) return;

    // Get the underlying DOM element
    const element = container as unknown as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          onSelectNextRow();
          break;
        case 'ArrowUp':
          e.preventDefault();
          onSelectPreviousRow();
          break;
        case 'Enter':
          e.preventDefault();
          onOpenSelectedRowDetails();
          break;
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [onSelectNextRow, onSelectPreviousRow, onOpenSelectedRowDetails]);

  // Focus the container when a row is clicked
  const handleRowClick = (index: number) => {
    onRowClick(index);
    // Focus container so keyboard events work
    if (Platform.OS === 'web' && containerRef.current) {
      (containerRef.current as unknown as HTMLElement).focus();
    }
  };

  return (
    <View
      ref={containerRef}
      style={[
        { flex: 1 },
        // Remove focus outline on web - we show selection via row background
        Platform.OS === 'web' && ({ outline: 'none' } as never),
      ]}
      // Make focusable on web
      tabIndex={Platform.OS === 'web' ? 0 : undefined}
    >
    <ScrollView horizontal style={{ flex: 1 }} showsHorizontalScrollIndicator>
      <View style={{ minWidth: totalWidth }}>
        {/* Header Row */}
        <View
          style={{
            flexDirection: 'row',
            height: HEADER_HEIGHT,
            backgroundColor: isDark ? setAlpha(theme.colors.muted, 0.8) : theme.colors.muted,
            borderBottomWidth: 2,
            borderBottomColor: setAlpha(theme.colors.border, isDark ? 0.4 : 0.6),
          }}
        >
          {columns.map((column, colIndex) => {
            const sortIcon = getSortIcon(column.name);
            const colWidth = getColumnWidth(column.name);
            return (
              <View
                key={column.cid}
                style={{
                  width: colWidth,
                  flexDirection: 'row',
                  position: 'relative',
                }}
              >
                <Pressable
                  onPress={() => onSort(column.name)}
                  style={(state) => {
                    const { hovered } = state as ExtendedPressableState;
                    return {
                      flex: 1,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      justifyContent: 'center',
                      backgroundColor: hovered
                        ? setAlpha(theme.colors.foreground, 0.05)
                        : 'transparent',
                      cursor: 'pointer',
                    };
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: sortIcon ? theme.colors.primary : theme.colors.foreground,
                        fontFamily: Platform.select({ web: 'monospace', default: undefined }),
                        flex: 1,
                      }}
                      numberOfLines={1}
                    >
                      {column.name}
                    </Text>
                    {sortIcon}
                  </View>
                  <Text
                    style={{ fontSize: 10, color: theme.colors.mutedForeground, marginTop: 2 }}
                    numberOfLines={1}
                  >
                    {column.type || 'ANY'}
                    {column.pk === 1 ? ' PK' : ''}
                  </Text>
                </Pressable>
                {/* Resize Handle - wider hit area for easier dragging */}
                {colIndex < columns.length - 1 && (
                  <View
                    style={[
                      {
                        position: 'absolute',
                        right: -10,
                        top: 0,
                        width: 20,
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                      Platform.OS === 'web' && { cursor: 'col-resize' as unknown as undefined },
                    ]}
                    onStartShouldSetResponder={() => true}
                    onResponderGrant={(e) => {
                      const { pageX } = e.nativeEvent;
                      setResizing({
                        column: column.name,
                        startX: pageX,
                        startWidth: getColumnWidth(column.name),
                      });
                    }}
                  >
                    <View
                      style={{
                        width: 4,
                        height: '100%',
                        backgroundColor: resizing?.column === column.name
                          ? setAlpha(theme.colors.primary, 0.5)
                          : setAlpha(theme.colors.border, isDark ? 0.3 : 0.5),
                      }}
                    />
                  </View>
                )}
              </View>
            );
          })}
          {/* Empty header for copy button column */}
          <View style={{ width: 40, height: HEADER_HEIGHT }} />
        </View>

        {/* Data Rows */}
        <ScrollView showsVerticalScrollIndicator>
          {records.map((record, rowIndex) => (
            <Pressable
              key={rowIndex}
              onPress={() => handleRowClick(rowIndex)}
              onLongPress={() => onRowDoubleClick(rowIndex)}
              onHoverIn={() => onRowHover(rowIndex)}
              onHoverOut={() => onRowHover(null)}
              // Prevent row from receiving browser focus - we manage selection via MobX state
              // This ensures Enter key events bubble to window listener instead of being captured
              tabIndex={-1}
              style={[
                {
                  flexDirection: 'row',
                  height: ROW_HEIGHT,
                  backgroundColor: getRowBackground(rowIndex),
                  borderBottomWidth: 1,
                  borderBottomColor: setAlpha(theme.colors.border, isDark ? 0.15 : 0.3),
                  cursor: 'pointer',
                },
                // Remove browser focus ring - selection is shown via background color (web only)
                Platform.OS === 'web' && ({ outline: 'none' } as never),
              ]}
            >
              {columns.map((column, colIndex) => {
                const value = record[column.name];
                const formatted = formatCellValue(value);
                const colWidth = getColumnWidth(column.name);
                return (
                  <View
                    key={column.cid}
                    style={{
                      width: colWidth,
                      height: ROW_HEIGHT,
                      paddingHorizontal: 12,
                      justifyContent: 'center',
                      borderRightWidth: colIndex < columns.length - 1 ? 1 : 0,
                      borderRightColor: setAlpha(theme.colors.border, isDark ? 0.1 : 0.2),
                    }}
                  >
                    {value === null ? (
                      <NullBadge theme={theme} />
                    ) : (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {formatted.isJSON && (
                          <CodeIcon
                            size={10}
                            color={theme.colors.primary}
                            style={{ marginRight: 4 }}
                          />
                        )}
                        {formatted.isDate && (
                          <CalendarIcon
                            size={10}
                            color={theme.colors.warning}
                            style={{ marginRight: 4 }}
                          />
                        )}
                        <Text
                          style={{
                            fontSize: 12,
                            color: formatted.isJSON
                              ? theme.colors.primary
                              : formatted.isDate
                                ? theme.colors.warning
                                : theme.colors.foreground,
                            fontFamily: Platform.select({ web: 'monospace', default: undefined }),
                            flex: 1,
                          }}
                          numberOfLines={1}
                        >
                          {formatted.text}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
              {/* Copy Row as JSON Button */}
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onCopyRowAsJSON(rowIndex);
                }}
                style={(state) => {
                  const { hovered } = state as ExtendedPressableState;
                  return {
                    width: 40,
                    height: ROW_HEIGHT,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: hovered
                      ? setAlpha(theme.colors.primary, 0.1)
                      : 'transparent',
                  };
                }}
              >
                <CopyIcon size={14} color={theme.colors.mutedForeground} />
              </Pressable>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
    </View>
  );
};
