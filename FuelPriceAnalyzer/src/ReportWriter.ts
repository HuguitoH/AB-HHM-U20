import fs from "node:fs";
import path from "node:path";
import type { IReportWriter } from "./interfaces/IReportWriter.js";

/**
 * Saves the formatted report to a file.
 *
 * Single Responsibility Principle: only handles file output.
 * Console output is handled by paginateReport in cli/prompt.ts.
 * No calculation, no formatting.
 */
export class ReportWriter implements IReportWriter {
  constructor(private readonly outputDir: string = "reports") {}

  /**
   * Saves the report to a file if save is true.
   * File is saved to reports/report-DD-MM-YYYY-{mode}.txt
   */
  write(text: string, date: string, mode: string, save: boolean): void {
    if (save) {
      this.saveToFile(text, date, mode);
    }
  }

  /**
   * Saves the report text to a file in the output directory.
   * Creates the directory if it does not exist.
   */
  private saveToFile(text: string, date: string, mode: string): void {
    fs.mkdirSync(this.outputDir, { recursive: true });
    const suffix = mode === "no-highway" ? "no-highway" : "all";
    const filename = `report-${date}-${suffix}.txt`;
    const filepath = path.join(this.outputDir, filename);
    fs.writeFileSync(filepath, text, "utf8");
    console.log(`\n  Report saved to: ${filepath}`);
  }
}
