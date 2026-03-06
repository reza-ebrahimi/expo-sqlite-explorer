// Main component
export { SqliteExplorer } from './screen';
export type { SqliteExplorerProps } from './screen';

// Database adapter
export { ExpoSqliteAdapter } from './database';
export type { ExpoSqliteAdapterOptions, SQLiteDatabase } from './database';

// Database interface (for custom adapters)
export type {
  IDatabaseAdapter,
  SqlParameter,
  DatabaseRow,
  TableInfo,
  ColumnInfo,
  IndexInfo,
  ForeignKeyInfo,
  ColumnStatistics,
  QueryResult,
  PaginationOptions,
} from './types';

// Theme
export { lightTheme, darkTheme, ThemeProvider, useTheme, setAlpha } from './theme';
export type { SqliteExplorerTheme, SqliteExplorerColors, ThemeProviderProps } from './theme';

// Explorer types
export type {
  TableRecord,
  PaginationState,
  SortDirection,
  ColumnWidths,
  SchemaColumn,
  SchemaIndex,
  SchemaForeignKey,
} from './types';

// Utilities
export {
  formatCellValue,
  formatFullValue,
  formatNumber,
  formatPercentage,
  copyToClipboard,
  copyRowAsJSON,
  exportToCSV,
  exportToJSON,
} from './utils';

// Icons
export * from './icons';
