/**
 * Date utility functions for CLI argument parsing and formatting.
 * Extracted following DRY principle — single source of truth for date handling.
 */

/**
 * Returns today's date formatted as DD-MM-YYYY.
 */
export function getTodayFormatted(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Parses --date argument from CLI args.
 * Falls back to today's date if not provided.
 */
export function parseDateArg(args: string[]): string {
  const idx = args.indexOf('--date');
  if (idx !== -1 && args[idx + 1]) {
    return args[idx + 1] as string;
  }
  return getTodayFormatted();
}
