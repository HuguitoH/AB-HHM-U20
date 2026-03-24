import type { IDataFetcher } from "./interfaces/IDataFetcher.js";
import type { IStationParser } from "./interfaces/IStationParser.js";
import type { IStationRepository } from "./interfaces/IStationRepository.js";
import type { Station } from "./types/station.js";

/**
 * Orchestrates data fetching and parsing to produce Station arrays.
 *
 * Dependency Inversion Principle: depends on IDataFetcher and IStationParser
 * interfaces, not on concrete implementations. This allows swapping
 * ApiDataFetcher for a mock in tests without modifying this class.
 */
export class StationRepository implements IStationRepository {

    // Dependencies injected via constructor (Dependency Injection pattern)
    constructor(
        private readonly fetcher: IDataFetcher,
        private readonly parser: IStationParser
    ) { }
    
    async getByProvinceAndProduct(
        date: string,
        provinceId: string,
        productId: string,
        productName: string
    ): Promise<Station[]> {
        const raw = await this.fetcher.fetch(date, provinceId, productId);
        return this.parser.parse(raw, productId, productName);
    }
}
