import { WeeklyAnalyzer } from "../src/WeeklyAnalyzer.js";
import type { DailyPriceData } from "../src/types/weekly.js";

const makeDayData = (
  date: string,
  dayOfWeek: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun",
  madridPrice: number,
  badajozPrice: number,
): DailyPriceData => ({
  date,
  dayOfWeek,
  pricesByProvince: {
    "Madrid|Gasolina 95 E5": madridPrice,
    "Badajoz|Gasolina 95 E5": badajozPrice,
  },
});

const mockData: DailyPriceData[] = [
  makeDayData("07-04-2026", "Tue", 1.5, 1.52),
  makeDayData("08-04-2026", "Wed", 1.51, 1.53),
  makeDayData("13-04-2026", "Mon", 1.49, 1.51),
  makeDayData("14-04-2026", "Tue", 1.48, 1.5),
  makeDayData("15-04-2026", "Wed", 1.47, 1.49),
];

describe("WeeklyAnalyzer", () => {
  const analyzer = new WeeklyAnalyzer();

  test("returns correct productId and productName", () => {
    const result = analyzer.analyze(mockData, "1", "Gasolina 95 E5", "04-2026");
    expect(result.productId).toBe("1");
    expect(result.productName).toBe("Gasolina 95 E5");
    expect(result.month).toBe("04-2026");
  });

  test("calculates correct average for Monday", () => {
    const result = analyzer.analyze(mockData, "1", "Gasolina 95 E5", "04-2026");
    // Only one Monday: Madrid 1.490, Badajoz 1.510 → avg 1.500
    expect(result.averagesByDay["Mon"]).toBe(1.5);
  });

  test("calculates correct average for Tuesday with multiple weeks", () => {
    const result = analyzer.analyze(mockData, "1", "Gasolina 95 E5", "04-2026");
    // Two Tuesdays:
    // Week1: Madrid 1.500, Badajoz 1.520 → avg 1.510
    // Week2: Madrid 1.480, Badajoz 1.500 → avg 1.490
    // Combined avg: (1.510 + 1.490) / 2 = 1.500
    expect(result.averagesByDay["Tue"]).toBe(1.5);
  });

  test("returns zero for days with no data", () => {
    const result = analyzer.analyze(mockData, "1", "Gasolina 95 E5", "04-2026");
    expect(result.averagesByDay["Sun"]).toBe(0);
    expect(result.averagesByDay["Fri"]).toBe(0);
  });

  test("sampleCount reflects number of data points per day", () => {
    const result = analyzer.analyze(mockData, "1", "Gasolina 95 E5", "04-2026");
    expect(result.sampleCount["Tue"]).toBe(4); // 2 Tuesdays × 2 provinces
    expect(result.sampleCount["Mon"]).toBe(2); // 1 Monday × 2 provinces
    expect(result.sampleCount["Sun"]).toBe(0);
  });

  test("returns empty averages for empty data", () => {
    const result = analyzer.analyze([], "1", "Gasolina 95 E5", "04-2026");
    expect(result.averagesByDay["Mon"]).toBe(0);
    expect(result.averagesByDay["Tue"]).toBe(0);
  });

  test("filters by product name correctly", () => {
    const mixedData: DailyPriceData[] = [
      {
        date: "07-04-2026",
        dayOfWeek: "Tue",
        pricesByProvince: {
          "Madrid|Gasolina 95 E5": 1.5,
          "Madrid|Gasóleo A habitual": 1.7,
        },
      },
    ];
    const result = analyzer.analyze(
      mixedData,
      "1",
      "Gasolina 95 E5",
      "04-2026",
    );
    // Should only use Gasolina 95 E5 price
    expect(result.averagesByDay["Tue"]).toBe(1.5);
  });
});
