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
    type: 'LONG',
    indicator: 'BUY',
    signalIndicator: 'BUY INDICATOR',
    actionText: 'BUY / LONG',
    isBull: true,
    confidence: 91,
    marketObservation: {
      status: 'VERIFIED',
      trendDirection: 'UPWARD',
      trendState: 'UPWARD TREND CONFIRMED',
      trendConvictionPct: 84,
      upwardScore: 9.5,
      downwardScore: 2.0,
      summary: 'Market observation confirms an UPWARD TREND (84% conviction). Price is advancing with buyer volume dominance above the EMA21 ribbon.',
      pillars: [
        {
          name: 'Dual EMA Ribbon',
          status: 'Upward Alignment',
          detail: 'EMA 21 (4148.5) > EMA 55 (4138.2) confirming bullish trend ribbon.',
          passed: true
        },
        {
          name: 'Directional Momentum',
          status: '+DI Upward Dominance',
          detail: '+DI: 31.8 | -DI: 15.2 | ADX: 34.6 (Strong Trend Velocity)',
          passed: true
        },
        {
          name: 'Market Structure & Swings',
          status: 'BULLISH EXPANSION (HH / HL)',
          detail: 'Ascending Higher Highs and Higher Lows on M15 timeframe.',
          passed: true
        },
        {
          name: 'Intraday VWAP & Orderflow',
          status: 'Buyer Dominance',
          detail: 'VWAP: 4142.10 | Orderflow Delta: +18.4% (Heavy Buyer Aggression)',
          passed: true
        }
      ]
    },
    setup: {
      grade: 'A+',
      score: 95,
      title: 'Prime Institutional Setup (A+)',
      shortTitle: 'SETUP A+ // PRIME',
      badgeClass: 'text-amber-300 bg-amber-500/15 border-amber-500/40 shadow-glow-amber',
      advice: 'Maximum institutional conviction. Dual EMA alignment + structural breakout + orderflow accumulation. Full execution authorized.',
      color: 'amber',
      confluencesPassed: 5,
      totalConfluences: 5,
      criteria: [
        { name: 'Dual EMA Ribbon (21/55)', passed: true, detail: 'EMA 21 > 55 aligns with Bullish trend expansion.' },
        { name: 'Structural Trending Highs/Lows', passed: true, detail: 'Market printing Higher Highs & Higher Lows.' },
        { name: 'Institutional Imbalance / Sweep', passed: true, detail: 'Active Bullish FVG demand zone at 4140.00.' },
        { name: 'Orderflow Delta Dominance', passed: true, detail: 'Heavy buyer market order aggression (+18.4%).' },
        { name: 'Noise Filter & Trend Velocity', passed: true, detail: 'Kaufman ER 0.44 + ADX 34.6 + Hurst 0.592 (Low Noise Trend).' }
      ]
    },
    entry: 4152.00,
    sl: 4139.00,
    slDistance: 13.00,
    slRationale: 'Structural invalidation buffer below swing low (entry - 13.00 pts)',
    tp1: 4171.50,
    tp1Gain: 19.50,
    tp2: 4191.00,
    tp2Gain: 39.00,
    tp3: 4210.50,
    tp3Gain: 58.50,
    rrRatio: '1 : 3.0',
    riskPts: 13.00,
    factors: [
      'EMA 21 > 55 Ribbon Bullish Expansion',
      'Hurst Exponent 0.59 (Persistent Bull Trend)',
      'Intraday VWAP 4142.10 (POC: 4145.00)',
      'Orderflow Delta +18.4% (Buying Dominance)',
      'Dynamic ATR Invalidation 13.00 pts'
    ],
    metrics: {
      ema21: 4148.5,
      ema55: 4138.2,
      adx: 34.6,
      er: 0.44,
      atr: 8.66,
      hurst: 0.592,
      regime: 'PERSISTENT TREND (Directional Breakout)',
      annualizedVol: 18.4,
      skewness: 0.38,
      excessKurtosis: 1.82,
      jarqueBera: 24.5,
      vwap: 4142.10,
      upper1Std: 4154.10,
      lower1Std: 4130.10,
      upper2Std: 4166.10,
      lower2Std: 4118.10,
      poc: 4145.00,
      deltaRatio: 18.4,
      buyVolPct: 59.2,
      sellVolPct: 40.8,
      histVar95: 0.28,
      cvar95: 0.41,
      halfKellyPct: 3.8
    },
    chartReading: {
      symbol: 'XAUUSD',
      currentPrice: 4152.00,
      lastCandle: { open: 4147.20, high: 4153.80, low: 4146.50, close: 4152.00, range: 7.30, bodySize: 4.80, bodyPct: 65.8, upperWickPct: 24.7, lowerWickPct: 9.5, isBull: true },
      pattern: { name: 'Bullish Momentum Expansion', type: 'BULLISH', description: 'Strong buyer dominance with 65.8% body expansion.' },
      structure: { label: 'BULLISH STRUCTURE (HH / HL)', bias: 'BULLISH', details: 'Ascending Higher Highs and Higher Lows on M15 timeframe.', keySupport: 4135.00, keyResistance: 4175.00 },
      fvg: { type: 'BULLISH FVG (Demand Imbalance)', top: 4144.50, bottom: 4139.00, gapSize: 5.50 },
      liquiditySweep: null,
      executiveReading: 'Gold (XAUUSD) has broken upward with ascending Higher Highs & Higher Lows on the M15 timeframe. Active candle prints bullish expansion with 65.8% body. Key demand rests at 4139.00 FVG support.'
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
    indicator: 'SELL',
    signalIndicator: 'SELL INDICATOR',
    actionText: 'SELL / SHORT',
    isBull: false,
    confidence: 88,
    marketObservation: {
      status: 'VERIFIED',
      trendDirection: 'DOWNWARD',
      trendState: 'DOWNWARD TREND CONFIRMED',
      trendConvictionPct: 92,
      upwardScore: 1.5,
      downwardScore: 10.0,
      summary: 'Market observation confirms a DOWNWARD TREND (92% conviction). Price is rejecting overhead resistance with heavy seller orderflow below the EMA21 ribbon.',
      pillars: [
        {
          name: 'Dual EMA Ribbon',
          status: 'Downward Alignment',
          detail: 'EMA 21 (81450.0) < EMA 55 (82100.0) confirming bearish trend ribbon.',
          passed: true
        },
        {
          name: 'Directional Momentum',
          status: '-DI Downward Dominance',
          detail: '+DI: 14.1 | -DI: 36.8 | ADX: 31.5 (Strong Trend Velocity)',
          passed: true
        },
        {
          name: 'Market Structure & Swings',
          status: 'BEARISH BREAKDOWN (LH / LL)',
          detail: 'Descending Lower Highs and Lower Lows on M15 timeframe.',
          passed: true
        },
        {
          name: 'Intraday VWAP & Orderflow',
          status: 'Seller Dominance',
          detail: 'VWAP: 81950.00 | Orderflow Delta: -21.4% (Heavy Seller Distribution)',
          passed: true
        }
      ]
    },
    setup: {
      grade: 'A',
      score: 88,
      title: 'High-Probability Trend Setup (A)',
      shortTitle: 'SETUP A // TREND',
      badgeClass: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/40 shadow-glow-emerald',
      advice: 'Confirmed Break of Structure (BOS) with supply FVG mitigation and heavy selling delta. Standard institutional sizing.',
      color: 'emerald',
      confluencesPassed: 4,
      totalConfluences: 5,
      criteria: [
        { name: 'Dual EMA Ribbon (21/55)', passed: true, detail: 'EMA 21 < 55 aligns with Bearish momentum.' },
        { name: 'Break of Structure (BOS)', passed: true, detail: 'Confirmed Bearish BOS past prior swing low.' },
        { name: 'Institutional Imbalance / Sweep', passed: true, detail: 'Active Bearish FVG between 81800.00 and 82150.00.' },
        { name: 'Orderflow Delta Dominance', passed: true, detail: 'Heavy seller market order aggression (-21.4%).' },
        { name: 'Noise Filter & Trend Velocity', passed: true, detail: 'Kaufman ER 0.38 + ADX 31.5 + Hurst 0.614 (Low Noise Trend).' }
      ]
    },
    entry: 81120.00,
    sl: 81650.00,
    slDistance: 530.00,
    slRationale: 'Structural invalidation buffer above swing high (entry + 530.00 pts)',
    tp1: 80325.00,
    tp1Gain: 795.00,
    tp2: 79530.00,
    tp2Gain: 1590.00,
    tp3: 78735.00,
    tp3Gain: 2385.00,
    rrRatio: '1 : 3.0',
    riskPts: 530.00,
    factors: [
      'EMA 21 < 55 Ribbon Bearish Expansion',
      'Hurst Exponent 0.61 (Persistent Bear Trend)',
      'Intraday VWAP 81950.00 (POC: 81500.00)',
      'Orderflow Delta -21.4% (Selling Dominance)',
      'Dynamic ATR Invalidation 530.00 pts'
    ],
    metrics: {
      ema21: 81450.0,
      ema55: 82100.0,
      adx: 31.5,
      er: 0.38,
      atr: 353.33,
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
