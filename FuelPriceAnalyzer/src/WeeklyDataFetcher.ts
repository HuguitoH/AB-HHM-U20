import { BASE_URL, PRODUCTS, PROVINCES } from "./config.js";
import type { ICacheStore } from "./interfaces/ICacheStore.js";
import type { IWeeklyDataFetcher } from "./interfaces/IWeeklyDataFetcher.js";
import type { DailyPriceData, DayOfWeek } from "./types/weekly.js";

/**
 * Fetches daily price data for the last N days using batch loading.
 * Cache-Aside Pattern: checks cache before calling the API.
 *
 * Single Responsibility Principle: only handles data fetching and caching.
 * No analysis, no rendering, no formatting.
 */
export class WeeklyDataFetcher implements IWeeklyDataFetcher {
  private static readonly BATCH_SIZE = 5;
  private static readonly BATCH_DELAY_MS = 200;

  private static readonly DAY_NAMES: DayOfWeek[] = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  constructor(private readonly cache: ICacheStore) {}

  /**
   * Fetches daily price data for the last N days.
   * Uses batch loading and cache to minimise API calls.
   * @param days - Number of days to fetch (default: 30)
   */
  async fetchLastDays(days: number = 30): Promise<DailyPriceData[]> {
    const dates = this.generateLastDays(days);
    const results: DailyPriceData[] = [];

    // Split dates into cached and missing
    const missing: string[] = [];
    for (const date of dates) {
      const cached = this.cache.get(date, "combined");
      if (cached) {
        results.push(cached);
      } else {
        missing.push(date);
      }
    }

    if (missing.length > 0) {
      console.log(`\n  Fetching ${missing.length} days from API...`);
      const fetched = await this.fetchInBatches(missing);
      for (const data of fetched) {
        this.cache.set(data.date, "combined", data);
        results.push(data);
      }
      this.cache.flush();
    }

    return results.sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Fetches data for multiple dates in batches of BATCH_SIZE.
   * Adds a delay between batches to avoid overwhelming the API.
   */
  private async fetchInBatches(dates: string[]): Promise<DailyPriceData[]> {
    const results: DailyPriceData[] = [];
    const batches = this.chunk(dates, WeeklyDataFetcher.BATCH_SIZE);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]!;
      console.log(`  Batch ${i + 1}/${batches.length}...`);

      const batchResults = await Promise.allSettled(
        batch.map((date) => this.fetchDayData(date)),
      );

      for (const result of batchResults) {
        if (result.status === "fulfilled" && result.value) {
          results.push(result.value);
        }
        // Silently skip failed dates (API delay, no data yet)
      }

      if (i < batches.length - 1) {
        await this.sleep(WeeklyDataFetcher.BATCH_DELAY_MS);
      }
    }

    return results;
  }

  /**
   * Fetches price data for a single date across all products and provinces.
   * Returns null if no data is available for that date.
   */
  private async fetchDayData(date: string): Promise<DailyPriceData | null> {
    const pricesByProvince: Record<string, number> = {};

    for (const product of PRODUCTS) {
      const url = `${BASE_URL}/EstacionesTerrestresHist/FiltroProducto/${date}/${product.id}`;

      try {
        const response = await fetch(url, {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) return null;

        const raw = (await response.json()) as {
          ListaEESSPrecio: Array<{
            Provincia: string;
            PrecioProducto: string;
          }>;
        };

        // Filter by our provinces and calculate average per province
        for (const province of PROVINCES) {
          const stations = raw.ListaEESSPrecio.filter(
            (s) =>
              s.Provincia.trim() === province.name.toUpperCase() &&
              s.PrecioProducto !== "",
          );

          if (stations.length > 0) {
            const avg =
              stations.reduce(
                (sum, s) =>
                  sum + parseFloat(s.PrecioProducto.replace(",", ".")),
                0,
              ) / stations.length;

            pricesByProvince[`${province.name}|${product.name}`] =
              Math.round(avg * 1000) / 1000;
          }
        }
      } catch {
        return null;
      }
    }

    if (Object.keys(pricesByProvince).length === 0) return null;

    return {
      date,
      dayOfWeek: this.getDayOfWeek(date),
      pricesByProvince,
    };
  }

  /**
   * Generates an array of the last N dates in DD-MM-YYYY format.
   * Excludes today and yesterday due to API publication delay.
   */
  private generateLastDays(days: number): string[] {
    const dates: string[] = [];
    const today = new Date();

    // Start from 2 days ago due to API delay
    for (let i = 2; i < days + 2; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(this.formatDate(date));
    }

    return dates;
  }

  /**
   * Returns the day of the week for a DD-MM-YYYY date string.
   */
  private getDayOfWeek(date: string): DayOfWeek {
    const [day, month, year] = date.split("-").map(Number);
    const d = new Date(year!, month! - 1, day!);
    return WeeklyDataFetcher.DAY_NAMES[d.getDay()]!;
  }

  /**
   * Formats a Date object as DD-MM-YYYY.
   */
  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  /**
   * Splits an array into chunks of the given size.
   */
  private chunk<T>(arr: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size),
    );
  }

  /**
   * Pauses execution for the given number of milliseconds.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
