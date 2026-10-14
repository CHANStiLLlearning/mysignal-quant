import https from 'https';

function fetchJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', ...headers } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function test() {
  console.log('Fetching live Kraken Real Prices for Gold (PAXG) and Bitcoin (BTC)...');
  const kraken = await fetchJson('https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD,PAXGUSD');
  const btcPrice = kraken.result.XXBTZUSD.c[0];
  const goldPrice = kraken.result.PAXGUSD.c[0];
  console.log('Real Live Prices:');
  console.log('  Gold Spot (XAUUSD):', `$${goldPrice}`);
  console.log('  Bitcoin (BTCUSDT):', `$${btcPrice}`);
}

test();
