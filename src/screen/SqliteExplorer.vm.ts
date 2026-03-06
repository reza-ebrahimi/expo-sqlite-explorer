import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import type {
  IDatabaseAdapter,
  SqlParameter,
  ColumnInfo,
  TableInfo,
  ColumnStatistics,
} from '../types/database';
import type {
  TableRecord,
  PaginationState,
  SortDirection,
  SchemaColumn,
  SchemaIndex,
  SchemaForeignKey,
  ColumnWidths,
} from '../types/explorer';

/**
 * Optional logger interface for debugging
 */
export interface SqliteExplorerLogger {
  info(method: string, message: string, data?: unknown): void;
  warn(method: string, message: string, data?: unknown): void;
  error(method: string, message: string, error?: unknown): void;
}

/**
 * ViewModel options
 */
export interface SqliteExplorerViewModelOptions {
  adapter: IDatabaseAdapter;
  logger?: SqliteExplorerLogger;
  pageSize?: number;
}

/**
 * Database state
 */
interface DatabaseState {
  tables: TableInfo[];
  isLoading: boolean;
}

/**
 * Selected table state
 */
interface TableState {
  selected: string | null;
  columns: ColumnInfo[];
  records: TableRecord[];
  isLoading: boolean;
  pagination: PaginationState;
  selectedRowIndex: number | null;
  detailRowIndex: number | null;
  sortColumn: string | null;
  sortDirection: SortDirection;
  filterColumn: string | null;
  filterValue: string;
  viewMode: 'data' | 'schema' | 'ddl' | 'stats';
  columnWidths: ColumnWidths;
}

/**
 * Schema state
 */
interface SchemaState {
  columns: SchemaColumn[];
  indexes: SchemaIndex[];
  foreignKeys: SchemaForeignKey[];
  ddl: string;
  statistics: ColumnStatistics[];
  isLoading: boolean;
}

/**
 * SQL Query state
 */
interface SqlQueryState {
  isActive: boolean;
  query: string;
  results: TableRecord[];
  columns: ColumnInfo[];
  error: string | null;
  isLoading: boolean;
}

/**
 * ViewModel state interface
 */
interface SqliteExplorerViewModelState {
  database: DatabaseState;
  table: TableState;
  schema: SchemaState;
  sqlQuery: SqlQueryState;
  error: string | null;
}

const DEFAULT_PAGE_SIZE = 50;

/**
 * Create initial state
 */
function createInitialState(pageSize: number): SqliteExplorerViewModelState {
  return {
    database: {
      tables: [],
      isLoading: false,
    },
    table: {
      selected: null,
      columns: [],
      records: [],
      isLoading: false,
      pagination: {
        currentPage: 1,
        pageSize,
        totalRecords: 0,
        totalPages: 0,
      },
      selectedRowIndex: null,
      detailRowIndex: null,
      sortColumn: null,
      sortDirection: null,
      filterColumn: null,
      filterValue: '',
      viewMode: 'data',
      columnWidths: {},
    },
    schema: {
      columns: [],
      indexes: [],
      foreignKeys: [],
      ddl: '',
      statistics: [],
      isLoading: false,
    },
    sqlQuery: {
      isActive: false,
      query: '',
      results: [],
      columns: [],
      error: null,
      isLoading: false,
    },
    error: null,
  };
}

/**
 * Extract error message from unknown error
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error occurred';
}

/**
 * SqliteExplorer ViewModel
 *
 * Development-only ViewModel for browsing SQLite database tables.
 * Provides read-only access to all database tables with pagination,
 * sorting, row details, DDL view, column statistics, and custom SQL query support.
 */
export class SqliteExplorerViewModel {
  private readonly adapter: IDatabaseAdapter;
  private readonly logger?: SqliteExplorerLogger;
  private readonly pageSize: number;

  @observable private state: SqliteExplorerViewModelState;

