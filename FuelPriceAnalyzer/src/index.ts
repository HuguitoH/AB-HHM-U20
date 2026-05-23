import { AnalyzerFactory } from "./AnalyzerFactory.js";
import { parseMonthArg, selectChartStyle } from "./cli/chartPrompt.js";
import { paginateReport, selectReportMode } from "./cli/prompt.js";
import { printSummary } from "./cli/summary.js";
import { PRODUCTS } from "./config.js";
import { parseDateArg } from "./utils/date.js";

/**
 * Entry point for the CLI.
 * Usage: npm run dev -- --date DD-MM-YYYY [--report] [--save-report]
 *
 * --date        Date to fetch data for (default: today)
 * --report      Generate full report instead of summary
 * --save-report Save report to reports/report-DD-MM-YYYY.txt (requires --report)
 * --month       Month for chart data in MM-YYYY format (default: current month)
 */

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const date = parseDateArg(args);
  const showReport = args.includes("--report");
  const saveReport = args.includes("--save-report");
  const showCharts = args.includes("--charts");

  if (showCharts) {
    await runChartsMode(args);
    return;
  }

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

/**
 * Runs the charts mode — fetches last 30 days, analyses weekly trends,
 * renders CLI charts and generates SVG images.
 */
async function runChartsMode(args: string[]): Promise<void> {
  const month = parseMonthArg(args);

  console.log(`\nFuel Price Analyzer — Weekly Charts — ${month}\n`);

  const renderer = await selectChartStyle();
  const analyzer = AnalyzerFactory.createWeeklyAnalyzer();
  const svgGen = AnalyzerFactory.createSvgGenerator();
  const chartWriter = AnalyzerFactory.createChartWriter();
  const pages: string[] = [];

  console.log("");

  for (const product of PRODUCTS) {
    const fetcher = AnalyzerFactory.createWeeklyFetcher(product.id);
    const dailyData = await fetcher.fetchLastDays(30);

    const weeklyData = analyzer.analyze(
      dailyData,
      product.id,
      product.name,
      month,
    );

    const input = { weekly: weeklyData, daily: dailyData };

    pages.push(renderer.render(input));

    const svg = svgGen.render(input);
    chartWriter.write(svg, product.name, month);
  }

  console.log("");
  await paginateReport(pages);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
