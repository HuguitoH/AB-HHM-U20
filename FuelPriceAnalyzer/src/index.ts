import { AnalyzerFactory } from "./AnalyzerFactory.js";
import { paginateReport, selectReportMode } from "./cli/prompt.js";
import { printSummary } from "./cli/summary.js";
import { parseDateArg } from "./utils/date.js";

/**
 * Entry point for the CLI.
 * Usage: npm run dev -- --date DD-MM-YYYY [--report] [--save-report]
 *
 * --date        Date to fetch data for (default: today)
 * --report      Generate full report instead of summary
 * --save-report Save report to reports/report-DD-MM-YYYY.txt (requires --report)
 */

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const date = parseDateArg(args);
  const showReport = args.includes("--report");
  const saveReport = args.includes("--save-report");

  console.log(`\nFuel Price Analyzer — date: ${date}\n`);

  // Factory creates all dependencies
  const loader = AnalyzerFactory.createLoader();

  const store = await loader.load(date);

  if (!store) {
    console.error(
      `No data available for ${date}.\n` +
        `The Ministry API publishes data with a 1-2 day delay.\n` +
        `Try: npm run dev -- --date DD-MM-YYYY`,
    );
    process.exit(1);
  }

  if (showReport) {
    const mode = await selectReportMode();
    const generator = AnalyzerFactory.createGenerator();
    const formatter = AnalyzerFactory.createFormatter();
    const writer = AnalyzerFactory.createWriter();

    const reportData = generator.generate(store, date, mode);
    const formattedReport = formatter.format(reportData);

    if (saveReport) {
      writer.write(formattedReport, date, mode, true);
    }

    const pages = formatter.formatPages(reportData);
    await paginateReport(pages);
  } else {
    printSummary(store, loader);
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
