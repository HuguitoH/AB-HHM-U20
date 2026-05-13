import type {Station} from "./station.js";

/**
 * Calculated data for a single province + product combination.
 * Pure data — no formatting, no presentation logic.
 */

export interface ReportEntry {
    province: string;
    product: string;
    averagePrice: number;
    cheapest: Station[]; // top 5 sorted asc
    mostExpensive: Station[]; // top 5 sorted desc
}

/**
 * Full daily report data for all province + product combinations.
 */

export interface ReportData {
    date: string;
    entries: ReportEntry[];
}


