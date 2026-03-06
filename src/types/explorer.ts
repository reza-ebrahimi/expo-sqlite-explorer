import type { SqlParameter } from './database';

/**
 * Extended pressable state for web hover support
 * React Native's PressableStateCallbackType doesn't include hovered on web
 */
export interface ExtendedPressableState {
  pressed: boolean;
  hovered?: boolean;
}

/**
 * Table record type for generic row data
 */
export type TableRecord = Record<string, SqlParameter>;

/**
 * Pagination state
 */
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc' | null;

/**
 * Column widths map
 */
export type ColumnWidths = Record<string, number>;

/**
 * Schema column info with additional display properties
 */
export interface SchemaColumn {
  cid: number;
  name: string;
  type: string;
  notnull: boolean;
  dflt_value: string | null;
  pk: boolean;
}

/**
 * Schema index info
 */
export interface SchemaIndex {
  name: string;
  unique: boolean;
  columns: string[];
}

/**
 * Schema foreign key info
 */
export interface SchemaForeignKey {
  id: number;
  table: string;
  from: string;
  to: string;
}
