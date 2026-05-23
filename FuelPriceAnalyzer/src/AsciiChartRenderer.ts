import type { ChartInput, IChartRenderer } from "./interfaces/IChartRender.js";
import type { DayOfWeek } from "./types/weekly.js";

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
   * Uses weekly averages from ChartInput.
   */
  render(input: ChartInput): string {
    const data = input.weekly;
    const lines: string[] = [];

    const prices = AsciiChartRenderer.DAY_ORDER.map(
      (d) => data.averagesByDay[d] ?? 0,
    );
    const validPrices = prices.filter((p) => p > 0);

    if (validPrices.length === 0) return "  No data available for this period.";

    const min = Math.min(...validPrices);
    const max = Math.max(...validPrices);

    lines.push("=".repeat(60));
    lines.push(`  WEEKLY CHART — ${data.productName} — ${data.month}`);
    lines.push(`  Mode: Horizontal bars`);
    lines.push("=".repeat(60));
    lines.push("");
    lines.push(`  Day  |${"".padEnd(24)}| Price`);
    lines.push(`  -----|${"".padEnd(24, "-")}|-------`);

    AsciiChartRenderer.DAY_ORDER.forEach((day, i) => {
      const price = prices[i] ?? 0;
      if (price === 0) {
        lines.push(`  ${day}  |${"".padEnd(24)}| no data`);
        lines.push(""); // ← línea vacía entre días
        return;
      }
      const bar = this.buildBar(price, min, max);
      lines.push(`  ${day}  |${bar}| ${price.toFixed(3)} €/L`);
      lines.push(""); // ← línea vacía entre días
    });

    lines.push(`  -----|${"".padEnd(24, "-")}|-------`);
    lines.push("");

    const minDay = AsciiChartRenderer.DAY_ORDER[prices.indexOf(min)] ?? "?";
    const maxDay = AsciiChartRenderer.DAY_ORDER[prices.indexOf(max)] ?? "?";
    lines.push(
      `  Min: ${min.toFixed(3)} €/L (${minDay})   Max: ${max.toFixed(3)} €/L (${maxDay})`,
    );
    lines.push("=".repeat(60));

    return lines.join("\n");
  }

  private static readonly BAR_WIDTH = 24;
  private static readonly BAR_CHAR = "█";

  private buildBar(value: number, min: number, max: number): string {
    const range = max - min || 1;
    const ratio = (value - min) / range;
    const filled = Math.round(ratio * AsciiChartRenderer.BAR_WIDTH);
    const empty = AsciiChartRenderer.BAR_WIDTH - filled;
    return "█".repeat(filled) + " ".repeat(empty);
  }
}
