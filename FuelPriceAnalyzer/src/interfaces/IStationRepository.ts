import type { Station } from "../types/station.js";

/**
 * Abstraction for retrieving Station data by province and product.
 * Consumers depend on this interface, not on StationRepository directly
 * (Dependency Inversion Principle).
 */
export interface IStationRepository {
    getByProvinceAndProduct(
        date: string,
        provinceId: string,
        productId: string,
        productName: string
    ): Promise<Station[]>;
}
