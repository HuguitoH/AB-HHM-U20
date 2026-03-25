import type { StationStore } from "../types/stationStore.js";
import type { Station } from "../types/station.js";

/**
 * Abstraction for loading station data into memory.
 * Dependency Inversion Principle: consumers depend on this interface,
 * not on the concrete StationLoader implementation.
 */
export interface IStationLoader {
    load(date: string): Promise<StationStore | null>;
    getStationsByProvinceAndProduct(
        store: StationStore,
        province: string,
        product: string
    ): Station[];
}