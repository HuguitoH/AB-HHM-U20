/**
 * Raw station data as returned by the API.
 * Field names are kept exactly as the API returns them — including
 * Spanish characters and spaces — to avoid any mapping errors.
 * Note: numeric fields (PrecioProducto, Latitud, Longitud) are strings
 * using comma as decimal separator. They must be parsed before use.
 */
export interface RawStationData {
  "C.P.": string;
  Dirección: string;
  Horario: string;
  Latitud: string;
  Localidad: string;
  "Longitud (WGS84)": string;
  Margen: string;
  Municipio: string;
  PrecioProducto: string;
  Provincia: string;
  Remisión: string;
  Rótulo: string;
  "Tipo Venta": string;
  IDEESS: string;
  IDMunicipio: string;
  IDProvincia: string;
  IDCCAA: string;
}

/**
 * Represents the raw JSON response from the Ministry REST API.
 * Contains the date of the data and an array of station price entries.
 */
export interface RawApiResponse {
  Fecha: string;
  ListaEESSPrecio: RawStationData[];
  Nota?: string;
  ResultadoConsulta?: string;
}
