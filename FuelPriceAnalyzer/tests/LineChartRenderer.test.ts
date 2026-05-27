import { LineChartRenderer } from "../src/LineChartRenderer.js";
import type { ChartInput } from "../src/interfaces/IChartRender.js";
import type { DailyPriceData, WeeklyData } from "../src/types/weekly.js";

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

const mockDaily: DailyPriceData[] = [
  {
    date: "01-04-2026",
    dayOfWeek: "Wed",
    pricesByProvince: { "Madrid|Gasolina 95 E5": 1.52 },
  },
  {
    date: "02-04-2026",
    dayOfWeek: "Thu",
    pricesByProvince: { "Madrid|Gasolina 95 E5": 1.525 },
  },
  {
    date: "03-04-2026",
    dayOfWeek: "Fri",
    pricesByProvince: { "Madrid|Gasolina 95 E5": 1.53 },
  },
];

describe("LineChartRenderer", () => {
  const renderer = new LineChartRenderer();

  test("renders chart string with valid daily data", () => {
    const result = renderer.render({ weekly: mockWeekly, daily: mockDaily });
    expect(result).toContain("Gasolina 95 E5");
    expect(result).toContain("Min:");
    expect(result).toContain("Max:");
  });

  test("returns no data message when daily is empty", () => {
    const input: ChartInput = { weekly: mockWeekly, daily: [] };
    expect(renderer.render(input)).toContain("No data available");
  });
});
