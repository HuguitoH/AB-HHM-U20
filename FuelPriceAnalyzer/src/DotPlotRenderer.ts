import type { ChartInput, IChartRenderer } from "./interfaces/IChartRender.js";
import type { DayOfWeek } from "./types/weekly.js";
/**
 * Renders weekly price data as a dot plot for terminal display.
 * Each day is represented by a dot positioned vertically by price.
 * Strategy Pattern: implements IChartRenderer alongside other renderers.
 *
 * Single Responsibility Principle: only handles dot plot ASCII rendering.
 */
export class DotPlotRenderer implements IChartRenderer {
  private static readonly CHART_HEIGHT = 8;
  private static readonly DOT_CHAR = "●";
  private static readonly EMPTY_CHAR = " ";

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
   * Renders weekly price data as a dot plot string.
   * Uses weekly averages from ChartInput.
   */
  render(input: ChartInput): string {
    const data = input.weekly;
    const lines: string[] = [];
    const prices = DotPlotRenderer.DAY_ORDER.map(
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
    lines.push(`  Mode: Dot plot`);
    lines.push("=".repeat(60));
    lines.push("");

    // Build chart rows top to bottom
    const rows = this.buildRows(prices, min, max);
    for (const row of rows) {
      lines.push(row);
    }

    // X axis
    lines.push("        +" + "-".repeat(43));
    lines.push("           Mon   Tue   Wed   Thu   Fri   Sat   Sun");
    lines.push("");

    // Summary
    const minDay = DotPlotRenderer.DAY_ORDER[prices.indexOf(min)] ?? "?";
    const maxDay = DotPlotRenderer.DAY_ORDER[prices.indexOf(max)] ?? "?";
    lines.push(
      `  Min: ${min.toFixed(3)} €/L (${minDay})   Max: ${max.toFixed(3)} €/L (${maxDay})`,
    );
    lines.push("=".repeat(60));

    return lines.join("\n");
  }

  /**
   * Builds chart rows from top to bottom.
   * Places a dot at the row closest to each day's price level.
   */
  private buildRows(prices: number[], min: number, max: number): string[] {
    const rows: string[] = [];
    const range = max - min || 1;

    // Calculate which row each day's dot belongs to
    const dotRows = prices.map((price) => {
      if (price === 0) return -1;
      const ratio = (price - min) / range;
      return Math.round(ratio * (DotPlotRenderer.CHART_HEIGHT - 1));
    });

    for (let row = DotPlotRenderer.CHART_HEIGHT - 1; row >= 0; row--) {
      const priceAtRow =
        min + (range * row) / (DotPlotRenderer.CHART_HEIGHT - 1);

      const label =
        row === DotPlotRenderer.CHART_HEIGHT - 1
          ? `  ${max.toFixed(3)} |`
          : row === Math.floor((DotPlotRenderer.CHART_HEIGHT - 1) / 2)
            ? `  ${((min + max) / 2).toFixed(3)} |`
            : row === 0
              ? `  ${min.toFixed(3)} |`
              : "          |";

      const dots = DotPlotRenderer.DAY_ORDER.map((_, i) =>
        dotRows[i] === row
          ? `  ${DotPlotRenderer.DOT_CHAR}   `
          : `  ${DotPlotRenderer.EMPTY_CHAR}   `,
      ).join("");

      rows.push(`${label}${dots}`);
    }

    return rows;
  }
}
