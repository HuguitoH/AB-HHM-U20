import type { DailyPriceData } from "../types/weekly.js";

/**
 * Abstraction for fetching daily price data for a date range.
 * Dependency Inversion Principle: consumers depend on this interface,
 * not on the concrete WeeklyDataFetcher implementation.
 */
export interface IWeeklyDataFetcher {
  /**
   * Fetches daily price data for the last N days.
   * Uses batch loading to avoid overwhelming the Ministry API.
   * Skips dates already available in cache.
   * @param days - Number of days to fetch (default: 30)
   * @returns Array of daily price data sorted by date ascending
   */
  fetchLastDays(days?: number): Promise<DailyPriceData[]>;
}
