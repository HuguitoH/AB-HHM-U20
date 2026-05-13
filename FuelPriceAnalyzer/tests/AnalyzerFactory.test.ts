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
});
