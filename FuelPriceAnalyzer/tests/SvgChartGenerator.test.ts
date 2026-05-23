import { SvgChartGenerator } from "../src/SvgChartGenerator.js";
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

const mockInput: ChartInput = {
  weekly: mockWeekly,
  daily: [],
};

describe("SvgChartGenerator", () => {
  const generator = new SvgChartGenerator();

  test("render returns valid SVG string", () => {
    const result = generator.render(mockInput);
    expect(result).toContain("<svg");
    expect(result).toContain("</svg>");
  });

  test("render includes product name in title", () => {
    const result = generator.render(mockInput);
    expect(result).toContain("Gasolina 95 E5");
  });

  test("render includes month in title", () => {
    const result = generator.render(mockInput);
    expect(result).toContain("04-2026");
  });

  test("render includes all 7 day labels", () => {
    const result = generator.render(mockInput);
    expect(result).toContain("Mon");
    expect(result).toContain("Tue");
    expect(result).toContain("Wed");
    expect(result).toContain("Thu");
    expect(result).toContain("Fri");
    expect(result).toContain("Sat");
    expect(result).toContain("Sun");
  });

  test("render includes price values", () => {
    const result = generator.render(mockInput);
    expect(result).toContain("1.532");
    expect(result).toContain("1.524");
  });

  test("render returns empty SVG when no data available", () => {
    const emptyInput: ChartInput = {
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
    const result = generator.render(emptyInput);
    expect(result).toContain("<svg");
    expect(result).toContain("No data available");
  });
});
