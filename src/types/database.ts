/**
 * SQL parameter types supported by the adapter
 */
export type SqlParameter = string | number | boolean | null;

/**
 * Generic row type for query results
 */
export type DatabaseRow = Record<string, SqlParameter>;

/**
 * Query result for SELECT operations
 */
export interface QueryResult<T extends DatabaseRow = DatabaseRow> {
  rows: T[];
  rowCount: number;
}

/**
 * Table information
 */
export interface TableInfo {
  name: string;
  rowCount: number;
}

/**
 * Column metadata from PRAGMA table_info
 */
export interface ColumnInfo {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
}

/**
 * Index metadata from PRAGMA index_list
 */
export interface IndexInfo {
  name: string;
  unique: boolean;
  columns: string[];
}

/**
 * Foreign key metadata from PRAGMA foreign_key_list
 */
export interface ForeignKeyInfo {
  id: number;
  table: string;
  from: string;
  to: string;
}

/**
 * Column statistics for schema view
 */
export interface ColumnStatistics {
  columnName: string;
  totalCount: number;
  nullCount: number;
  nullPercentage: number;
  distinctCount: number;
  minValue: SqlParameter;
  maxValue: SqlParameter;
}

/**
 * Pagination options for getRows
 */
export interface PaginationOptions {
  offset: number;
  limit: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  filterColumn?: string;
  filterValue?: string;
}

/**
 * Database adapter interface
 * Implementations must provide these methods for the explorer to function
 */
export interface IDatabaseAdapter {
  /**
   * Check if the database is ready for queries
   */
  isReady(): boolean;

  /**
   * Get all table names in the database
   */
  getTables(): Promise<TableInfo[]>;

  /**
   * Get column information for a table
   */
  getColumns(tableName: string): Promise<ColumnInfo[]>;

  /**
   * Get indexes for a table
   */
  getIndexes(tableName: string): Promise<IndexInfo[]>;

  /**
   * Get foreign keys for a table
   */
  getForeignKeys(tableName: string): Promise<ForeignKeyInfo[]>;

  /**
   * Get the CREATE TABLE DDL statement
   */
  getTableDDL(tableName: string): Promise<string>;

  /**
   * Get column statistics for a table
   */
  getColumnStatistics(tableName: string): Promise<ColumnStatistics[]>;

  /**
   * Execute a read-only query
   */
  query<T extends DatabaseRow = DatabaseRow>(
    sql: string,
    params?: readonly SqlParameter[]
  ): Promise<QueryResult<T>>;

  /**
   * Get row count for a table with optional filter
   */
  getRowCount(
    tableName: string,
    filterColumn?: string,
    filterValue?: string
  ): Promise<number>;

  /**
   * Get paginated rows from a table
   */
  getRows<T extends DatabaseRow = DatabaseRow>(
    tableName: string,
    options: PaginationOptions
  ): Promise<T[]>;
}