  constructor(options: SqliteExplorerViewModelOptions) {
    this.adapter = options.adapter;
    this.logger = options.logger;
    this.pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
    this.state = createInitialState(this.pageSize);
    makeObservable(this);
  }

  // ========================================
  // Lifecycle Methods
  // ========================================

  @action
  async initialize(): Promise<void> {
    this.logger?.info('initialize', 'Initializing SQLite Explorer');

    try {
      if (!this.adapter.isReady()) {
        runInAction(() => {
          this.state.error = 'Database is not initialized';
        });
        return;
      }

      await this.loadTables();
    } catch (error) {
      const message = getErrorMessage(error);
      this.logger?.error('initialize', 'Failed to initialize', error);
      runInAction(() => {
        this.state.error = message;
      });
    }
  }

  @action
  dispose(): void {
    this.reset();
    this.logger?.info('dispose', 'SqliteExplorerViewModel disposed');
  }

  @action
  reset(): void {
    this.state = createInitialState(this.pageSize);
    this.logger?.info('reset', 'State reset');
  }

  // ========================================
  // Database Computed Properties
  // ========================================

  @computed
  get tables(): TableInfo[] {
    return this.state.database.tables;
  }

  @computed
  get isDatabaseLoading(): boolean {
    return this.state.database.isLoading;
  }

  // ========================================
  // Table Computed Properties
  // ========================================

  @computed
  get selectedTable(): string | null {
    return this.state.table.selected;
  }

  @computed
  get columns(): ColumnInfo[] {
    return this.state.table.columns;
  }

  @computed
  get records(): TableRecord[] {
    return this.state.table.records;
  }

  @computed
  get isTableLoading(): boolean {
    return this.state.table.isLoading;
  }

  @computed
  get pagination(): PaginationState {
    return this.state.table.pagination;
  }

  @computed
  get selectedRowIndex(): number | null {
    return this.state.table.selectedRowIndex;
  }

  @computed
  get detailRowIndex(): number | null {
    return this.state.table.detailRowIndex;
  }

  @computed
  get detailRow(): TableRecord | null {
    const idx = this.state.table.detailRowIndex;
    if (idx === null || idx < 0 || idx >= this.state.table.records.length) {
      return null;
    }
    return this.state.table.records[idx];
  }

  @computed
  get sortColumn(): string | null {
    return this.state.table.sortColumn;
  }

  @computed
  get sortDirection(): SortDirection {
    return this.state.table.sortDirection;
  }

  @computed
  get filterColumn(): string | null {
    return this.state.table.filterColumn;
  }

  @computed
  get filterValue(): string {
    return this.state.table.filterValue;
  }

  @computed
  get viewMode(): 'data' | 'schema' | 'ddl' | 'stats' {
    return this.state.table.viewMode;
  }

  @computed
  get columnWidths(): ColumnWidths {
    return this.state.table.columnWidths;
  }

  // ========================================
  // Schema Computed Properties
  // ========================================

  @computed
  get schemaColumns(): SchemaColumn[] {
    return this.state.schema.columns;
  }

  @computed
  get schemaIndexes(): SchemaIndex[] {
    return this.state.schema.indexes;
  }

  @computed
  get schemaForeignKeys(): SchemaForeignKey[] {
    return this.state.schema.foreignKeys;
  }

  @computed
  get tableDDL(): string {
    return this.state.schema.ddl;
  }

  @computed
  get columnStatistics(): ColumnStatistics[] {
    return this.state.schema.statistics;
  }

  @computed
  get isSchemaLoading(): boolean {
    return this.state.schema.isLoading;
  }

  // ========================================
  // SQL Query Computed Properties
  // ========================================

  @computed
  get isSqlMode(): boolean {
    return this.state.sqlQuery.isActive;
  }

  @computed
  get sqlQuery(): string {
    return this.state.sqlQuery.query;
  }

