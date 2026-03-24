// Base URL for the Ministry of Ecological Transition REST API.
export const BASE_URL = 'https://energia.serviciosmin.gob.es/ServiciosRestCarburantes/PreciosCarburantes';

// Provinces and products of interest for the company.
// To add a new province or product, only this file needs to change (Open/Closed Principle).
export const PROVINCES = [
    { name: 'Madrid', id: '28' },
    { name: 'A Coruña', id: '15' },
    { name: 'Tenerife', id: '38' },
    { name: 'Badajoz', id: '06' },
] as const;

export const PRODUCTS = [
    { name: 'Gasolina 95 E5', id: '1' },
    { name: 'Gasóleo A habitual', id: '4' },
] as const;

export type ProvinceName = typeof PROVINCES[number]['name'];
export type ProductName = typeof PRODUCTS[number]['name'];

