import type { IDataFetcher } from "./interfaces/IDataFetcher.js";
import type { RawApiResponse } from "./types/raw.js";
import { BASE_URL } from "./config.js";
import { NoDataAvailableError } from "./errors/NoDataAvailableError.js";

/**
 * Fetches raw fuel price data from the Ministry REST API.
 *
 * Single Responsibility Principle: only handles HTTP communication.
 * No parsing, no transformation, no business logic.
 */
export class ApiDataFetcher implements IDataFetcher {
    
    async fetch(date: string, provinceId: string, productId: string): Promise<RawApiResponse> {
        const url = `${BASE_URL}/EstacionesTerrestresHist/FiltroProvinciaProducto/${date}/${provinceId}/${productId}`;
        
        // API returns XML by default, but we want JSON — set Accept header to request JSON response
        const response = await fetch(url, {
            headers: {'Accept': 'application/json'}
        });

        if (!response.ok) {
            if (response.status === 400) {
                throw new NoDataAvailableError(date);
            }
            throw new Error(`API error: ${response.status} for URL: ${url}`);
        }

        return response.json() as Promise<RawApiResponse>;
    }
}

