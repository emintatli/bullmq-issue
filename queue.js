import { Queue } from 'bullmq'
import { redis_connection } from './redis.js'
import { Worker } from 'bullmq'
import { scrapeUrl } from './scrape.js'
import { promises as fs } from 'fs'


export const scrapeQueue = new Queue('scrape', {
    connection: redis_connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
    },
})


const worker = new Worker(
    'scrape',
    async (job) => {
        try {
            console.log(`started -- ${job.id}`)
            const { url } = job.data
            const data = await scrapeUrl(url)
            
            await fs.appendFile(
                'result.json',
                JSON.stringify({
                    url,
                    data,
                    timestamp: new Date().toISOString(),
                }) + '\n'
            )
            console.log(`completed -- ${job.id}`)
            return 'done'
        } catch (error) {
            console.error(`Job ${job.id} failed:`, error)
            throw error
        }
    },
    {
        connection: redis_connection,
        concurrency: 1000,
    }
)
worker.on('completed', (job) => {
    console.log(`${job.id} has completed!`)
})

worker.on('failed', (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`)
})

worker.on('error', (err) => {
    // log the error
    console.error(err)
})
