import type { RawApiResponse } from "../types/raw.js";
import type { Station } from "../types/station.js";

export interface IStationParser {
    parse(raw: RawApiResponse, productId: string, productName: string): Station[];
}

