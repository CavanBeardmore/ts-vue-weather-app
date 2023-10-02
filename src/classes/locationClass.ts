import { hasURLFormatter } from "@/interfaces/format";

export class Location implements hasURLFormatter{
    constructor(
        public name: string,
        public currentURLOne: string,
        public currentURLTwo: string,
        public forecastURLOne: string,
        public forecastURLTwo: string,
        public forecastURLThree: string,
        public moreInfo: boolean = false,
        public weatherData: object = {},
    ){}

    formatCurrent(a: string, b: string, c: string) {
        return a + b + c
    };

    formatForecast(a: string, b: string, c: string, d: number, e: string) {
        return a + b + c + d + e
    };

    addData(data: object) {
        this.weatherData = data
    };

    toggleMoreInfo() {
        this.moreInfo = !this.moreInfo
    };

}