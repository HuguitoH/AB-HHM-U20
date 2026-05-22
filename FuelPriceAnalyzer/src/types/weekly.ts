/**
 * Days of the week in display order.
 * Used as keys for weekly price averages.
 */
export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

/**
 * Price data for a single day across all studied provinces.
 * Organised by province name → average price.
 */
export interface DailyPriceData {
  date: string; // DD-MM-YYYY
  dayOfWeek: DayOfWeek;
  pricesByProvince: Record<string, number>; // province name → avg price
}

/**
 * Weekly analysis result for a single fuel product.
 * Contains average prices grouped by day of the week
 * across all studied provinces combined.
 */
export interface WeeklyData {
  productId: string;
  productName: string;
  month: string; // MM-YYYY
  averagesByDay: Record<DayOfWeek, number>;
  sampleCount: Record<DayOfWeek, number>; // how many data points per day
}

/**
 * Full chart dataset for all products.
 */
export interface ChartDataset {
  generatedAt: string;
  month: string;
  data: WeeklyData[];
}
