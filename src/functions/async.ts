export async function getData(url: string) {
    const response: any = await fetch(url);

    if (response.status !== 200) {
        throw new Error('Cannot fetch weather data')
    }

    const data: object = await response.json()

    return data
}