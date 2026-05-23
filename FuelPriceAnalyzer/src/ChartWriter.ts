import fs from "node:fs";
import path from "node:path";
import type { IChartWriter } from "./interfaces/IChartWriter.js";

/**
 * Saves SVG chart content to the charts/ directory.
 *
 * Single Responsibility Principle: only handles file output.
 * No rendering, no calculation, no CLI interaction.
 */
export class ChartWriter implements IChartWriter {
  constructor(private readonly outputDir: string = "charts") {}

  /**
   * Saves the SVG chart to disk.
   * Creates the output directory if it does not exist.
   * @param content - SVG markup string to save
   * @param productName - Used to build the filename
   * @param month - Used to build the filename (MM-YYYY)
   */
  write(content: string, productName: string, month: string): void {
    fs.mkdirSync(this.outputDir, { recursive: true });

    const filename = this.buildFilename(productName, month);
    const filepath = path.join(this.outputDir, filename);

    fs.writeFileSync(filepath, content, "utf8");
    console.log(`  Chart saved to: ${filepath}`);
  }

  /**
   * Builds a safe filename from product name and month.
   * e.g. "Gasolina 95 E5" + "05-2026" → "chart-gasolina-95-e5-05-2026.svg"
   */
  private buildFilename(productName: string, month: string): string {
    const slug = productName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    return `chart-${slug}-${month}.svg`;
  }
}
