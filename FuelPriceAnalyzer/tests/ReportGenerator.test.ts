import { ReportGenerator } from "../src/ReportGenerator.js";
import type { Station } from "../src/types/station.js";
import type { StationStore } from "../src/types/stationStore.js";

// Mock stations
const makeStation = (
  id: string,
  name: string,
  price: number,
  address: string,
): Station => ({
  id,
  name,
  address,
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

const cheapStation = makeStation("1", "CHEAP", 1.3, "CALLE BARATA, 1");
const midStation = makeStation("2", "MID", 1.5, "CALLE MEDIA, 2");
const expensiveStation = makeStation("3", "EXPENSIVE", 1.8, "CALLE CARA, 3");
const highwayStation = makeStation("4", "HIGHWAY", 1.9, "AUTOPISTA A-1 KM. 10");
const duplicateStation = makeStation("5", "CHEAP", 1.3, "CALLE BARATA, 1"); // same address as cheapStation

const mockStore: StationStore = new Map([
  [
    "Madrid",
    new Map([
      [
        "Gasolina 95 E5",
        [
          cheapStation,
          midStation,
          expensiveStation,
          highwayStation,
          duplicateStation,
        ],
      ],
    ]),
  ],
]);

describe("ReportGenerator", () => {
  const generator = new ReportGenerator();

  test("generates one entry per province/product combination", () => {
    const result = generator.generate(mockStore, "12-05-2026", "all");
    expect(result.entries).toHaveLength(1);
  });

  test("calculates correct average price", () => {
    const result = generator.generate(mockStore, "12-05-2026", "all");
    const entry = result.entries[0];
    // stations after dedup: cheap(1.3), mid(1.5), expensive(1.8), highway(1.9) = 6.5 / 4 = 1.625
    expect(entry?.averagePrice).toBe(1.625);
  });

  test("returns top 5 cheapest sorted ascending", () => {
    const result = generator.generate(mockStore, "12-05-2026", "all");
    const cheapest = result.entries[0]?.cheapest ?? [];
    expect(cheapest[0]?.price).toBe(1.3);
    expect(cheapest[1]?.price).toBe(1.5);
  });

  test("returns top 5 most expensive sorted descending", () => {
    const result = generator.generate(mockStore, "12-05-2026", "all");
    const expensive = result.entries[0]?.mostExpensive ?? [];
    expect(expensive[0]?.price).toBe(1.9);
    expect(expensive[1]?.price).toBe(1.8);
  });

  test("deduplicates stations with same address and locality", () => {
    const result = generator.generate(mockStore, "12-05-2026", "all");
    const entry = result.entries[0];
    // duplicateStation has same address as cheapStation → should be removed
    // remaining: cheap, mid, expensive, highway = 4
    expect(
      entry?.cheapest.length + (entry?.mostExpensive.length ?? 0),
    ).toBeLessThanOrEqual(8);
    expect(result.entries[0]?.averagePrice).not.toBe(
      (1.3 + 1.3 + 1.5 + 1.8 + 1.9) / 5, // would be 1.56 if not deduplicated
    );
  });

  test("excludes highway stations in no-highway mode", () => {
    const result = generator.generate(mockStore, "12-05-2026", "no-highway");
    const entry = result.entries[0];
    const allStations = [
      ...(entry?.cheapest ?? []),
      ...(entry?.mostExpensive ?? []),
    ];
    const hasHighway = allStations.some((s) =>
      s.address.toLowerCase().includes("autopista"),
    );
    expect(hasHighway).toBe(false);
  });

  test("includes highway stations in all mode", () => {
    const result = generator.generate(mockStore, "12-05-2026", "all");
    const entry = result.entries[0];
    const expensive = entry?.mostExpensive ?? [];
    expect(expensive[0]?.name).toBe("HIGHWAY");
  });

  test("propagates date and mode to ReportData", () => {
    const result = generator.generate(mockStore, "12-05-2026", "no-highway");
    expect(result.date).toBe("12-05-2026");
    expect(result.mode).toBe("no-highway");
  });

  test("returns empty entries when store has no data for province", () => {
    const emptyStore: StationStore = new Map();
    const result = generator.generate(emptyStore, "12-05-2026", "all");
    expect(result.entries).toHaveLength(0);
  });

  test("average price with single station equals station price", () => {
    const singleStore: StationStore = new Map([
      ["Madrid", new Map([["Gasolina 95 E5", [cheapStation]]])],
    ]);
    const result = generator.generate(singleStore, "12-05-2026", "all");
    expect(result.entries[0]?.averagePrice).toBe(1.3);
  });
});
