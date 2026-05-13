import { PRODUCTS, PROVINCES } from "./config.js";
import type { IReportGenerator } from "./interfaces/IReportGenerator.js";
import type { ReportData, ReportEntry, ReportMode } from "./types/report.js";
import type { Station } from "./types/station.js";
import type { StationStore } from "./types/stationStore.js";

/**
 * Generates report data from the in-memory StationStore.
 *
 * Single Responsibility Principle: only handles data calculation.
 * No formatting, no output, no HTTP calls.
 */
export class ReportGenerator implements IReportGenerator {
  // Keywords that identify highway stations in address field
  private static readonly HIGHWAY_KEYWORDS = [
    "autopista",
    "autovia",
    "au r-",
    "au a-",
    "au ap-",
  ];

  /**
   * Generates a full report from the in-memory store for a given date and mode.
   * @param store - In-memory station data indexed by province and product
   * @param date - Date in DD-MM-YYYY format
   * @param mode - 'all' includes highways, 'no-highway' excludes them
   */
  generate(store: StationStore, date: string, mode: ReportMode): ReportData {
    const entries: ReportEntry[] = [];

    for (const province of PROVINCES) {
      for (const product of PRODUCTS) {
        const raw = store.get(province.name)?.get(product.name) ?? [];

        // Deduplicate by address+locality — Ministry API sometimes returns duplicates
        const deduplicated = this.deduplicateByLocation(raw);

        // Apply mode filter
        const stations =
          mode === "no-highway"
            ? this.filterHighway(deduplicated)
            : deduplicated;

        if (stations.length === 0) continue;

        entries.push({
          province: province.name,
          product: product.name,
          averagePrice: this.calculateAverage(stations),
          cheapest: this.getTopN(stations, 5, "asc"),
          mostExpensive: this.getTopN(stations, 5, "desc"),
        });
      }
    }

    return { date, mode, entries };
  }

  /**
   * Removes duplicate stations by address and locality.
   * The Ministry API registers some physical stations as multiple entries
   * with different IDs but identical address and locality.
   */
  private deduplicateByLocation(stations: Station[]): Station[] {
    const seen = new Set<string>();
    return stations.filter((s) => {
      const key = `${s.address.toLowerCase().trim()}|${s.locality.toLowerCase().trim()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Filters out highway stations based on address keywords.
   */
  private filterHighway(stations: Station[]): Station[] {
    return stations.filter(
      (s) =>
        !ReportGenerator.HIGHWAY_KEYWORDS.some((kw) =>
          s.address.toLowerCase().includes(kw),
        ),
    );
  }

  /**
   * Calculates the average price across all stations.
   */
  private calculateAverage(stations: Station[]): number {
    const total = stations.reduce((sum, s) => sum + s.price, 0);
    return Math.round((total / stations.length) * 1000) / 1000;
  }

  /**
   * Returns the top N stations sorted by price.
   * 'asc' → cheapest first, 'desc' → most expensive first.
   */
  private getTopN(
    stations: Station[],
    n: number,
    order: "asc" | "desc",
  ): Station[] {
    return [...stations]
      .sort((a, b) => (order === "asc" ? a.price - b.price : b.price - a.price))
      .slice(0, n);
  }
}
