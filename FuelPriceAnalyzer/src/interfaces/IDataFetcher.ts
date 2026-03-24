import type { RawApiResponse } from "../types/raw.js";

export interface IDataFetcher {
    fetch(date: string, provinceId: string, productId: string): Promise<RawApiResponse>;
}

