import React, { createContext, useContext } from 'react';
import type { IDatabaseAdapter } from '../types';

const DatabaseContext = createContext<IDatabaseAdapter | null>(null);

export interface DatabaseProviderProps {
  adapter: IDatabaseAdapter;
  children: React.ReactNode;
}

/**
 * Database provider for SQLite Explorer
 * Wraps components and provides database adapter context
 */
export function DatabaseProvider({ adapter, children }: DatabaseProviderProps): React.ReactElement {
  return (
    <DatabaseContext.Provider value={adapter}>
      {children}
    </DatabaseContext.Provider>
  );
}

/**
 * Hook to access the current database adapter
 * Must be used within a DatabaseProvider
 * @throws Error if used outside of DatabaseProvider
 */
export function useDatabase(): IDatabaseAdapter {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}

/**
 * Hook to optionally access the database adapter
 * Returns null if not within a DatabaseProvider
 */
export function useDatabaseOptional(): IDatabaseAdapter | null {
  return useContext(DatabaseContext);
}
