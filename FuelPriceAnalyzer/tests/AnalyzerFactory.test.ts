import { AnalyzerFactory } from "../src/AnalyzerFactory.js";

describe("AnalyzerFactory", () => {
  test("createFetcher returns object with fetch method", () => {
    const fetcher = AnalyzerFactory.createFetcher();
    expect(typeof fetcher.fetch).toBe("function");
  });

  test("createParser returns object with parse method", () => {
    const parser = AnalyzerFactory.createParser();
    expect(typeof parser.parse).toBe("function");
  });

  test("createRepository returns object with getByProvinceAndProduct method", () => {
    const repo = AnalyzerFactory.createRepository();
    expect(typeof repo.getByProvinceAndProduct).toBe("function");
  });

  test("createLoader returns object with load method", () => {
    const loader = AnalyzerFactory.createLoader();
    expect(typeof loader.load).toBe("function");
  });

  test("createGenerator returns object with generate method", () => {
    const generator = AnalyzerFactory.createGenerator();
    expect(typeof generator.generate).toBe("function");
  });

  test("createFormatter returns object with format method", () => {
    const formatter = AnalyzerFactory.createFormatter();
    expect(typeof formatter.format).toBe("function");
  });

  test("createWriter returns object with write method", () => {
    const writer = AnalyzerFactory.createWriter();
    expect(typeof writer.write).toBe("function");
  });

  test("createLoader returns new instance each call", () => {
    const a = AnalyzerFactory.createLoader();
    const b = AnalyzerFactory.createLoader();
    expect(a).not.toBe(b);
  });

  test("createWeeklyAnalyzer returns object with analyze method", () => {
    const analyzer = AnalyzerFactory.createWeeklyAnalyzer();
    expect(typeof analyzer.analyze).toBe("function");
  });

  test("createWeeklyFetcher returns object with fetchLastDays method", () => {
    const fetcher = AnalyzerFactory.createWeeklyFetcher("1");
    expect(typeof fetcher.fetchLastDays).toBe("function");
  });

  test("createCacheStore returns object with get/set/has/flush methods", () => {
    const cache = AnalyzerFactory.createCacheStore("1");
    expect(typeof cache.get).toBe("function");
    expect(typeof cache.set).toBe("function");
    expect(typeof cache.has).toBe("function");
    expect(typeof cache.flush).toBe("function");
  });

  test("createBarChartRenderer returns object with render method", () => {
    const renderer = AnalyzerFactory.createBarChartRenderer();
    expect(typeof renderer.render).toBe("function");
  });

  test("createDotPlotRenderer returns object with render method", () => {
    const renderer = AnalyzerFactory.createDotPlotRenderer();
    expect(typeof renderer.render).toBe("function");
  });

  test("createLineChartRenderer returns object with render method", () => {
    const renderer = AnalyzerFactory.createLineChartRenderer();
    expect(typeof renderer.render).toBe("function");
  });

  test("createSvgGenerator returns object with render method", () => {
    const generator = AnalyzerFactory.createSvgGenerator();
    expect(typeof generator.render).toBe("function");
  });

  test("createChartWriter returns object with write method", () => {
    const writer = AnalyzerFactory.createChartWriter();
    expect(typeof writer.write).toBe("function");
  });
});
