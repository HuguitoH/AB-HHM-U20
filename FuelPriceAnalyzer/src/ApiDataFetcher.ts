import { BASE_URL } from "./config.js";
import { NoDataAvailableError } from "./errors/NoDataAvailableError.js";
import type { IDataFetcher } from "./interfaces/IDataFetcher.js";
import type { RawApiResponse } from "./types/raw.js";

/**
 * Fetches raw station price data from the Ministry REST API.
 * @param date - Date in DD-MM-YYYY format
 * @param provinceId - Province ID from /Listados/Provincias/
 * @param productId - Product ID from /Listados/ProductosPetroliferos/
 * @throws NoDataAvailableError if the API returns 400 (data not yet published)
 * @throws Error if the API returns any other non-OK status
 */

export class ApiDataFetcher implements IDataFetcher {
  async fetch(
    date: string,
    provinceId: string,
    productId: string,
  ): Promise<RawApiResponse> {
    const url = `${BASE_URL}/EstacionesTerrestresHist/FiltroProvinciaProducto/${date}/${provinceId}/${productId}`;

    // API returns XML by default, but we want JSON — set Accept header to request JSON response
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new NoDataAvailableError(date);
      }
      throw new Error(
        `API error: ${response.status} ${response.statusText} for URL: ${url}`,
      );
    }

    return response.json() as Promise<RawApiResponse>;
  }
}
