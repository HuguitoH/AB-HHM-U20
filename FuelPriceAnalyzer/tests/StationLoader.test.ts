import { jest } from '@jest/globals';
import { StationLoader } from "../src/StationLoader";
import type { IStationRepository } from "../src/interfaces/IStationRepository";
import type { Station } from "../src/types/station.js";

const mockStations: Station = {
    id: '3119',
    name: 'REPSOL',
    address: 'CARRETERA M-114 KM. 0,7',
    locality: 'AJALVIR',
    municipality: 'Ajalvir',
    province: 'MADRID',
    postalCode: '28864',
    price: 1.859,
    productId: '1',
    productName: 'Gasoline 95 E5',
    lat: 40.528028,
    lon: -3.480944,
    schedule: 'L: 06:00-00:00',
    date: new Date(2026, 2, 20)
}

// Mock Repository
const mockRepository: IStationRepository = {
    getByProvinceAndProduct: jest.fn().mockResolvedValue([mockStations])
};

describe('StationLoader', () => {
    const loader = new StationLoader(mockRepository);

    test('Loads all provinces/product combinations into memory', async () => {
        const store = await loader.load('20-03-2026');
        expect(store).not.toBeNull();
        expect(store?.size).toBe(4)
    });

    test('builds correct nested map structure', async () => {
        const store = await loader.load('20-03-2026');
        expect(store?.get('Madrid')).toBeDefined();
        expect(store?.get('Madrid')?.get('Gasolina 95 E5')).toBeDefined();
    });

    test('getStationsByProvinceAndProduct returns correct stations', async () => {
        const store = await loader.load('20-03-2026');
        const stations = loader.getStationsByProvinceAndProduct(
            store!,
            'Madrid',
            'Gasolina 95 E5'
        );
        expect(stations).toHaveLength(1);
        expect(stations[0]?.price).toBe(1.859);
    });

    test('returns empty array for unknown province', async () => {
        const store = await loader.load('20-03-2026');
        const stations = loader.getStationsByProvinceAndProduct(
            store!,
            'Sevilla',
            'Gasolina 95 E5'
        );
        expect(stations).toHaveLength(0);
    });

    test('returns null when no data available', async () => {
        const emptyRepository: IStationRepository = {
            getByProvinceAndProduct: jest.fn().mockRejectedValue(
                new (await import('../src/errors/NoDataAvailableError.js')).NoDataAvailableError('20-03-2026')
            )
    };
        const emptyLoader = new StationLoader(emptyRepository);
        const store = await emptyLoader.load('20-03-2026');
        expect(store).toBeNull();
    });
});