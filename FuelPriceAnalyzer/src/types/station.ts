/**
 * Clean internal domain model for a fuel station.
 * All numeric fields are proper numbers (comma decimal separator already parsed).
 * All string fields are trimmed.
 */
export interface Station {
    id: string;
    name: string;
    address: string;
    locality: string;
    municipality: string;
    province: string;
    postalCode: string;
    price: number;
    productId: string;
    productName: string;
    lat: number;
    lon: number;
    schedule: string;
    date: Date;
}

