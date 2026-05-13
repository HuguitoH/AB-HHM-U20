/**
 * Abstraction for writing the formatted report to output destinations.
 * Single Responsibility: only handles output, not formatting or calculation.
 */
export interface IReportWriter {
  write(text: string, date: string, save: boolean): void;
}
