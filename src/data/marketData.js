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
    setup: {
      grade: 'A+',
      score: 92,
      title: 'Prime Institutional Setup (A+)',
      shortTitle: 'SETUP A+ // PRIME',
      badgeClass: 'text-amber-300 bg-amber-500/15 border-amber-500/40 shadow-glow-amber',
      advice: 'Maximum confluence: Dual Trend Ribbon, Structural BOS/CHoCH, Imbalance & Orderflow. Full Half-Kelly execution.',
      color: 'amber',
      confluencesPassed: 5,
      totalConfluences: 5,
      criteria: [
        { name: 'Dual EMA Ribbon (21/55)', passed: true, detail: 'EMA 21 < 55 aligns with Bearish trend expansion.' },
        { name: 'Structural Trending Highs/Lows', passed: true, detail: 'Market printing Lower Highs & Lower Lows.' },
        { name: 'Institutional Imbalance / Sweep', passed: true, detail: 'Active Bearish FVG between 4112.00 and 4118.50.' },
        { name: 'Orderflow Delta Dominance', passed: true, detail: 'Heavy seller market order aggression (-14.2%).' },
        { name: 'Noise Filter & Trend Velocity', passed: true, detail: 'Kaufman ER 0.42 + ADX 37.0 + Hurst 0.582 (Low Noise Trend).' }
      ]
    },
    entry: 4105.00,
    sl: 4118.00,
    tp1: 4085.50,
    tp2: 4066.00,
    tp3: 4046.50,
    rrRatio: '1 : 3.0',
    riskPts: 13.00,
    factors: [
      'EMA 21 < 55 Ribbon Bearish',
      'Hurst Exponent 0.58 (Persistent Trend)',
      'Intraday VWAP 4112.40 (POC: 4110.00)',
      'Orderflow Delta -14.2% (Selling Dominance)',
      'Dynamic ATR Invalidation 8.66 pts'
    ],
    metrics: {
      ema21: 4108.2,
      ema55: 4115.6,
      adx: 37.0,
      er: 0.42,
      atr: 8.66,
      hurst: 0.582,
      regime: 'PERSISTENT TREND (Directional Breakout)',
      annualizedVol: 18.4,
      skewness: -0.34,
      excessKurtosis: 1.82,
      jarqueBera: 24.5,
      vwap: 4112.40,
      upper1Std: 4122.10,
      lower1Std: 4102.70,
      upper2Std: 4131.80,
      lower2Std: 4093.00,
      poc: 4110.00,
      deltaRatio: -14.2,
      buyVolPct: 42.9,
      sellVolPct: 57.1,
      histVar95: 0.28,
      cvar95: 0.41,
      halfKellyPct: 3.4
    },
    chartReading: {
      symbol: 'XAUUSD',
      currentPrice: 4105.00,
      lastCandle: { open: 4108.50, high: 4111.00, low: 4103.20, close: 4105.00, range: 7.80, bodySize: 3.50, bodyPct: 44.9, upperWickPct: 32.1, lowerWickPct: 23.1, isBull: false },
      pattern: { name: 'Bearish Continuation', type: 'BEARISH', description: 'Orderflow favoring offers with 44.9% body dominance.' },
      structure: { label: 'BEARISH STRUCTURE (LH / LL)', bias: 'BEARISH', details: 'Descending Lower Highs and Lower Lows on M15 timeframe.', keySupport: 4085.00, keyResistance: 4124.50 },
      fvg: { type: 'BEARISH FVG (Supply Imbalance)', top: 4118.50, bottom: 4112.00, gapSize: 6.50 },
      liquiditySweep: null,
      executiveReading: 'Gold (XAUUSD) is exhibiting bearish market structure (Lower Highs & Lower Lows) on the M15 timeframe. The active candle formed a Bearish Continuation with 44.9% body dominance. Active imbalance: Bearish FVG between 4112.00 and 4118.50. Primary orderflow conviction remains bearish while price stays below 4124.50 resistance.'
    },
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
    setup: {
      grade: 'A+',
      score: 95,
      title: 'Prime Institutional Setup (A+)',
      shortTitle: 'SETUP A+ // PRIME',
      badgeClass: 'text-amber-300 bg-amber-500/15 border-amber-500/40 shadow-glow-amber',
      advice: 'Confirmed Break of Structure (BOS) with supply FVG mitigation and heavy selling delta.',
      color: 'amber',
      confluencesPassed: 5,
      totalConfluences: 5,
      criteria: [
        { name: 'Dual EMA Ribbon (21/55)', passed: true, detail: 'EMA 21 < 55 aligns with Bearish momentum.' },
        { name: 'Break of Structure (BOS)', passed: true, detail: 'Confirmed Bearish BOS past prior swing low.' },
        { name: 'Institutional Imbalance / Sweep', passed: true, detail: 'Active Bearish FVG between 82180.00 and 82450.00.' },
        { name: 'Orderflow Delta Dominance', passed: true, detail: 'Heavy seller market order aggression (-18.6%).' },
        { name: 'Noise Filter & Trend Velocity', passed: true, detail: 'Kaufman ER 0.38 + ADX 28.2 + Hurst 0.614 (Low Noise Trend).' }
      ]
    },
    entry: 81900.00,
    sl: 82380.00,
    tp1: 81180.00,
    tp2: 80460.00,
    tp3: 79740.00,
    rrRatio: '1 : 3.0',
    riskPts: 480.00,
    factors: [
      'EMA 21 < 55 Ribbon Compression',
      'Hurst Exponent 0.61 (Persistent Trend)',
      'Intraday VWAP 82450.00 (POC: 82100.00)',
      'Orderflow Delta -18.6% (Selling Dominance)',
      'Dynamic ATR Invalidation 320.00 pts'
    ],
    metrics: {
      ema21: 82120.0,
      ema55: 82680.0,
      adx: 28.2,
      er: 0.38,
      atr: 320.00,
      hurst: 0.614,
      regime: 'PERSISTENT TREND (Directional Breakout)',
      annualizedVol: 46.8,
      skewness: -0.48,
      excessKurtosis: 2.45,
      jarqueBera: 48.2,
      vwap: 82450.00,
      upper1Std: 83200.00,
      lower1Std: 81700.00,
      upper2Std: 83950.00,
      lower2Std: 80950.00,
      poc: 82100.00,
      deltaRatio: -18.6,
      buyVolPct: 40.7,
      sellVolPct: 59.3,
      histVar95: 0.74,
      cvar95: 1.12,
      halfKellyPct: 2.8
    },
    chartReading: {
      symbol: 'BTCUSDT',
      currentPrice: 81900.00,
      lastCandle: { open: 82150.00, high: 82280.00, low: 81820.00, close: 81900.00, range: 460.00, bodySize: 250.00, bodyPct: 54.3, upperWickPct: 28.3, lowerWickPct: 17.4, isBull: false },
      pattern: { name: 'Bearish Continuation', type: 'BEARISH', description: 'Orderflow favoring sellers with 54.3% body dominance.' },
      structure: { label: 'BOS (BEARISH BREAK OF STRUCTURE)', bias: 'BEARISH', details: 'Price closed below previous swing low, confirming downward expansion.', keySupport: 81400.00, keyResistance: 82950.00 },
      fvg: { type: 'BEARISH FVG (Supply Imbalance)', top: 82450.00, bottom: 82180.00, gapSize: 270.00 },
      liquiditySweep: null,
      executiveReading: 'Bitcoin (BTCUSDT) is exhibiting a bearish Break of Structure (BOS) on the M15 timeframe. The active candle formed a Bearish Continuation with 54.3% body dominance. Active imbalance: Bearish FVG between 82180.00 and 82450.00. Primary orderflow conviction remains bearish below 82950.00.'
    },
    timestamp: 'Live Feed',
    status: 'ACTIVE'
  }
];

export const assetSpecs = {
  gold: { contractMultiplier: 100, minStep: 0.01, unitLabel: 'Standard Lots (100 oz Gold)' },
  crypto: { contractMultiplier: 1, minStep: 0.001, unitLabel: 'Bitcoin Units (BTC)' }
};
