import type { ChartInput, IChartRenderer } from "./interfaces/IChartRender.js";
import type { DayOfWeek, WeeklyData } from "./types/weekly.js";
/**
 * Generates SVG bar chart markup for weekly price data.
 * Strategy Pattern: implements IChartRenderer alongside ASCII renderers.
 *
 * Single Responsibility Principle: only handles SVG generation.
 * No file writing, no CLI output, no data fetching.
 *
 * Pure SVG string generation — no external dependencies required.
 */
export class SvgChartGenerator implements IChartRenderer {
  private static readonly WIDTH = 800;
  private static readonly HEIGHT = 500;
  private static readonly PADDING = 60;
  private static readonly BAR_GAP = 10;
  private static readonly COLORS = {
    bar: "#4A90D9",
    barHover: "#357ABD",
    background: "#1E1E2E",
    grid: "#3A3A5C",
    text: "#CDD6F4",
    axis: "#6C7086",
    title: "#89B4FA",
    min: "#A6E3A1",
    max: "#F38BA8",
  };

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
   * Renders weekly price data as an SVG bar chart string.
   * Uses weekly averages from ChartInput.
   */
  render(input: ChartInput): string {
    const data = input.weekly;
    const prices = SvgChartGenerator.DAY_ORDER.map(
      (d) => data.averagesByDay[d] ?? 0,
    );
    const valid = prices.filter((p) => p > 0);

    if (valid.length === 0) {
      return this.buildEmptySvg(data);
    }

    const min = Math.min(...valid);
    const max = Math.max(...valid);
    const padding = SvgChartGenerator.PADDING;
    const chartW = SvgChartGenerator.WIDTH - padding * 2;
    const chartH = SvgChartGenerator.HEIGHT - padding * 2;
    const barW = chartW / 7 - SvgChartGenerator.BAR_GAP;

    return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${SvgChartGenerator.WIDTH}"
  height="${SvgChartGenerator.HEIGHT}"
  viewBox="0 0 ${SvgChartGenerator.WIDTH} ${SvgChartGenerator.HEIGHT}">

  <!-- Background -->
  <rect width="${SvgChartGenerator.WIDTH}" height="${SvgChartGenerator.HEIGHT}"
    fill="${SvgChartGenerator.COLORS.background}" rx="12"/>

  <!-- Title -->
  <text x="${SvgChartGenerator.WIDTH / 2}" y="36"
    font-family="monospace" font-size="16" font-weight="bold"
    fill="${SvgChartGenerator.COLORS.title}" text-anchor="middle">
    ${data.productName} — Weekly Average — ${data.month}
  </text>

  <!-- Y axis grid lines and labels -->
  ${this.buildYAxis(min, max, padding, chartW, chartH)}

  <!-- Bars -->
  ${this.buildBars(prices, min, max, padding, chartW, chartH, barW)}

  <!-- X axis labels -->
  ${this.buildXAxis(padding, chartW, chartH)}

  <!-- X axis line -->
  <line x1="${padding}" y1="${padding + chartH}"
    x2="${padding + chartW}" y2="${padding + chartH}"
    stroke="${SvgChartGenerator.COLORS.axis}" stroke-width="1"/>

  <!-- Y axis line -->
  <line x1="${padding}" y1="${padding}"
    x2="${padding}" y2="${padding + chartH}"
    stroke="${SvgChartGenerator.COLORS.axis}" stroke-width="1"/>
</svg>`;
  }

  /**
   * Builds Y axis grid lines and price labels.
   */
  private buildYAxis(
    min: number,
    max: number,
    padding: number,
    chartW: number,
    chartH: number,
  ): string {
    const steps = 5;
    const range = max - min || 1;
    const lines: string[] = [];

    for (let i = 0; i <= steps; i++) {
      const value = min + (range * i) / steps;
      const y = padding + chartH - (chartH * i) / steps;

      lines.push(`
  <line x1="${padding}" y1="${y}" x2="${padding + chartW}" y2="${y}"
    stroke="${SvgChartGenerator.COLORS.grid}" stroke-width="1"
    stroke-dasharray="4,4" opacity="0.5"/>
  <text x="${padding - 8}" y="${y + 4}"
    font-family="monospace" font-size="11"
    fill="${SvgChartGenerator.COLORS.text}" text-anchor="end">
    ${value.toFixed(3)}
  </text>`);
    }

    return lines.join("");
  }

  /**
   * Builds bar elements for each day of the week.
   */
  private buildBars(
    prices: number[],
    min: number,
    max: number,
    padding: number,
    chartW: number,
    chartH: number,
    barW: number,
  ): string {
    const range = max - min || 1;
    const slotW = chartW / 7;
    const bars: string[] = [];

    prices.forEach((price, i) => {
      if (price === 0) return;

      const barH = (chartH * (price - min)) / range;
      const x = padding + i * slotW + SvgChartGenerator.BAR_GAP / 2;
      const y = padding + chartH - barH;
      const isMin = price === min;
      const isMax = price === max;
      const color = isMax
        ? SvgChartGenerator.COLORS.max
        : isMin
          ? SvgChartGenerator.COLORS.min
          : SvgChartGenerator.COLORS.bar;

      bars.push(`
  <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}"
    width="${barW.toFixed(1)}" height="${barH.toFixed(1)}"
    fill="${color}" rx="4" opacity="0.9"/>
  <text x="${(x + barW / 2).toFixed(1)}" y="${(y - 6).toFixed(1)}"
    font-family="monospace" font-size="11"
    fill="${SvgChartGenerator.COLORS.text}" text-anchor="middle">
    ${price.toFixed(3)}
  </text>`);
    });

    return bars.join("");
  }

  /**
   * Builds X axis day labels.
   */
  private buildXAxis(padding: number, chartW: number, chartH: number): string {
    const slotW = chartW / 7;
    return SvgChartGenerator.DAY_ORDER.map((day, i) => {
      const x = padding + i * slotW + slotW / 2;
      const y = padding + chartH + 20;
      return `
  <text x="${x.toFixed(1)}" y="${y}"
    font-family="monospace" font-size="13"
    fill="${SvgChartGenerator.COLORS.text}" text-anchor="middle">
    ${day}
  </text>`;
    }).join("");
  }

  /**
   * Builds an empty SVG when no data is available.
   */
  private buildEmptySvg(data: WeeklyData): string {
    return `<svg xmlns="http://www.w3.org/2000/svg"
  width="${SvgChartGenerator.WIDTH}" height="${SvgChartGenerator.HEIGHT}">
  <rect width="100%" height="100%" fill="${SvgChartGenerator.COLORS.background}" rx="12"/>
  <text x="50%" y="50%" font-family="monospace" font-size="16"
    fill="${SvgChartGenerator.COLORS.text}" text-anchor="middle">
    No data available for ${data.productName} — ${data.month}
  </text>
</svg>`;
  }
}
