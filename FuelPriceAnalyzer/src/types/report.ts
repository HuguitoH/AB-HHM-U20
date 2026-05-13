import type { Station } from "./station.js";

/**
 * Report display mode — controls whether highway stations are included.
 */
export type ReportMode = 'all' | 'no-highway';

/**
 * Calculated data for a single province + product combination.
 * Pure data — no formatting, no presentation logic.
 */
export interface ReportEntry {
  province: string;
  product: string;
  averagePrice: number;
  cheapest: Station[];
  mostExpensive: Station[];
}

/**
 * Full daily report data for all province + product combinations.
 */
export interface ReportData {
  date: string;
  mode: ReportMode;
  entries: ReportEntry[];
}
