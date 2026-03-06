import type { SQLiteDatabase } from 'expo-sqlite';
import type {
  IDatabaseAdapter,
  TableInfo,
  ColumnInfo,
  IndexInfo,
  ForeignKeyInfo,
  ColumnStatistics,
  QueryResult,
  DatabaseRow,
  SqlParameter,
  PaginationOptions,
} from '../types';

export interface ExpoSqliteAdapterOptions {
  /**
   * The expo-sqlite database instance
   */
  database: SQLiteDatabase;
}

/**
 * Database adapter implementation for expo-sqlite
 */
export class ExpoSqliteAdapter implements IDatabaseAdapter {
  private readonly db: SQLiteDatabase;

  constructor(options: ExpoSqliteAdapterOptions) {
    this.db = options.database;
  }

  isReady(): boolean {
    return this.db !== null && this.db !== undefined;
  }

  async getTables(): Promise<TableInfo[]> {
    const tables = await this.db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    );

    const result: TableInfo[] = [];
    for (const { name } of tables) {
      const count = await this.db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM "${name}"`
      );
      result.push({ name, rowCount: count?.count ?? 0 });
    }
    return result;
  }

  async getColumns(tableName: string): Promise<ColumnInfo[]> {
    const columns = await this.db.getAllAsync<{
      cid: number;
      name: string;
      type: string;
      notnull: number;
      dflt_value: string | null;
      pk: number;
    }>(`PRAGMA table_info("${tableName}")`);

    return columns.map((col: { cid: number; name: string; type: string; notnull: number; dflt_value: string | null; pk: number }) => ({
      cid: col.cid,
      name: col.name,
      type: col.type || 'ANY',
      notnull: col.notnull,
      dflt_value: col.dflt_value,
      pk: col.pk,
    }));
  }

  async getIndexes(tableName: string): Promise<IndexInfo[]> {
    const indexList = await this.db.getAllAsync<{
      name: string;
      unique: number;
    }>(`PRAGMA index_list("${tableName}")`);

    const result: IndexInfo[] = [];
    for (const idx of indexList) {
      // Skip auto-generated indexes
      if (idx.name.startsWith('sqlite_autoindex')) continue;

      const indexInfo = await this.db.getAllAsync<{ name: string }>(
        `PRAGMA index_info("${idx.name}")`
      );
      result.push({
        name: idx.name,
        unique: idx.unique === 1,
        columns: indexInfo.map((col: { name: string }) => col.name),
      });
    }
    return result;
  }

  async getForeignKeys(tableName: string): Promise<ForeignKeyInfo[]> {
    const fks = await this.db.getAllAsync<{
      id: number;
      table: string;
      from: string;
      to: string;
    }>(`PRAGMA foreign_key_list("${tableName}")`);

    return fks.map((fk: { id: number; table: string; from: string; to: string }) => ({
      id: fk.id,
      table: fk.table,
      from: fk.from,
      to: fk.to,
    }));
  }

  async getTableDDL(tableName: string): Promise<string> {
    const result = await this.db.getFirstAsync<{ sql: string }>(
      `SELECT sql FROM sqlite_master WHERE type='table' AND name = ?`,
      [tableName]
    );
    return result?.sql ?? '';
  }

  async getColumnStatistics(tableName: string): Promise<ColumnStatistics[]> {
    const columns = await this.getColumns(tableName);
    const stats: ColumnStatistics[] = [];

    for (const col of columns) {
      try {
        const result = await this.db.getFirstAsync<{
          total: number;
          null_count: number;
          distinct_count: number;
          min_val: SqlParameter;
          max_val: SqlParameter;
        }>(`
          SELECT
            COUNT(*) as total,
            SUM(CASE WHEN "${col.name}" IS NULL THEN 1 ELSE 0 END) as null_count,
            COUNT(DISTINCT "${col.name}") as distinct_count,
            MIN("${col.name}") as min_val,
            MAX("${col.name}") as max_val
          FROM "${tableName}"
        `);

        if (result) {
          stats.push({
            columnName: col.name,
            totalCount: result.total,
            nullCount: result.null_count,
            nullPercentage:
              result.total > 0
                ? Math.round((result.null_count / result.total) * 10000) / 100
                : 0,
            distinctCount: result.distinct_count,
            minValue: result.min_val,
            maxValue: result.max_val,
          });
        }
      } catch {
        // If stats fail for a column, add placeholder
        stats.push({
          columnName: col.name,
          totalCount: 0,
          nullCount: 0,
          nullPercentage: 0,
          distinctCount: 0,
          minValue: null,
          maxValue: null,
        });
      }
    }

    return stats;
  }

  async query<T extends DatabaseRow = DatabaseRow>(
    sql: string,
    params?: readonly SqlParameter[]
  ): Promise<QueryResult<T>> {
    const rows = await this.db.getAllAsync<T>(sql, params ? [...params] : []);
    return { rows, rowCount: rows.length };
  }

  async getRowCount(
    tableName: string,
    filterColumn?: string,
    filterValue?: string
  ): Promise<number> {
    let sql = `SELECT COUNT(*) as count FROM "${tableName}"`;
    const params: SqlParameter[] = [];

    if (filterColumn && filterValue) {
      sql += ` WHERE "${filterColumn}" LIKE ?`;
      params.push(`%${filterValue}%`);
    }

    const result = await this.db.getFirstAsync<{ count: number }>(sql, params);
    return result?.count ?? 0;
  }

  async getRows<T extends DatabaseRow = DatabaseRow>(
    tableName: string,
    options: PaginationOptions
  ): Promise<T[]> {
    let sql = `SELECT * FROM "${tableName}"`;
    const params: SqlParameter[] = [];

    if (options.filterColumn && options.filterValue) {
      sql += ` WHERE "${options.filterColumn}" LIKE ?`;
      params.push(`%${options.filterValue}%`);
    }

    if (options.orderBy && options.orderDirection) {
      sql += ` ORDER BY "${options.orderBy}" ${options.orderDirection.toUpperCase()}`;
    }

    sql += ` LIMIT ? OFFSET ?`;
    params.push(options.limit, options.offset);

    return await this.db.getAllAsync<T>(sql, params);
  }
}
