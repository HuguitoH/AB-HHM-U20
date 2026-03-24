import type { RawApiResponse } from "../types/raw.js";
import type { Station } from "../types/station.js";

/**
 * Abstraction for parsing raw API responses into Station objects.
 * Keeping this interface small and focused follows
 * the Interface Segregation Principle.
 */
export interface IStationParser {
    parse(raw: RawApiResponse, productId: string, productName: string): Station[];
}

