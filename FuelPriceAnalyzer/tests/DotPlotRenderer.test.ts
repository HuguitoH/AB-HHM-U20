import { DotPlotRenderer } from "../src/DotPlotRenderer.js";
import type { ChartInput } from "../src/interfaces/IChartRender.js";
import type { WeeklyData } from "../src/types/weekly.js";

const mockWeekly: WeeklyData = {
  productId: "1",
  productName: "Gasolina 95 E5",
  month: "04-2026",
  averagesByDay: {
    Mon: 1.53,
    Tue: 1.532,
    Wed: 1.527,
    Thu: 1.529,
    Fri: 1.524,
    Sat: 1.526,
    Sun: 1.527,
  },
  sampleCount: {
    Mon: 4,
    Tue: 4,
    Wed: 4,
    Thu: 4,
    Fri: 4,
    Sat: 4,
    Sun: 4,
  },
};

describe("DotPlotRenderer", () => {
  const renderer = new DotPlotRenderer();

  test("renders chart string with valid data", () => {
    const result = renderer.render({ weekly: mockWeekly, daily: [] });
    expect(result).toContain("Gasolina 95 E5");
    expect(result).toContain("Min:");
    expect(result).toContain("Max:");
  });

  test("returns no data message when all prices are zero", () => {
    const input: ChartInput = {
      weekly: {
        ...mockWeekly,
        averagesByDay: {
          Mon: 0,
          Tue: 0,
          Wed: 0,
          Thu: 0,
          Fri: 0,
          Sat: 0,
          Sun: 0,
        },
      },
      daily: [],
    };
    expect(renderer.render(input)).toContain("No data available");
  });
});
