export interface RawStationData {
    'C.P.': string;
    'Dirección': string;
    'Horario': string;
    'Latitud': string;
    'Localidad': string;
    'Longitud (WGS84)': string;
    'Municipio': string;
    'PrecioProducto': string;
    'Provincia': string;
    'Remisión': string;
    'Rótulo': string;
    'Tipo Venta': string;
    'IDEESS': string;
    'IDMunicipio': string;
    'IDProvincia': string;
    'IDCCAA': string;
}

export interface RawApiResponse {
    Fecha: string;
    ListaEESSPrecio: RawStationData[];
    Nota?: string;
    ResultadoConsulta?: string;
}

