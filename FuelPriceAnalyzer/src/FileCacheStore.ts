import fs from "node:fs";
import path from "node:path";
import type { ICacheStore } from "./interfaces/ICacheStore.js";
import type { DailyPriceData } from "./types/weekly.js";

/**
 * File-based cache store for daily price data.
 * Cache-Aside Pattern: persists data to JSON files between program runs.
 * One file per product, keyed by date.
 *
 * Single Responsibility Principle: only handles cache read/write operations.
 */
export class FileCacheStore implements ICacheStore {
  // In-memory cache — loaded from disk on first access
  private cache: Map<string, DailyPriceData> = new Map();
  private dirty = false;

  constructor(
    private readonly productId: string,
    private readonly cacheDir: string = "cache",
  ) {
    this.loadFromDisk();
  }

  /**
   * Returns cached data for a given date and product, or null if not cached.
   */
  get(date: string, productId: string): DailyPriceData | null {
    const key = this.buildKey(date, productId);
    return this.cache.get(key) ?? null;
  }

  /**
   * Stores daily price data in the in-memory cache.
   * Call flush() to persist to disk.
   */
  set(date: string, productId: string, data: DailyPriceData): void {
    const key = this.buildKey(date, productId);
    this.cache.set(key, data);
    this.dirty = true;
  }

  /**
   * Returns true if data for the given date and product is cached.
   */
  has(date: string, productId: string): boolean {
    return this.cache.has(this.buildKey(date, productId));
  }

  /**
   * Persists the in-memory cache to disk if any changes were made.
   */
  flush(): void {
    if (!this.dirty) return;

    fs.mkdirSync(this.cacheDir, { recursive: true });

    const filepath = path.join(this.cacheDir, `prices-${this.productId}.json`);
    const data = Object.fromEntries(this.cache.entries());
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf8");

    this.dirty = false;
  }

  /**
   * Loads existing cache from disk into memory.
   * Called once on construction.
   */
  private loadFromDisk(): void {
    const filepath = path.join(this.cacheDir, `prices-${this.productId}.json`);

    if (!fs.existsSync(filepath)) return;

    try {
      const raw = fs.readFileSync(filepath, "utf8");
      const data = JSON.parse(raw) as Record<string, DailyPriceData>;
      for (const [key, value] of Object.entries(data)) {
        this.cache.set(key, value);
      }
    } catch {
      // Corrupt cache — start fresh
      this.cache.clear();
    }
  }

  /**
   * Builds a unique cache key from date and productId.
   */
  private buildKey(date: string, productId: string): string {
    return `${date}|${productId}`;
  }
}
