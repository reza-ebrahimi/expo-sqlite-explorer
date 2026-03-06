/**
 * Theme color definitions for SQLite Explorer
 */
export interface SqliteExplorerColors {
  // Backgrounds
  background: string;
  card: string;
  muted: string;

  // Text
  foreground: string;
  mutedForeground: string;

  // Interactive
  primary: string;
  primaryForeground: string;

  // Borders
  border: string;

  // Status
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  destructive: string;
  destructiveForeground: string;
}

/**
 * Complete theme definition
 */
export interface SqliteExplorerTheme {
  mode: 'light' | 'dark';
  colors: SqliteExplorerColors;
}

/**
 * Theme context type
 */
export interface ThemeContextType {
  theme: SqliteExplorerTheme;
  isDark: boolean;
}
