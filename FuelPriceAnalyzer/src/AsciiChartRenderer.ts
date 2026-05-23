import type { IChartRenderer } from "./interfaces/IChartRender.js";
import type { DayOfWeek, WeeklyData } from "./types/weekly.js";

/**
 * Renders weekly price data as vertical ASCII bar charts.
 * Strategy Pattern: implements IChartRenderer alongside other renderers.
 *
 * Single Responsibility Principle: only handles vertical bar ASCII rendering.
 */
export class AsciiChartRenderer implements IChartRenderer {
  private static readonly CHART_HEIGHT = 8;
  private static readonly DAY_ORDER: DayOfWeek[] = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  /**
   * Renders weekly price data as a vertical bar chart string.
   */
  render(data: WeeklyData): string {
    const lines: string[] = [];
    const prices = AsciiChartRenderer.DAY_ORDER.map(
      (d) => data.averagesByDay[d] ?? 0,
    );
    const validPrices = prices.filter((p) => p > 0);

    if (validPrices.length === 0) {
      return "  No data available for this period.";
    }

    const min = Math.min(...validPrices);
    const max = Math.max(...validPrices);

    lines.push("=".repeat(60));
    lines.push(`  WEEKLY CHART — ${data.productName} — ${data.month}`);
    lines.push(`  Mode: Vertical bars`);
    lines.push("=".repeat(60));
    lines.push("");

    // Build chart rows top to bottom
    const rows = this.buildRows(prices, min, max);
    for (const row of rows) {
      lines.push(row);
    }

    // X axis
    lines.push("        " + "     +" + "-".repeat(29));
    lines.push("          Mon  Tue  Wed  Thu  Fri  Sat  Sun");
    lines.push("");

    // Summary
    const minDay = AsciiChartRenderer.DAY_ORDER[prices.indexOf(min)] ?? "?";
    const maxDay = AsciiChartRenderer.DAY_ORDER[prices.indexOf(max)] ?? "?";
    lines.push(
      `  Min: ${min.toFixed(3)} €/L (${minDay})   Max: ${max.toFixed(3)} €/L (${maxDay})`,
    );
    lines.push("=".repeat(60));

    return lines.join("\n");
  }

  /**
   * Builds chart rows from top to bottom.
   * Each row represents a price level — filled with █ if bar reaches that level.
   */
  private buildRows(prices: number[], min: number, max: number): string[] {
    const rows: string[] = [];
    const range = max - min || 1;

    for (let row = AsciiChartRenderer.CHART_HEIGHT; row >= 1; row--) {
      const threshold = min + (range * row) / AsciiChartRenderer.CHART_HEIGHT;
      const label =
        row === AsciiChartRenderer.CHART_HEIGHT
          ? `  ${max.toFixed(3)} |`
          : row === Math.ceil(AsciiChartRenderer.CHART_HEIGHT / 2)
            ? `  ${((min + max) / 2).toFixed(3)} |`
            : row === 1
              ? `  ${min.toFixed(3)} |`
              : "          |";

      const bars = prices
        .map((price) => (price >= threshold ? "  █  " : "     "))
        .join("");

      rows.push(`${label}${bars}`);
    }

    return rows;
  }
}
