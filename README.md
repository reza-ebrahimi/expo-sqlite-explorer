# expo-sqlite-explorer

[![npm version](https://img.shields.io/npm/v/expo-sqlite-explorer.svg?style=flat-square)](https://www.npmjs.com/package/expo-sqlite-explorer)
[![npm downloads](https://img.shields.io/npm/dm/expo-sqlite-explorer.svg?style=flat-square)](https://www.npmjs.com/package/expo-sqlite-explorer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A SQLite database browser and explorer component for React Native and Expo applications. Provides a complete UI for browsing tables, viewing data, executing queries, and analyzing schema.

## Features

- **Table Browser** - Browse all tables with row counts
- **Data Grid** - Paginated data view with sorting and filtering
- **Row Details** - Modal view for full row inspection
- **SQL Query** - Execute custom SELECT queries
- **Schema View** - View columns, indexes, and foreign keys
- **DDL View** - View CREATE TABLE statements
- **Column Statistics** - Min/max values, null percentages, distinct counts
- **Export** - Export data to CSV or JSON
- **Theming** - Built-in light/dark themes with custom theme support
- **Clipboard** - Copy cells, rows as JSON

## Installation

```bash
npm install expo-sqlite-explorer
# or
yarn add expo-sqlite-explorer
```

### Peer Dependencies

This package requires the following peer dependencies:

```json
{
  "react": ">=18.0.0",
  "react-native": ">=0.72.0",
  "react-native-svg": ">=15.12.1",
  "expo-sqlite": ">=14.0.0",
  "expo-clipboard": ">=6.0.0",
  "mobx": ">=6.0.0",
  "mobx-react-lite": ">=4.0.0"
}
```

## Usage

### Basic Usage

```tsx
import * as SQLite from "expo-sqlite";
import { SqliteExplorer, ExpoSqliteAdapter } from "expo-sqlite-explorer";

// Open your database
const db = await SQLite.openDatabaseAsync("myapp.db");

// Create adapter
const adapter = new ExpoSqliteAdapter({ database: db });

// Render explorer
<SqliteExplorer adapter={adapter} />;
```

### With Dark Theme

```tsx
import {
  SqliteExplorer,
  ExpoSqliteAdapter,
  darkTheme,
} from "expo-sqlite-explorer";

<SqliteExplorer adapter={adapter} theme={darkTheme} />;
```

### Development-Only Mode

```tsx
<SqliteExplorer
  adapter={adapter}
  devOnly={true} // Only renders when __DEV__ is true
/>
```

### Custom Page Size

```tsx
<SqliteExplorer
  adapter={adapter}
  pageSize={100} // Default is 50
/>
```

## Custom Database Adapters

You can create custom adapters by implementing the `IDatabaseAdapter` interface:

```tsx
import type { IDatabaseAdapter } from "expo-sqlite-explorer";

class MyCustomAdapter implements IDatabaseAdapter {
  isReady(): boolean {
    /* ... */
  }
  getTables(): Promise<TableInfo[]> {
    /* ... */
  }
  getColumns(tableName: string): Promise<ColumnInfo[]> {
    /* ... */
  }
  getIndexes(tableName: string): Promise<IndexInfo[]> {
    /* ... */
  }
  getForeignKeys(tableName: string): Promise<ForeignKeyInfo[]> {
    /* ... */
  }
  getTableDDL(tableName: string): Promise<string> {
    /* ... */
  }
  getColumnStatistics(tableName: string): Promise<ColumnStatistics[]> {
    /* ... */
  }
  query<T>(sql: string, params?: SqlParameter[]): Promise<QueryResult<T>> {
    /* ... */
  }
  getRowCount(
    tableName: string,
    filterColumn?: string,
    filterValue?: string
  ): Promise<number> {
    /* ... */
  }
  getRows<T>(tableName: string, options: PaginationOptions): Promise<T[]> {
    /* ... */
  }
}
```

## Custom Theming

Create a custom theme by providing a `SqliteExplorerTheme` object:

```tsx
import type { SqliteExplorerTheme } from "expo-sqlite-explorer";

const customTheme: SqliteExplorerTheme = {
  mode: "dark",
  colors: {
    background: "#1a1a2e",
    foreground: "#eaeaea",
    card: "#16213e",
    border: "#0f3460",
    primary: "#e94560",
    primaryForeground: "#ffffff",
    muted: "#1f4068",
    mutedForeground: "#a0a0a0",
    success: "#00d09c",
    successForeground: "#ffffff",
    warning: "#ffc107",
    warningForeground: "#000000",
    destructive: "#ff6b6b",
    destructiveForeground: "#ffffff",
  },
};

<SqliteExplorer adapter={adapter} theme={customTheme} />;
```

## API Reference

### SqliteExplorer Props

| Prop       | Type                  | Default      | Description                |
| ---------- | --------------------- | ------------ | -------------------------- |
| `adapter`  | `IDatabaseAdapter`    | required     | Database adapter instance  |
| `theme`    | `SqliteExplorerTheme` | `lightTheme` | Theme configuration        |
| `pageSize` | `number`              | `50`         | Rows per page              |
| `devOnly`  | `boolean`             | `false`      | Only render in development |

### Exports

```tsx
// Main component
import { SqliteExplorer } from "expo-sqlite-explorer";

// Adapter
import { ExpoSqliteAdapter } from "expo-sqlite-explorer";

// Themes
import { lightTheme, darkTheme } from "expo-sqlite-explorer";

// Types
import type {
  IDatabaseAdapter,
  SqliteExplorerTheme,
  TableInfo,
  ColumnInfo,
  ColumnStatistics,
} from "expo-sqlite-explorer";
```

## Development

To build the project locally:

```bash
# Install dependencies
npm install

# Compile TypeScript to dist/
npm run build

# Run TypeScript type check
npm run compile
```

## License

MIT © [Reza Ebrahimi](mailto:reza.ebrahimi.dev@gmail.com)
