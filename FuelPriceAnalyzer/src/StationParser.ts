import type { IStationParser } from "./interfaces/IStationParser.js";
import type { RawApiResponse, RawStationData } from "./types/raw.js";
import type { Station } from "./types/station.js";

/**
 * Transforms raw API responses into clean Station objects.
 *
 * Single Responsibility Principle: only handles data transformation.
 * No HTTP calls, no business logic, no side effects.
 */
export class StationParser implements IStationParser {
    parse(raw: RawApiResponse, productId: string, productName: string): Station[] {
        const date = this.parseDate(raw.Fecha);

        // Stations with empty PrecioProducto do not sell this fuel — exclude them
        return raw.ListaEESSPrecio
            .filter(s => s.PrecioProducto !== '')
            .map(s => this.mapStation(s, productId, productName, date));
    }

    private mapStation(
        s: RawStationData,
        productId: string,
        productName: string,
        date: Date
    ): Station {
        return {
            id: s.IDEESS,
            name: s['Rótulo'].trim(),
            address: s['Dirección'].trim(),
            locality: s.Localidad.trim(),
            municipality: s.Municipio.trim(),
            province: s.Provincia.trim(),
            postalCode: s['C.P.'].trim(),
            price: this.parseSpanishFloat(s.PrecioProducto),
            productId,
            productName,
            lat: this.parseSpanishFloat(s.Latitud),
            lon: this.parseSpanishFloat(s['Longitud (WGS84)']),
            schedule: s.Horario.trim(),
            date
        };
    }

    // Transform "1,859" -> 1.859 (Ministry API uses comma as decimal separator instead of period)
    parseSpanishFloat(value: string): number {
        const parsed = parseFloat(value.replace(',', '.'));
        if (isNaN(parsed)) throw new Error(`Invalid number format: ${value}`);
        return parsed;
    }

    // Transform Date (e.g. "20/03/2026 0:00:00") -> Date object
    private parseDate(Fecha: string): Date {
        const parts = Fecha.split(' ')[0]?.split('/');
        if (!parts || parts.length < 3) {
            throw new Error(`Invalid date format: ${Fecha}`);
        }

        const day = Number(parts[0]);
        const month = Number(parts[1]);
        const year = Number(parts[2]);
        return new Date(year, month - 1, day);
    }
}

