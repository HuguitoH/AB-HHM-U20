export const BASE_URL = 'https://energia.serviciosmin.gob.es/ServiciosRestCarburantes/PreciosCarburantes';

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

