import * as Clipboard from 'expo-clipboard';
import type { SqlParameter, TableRecord } from '../types';

/**
 * Copy a value to clipboard
 */
export async function copyToClipboard(value: SqlParameter): Promise<void> {
  const text = value === null ? 'NULL' : String(value);
  await Clipboard.setStringAsync(text);
}

/**
 * Copy a row as JSON to clipboard
 */
export async function copyRowAsJSON(record: TableRecord): Promise<void> {
  const json = JSON.stringify(record, null, 2);
  await Clipboard.setStringAsync(json);
}

/**
 * Copy text to clipboard
 */
export async function copyText(text: string): Promise<void> {
  await Clipboard.setStringAsync(text);
}
