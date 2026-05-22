import type { WeeklyData } from "../types/weekly.js";

/**
 * Abstraction for rendering weekly data as a visual chart.
 * Implemented by AsciiChartRenderer (CLI) and SvgChartGenerator (image).
 * Strategy Pattern: both implementations are interchangeable.
 */
export interface IChartRenderer {
  /**
   * Renders weekly price data as a chart string.
   * For ASCII: returns terminal-ready string.
   * For SVG: returns SVG markup string.
   */
  render(data: WeeklyData): string;
}
