import { describe, mock } from "node:test";
import { StationParser } from "../src/StationParser.js";
import type { RawApiResponse } from "../src/types/raw.js";

const mockRaw: RawApiResponse = {
    Fecha: '20/03/2026 0:00:00',
    ListaEESSPrecio: [
    {
        'C.P.': '28864',
        'Dirección': 'CARRETERA M-114 KM. 0,7',
        'Horario': 'L: 06:00-00:00',
        'Latitud': '40,528028',
        'Localidad': 'AJALVIR                  ',
        'Longitud (WGS84)': '-3,480944',
        'Margen': 'I',
        'Municipio': 'Ajalvir',
        'PrecioProducto': '1,859',
        'Provincia': 'MADRID',
        'Remisión': 'OM',
        'Rótulo': 'REPSOL',
        'Tipo Venta': 'P',
        'IDEESS': '3119',
        'IDMunicipio': '4277',
        'IDProvincia': '28',
        'IDCCAA': '13',
    },
    {
        'C.P.': '28001',
        'Dirección': '',
        'Horario': '',
        'Latitud': '40,0',
        'Localidad': '',
        'Longitud (WGS84)': '-3,0',
        'Margen': '',
        'Municipio': '',
        'PrecioProducto': '',
        'Provincia': 'MADRID',
        'Remisión': '',
        'Rótulo': 'SIN PRECIO',
        'Tipo Venta': '',
        'IDEESS': '9999',
        'IDMunicipio': '1',
        'IDProvincia': '28',
        'IDCCAA': '13',
        }
    ],
    ResultadoConsulta: 'OK'
};

describe('StationParser', () => {
    const parser = new StationParser();

    test('Filters out stations with empty price', () => {
        const result = parser.parse(mockRaw, '1', 'Gasoline 95');
        expect(result).toHaveLength(1);
    });

    test('Parses PrecioProducto string with comma to number', () => {
        const [station] = parser.parse(mockRaw, '1', 'Gasoline 95');
        expect(station?.price).toBe(1.859);
    });

    test('Parses Latitud string with comma to number', () => {
        const [station] = parser.parse(mockRaw, '1', 'Gasoline 95');
        expect(station?.lat).toBe(40.528028);
    });

    test('Trims trailing whitespace from Localidad', () => {
        const [station] = parser.parse(mockRaw, '1', 'Gasoline 95');
        expect(station?.locality).toBe('AJALVIR');
    });

    test('Propagates Fecha from root object to each station', () => {
        const [station] = parser.parse(mockRaw, '1', 'Gasoline 95');
        expect(station?.date).toEqual(new Date(2026, 2, 20));
    });

    test('ParseSpanishFloat throws error on invalid number format', () => {
        expect(() => parser.parseSpanishFloat('abc')).toThrow(
            'Invalid number format: abc');
    });
});

