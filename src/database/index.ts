export { ExpoSqliteAdapter } from './ExpoSqliteAdapter';
export type { ExpoSqliteAdapterOptions } from './ExpoSqliteAdapter';
export { DatabaseProvider, useDatabase, useDatabaseOptional } from './context';
export type { DatabaseProviderProps } from './context';

// Re-export SQLiteDatabase type for consumers to use the same type resolution
export type { SQLiteDatabase } from 'expo-sqlite';
