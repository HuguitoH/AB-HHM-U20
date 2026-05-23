/**
 * Type declarations for asciichart.
 * The package does not ship with official TypeScript types.
 */
declare module "asciichart" {
  export function plot(
    series: number[],
    config?: {
      min?: number;
      max?: number;
      height?: number;
      offset?: number;
      padding?: string;
      colors?: string[];
    },
  ): string;

  export const blue: string;
  export const green: string;
  export const red: string;
  export const yellow: string;
  export const reset: string;
}
