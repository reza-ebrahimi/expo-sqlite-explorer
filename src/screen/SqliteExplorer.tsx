import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo } from "react";

import { ThemeProvider } from "../theme/context";
import { DatabaseProvider } from "../database/context";
import { lightTheme, darkTheme } from "../theme";
import type { SqliteExplorerTheme } from "../theme";
import type { IDatabaseAdapter } from "../types/database";
import { exportToCSV, exportToJSON } from "../utils/export";
import { SqliteExplorerUI } from "./SqliteExplorer.ui";
import {
  SqliteExplorerViewModel,
  SqliteExplorerViewModelOptions,
} from "./SqliteExplorer.vm";

/**
 * Props for SqliteExplorer component
 */
export interface SqliteExplorerProps {
  /**
   * Database adapter instance
   */
  adapter: IDatabaseAdapter;

  /**
   * Theme to use. Defaults to light theme.
   * Pass `darkTheme` for dark mode or a custom theme object.
   */
  theme?: SqliteExplorerTheme;

  /**
   * Page size for pagination. Defaults to 50.
   */
  pageSize?: number;

  /**
   * Development-only mode. When true, component will not render in production.
   * Defaults to false.
   */
  devOnly?: boolean;
}

/**
 * SqliteExplorer - SQLite database browser component
 *
 * A complete database explorer component for React Native/Expo applications.
 * Features:
 * - Browse all SQLite tables in a sidebar
 * - View records with pagination and sorting
 * - Copy cell values to clipboard
 * - View full row details in a modal
 * - Execute custom SQL queries
 * - Export data to CSV/JSON
 * - View table schema, DDL, and column statistics
 *
 * @example
 * ```tsx
 * import { SqliteExplorer, ExpoSqliteAdapter, darkTheme } from 'expo-sqlite-explorer';
 *
 * const db = await SQLite.openDatabaseAsync('mydb.db');
 * const adapter = new ExpoSqliteAdapter({ database: db });
 *
 * // Basic usage
 * <SqliteExplorer adapter={adapter} />
 *
 * // With dark theme
 * <SqliteExplorer adapter={adapter} theme={darkTheme} />
 *
 * // Dev-only mode
 * <SqliteExplorer adapter={adapter} devOnly />
 * ```
 */
export const SqliteExplorer: React.FC<SqliteExplorerProps> = observer(
  ({ adapter, theme = lightTheme, pageSize = 50, devOnly = false }) => {
    // Development guard
    if (devOnly && typeof __DEV__ !== "undefined" && !__DEV__) {
      return null;
    }

    // Create ViewModel options
    const options: SqliteExplorerViewModelOptions = useMemo(
      () => ({
        adapter,
        pageSize,
      }),
      [adapter, pageSize]
    );

    // Create ViewModel instance
    const viewModel = useMemo(
      () => new SqliteExplorerViewModel(options),
      [options]
    );

    // Initialize on mount, dispose on unmount
    useEffect(() => {
      viewModel.initialize();
      return () => viewModel.dispose();
    }, [viewModel]);

    // Export handlers that need data from ViewModel
    const handleExportCSV = () => {
      const { records, columns } = viewModel.getExportData();
      const fileName = viewModel.getExportFileName();
      exportToCSV(records, columns, fileName);
    };

    const handleExportJSON = () => {
      const { records, columns } = viewModel.getExportData();
      const fileName = viewModel.getExportFileName();
      exportToJSON(records, fileName);
    };

    // Wire ViewModel to UI with providers
    return (
      <ThemeProvider theme={theme}>
        <DatabaseProvider adapter={adapter}>
          <SqliteExplorerUI
            // Database state
            tables={viewModel.tables}
            isDatabaseLoading={viewModel.isDatabaseLoading}
            // Table state
            selectedTable={viewModel.selectedTable}
            columns={viewModel.columns}
            records={viewModel.records}
            isTableLoading={viewModel.isTableLoading}
            pagination={viewModel.pagination}
            selectedRowIndex={viewModel.selectedRowIndex}
            sortColumn={viewModel.sortColumn}
            sortDirection={viewModel.sortDirection}
            // Filter state
            filterColumn={viewModel.filterColumn}
            filterValue={viewModel.filterValue}
            // View mode
            viewMode={viewModel.viewMode}
            // Column widths
            columnWidths={viewModel.columnWidths}
            // Schema state
            schemaColumns={viewModel.schemaColumns}
            schemaIndexes={viewModel.schemaIndexes}
            schemaForeignKeys={viewModel.schemaForeignKeys}
            tableDDL={viewModel.tableDDL}
            columnStatistics={viewModel.columnStatistics}
            isSchemaLoading={viewModel.isSchemaLoading}
            // Row details
            detailRow={viewModel.detailRow}
            detailRowIndex={viewModel.detailRowIndex}
            // SQL Query state
            isSqlMode={viewModel.isSqlMode}
            sqlQuery={viewModel.sqlQuery}
            sqlResults={viewModel.sqlResults}
            sqlColumns={viewModel.sqlColumns}
            sqlError={viewModel.sqlError}
            isSqlLoading={viewModel.isSqlLoading}
            // Derived state
            hasRecords={viewModel.hasRecords}
            hasPreviousPage={viewModel.hasPreviousPage}
            hasNextPage={viewModel.hasNextPage}
            // Error
            error={viewModel.error}
            // Table actions
            onSelectTable={viewModel.selectTable.bind(viewModel)}
            onNextPage={viewModel.nextPage.bind(viewModel)}
            onPreviousPage={viewModel.previousPage.bind(viewModel)}
            onClearError={viewModel.clearError.bind(viewModel)}
            onRefresh={viewModel.refreshData.bind(viewModel)}
            onToggleSort={viewModel.toggleSort.bind(viewModel)}
            // Filter actions
            onSetFilterColumn={viewModel.setFilterColumn.bind(viewModel)}
            onSetFilterValue={viewModel.setFilterValue.bind(viewModel)}
            onClearFilter={viewModel.clearFilter.bind(viewModel)}
            // View mode actions
            onSetViewMode={viewModel.setViewMode.bind(viewModel)}
            // Export actions
            onExportCSV={handleExportCSV}
            onExportJSON={handleExportJSON}
            // Column resize actions
            onSetColumnWidth={viewModel.setColumnWidth.bind(viewModel)}
            onResetColumnWidths={viewModel.resetColumnWidths.bind(viewModel)}
            // Copy actions
            onCopyRowAsJSON={viewModel.copyRowAsJSON.bind(viewModel)}
            // Row actions
            onSelectRow={viewModel.selectRow.bind(viewModel)}
            onSelectNextRow={viewModel.selectNextRow.bind(viewModel)}
            onSelectPreviousRow={viewModel.selectPreviousRow.bind(viewModel)}
            onOpenRowDetails={viewModel.openRowDetails.bind(viewModel)}
            onOpenSelectedRowDetails={viewModel.openSelectedRowDetails.bind(
              viewModel
            )}
            onCloseRowDetails={viewModel.closeRowDetails.bind(viewModel)}
            // SQL actions
            onToggleSqlMode={viewModel.toggleSqlMode.bind(viewModel)}
            onSetSqlQuery={viewModel.setSqlQuery.bind(viewModel)}
            onExecuteQuery={viewModel.executeQuery.bind(viewModel)}
            onClearQueryResults={viewModel.clearQueryResults.bind(viewModel)}
          />
        </DatabaseProvider>
      </ThemeProvider>
    );
  }
);
