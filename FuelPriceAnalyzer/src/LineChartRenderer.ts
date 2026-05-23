import * as asciichart from "asciichart";
import type { IChartRenderer } from "./interfaces/IChartRender.js";
import type { DayOfWeek, WeeklyData } from "./types/weekly.js";

/**
 * Renders weekly price data as a line chart using asciichart.
 * Strategy Pattern: implements IChartRenderer alongside other renderers.
 *
 * Single Responsibility Principle: only handles line chart rendering.
 */
export class LineChartRenderer implements IChartRenderer {
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
   * Renders weekly price data as a line chart string using asciichart.
   */
  render(data: WeeklyData): string {
    const lines: string[] = [];
    const prices = LineChartRenderer.DAY_ORDER.map(
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
    lines.push(`  Mode: Line chart`);
    lines.push("=".repeat(60));
    lines.push("");

    // Generate line chart using asciichart
    const chart = asciichart.plot(prices, {
      height: LineChartRenderer.CHART_HEIGHT,
      min,
      max,
      padding: "      ",
    });

    lines.push(chart);
    lines.push("");
    lines.push("         Mon   Tue   Wed   Thu   Fri   Sat   Sun");
    lines.push("");

    // Summary
    const minDay = LineChartRenderer.DAY_ORDER[prices.indexOf(min)] ?? "?";
    const maxDay = LineChartRenderer.DAY_ORDER[prices.indexOf(max)] ?? "?";
    lines.push(
      `  Min: ${min.toFixed(3)} €/L (${minDay})   Max: ${max.toFixed(3)} €/L (${maxDay})`,
    );
    lines.push("=".repeat(60));

    return lines.join("\n");
  }
}
