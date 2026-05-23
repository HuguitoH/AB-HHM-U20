import * as asciichart from "asciichart";
import type { ChartInput, IChartRenderer } from "./interfaces/IChartRender.js";
import type { DailyPriceData } from "./types/weekly.js";

/**
 * Renders the last 30 days of price data as a line chart using asciichart.
 * Strategy Pattern: implements IChartRenderer alongside other renderers.
 *
 * Uses daily time series data instead of weekly averages —
 * line charts show trends over time, not day-of-week comparisons.
 *
 * Single Responsibility Principle: only handles line chart rendering.
 */
export class LineChartRenderer implements IChartRenderer {
  private static readonly CHART_HEIGHT = 10;

  /**
   * Renders daily price time series as a line chart string.
   * Uses daily data from ChartInput for a meaningful 30-day trend.
   */
  render(input: ChartInput): string {
    const { daily, weekly } = input;
    const productName = weekly.productName;
    const month = weekly.month;

    const lines: string[] = [];

    // Sort by date ascending
    const sorted = [...daily].sort((a, b) => a.date.localeCompare(b.date));

    // Extract average price per day across all provinces for this product
    const prices = sorted
      .map((day) => this.extractAverage(day, productName))
      .filter((p) => p > 0);

    if (prices.length === 0) {
      return "  No data available for this period.";
    }

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 0.01;
    const pad = range * 0.3;

    lines.push("=".repeat(60));
    lines.push(`  WEEKLY CHART — ${productName} — ${month}`);
    lines.push(`  Mode: Line chart (last ${prices.length} days)`);
    lines.push("=".repeat(60));
    lines.push("");

    const chart = asciichart.plot(prices, {
      height: LineChartRenderer.CHART_HEIGHT,
      min: min - pad,
      max: max + pad,
      padding: "        ",
    });

    lines.push(chart);
    lines.push("");
    lines.push(
      `  ${sorted[0]?.date ?? ""}  →  ${sorted[sorted.length - 1]?.date ?? ""}`,
    );
    lines.push("");
    lines.push(`  Min: ${min.toFixed(3)} €/L   Max: ${max.toFixed(3)} €/L`);
    lines.push("=".repeat(60));

    return lines.join("\n");
  }

  /**
   * Extracts the average price for a given product across all provinces
   * from a single day's data.
   */
  private extractAverage(day: DailyPriceData, productName: string): number {
    const values = Object.entries(day.pricesByProvince)
      .filter(([key]) => key.includes(productName))
      .map(([, v]) => v);

    if (values.length === 0) return 0;

    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round((sum / values.length) * 1000) / 1000;
  }
}
