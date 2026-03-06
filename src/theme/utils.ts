import { colord } from 'colord';

/**
 * Sets the alpha channel of a color
 * @param color - The color to modify (hex, rgb, hsl, etc.)
 * @param alpha - The alpha value (0-1)
 * @returns The color with the specified alpha as rgba string
 */
export function setAlpha(color: string, alpha: number): string {
  const c = colord(color);
  if (!c.isValid()) return color;
  const { r, g, b } = c.toRgb();
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${r},${g},${b},${a.toFixed(2)})`;
}

/**
 * Lightens a color by a percentage
 * @param color - The color to lighten
 * @param amount - The percentage to lighten (0-100)
 * @returns The lightened color
 */
export function lighten(color: string, amount: number): string {
  const c = colord(color);
  if (!c.isValid()) return color;
  return c.lighten(amount / 100).toHex();
}

/**
 * Darkens a color by a percentage
 * @param color - The color to darken
 * @param amount - The percentage to darken (0-100)
 * @returns The darkened color
 */
export function darken(color: string, amount: number): string {
  const c = colord(color);
  if (!c.isValid()) return color;
  return c.darken(amount / 100).toHex();
}
