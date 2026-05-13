import { ReportFormatter } from "../src/ReportFormatter.js";
import type { ReportData } from "../src/types/report.js";
import type { Station } from "../src/types/station.js";

const makeStation = (id: string, name: string, price: number): Station => ({
  id,
  name,
  address: `CALLE ${name}, 1`,
  locality: "TEST",
  municipality: "TEST",
  province: "MADRID",
  postalCode: "28000",
  price,
  productId: "1",
  productName: "Gasolina 95 E5",
  lat: 40.0,
  lon: -3.0,
  schedule: "L-D: 00:00-24:00",
  date: new Date(2026, 4, 12),
});

const mockData: ReportData = {
  date: "12-05-2026",
  mode: "all",
  entries: [
    {
      province: "Madrid",
      product: "Gasolina 95 E5",
      averagePrice: 1.55,
      cheapest: [makeStation("1", "CHEAP", 1.3)],
      mostExpensive: [makeStation("2", "EXPENSIVE", 1.8)],
    },
  ],
};

describe("ReportFormatter", () => {
  const formatter = new ReportFormatter();

  test("format includes date in header", () => {
    const result = formatter.format(mockData);
    expect(result).toContain("12-05-2026");
  });

  test("format includes mode in header", () => {
    const result = formatter.format(mockData);
    expect(result).toContain("All stations");
  });

  test("format includes province and product", () => {
    const result = formatter.format(mockData);
    expect(result).toContain("Madrid");
    expect(result).toContain("Gasolina 95 E5");
  });

  test("format includes average price", () => {
    const result = formatter.format(mockData);
    expect(result).toContain("1.550");
  });

  test("format includes cheapest station name", () => {
    const result = formatter.format(mockData);
    expect(result).toContain("CHEAP");
  });

  test("format includes most expensive station name", () => {
    const result = formatter.format(mockData);
    expect(result).toContain("EXPENSIVE");
  });

  test("format no-highway mode shows correct label", () => {
    const noHighwayData: ReportData = { ...mockData, mode: "no-highway" };
    const result = formatter.format(noHighwayData);
    expect(result).toContain("Excluding highway stations");
  });

  test("formatPages returns one page per entry", () => {
    const pages = formatter.formatPages(mockData);
    expect(pages).toHaveLength(1);
  });

  test("formatPages each page contains entry province", () => {
    const pages = formatter.formatPages(mockData);
    expect(pages[0]).toContain("Madrid");
  });

  test("formatPages each page contains report header", () => {
    const pages = formatter.formatPages(mockData);
    expect(pages[0]).toContain("FUEL PRICE REPORT");
  });
});
