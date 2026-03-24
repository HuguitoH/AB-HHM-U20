import type { Station } from "../types/station.js";

export interface IStationRepository {
    getByProvinceAndProduct(
        date: string,
        provinceId: string,
        productId: string,
        productName: string
    ): Promise<Station[]>;
}
