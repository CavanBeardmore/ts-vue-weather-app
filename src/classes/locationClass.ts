import { hasURLFormatter } from "@/interfaces/format";

export class Location implements hasURLFormatter{
    constructor(
        public name: string,
        private currentURLOne: string,
        private currentURLTwo: string,
        private forecastURLOne: string,
        private forecastURLTwo: string,
        private forecastURLThree: string
    ){}

    formatCurrent(a: string, b: string, c: string) {
        return a + b + c
    };

    formatForecast(a: string, b: string, c: string, d: number, e: string) {
        return a + b + c + d + e
    };

}