import { scrapeQueue } from './queue.js'
import { redis_connection } from './redis.js'
import { ExpressAdapter } from '@bull-board/express'
import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js'
import express from 'express'

const app = express()

redis_connection.on('ready', async () => {
    await scrapeQueue.setGlobalConcurrency(1000)
    console.log('Connected to Redis')
})

redis_connection.on('error', (err) => {
    console.log('Error connecting to Redis', err)
})
const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath('/queue')
createBullBoard({
    queues: [
        new BullMQAdapter(scrapeQueue),
    ],
    serverAdapter: serverAdapter,
})

async function main() {
    console.log('main')
    await scrapeQueue.addBulk(
        Array(100).fill({
            name: 'scrape',
            data: {
                url: 'https://www.google.com',
            },
        })
    )
}

app.get('/add-queue', async(req, res) => {
    await main()
    res.send('Hello World')
})
app.use('/queue', serverAdapter.getRouter())

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

