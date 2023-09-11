export let formatCurrent = (urlOne: string, location: string, urlTwo: string) => {
    const newUrl = urlOne + location + urlTwo
    return newUrl
};

export let formatForecast = (urlOne: string, location: string, urlTwo: string, days: number, urlThree: string) => {
    const newUrl = urlOne + location + urlTwo + days.toString() + urlThree;
    return newUrl;
}