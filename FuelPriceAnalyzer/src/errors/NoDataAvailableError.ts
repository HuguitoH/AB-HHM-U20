/**
 * Thrown when the Ministry API returns 400 for a given date.
 * This typically means the data for that date has not been published yet,
 * as the API publishes data with a 1-2 day delay.
 */
export class NoDataAvailableError extends Error {
    
    constructor(date: string) {
    super(
        `No data available for ${date}. ` +
        `The Ministry API publishes data with a 1-2 day delay.`
    );
        this.name = 'NoDataAvailableError';
    }
}