  @computed
  get sqlResults(): TableRecord[] {
    return this.state.sqlQuery.results;
  }

  @computed
  get sqlColumns(): ColumnInfo[] {
    return this.state.sqlQuery.columns;
  }

  @computed
  get sqlError(): string | null {
    return this.state.sqlQuery.error;
  }

  @computed
  get isSqlLoading(): boolean {
    return this.state.sqlQuery.isLoading;
  }

  // ========================================
  // Derived Computed Properties
  // ========================================

  @computed
  get hasRecords(): boolean {
    return this.state.table.records.length > 0;
  }

  @computed
  get hasPreviousPage(): boolean {
    return this.state.table.pagination.currentPage > 1;
  }

  @computed
  get hasNextPage(): boolean {
    const { currentPage, totalPages } = this.state.table.pagination;
    return currentPage < totalPages;
  }

  @computed
  get error(): string | null {
    return this.state.error;
  }

  // ========================================
  // Database Actions
  // ========================================

  @action
  async loadTables(): Promise<void> {
    runInAction(() => {
      this.state.database.isLoading = true;
      this.state.error = null;
    });

    try {
      const tables = await this.adapter.getTables();

      runInAction(() => {
        this.state.database.tables = tables;
        this.state.database.isLoading = false;
      });

      this.logger?.info('loadTables', `Loaded ${tables.length} tables`);
    } catch (error) {
      const message = getErrorMessage(error);
      this.logger?.error('loadTables', 'Failed to load tables', error);
      runInAction(() => {
        this.state.database.isLoading = false;
        this.state.error = `Failed to load tables: ${message}`;
      });
    }
  }

  @action
  async refreshData(): Promise<void> {
    this.logger?.info('refreshData', 'Refreshing data');
    await this.loadTables();

    if (this.state.table.selected) {
      await this.loadTableData();
    }
  }

  // ========================================
  // Table Actions
  // ========================================

  @action
  async selectTable(tableName: string): Promise<void> {
    this.logger?.info('selectTable', `Selecting table: ${tableName}`);

    runInAction(() => {
      this.state.table.selected = tableName;
      this.state.table.columns = [];
      this.state.table.records = [];
      this.state.table.isLoading = true;
      this.state.table.pagination = {
        currentPage: 1,
        pageSize: this.pageSize,
        totalRecords: 0,
        totalPages: 0,
      };
      this.state.table.selectedRowIndex = null;
      this.state.table.detailRowIndex = null;
      this.state.table.sortColumn = null;
      this.state.table.sortDirection = null;
      this.state.table.filterColumn = null;
      this.state.table.filterValue = '';
      this.state.table.viewMode = 'data';
      // Reset schema
      this.state.schema.columns = [];
      this.state.schema.indexes = [];
      this.state.schema.foreignKeys = [];
      this.state.schema.ddl = '';
      this.state.schema.statistics = [];
      this.state.error = null;
    });

    await this.loadTableData();
  }

  @action
  async toggleSort(columnName: string): Promise<void> {
    const { sortColumn, sortDirection } = this.state.table;

    let newDirection: SortDirection;
    if (sortColumn !== columnName) {
      newDirection = 'asc';
    } else if (sortDirection === 'asc') {
      newDirection = 'desc';
    } else if (sortDirection === 'desc') {
      newDirection = null;
    } else {
      newDirection = 'asc';
    }

    runInAction(() => {
      this.state.table.sortColumn = newDirection ? columnName : null;
      this.state.table.sortDirection = newDirection;
      this.state.table.pagination.currentPage = 1;
    });

    await this.loadTableData();
  }

  @action
  async goToPage(page: number): Promise<void> {
    const { totalPages } = this.state.table.pagination;

    if (page < 1 || page > totalPages) {
      this.logger?.warn('goToPage', `Invalid page number: ${page}`);
      return;
    }

    runInAction(() => {
      this.state.table.pagination.currentPage = page;
    });

    await this.loadTableData();
  }

