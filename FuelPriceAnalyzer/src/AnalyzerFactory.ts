import { ApiDataFetcher } from "./ApiDataFetcher.js";
import { AsciiChartRenderer } from "./AsciiChartRenderer.js";
import { ChartWriter } from "./ChartWriter.js";
import { DotPlotRenderer } from "./DotPlotRenderer.js";
import { FileCacheStore } from "./FileCacheStore.js";
import { LineChartRenderer } from "./LineChartRenderer.js";
import { ReportFormatter } from "./ReportFormatter.js";
import { ReportGenerator } from "./ReportGenerator.js";
import { ReportWriter } from "./ReportWriter.js";
import { StationLoader } from "./StationLoader.js";
import { StationParser } from "./StationParser.js";
import { StationRepository } from "./StationRepository.js";
import { SvgChartGenerator } from "./SvgChartGenerator.js";
import { WeeklyAnalyzer } from "./WeeklyAnalyzer.js";
import { WeeklyDataFetcher } from "./WeeklyDataFetcher.js";
import type { ICacheStore } from "./interfaces/ICacheStore.js";
import type { IChartRenderer } from "./interfaces/IChartRender.js";
import type { IChartWriter } from "./interfaces/IChartWriter.js";
import type { IDataFetcher } from "./interfaces/IDataFetcher.js";
import type { IReportFormatter } from "./interfaces/IReportFormatter.js";
import type { IReportGenerator } from "./interfaces/IReportGenerator.js";
import type { IReportWriter } from "./interfaces/IReportWriter.js";
import type { IStationLoader } from "./interfaces/IStationLoader.js";
import type { IStationParser } from "./interfaces/IStationParser.js";
import type { IStationRepository } from "./interfaces/IStationRepository.js";
import type { IWeeklyAnalyzer } from "./interfaces/IWeeklyAnalyzer.js";
import type { IWeeklyDataFetcher } from "./interfaces/IWeeklyDataFetcher.js";

/**
 * Factory for creating all analyzer components.
 * Creational Pattern — Factory Method: centralises object creation,
 * decoupling consumers from concrete implementations.
 * Open/Closed: swap implementations without touching index.ts.
 */
export class AnalyzerFactory {
  private constructor() {}

  static createFetcher(): IDataFetcher {
    return new ApiDataFetcher();
  }

  static createParser(): IStationParser {
    return new StationParser();
  }

  static createRepository(): IStationRepository {
    const fetcher = AnalyzerFactory.createFetcher();
    const parser = AnalyzerFactory.createParser();
    return new StationRepository(fetcher, parser);
  }

  static createLoader(): IStationLoader {
    const repository = AnalyzerFactory.createRepository();
    return new StationLoader(repository);
  }

  static createGenerator(): IReportGenerator {
    return new ReportGenerator();
  }

  static createFormatter(): IReportFormatter {
    return new ReportFormatter();
  }

  static createWriter(): IReportWriter {
    return new ReportWriter();
  }

  static createCacheStore(productId: string): ICacheStore {
    return new FileCacheStore(productId);
  }

  static createWeeklyFetcher(productId: string): IWeeklyDataFetcher {
    const cache = AnalyzerFactory.createCacheStore(productId);
    return new WeeklyDataFetcher(cache);
  }

  static createWeeklyAnalyzer(): IWeeklyAnalyzer {
    return new WeeklyAnalyzer();
  }

  static createBarChartRenderer(): IChartRenderer {
    return new AsciiChartRenderer();
  }

  static createDotPlotRenderer(): IChartRenderer {
    return new DotPlotRenderer();
  }

  static createLineChartRenderer(): IChartRenderer {
    return new LineChartRenderer();
  }

  static createSvgGenerator(): IChartRenderer {
    return new SvgChartGenerator();
  }

  static createChartWriter(): IChartWriter {
    return new ChartWriter();
  }
}
