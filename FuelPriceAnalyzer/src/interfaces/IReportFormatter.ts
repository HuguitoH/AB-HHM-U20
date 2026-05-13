import type { ReportData } from "../types/report.js";

/**
 * Abstraction for formatting report data into a human-readable string.
 * Single Responsibility: only handles presentation, not calculation.
 */
export interface IReportFormatter {
  format(data: ReportData): string;
}
