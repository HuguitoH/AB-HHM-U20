import type { IDataFetcher } from "./interfaces/IDataFetcher.js";
import type { RawApiResponse } from "./types/raw.js";
import { BASE_URL } from "./config.js";

export class ApiDataFetcher implements IDataFetcher {
    
    async fetch(date: string, provinceId: string, productId: string): Promise<RawApiResponse> {
        const url = `${BASE_URL}/EstacionesTerrestresHist/FiltroProvinciaProducto/${date}/${provinceId}/${productId}`;

        const response = await fetch(url, {
            headers: {'Accept': 'application/json'}
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} for URL: ${url}`);
        }

        return response.json() as Promise<RawApiResponse>;
    }
}

