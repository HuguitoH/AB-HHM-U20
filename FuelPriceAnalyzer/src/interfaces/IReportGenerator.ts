import type { ReportData, ReportMode } from "../types/report.js";
import type { StationStore } from "../types/stationStore.js";

/**
 * Abstraction for generating report data from the in-memory store.
 * Dependency Inversion Principle: consumers depend on this interface,
 * not on the concrete ReportGenerator implementation.
 */
export interface IReportGenerator {
  generate(store: StationStore, date: string, mode: ReportMode): ReportData;
}
