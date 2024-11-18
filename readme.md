# Reproduction Steps

1. Configure Redis settings in `redis.js`

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Monitor the queues by visiting:
   ```
   http://localhost:3000/queue
   ```

4. Add jobs to the queue by visiting:
   ```
   http://localhost:3000/add-queue
   ```
   Note: You can visit this endpoint once or multiple times.

5. Observe the issue:
   - Return to the queue monitoring page (`/queue`)
   - The page will begin to slow down and consume more memory as you add more jobs
   - This issue only occurs in development mode (`npm run dev`)
   - Running in production mode (`npm start`) works as expected

## Issues
- Memory consumption increases when adding jobs in npm run dev
- Queue monitoring page becomes unresponsive
- Issue is specific to when you run it nodemon or tsc --watch