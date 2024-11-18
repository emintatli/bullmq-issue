
import IORedis from 'ioredis'

export const redis_connection = new IORedis({
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null,
})