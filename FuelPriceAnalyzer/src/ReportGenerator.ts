import { PRODUCTS, PROVINCES } from "./config.js";
import type { IReportGenerator } from "./interfaces/IReportGenerator.js";
import type { ReportData, ReportEntry } from "./types/report.js";
import type { Station } from "./types/station.js";
import type { StationStore } from "./types/stationStore.js";

/**
 * Generates report data from the in-memory StationStore.
 *
 * Single Responsibility Principle: only handles data calculation.
 * No formatting, no output, no HTTP calls.
 */
export class ReportGenerator implements IReportGenerator {
  generate(store: StationStore, date: string): ReportData {
    const entries: ReportEntry[] = [];

    for (const province of PROVINCES) {
      for (const product of PRODUCTS) {
        const stations = store.get(province.name)?.get(product.name) ?? [];

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

    return { date, entries };
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