  @action
  async nextPage(): Promise<void> {
    if (this.hasNextPage) {
      await this.goToPage(this.state.table.pagination.currentPage + 1);
    }
  }

  @action
  async previousPage(): Promise<void> {
    if (this.hasPreviousPage) {
      await this.goToPage(this.state.table.pagination.currentPage - 1);
    }
  }

  // ========================================
  // Row Selection Actions
  // ========================================

  @action
  selectRow(index: number): void {
    if (index >= 0 && index < this.state.table.records.length) {
      this.state.table.selectedRowIndex = index;
    }
  }

  @action
  selectNextRow(): void {
    const { selectedRowIndex } = this.state.table;
    const maxIndex = this.state.table.records.length - 1;

    if (selectedRowIndex === null) {
      this.state.table.selectedRowIndex = 0;
    } else if (selectedRowIndex < maxIndex) {
      this.state.table.selectedRowIndex = selectedRowIndex + 1;
    }
  }

  @action
  selectPreviousRow(): void {
    const { selectedRowIndex } = this.state.table;

    if (selectedRowIndex === null) {
      this.state.table.selectedRowIndex = 0;
    } else if (selectedRowIndex > 0) {
      this.state.table.selectedRowIndex = selectedRowIndex - 1;
    }
  }

  @action
  clearRowSelection(): void {
    this.state.table.selectedRowIndex = null;
  }

  // ========================================
  // Row Details Actions
  // ========================================

  @action
  openRowDetails(index: number): void {
    if (index >= 0 && index < this.state.table.records.length) {
      this.state.table.detailRowIndex = index;
    }
  }

  @action
  openSelectedRowDetails(): void {
    const { selectedRowIndex } = this.state.table;
    if (selectedRowIndex !== null) {
      this.openRowDetails(selectedRowIndex);
    }
  }

  @action
  closeRowDetails(): void {
    this.state.table.detailRowIndex = null;
  }

  // ========================================
  // SQL Query Actions
  // ========================================

  @action
  toggleSqlMode(): void {
    this.state.sqlQuery.isActive = !this.state.sqlQuery.isActive;
    if (!this.state.sqlQuery.isActive) {
      this.state.sqlQuery.error = null;
    }
  }

  @action
  setSqlQuery(query: string): void {
    this.state.sqlQuery.query = query;
  }

  @action
  async executeQuery(): Promise<void> {
    const query = this.state.sqlQuery.query.trim();
    if (!query) {
      runInAction(() => {
        this.state.sqlQuery.error = 'Please enter a SQL query';
      });
      return;
    }

    // Security: Only allow SELECT queries
    if (!query.toLowerCase().startsWith('select')) {
      runInAction(() => {
        this.state.sqlQuery.error = 'Only SELECT queries are allowed';
      });
      return;
    }

    this.logger?.info('executeQuery', 'Executing SQL query');

    runInAction(() => {
      this.state.sqlQuery.isLoading = true;
      this.state.sqlQuery.error = null;
      this.state.sqlQuery.results = [];
      this.state.sqlQuery.columns = [];
    });

    try {
      const result = await this.adapter.query<TableRecord>(query);
      const rows = result.rows;

      // Extract columns from first result
      const columns: ColumnInfo[] = rows.length > 0
        ? Object.keys(rows[0]).map((name, idx) => ({
            cid: idx,
            name,
            type: 'ANY',
            notnull: 0,
            dflt_value: null,
            pk: 0,
          }))
        : [];

      runInAction(() => {
        this.state.sqlQuery.results = rows;
        this.state.sqlQuery.columns = columns;
        this.state.sqlQuery.isLoading = false;
      });

      this.logger?.info('executeQuery', `Query returned ${rows.length} rows`);
    } catch (error) {
      const message = getErrorMessage(error);
      this.logger?.error('executeQuery', 'Query failed', error);
      runInAction(() => {
        this.state.sqlQuery.isLoading = false;
        this.state.sqlQuery.error = message;
      });
    }
  }

