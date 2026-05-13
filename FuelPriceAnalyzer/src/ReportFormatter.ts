import type { IReportFormatter } from "./interfaces/IReportFormatter.js";
import type { ReportData, ReportEntry } from "./types/report.js";
import type { Station } from "./types/station.js";

/**
 * Formats report data into a human-readable string.
 *
 * Single Responsibility Principle: only handles presentation logic.
 * No calculation, no output, no HTTP calls.
 */
export class ReportFormatter implements IReportFormatter {
  format(data: ReportData): string {
    const lines: string[] = [];

    lines.push("=".repeat(60));
    lines.push(`  FUEL PRICE REPORT — ${data.date}`);
    lines.push("=".repeat(60));
    lines.push("");

    for (const entry of data.entries) {
      lines.push(...this.formatEntry(entry));
    }

    return lines.join("\n");
  }

  private formatEntry(entry: ReportEntry): string[] {
    const lines: string[] = [];

    lines.push(`>>> ${entry.province} / ${entry.product}`);
    lines.push("-".repeat(60));
    lines.push(`  Average price: ${entry.averagePrice.toFixed(3)} €/L`);
    lines.push("");

    lines.push("  ▼ Top 5 cheapest:");
    lines.push(...this.formatStations(entry.cheapest));
    lines.push("");

    lines.push("  ▲ Top 5 most expensive:");
    lines.push(...this.formatStations(entry.mostExpensive));
    lines.push("");

    return lines;
  }

  private formatStations(stations: Station[]): string[] {
    return stations.map(
      (s, i) =>
        `    ${i + 1}. ${s.name.padEnd(30)} ${s.price.toFixed(3)} €/L — ${s.address}, ${s.locality}`,
    );
  }
}
