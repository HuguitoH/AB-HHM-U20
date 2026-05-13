/**
 * Application configuration.
 * Creational Pattern — Singleton: guarantees a single instance
 * of application configuration across the entire runtime.
 */
export class Config {
  private static instance: Config | null = null;

  // Base URL for the Ministry of Ecological Transition REST API.
  // Full API docs: https://energia.serviciosmin.gob.es/ServiciosRestCarburantes/PreciosCarburantes/help
  readonly baseUrl: string =
    "https://energia.serviciosmin.gob.es/ServiciosRestCarburantes/PreciosCarburantes";

  // Provinces and products of interest for the company.
  // To add a new province or product, only this file needs to change (Open/Closed Principle).
  readonly provinces = [
    { name: "Madrid", id: "28" },
    { name: "A Coruña", id: "15" },
    { name: "Tenerife", id: "38" },
    { name: "Badajoz", id: "06" },
  ] as const;

  readonly products = [
    { name: "Gasolina 95 E5", id: "1" },
    { name: "Gasóleo A habitual", id: "4" },
  ] as const;

  private constructor() {}

  /**
   * Returns the single Config instance, creating it if necessary.
   */
  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

// Convenience exports — allow direct imports without calling getInstance()
const config = Config.getInstance();
export const BASE_URL = config.baseUrl;
export const PROVINCES = config.provinces;
export const PRODUCTS = config.products;

export type ProvinceName = (typeof PROVINCES)[number]["name"];
export type ProductName = (typeof PRODUCTS)[number]["name"];