  @action
  clearQueryResults(): void {
    this.state.sqlQuery.results = [];
    this.state.sqlQuery.columns = [];
    this.state.sqlQuery.error = null;
  }

  // ========================================
  // Filter Actions
  // ========================================

  @action
  setFilterColumn(column: string | null): void {
    this.state.table.filterColumn = column;
  }

  @action
  async setFilterValue(value: string): Promise<void> {
    runInAction(() => {
      this.state.table.filterValue = value;
      this.state.table.pagination.currentPage = 1;
    });
    await this.loadTableData();
  }

  @action
  async clearFilter(): Promise<void> {
    runInAction(() => {
      this.state.table.filterColumn = null;
      this.state.table.filterValue = '';
      this.state.table.pagination.currentPage = 1;
    });
    await this.loadTableData();
  }

  // ========================================
  // View Mode Actions
  // ========================================

  @action
  async setViewMode(mode: 'data' | 'schema' | 'ddl' | 'stats'): Promise<void> {
    if (mode === this.state.table.viewMode) return;

    runInAction(() => {
      this.state.table.viewMode = mode;
    });

    if (this.state.table.selected) {
      if (mode === 'schema') {
        await this.loadSchema();
      } else if (mode === 'ddl') {
        await this.loadDDL();
      } else if (mode === 'stats') {
        await this.loadColumnStatistics();
      }
    }
  }

  // ========================================
  // Column Resize Actions
  // ========================================

  @action
  setColumnWidth(columnName: string, width: number): void {
    const clampedWidth = Math.max(50, width);
    this.state.table.columnWidths[columnName] = clampedWidth;
  }

  @action
  resetColumnWidths(): void {
    this.state.table.columnWidths = {};
  }

  // ========================================
  // Copy Actions
  // ========================================

  copyRowAsJSON(rowIndex: number): string | null {
    const records = this.state.sqlQuery.isActive
      ? this.state.sqlQuery.results
      : this.state.table.records;

    if (rowIndex < 0 || rowIndex >= records.length) {
      return null;
    }

    const record = records[rowIndex];
    return JSON.stringify(record, null, 2);
  }

  // ========================================
  // Schema Actions
  // ========================================

  @action
  async loadSchema(): Promise<void> {
    const tableName = this.state.table.selected;
    if (!tableName) return;

    runInAction(() => {
      this.state.schema.isLoading = true;
    });

    try {
      const [columns, indexes, foreignKeys] = await Promise.all([
        this.adapter.getColumns(tableName),
        this.adapter.getIndexes(tableName),
        this.adapter.getForeignKeys(tableName),
      ]);

      const schemaColumns: SchemaColumn[] = columns.map((col) => ({
        cid: col.cid,
        name: col.name,
        type: col.type,
        notnull: col.notnull === 1,
        dflt_value: col.dflt_value,
        pk: col.pk === 1,
      }));

      const schemaIndexes: SchemaIndex[] = indexes.map((idx) => ({
        name: idx.name,
        unique: idx.unique,
        columns: idx.columns,
      }));

      const schemaForeignKeys: SchemaForeignKey[] = foreignKeys.map((fk) => ({
        id: fk.id,
        table: fk.table,
        from: fk.from,
        to: fk.to,
      }));

      runInAction(() => {
        this.state.schema.columns = schemaColumns;
        this.state.schema.indexes = schemaIndexes;
        this.state.schema.foreignKeys = schemaForeignKeys;
        this.state.schema.isLoading = false;
      });

      this.logger?.info('loadSchema', `Loaded schema for ${tableName}`);
    } catch (error) {
      const message = getErrorMessage(error);
      this.logger?.error('loadSchema', 'Failed to load schema', error);
      runInAction(() => {
        this.state.schema.isLoading = false;
        this.state.error = `Failed to load schema: ${message}`;
      });
    }
  }

