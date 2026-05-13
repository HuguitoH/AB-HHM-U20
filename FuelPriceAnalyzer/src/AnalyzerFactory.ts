import { ApiDataFetcher } from "./ApiDataFetcher.js";
import { ReportFormatter } from "./ReportFormatter.js";
import { ReportGenerator } from "./ReportGenerator.js";
import { ReportWriter } from "./ReportWriter.js";
import { StationLoader } from "./StationLoader.js";
import { StationParser } from "./StationParser.js";
import { StationRepository } from "./StationRepository.js";
import type { IDataFetcher } from "./interfaces/IDataFetcher.js";
import type { IReportFormatter } from "./interfaces/IReportFormatter.js";
import type { IReportGenerator } from "./interfaces/IReportGenerator.js";
import type { IReportWriter } from "./interfaces/IReportWriter.js";
import type { IStationLoader } from "./interfaces/IStationLoader.js";
import type { IStationParser } from "./interfaces/IStationParser.js";
import type { IStationRepository } from "./interfaces/IStationRepository.js";

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
}
