import React, { createContext, useContext, useMemo } from 'react';
import type { SqliteExplorerTheme, ThemeContextType } from '../types';
import { lightTheme } from './light';

const ThemeContext = createContext<ThemeContextType | null>(null);

export interface ThemeProviderProps {
  theme?: SqliteExplorerTheme;
  children: React.ReactNode;
}

/**
 * Theme provider for SQLite Explorer
 * Wraps components and provides theme context
 */
export function ThemeProvider({ theme = lightTheme, children }: ThemeProviderProps): React.ReactElement {
  const contextValue = useMemo<ThemeContextType>(
    () => ({
      theme,
      isDark: theme.mode === 'dark',
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access the current theme
 * Must be used within a ThemeProvider
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return default light theme if no provider (for convenience)
    return {
      theme: lightTheme,
      isDark: false,
    };
  }
  return context;
}
