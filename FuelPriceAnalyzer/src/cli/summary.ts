import { PRODUCTS, PROVINCES } from "../config.js";
import type { IStationLoader } from "../interfaces/IStationLoader.js";
import type { StationStore } from "../types/stationStore.js";

/**
 * Prints a quick summary of loaded stations per province and product.
 * Used in summary mode (without --report flag).
 *
 * Single Responsibility: only handles summary presentation logic.
 */
export function printSummary(
  store: StationStore,
  loader: IStationLoader,
): void {
  for (const province of PROVINCES) {
    for (const product of PRODUCTS) {
      const stations = loader.getStationsByProvinceAndProduct(
        store,
        province.name,
        product.name,
      );

      console.log(`[${province.name} / ${product.name}]`);
      console.log(`  Total stations: ${stations.length}`);

      if (stations.length > 0) {
        const { name, address, price } = stations[0]!;
        console.log(`  First: ${name} | ${address} | ${price} €/L`);
      }

      console.log("");
    }
  }
}
