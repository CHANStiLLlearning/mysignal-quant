export const initialTickers = [
  { symbol: 'XAUUSD', name: 'Gold / US Dollar', price: 4105.00, change: -1.20, isBull: false, tvSymbol: 'OANDA:XAUUSD', category: 'gold', assetType: 'gold' },
  { symbol: 'BTCUSDT', name: 'Bitcoin / Tether', price: 81900.00, change: -1.40, isBull: false, tvSymbol: 'BINANCE:BTCUSDT', category: 'crypto', assetType: 'crypto' },
];

export const initialSignals = [
  {
    id: 'sig-xau-1',
    symbol: 'XAUUSD',
    name: 'Gold Spot / US Dollar',
    category: 'gold',
    assetType: 'gold',
    timeframe: 'M15',
    type: 'SHORT',
    isBull: false,
    confidence: 88,
    entry: 4105.00,
    sl: 4118.00,
    tp1: 4085.50,
    tp2: 4066.00,
    tp3: 4046.50,
    rrRatio: '1 : 3.0',
    riskPts: 13.00,
    factors: [
      'EMA 21 < 55 Ribbon Bearish',
      'Wilder ADX 37.0 (Strong Trend)',
      'H1 Trend Filter Bearish Confluence',
      'Dynamic ATR Invalidation 8.66 pts'
    ],
    timestamp: 'Live Feed',
    status: 'ACTIVE'
  },
  {
    id: 'sig-btc-1',
    symbol: 'BTCUSDT',
    name: 'Bitcoin / Tether Perpetual',
    category: 'crypto',
    assetType: 'crypto',
    timeframe: 'M15',
    type: 'SHORT',
    isBull: false,
    confidence: 85,
    entry: 81900.00,
    sl: 82380.00,
    tp1: 81180.00,
    tp2: 80460.00,
    tp3: 79740.00,
    rrRatio: '1 : 3.0',
    riskPts: 480.00,
    factors: [
      'EMA 21 < 55 Ribbon Compression',
      'ADX 28.2 Trend Confirmation',
      'Kaufman ER 0.42 (Low Noise)',
      'Dynamic ATR Invalidation 320.00 pts'
    ],
    timestamp: 'Live Feed',
    status: 'ACTIVE'
  }
];

export const assetSpecs = {
  gold: { contractMultiplier: 100, minStep: 0.01, unitLabel: 'Standard Lots (100 oz Gold)' },
  crypto: { contractMultiplier: 1, minStep: 0.001, unitLabel: 'Bitcoin Units (BTC)' }
};
