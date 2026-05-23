import { createInterface } from "node:readline";
import { AnalyzerFactory } from "../AnalyzerFactory.js";
import type { IChartRenderer } from "../interfaces/IChartRender.js";

/**
 * Prompts the user to select a chart style interactively.
 * Validates input and re-prompts on invalid selection.
 *
 * Single Responsibility: only handles CLI chart style selection.
 * @returns The selected IChartRenderer implementation
 */
export async function selectChartStyle(): Promise<IChartRenderer> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const ask = () => {
      console.log("  Chart style:");
      console.log("  [1] Vertical bars  — compare prices day by day");
      console.log("  [2] Dot plot       — see price spread across the week");
      console.log("  [3] Line chart     — see weekly trend");
      console.log("");

      rl.question("  Select [1/2/3]: ", (answer) => {
        const input = answer.trim();

        if (input === "1") {
          rl.close();
          resolve(AnalyzerFactory.createBarChartRenderer());
        } else if (input === "2") {
          rl.close();
          resolve(AnalyzerFactory.createDotPlotRenderer());
        } else if (input === "3") {
          rl.close();
          resolve(AnalyzerFactory.createLineChartRenderer());
        } else {
          console.log("\n  Invalid option. Please enter 1, 2 or 3.\n");
          ask();
        }
      });
    };

    ask();
  });
}

/**
 * Prompts the user to select the month for chart data.
 * Defaults to the last 30 days if no month is provided via CLI.
 * @returns Month string in MM-YYYY format
 */
export function parseMonthArg(args: string[]): string {
  const idx = args.indexOf("--month");
  if (idx !== -1 && args[idx + 1]) {
    return args[idx + 1] as string;
  }

  // Default to current month
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${month}-${year}`;
}
