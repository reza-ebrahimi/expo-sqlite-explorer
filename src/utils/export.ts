import { Platform } from 'react-native';
import type { TableRecord, ColumnInfo } from '../types';

/**
 * Export records to CSV format
 */
export function exportToCSV(
  records: TableRecord[],
  columns: ColumnInfo[],
  tableName: string
): void {
  if (records.length === 0) {
    console.warn('exportToCSV: No records to export');
    return;
  }

  const headers = columns.map((col) => col.name).join(',');
  const rows = records.map((record) =>
    columns
      .map((col) => {
        const value = record[col.name];
        if (value === null) return '';
        const str = String(value);
        // Escape quotes and wrap in quotes if contains comma/newline/quote
        if (str.includes(',') || str.includes('\n') || str.includes('"')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      })
      .join(',')
  );

  const csv = [headers, ...rows].join('\n');
  downloadFile(csv, 'text/csv', `${tableName}.csv`);
}

/**
 * Export records to JSON format
 */
export function exportToJSON(records: TableRecord[], tableName: string): void {
  if (records.length === 0) {
    console.warn('exportToJSON: No records to export');
    return;
  }

  const json = JSON.stringify(records, null, 2);
  downloadFile(json, 'application/json', `${tableName}.json`);
}

/**
 * Download a file (web only)
 */
function downloadFile(content: string, mimeType: string, fileName: string): void {
  if (Platform.OS !== 'web') {
    console.warn('File download is only supported on web platform');
    return;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
