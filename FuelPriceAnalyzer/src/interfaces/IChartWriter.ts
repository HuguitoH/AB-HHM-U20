/**
 * Abstraction for writing chart output to its destination.
 * Single Responsibility: only handles output, not rendering.
 */
export interface IChartWriter {
  /**
   * Writes chart content to its destination.
   * For ASCII: prints to console.
   * For SVG: saves to charts/ directory.
   * @param content - Rendered chart string
   * @param productName - Used for filename and display
   * @param month - Used for filename
   */
  write(content: string, productName: string, month: string): void;
}
