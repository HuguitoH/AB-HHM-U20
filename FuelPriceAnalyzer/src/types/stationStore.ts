import type { Station } from '../types/station.js';

/**
 * In-memory store for all fetched station data.
 * Organised by province name → product name → Station[].
 * This structure is the primary input for Milestone 2 report generation.
 */
export type StationStore = Map<string, Map<string, Station[]>>;

