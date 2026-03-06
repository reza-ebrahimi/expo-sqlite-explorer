import type { SqlParameter } from '../types';

/**
 * Check if a string is a valid ISO date
 */
export function isISODate(value: string): boolean {
  const isoPattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/;
  if (!isoPattern.test(value)) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}

/**
 * Check if a string looks like JSON
 */
export function isJSONString(value: string): boolean {
  const trimmed = value.trim();
  return (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  );
}

/**
 * Format a date for display
 */
export function formatDate(value: string): string {
  const date = new Date(value);
  if (value.includes('T')) {
    return date.toLocaleString();
  }
  return date.toLocaleDateString();
}

/**
 * Format JSON for display (abbreviated for cells)
 */
export function formatJSON(value: string): string {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return `[${parsed.length} items]`;
    }
    const keys = Object.keys(parsed);
    if (keys.length <= 2) {
      return `{${keys.join(', ')}}`;
    }
    return `{${keys.slice(0, 2).join(', ')}, ...}`;
  } catch {
    return value;
  }
}

/**
 * Cell value formatting result
 */
export interface FormattedCellValue {
  text: string;
  isJSON: boolean;
  isDate: boolean;
}

/**
 * Format a cell value for display in the data grid
 */
export function formatCellValue(value: SqlParameter): FormattedCellValue {
  if (value === null) {
    return { text: '', isJSON: false, isDate: false };
  }
  if (typeof value === 'boolean') {
    return { text: value ? 'true' : 'false', isJSON: false, isDate: false };
  }

  const strValue = String(value);

  // Check for JSON
  if (isJSONString(strValue)) {
    return { text: formatJSON(strValue), isJSON: true, isDate: false };
  }

  // Check for date
  if (isISODate(strValue)) {
    return { text: formatDate(strValue), isJSON: false, isDate: true };
  }

  // Truncate long text
  if (strValue.length > 50) {
    return { text: strValue.substring(0, 50) + '...', isJSON: false, isDate: false };
  }

  return { text: strValue, isJSON: false, isDate: false };
}

/**
 * Full value formatting result for modal display
 */
export interface FormattedFullValue {
  text: string;
  isFormatted: boolean;
  type: 'json' | 'date' | 'text';
}

/**
 * Format full value for display in detail modal
 */
export function formatFullValue(value: SqlParameter): FormattedFullValue {
  if (value === null) {
    return { text: 'NULL', isFormatted: false, type: 'text' };
  }
  if (typeof value === 'boolean') {
    return { text: value ? 'true' : 'false', isFormatted: false, type: 'text' };
  }

  const strValue = String(value);

  // Check for JSON
  if (isJSONString(strValue)) {
    try {
      const parsed = JSON.parse(strValue);
      return { text: JSON.stringify(parsed, null, 2), isFormatted: true, type: 'json' };
    } catch {
      // Not valid JSON
    }
  }

  // Check for date
  if (isISODate(strValue)) {
    return { text: formatDate(strValue), isFormatted: true, type: 'date' };
  }

  return { text: strValue, isFormatted: false, type: 'text' };
}

/**
 * Format a number with locale-specific separators
 */
export function formatNumber(value: number): string {
  return value.toLocaleString();
}

/**
 * Format a percentage value
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}
