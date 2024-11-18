import { HeaderGenerator } from 'header-generator'
import fetch from 'node-fetch'
export const scrapeUrl = async (url, timeout = 10000) => {
    const headerGenerator = new HeaderGenerator()
    try {
        const headers = headerGenerator.getHeaders({
            browsers: [
                { name: 'chrome', minVersion: 87, maxVersion: 109 },
                { name: 'firefox', minVersion: 86, maxVersion: 108 },
            ],
            devices: ['mobile'],
            operatingSystems: ['android', 'ios'],
        })
        headers['accept'] =
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        headers['accept-encoding'] = 'gzip, deflate, br'

        const response = await fetch(url, {
            headers,
        })

        const data = await response.text()

        return data
    } catch (error) {
        throw new Error(`Failed to scrape ${url}: ${error.message}`)
    }
}
