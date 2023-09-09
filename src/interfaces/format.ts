export interface hasURLFormatter {
    formatCurrent: (a: string, b: string, c: string) => string;
    formatForecast: (a: string, b: string, c: string, d: number, e: string) => string;
}