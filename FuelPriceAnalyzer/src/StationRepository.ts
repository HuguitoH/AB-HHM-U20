import type { IDataFetcher } from "./interfaces/IDataFetcher.js";
import type { IStationParser } from "./interfaces/IStationParser.js";
import type { IStationRepository } from "./interfaces/IStationRepository.js";
import type { Station } from "./types/station.js";

export class StationRepository implements IStationRepository {

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
