import type { RawApiResponse } from "../types/raw.js";

/**
 * Abstraction for fetching raw fuel price data.
 * Depends on this interface instead of a concrete implementation
 * allows swapping ApiDataFetcher for a mock in tests (Dependency Inversion Principle).
 */
export interface IDataFetcher {
    fetch(date: string, provinceId: string, productId: string): Promise<RawApiResponse>;
}

