/**
 * Abstraction for writing the formatted report to output destinations.
 * Single Responsibility: only handles output, not formatting or calculation.
 */
export interface IReportWriter {
  write(text: string, date: string, mode: string, save: boolean): void;
}
