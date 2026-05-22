import type { IWeeklyAnalyzer } from "./interfaces/IWeeklyAnalyzer.js";
import type { DailyPriceData, DayOfWeek, WeeklyData } from "./types/weekly.js";

/**
 * Analyses daily price data into weekly averages grouped by day of the week.
 *
 * Single Responsibility Principle: only handles weekly grouping and calculation.
 * No fetching, no rendering, no output.
 */
export class WeeklyAnalyzer implements IWeeklyAnalyzer {
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
   * Groups daily price data by day of the week and calculates averages.
   * Combines prices across all studied provinces into a single average per day.
   */
  analyze(
    data: DailyPriceData[],
    productId: string,
    productName: string,
    month: string,
  ): WeeklyData {
    // Group prices by day of week
    const pricesByDay = this.groupByDayOfWeek(data, productName);

    // Calculate average per day
    const averagesByDay = {} as Record<DayOfWeek, number>;
    const sampleCount = {} as Record<DayOfWeek, number>;

    for (const day of WeeklyAnalyzer.DAY_ORDER) {
      const prices = pricesByDay[day] ?? [];
      averagesByDay[day] =
        prices.length > 0
          ? Math.round(
              (prices.reduce((a, b) => a + b, 0) / prices.length) * 1000,
            ) / 1000
          : 0;
      sampleCount[day] = prices.length;
    }

    return { productId, productName, month, averagesByDay, sampleCount };
  }

  /**
   * Groups all province prices by day of the week for a given product.
   * Combines prices from all provinces into a single array per day.
   */
  private groupByDayOfWeek(
    data: DailyPriceData[],
    productName: string,
  ): Partial<Record<DayOfWeek, number[]>> {
    const groups: Partial<Record<DayOfWeek, number[]>> = {};

    for (const day of data) {
      const prices = Object.entries(day.pricesByProvince)
        .filter(([key]) => key.includes(productName))
        .map(([, price]) => price);

      if (prices.length === 0) continue;

      if (!groups[day.dayOfWeek]) {
        groups[day.dayOfWeek] = [];
      }
      groups[day.dayOfWeek]!.push(...prices);
    }

    return groups;
  }
}