  @action
  async loadDDL(): Promise<void> {
    const tableName = this.state.table.selected;
    if (!tableName) return;

    runInAction(() => {
      this.state.schema.isLoading = true;
    });

    try {
      const ddl = await this.adapter.getTableDDL(tableName);

      runInAction(() => {
        this.state.schema.ddl = ddl;
        this.state.schema.isLoading = false;
      });

      this.logger?.info('loadDDL', `Loaded DDL for ${tableName}`);
    } catch (error) {
      const message = getErrorMessage(error);
      this.logger?.error('loadDDL', 'Failed to load DDL', error);
      runInAction(() => {
        this.state.schema.isLoading = false;
        this.state.error = `Failed to load DDL: ${message}`;
      });
    }
  }

  @action
  async loadColumnStatistics(): Promise<void> {
    const tableName = this.state.table.selected;
    if (!tableName) return;

    runInAction(() => {
      this.state.schema.isLoading = true;
    });

    try {
      const statistics = await this.adapter.getColumnStatistics(tableName);

      runInAction(() => {
        this.state.schema.statistics = statistics;
        this.state.schema.isLoading = false;
      });

      this.logger?.info('loadColumnStatistics', `Loaded statistics for ${tableName}`);
    } catch (error) {
      const message = getErrorMessage(error);
      this.logger?.error('loadColumnStatistics', 'Failed to load column statistics', error);
      runInAction(() => {
        this.state.schema.isLoading = false;
        this.state.error = `Failed to load column statistics: ${message}`;
      });
    }
  }

  // ========================================
  // Export Actions
  // ========================================

  getExportData(): { records: TableRecord[]; columns: ColumnInfo[] } {
    const records = this.state.sqlQuery.isActive
      ? this.state.sqlQuery.results
      : this.state.table.records;
    const columns = this.state.sqlQuery.isActive
      ? this.state.sqlQuery.columns
      : this.state.table.columns;

    return { records, columns };
  }

  getExportFileName(): string {
    return this.state.table.selected || 'query';
  }

  // ========================================
  // Error Actions
  // ========================================

  @action
  clearError(): void {
    this.state.error = null;
  }

  // ========================================
  // Private Helper Methods
  // ========================================

  private async loadTableData(): Promise<void> {
    const { selected, sortColumn, sortDirection, pagination, filterColumn, filterValue } = this.state.table;
    if (!selected) return;

    runInAction(() => {
      this.state.table.isLoading = true;
    });

    try {
      const [columns, totalRecords] = await Promise.all([
        this.adapter.getColumns(selected),
        this.adapter.getRowCount(
          selected,
          filterColumn ?? undefined,
          filterValue || undefined
        ),
      ]);

      const totalPages = Math.ceil(totalRecords / pagination.pageSize);
      const offset = (pagination.currentPage - 1) * pagination.pageSize;

      const records = await this.adapter.getRows<TableRecord>(selected, {
        limit: pagination.pageSize,
        offset,
        orderBy: sortColumn ?? undefined,
        orderDirection: sortDirection ?? undefined,
        filterColumn: filterColumn ?? undefined,
        filterValue: filterValue || undefined,
      });

      runInAction(() => {
        this.state.table.columns = columns;
        this.state.table.records = records;
        this.state.table.pagination.totalRecords = totalRecords;
        this.state.table.pagination.totalPages = totalPages;
        this.state.table.isLoading = false;
        this.state.table.selectedRowIndex = null;
      });

      this.logger?.info('loadTableData', `Loaded ${records.length} records`);
    } catch (error) {
      const message = getErrorMessage(error);
      this.logger?.error('loadTableData', 'Failed to load table data', error);
      runInAction(() => {
        this.state.table.isLoading = false;
        this.state.error = `Failed to load table: ${message}`;
      });
    }
  }
}
