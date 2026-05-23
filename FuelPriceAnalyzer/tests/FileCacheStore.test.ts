import fs from "node:fs";
import { FileCacheStore } from "../src/FileCacheStore.js";
import type { DailyPriceData } from "../src/types/weekly.js";

const mockData: DailyPriceData = {
  date: "07-04-2026",
  dayOfWeek: "Tue",
  pricesByProvince: {
    "Madrid|Gasolina 95 E5": 1.5,
  },
};

const TEST_CACHE_DIR = "test-cache-tmp";

afterEach(() => {
  if (fs.existsSync(TEST_CACHE_DIR)) {
    fs.rmSync(TEST_CACHE_DIR, { recursive: true });
  }
});

describe("FileCacheStore", () => {
  test("has returns false for uncached date", () => {
    const store = new FileCacheStore("1", TEST_CACHE_DIR);
    expect(store.has("07-04-2026", "1")).toBe(false);
  });

  test("get returns null for uncached date", () => {
    const store = new FileCacheStore("1", TEST_CACHE_DIR);
    expect(store.get("07-04-2026", "1")).toBeNull();
  });

  test("set and get returns correct data", () => {
    const store = new FileCacheStore("1", TEST_CACHE_DIR);
    store.set("07-04-2026", "1", mockData);
    const result = store.get("07-04-2026", "1");
    expect(result?.date).toBe("07-04-2026");
    expect(result?.dayOfWeek).toBe("Tue");
  });

  test("has returns true after set", () => {
    const store = new FileCacheStore("1", TEST_CACHE_DIR);
    store.set("07-04-2026", "1", mockData);
    expect(store.has("07-04-2026", "1")).toBe(true);
  });

  test("flush persists data to disk", () => {
    const store = new FileCacheStore("1", TEST_CACHE_DIR);
    store.set("07-04-2026", "1", mockData);
    store.flush();
    expect(fs.existsSync(`${TEST_CACHE_DIR}/prices-1.json`)).toBe(true);
  });

  test("new instance loads persisted cache from disk", () => {
    const store1 = new FileCacheStore("1", TEST_CACHE_DIR);
    store1.set("07-04-2026", "1", mockData);
    store1.flush();

    const store2 = new FileCacheStore("1", TEST_CACHE_DIR);
    expect(store2.has("07-04-2026", "1")).toBe(true);
    expect(store2.get("07-04-2026", "1")?.date).toBe("07-04-2026");
  });

  test("flush does not write if no changes made", () => {
    const store = new FileCacheStore("1", TEST_CACHE_DIR);
    store.flush();
    expect(fs.existsSync(`${TEST_CACHE_DIR}/prices-1.json`)).toBe(false);
  });
});
