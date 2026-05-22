import type { DailyPriceData, WeeklyData } from "../types/weekly.js";

/**
 * Abstraction for analysing daily price data into weekly averages.
 * Single Responsibility: only handles weekly grouping and calculation.
 */
export interface IWeeklyAnalyzer {
  /**
   * Groups daily price data by day of the week and calculates averages.
   * @param data - Array of daily price data
   * @param productId - Product ID to tag the result
   * @param productName - Product name to tag the result
   * @param month - Month label for the result (MM-YYYY)
   */

  analyze(
    data: DailyPriceData[],
    productId: string,
    productName: string,
    month: string,
  ): WeeklyData;
}
