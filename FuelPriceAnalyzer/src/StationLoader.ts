import { PRODUCTS, PROVINCES } from "./config.js";
import { NoDataAvailableError } from "./errors/NoDataAvailableError.js";
import type { IStationLoader } from "./interfaces/IStationLoader.js";
import type { IStationRepository } from "./interfaces/IStationRepository.js";
import type { Station } from "./types/station.js";
import type { StationStore } from "./types/stationStore.js";

/**
 * Loads all station data into memory for a given date.
 *
 * Single Responsibility Principle: only responsible for building
 * and providing access to the in-memory station store.
 */
export class StationLoader implements IStationLoader {
  constructor(private readonly repository: IStationRepository) {}

  // Fetches all province/product combinations and stores them in a Map. --> (Returns null if no data available for any combination)
  async load(date: string): Promise<StationStore | null> {
    const store: StationStore = new Map();

    let hasData = false;

    for (const province of PROVINCES) {
      for (const product of PRODUCTS) {
        try {
          const stations = await this.repository.getByProvinceAndProduct(
            date,
            province.id,
            product.id,
            product.name,
          );

          // Build nested maps: province → product → stations
          const provinceMap = store.get(province.name);
          if (provinceMap) {
            provinceMap.set(product.name, stations);
          } else {
            store.set(province.name, new Map([[product.name, stations]]));
          }
          hasData = true;
        } catch (error) {
          if (error instanceof NoDataAvailableError) {
            // Expected - Skip this combination
          } else {
            throw error;
          }
        }
      }
    }

    return hasData ? store : null;
  }

  // Retrieves stations for a specific province and product from the store.
  getStationsByProvinceAndProduct(
    store: StationStore,
    provinceName: string,
    productName: string,
  ): Station[] {
    return store.get(provinceName)?.get(productName) ?? [];
  }
}
