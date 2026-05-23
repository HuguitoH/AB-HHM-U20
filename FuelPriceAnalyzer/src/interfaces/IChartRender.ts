import type { DailyPriceData, WeeklyData } from "../types/weekly.js";

/**
 * Input data for chart renderers.
 * Weekly data for bar/dot renderers, daily data for line chart.
 */
export interface ChartInput {
  weekly: WeeklyData;
  daily: DailyPriceData[];
}

/**
 * Abstraction for rendering chart data.
 * Strategy Pattern: each renderer decides internally how to use the input.
 * Dependency Inversion: consumers depend on this interface only.
 */
export interface IChartRenderer {
  /**
   * Renders chart data into a displayable string.
   * @param input - Combined weekly and daily data
   */
  render(input: ChartInput): string;
}
