import type { DailyPriceData } from "../types/weekly.js";

/**
 * Abstraction for caching daily price data between runs.
 * Cache-Aside Pattern: consumers check cache before calling API.
 */
export interface ICacheStore {
  /**
   * Returns cached data for a given date and product, or null if not cached.
   */
  get(date: string, productId: string): DailyPriceData | null;

  /**
   * Stores daily price data in the cache.
   */
  set(date: string, productId: string, data: DailyPriceData): void;

  /**
   * Returns true if data for the given date and product is cached.
   */
  has(date: string, productId: string): boolean;

  /**
   * Persists the cache to disk.
   */
  flush(): void;
}
