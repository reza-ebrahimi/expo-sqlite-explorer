import type { SqliteExplorerTheme } from '../types';

export const lightTheme: SqliteExplorerTheme = {
  mode: 'light',
  colors: {
    // Backgrounds
    background: '#FFFFFF',
    card: '#FFFFFF',
    muted: '#F8FAFC',

    // Text
    foreground: '#0F172A',
    mutedForeground: '#64748B',

    // Interactive
    primary: '#0EA5E9',
    primaryForeground: '#FFFFFF',

    // Borders
    border: '#E2E8F0',

    // Status
    success: '#10B981',
    successForeground: '#FFFFFF',
    warning: '#F59E0B',
    warningForeground: '#0F172A',
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
  },
};
