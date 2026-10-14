import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fetchLiveMarketData } from './src/server/quantEngine.js'

function liveMarketDataPlugin() {
  return {
    name: 'live-market-data-api',
    configureServer(server) {
      server.middlewares.use('/api/market-data', async (req, res, next) => {
        try {
          const data = await fetchLiveMarketData()
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.end(JSON.stringify(data))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message }))
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), liveMarketDataPlugin()],
  server: {
    port: 3000,
    host: true
  }
})
