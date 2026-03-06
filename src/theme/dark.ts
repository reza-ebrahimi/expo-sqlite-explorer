import type { SqliteExplorerTheme } from '../types';

export const darkTheme: SqliteExplorerTheme = {
  mode: 'dark',
  colors: {
    // Backgrounds
    background: '#0F172A',
    card: '#1E293B',
    muted: '#334155',

    // Text
    foreground: '#F0F9FF',
    mutedForeground: '#94A3B8',

    // Interactive
    primary: '#38BDF8',
    primaryForeground: '#0F172A',

    // Borders
    border: '#334155',

    // Status
    success: '#34D399',
    successForeground: '#0F172A',
    warning: '#FBBF24',
    warningForeground: '#0F172A',
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
  },
};
