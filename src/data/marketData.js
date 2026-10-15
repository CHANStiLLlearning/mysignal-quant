export const initialTickers = [
  { symbol: 'XAUUSD', name: 'Gold / US Dollar', price: 4105.00, change: -1.20, isBull: false, tvSymbol: 'OANDA:XAUUSD', category: 'gold', assetType: 'gold' },
  { symbol: 'BTCUSDT', name: 'Bitcoin / Tether', price: 81900.00, change: -1.40, isBull: false, tvSymbol: 'BINANCE:BTCUSDT', category: 'crypto', assetType: 'crypto' },
];

export const initialMarketPredictions = {
  XAUUSD: {
    symbol: 'XAUUSD',
    name: 'Gold Spot / US Dollar',
    currentPrice: 4152.00,
    verdict: 'BUY',
    verdictLabel: '▲ PREDICTED BUY',
    verdictSubtext: 'High Probability Bullish Outperform',
    actionText: 'BUY / LONG',
    isBull: true,
    buyProbability: 84,
    sellProbability: 16,
    confidence: 84,
    expectedMovePts: '+39.00 pts',
    targetPrice: 4191.00,
    invalidationLevel: 4139.00,
    riskReward: '1 : 3.0',
    summary: 'Quantitative consensus predicts an 84% probability of BUY continuation toward 4191.00. Key invalidation pivot sits at 4139.00.',
    models: [
      {
        name: 'Trend Vector (Dual EMA 21/55)',
        prediction: 'BUY',
        weight: '25%',
        score: 9.5,
        bias: 'BULLISH',
        detail: 'EMA 21 (4148.5) > EMA 55 (4138.2) confirming bullish trend ribbon'
      },
      {
        name: 'Directional Momentum (ADX & DMI)',
        prediction: 'BUY',
        weight: '20%',
        score: 8.8,
        bias: '+DI LEADING',
        detail: '+DI: 31.8 | -DI: 15.2 | ADX Power: 34.6 (Strong Trend Velocity)'
      },
      {
        name: 'Microstructure Delta & VWAP',
        prediction: 'BUY',
        weight: '25%',
        score: 9.1,
        bias: 'BUYER DOMINANCE',
        detail: 'Orderflow delta at +18.4% above intraday VWAP 4142.10'
      },
      {
        name: 'Fractal Memory (Hurst R/S)',
        prediction: 'BUY',
        weight: '15%',
        score: 8.9,
        bias: 'PERSISTENT TREND',
        detail: 'Hurst exponent 0.592 validates persistent upward trajectory'
      },
      {
        name: 'Structural Geometry & Imbalance',
        prediction: 'BUY',
        weight: '15%',
        score: 9.4,
        bias: 'BULLISH EXPANSION',
        detail: 'Higher Highs / Higher Lows with active Bullish FVG at 4140.00'
      }
    ],
    horizons: [
      { timeframe: '15M', label: 'Next 15M Bar', prediction: 'BUY', target: 4159.50, prob: 86, expectedPts: '+7.50', range: '4148.00 - 4162.00' },
      { timeframe: '1H', label: 'Next 1 Hour', prediction: 'BUY', target: 4172.00, prob: 84, expectedPts: '+20.00', range: '4144.00 - 4178.00' },
      { timeframe: '4H', label: 'Next 4 Hours', prediction: 'BUY', target: 4191.00, prob: 78, expectedPts: '+39.00', range: '4139.00 - 4205.00' },
      { timeframe: '24H', label: 'Next 24 Hours', prediction: 'BUY', target: 4215.00, prob: 72, expectedPts: '+63.00', range: '4130.00 - 4235.00' }
    ],
    contract: {
      question: 'Will Gold (XAUUSD) close HIGHER (BUY) or LOWER (SELL) by next session close?',
      buyOdds: 0.84,
      sellOdds: 0.16,
      buyPriceDisplay: '84¢',
      sellPriceDisplay: '16¢',
      volume24h: '$5.42M',
      totalPredictions: 1840,
      crowdBuyPct: 84,
      crowdSellPct: 16
    }
  },
  BTCUSDT: {
    symbol: 'BTCUSDT',
    name: 'Bitcoin / Tether Perpetual',
    currentPrice: 81900.00,
    verdict: 'SELL',
    verdictLabel: '▼ PREDICTED SELL',
    verdictSubtext: 'High Probability Bearish Breakdown',
    actionText: 'SELL / SHORT',
    isBull: false,
    buyProbability: 8,
    sellProbability: 92,
    confidence: 92,
    expectedMovePts: '-1590.00 pts',
    targetPrice: 79530.00,
    invalidationLevel: 81650.00,
    riskReward: '1 : 3.0',
    summary: 'Quantitative consensus predicts a 92% probability of SELL continuation toward 79530.00. Key invalidation pivot sits at 81650.00.',
    models: [
      {
        name: 'Trend Vector (Dual EMA 21/55)',
        prediction: 'SELL',
        weight: '25%',
        score: 9.6,
        bias: 'BEARISH',
        detail: 'EMA 21 (81450.0) < EMA 55 (82100.0) bearish momentum expansion'
      },
      {
        name: 'Directional Momentum (ADX & DMI)',
        prediction: 'SELL',
        weight: '20%',
        score: 9.2,
        bias: '-DI LEADING',
        detail: '+DI: 14.1 | -DI: 36.8 | ADX Power: 31.5 (Strong Trend Velocity)'
      },
      {
        name: 'Microstructure Delta & VWAP',
        prediction: 'SELL',
        weight: '25%',
        score: 9.0,
        bias: 'SELLER DOMINANCE',
        detail: 'Heavy distribution delta at -21.4% below intraday VWAP'
      },
      {
        name: 'Fractal Memory (Hurst R/S)',
        prediction: 'SELL',
        weight: '15%',
        score: 8.8,
        bias: 'PERSISTENT BEAR',
        detail: 'Hurst exponent 0.614 confirms strong bearish momentum persistence'
      },
      {
        name: 'Structural Geometry & Imbalance',
        prediction: 'SELL',
        weight: '15%',
        score: 9.3,
        bias: 'BEARISH BOS',
        detail: 'Confirmed Break of Structure (BOS) with Supply FVG overhead'
      }
    ],
    horizons: [
      { timeframe: '15M', label: 'Next 15M Bar', prediction: 'SELL', target: 81550.00, prob: 94, expectedPts: '-350.00', range: '81400.00 - 82000.00' },
      { timeframe: '1H', label: 'Next 1 Hour', prediction: 'SELL', target: 80800.00, prob: 92, expectedPts: '-1100.00', range: '80400.00 - 81950.00' },
      { timeframe: '4H', label: 'Next 4 Hours', prediction: 'SELL', target: 79530.00, prob: 86, expectedPts: '-2370.00', range: '78900.00 - 81650.00' },
      { timeframe: '24H', label: 'Next 24 Hours', prediction: 'SELL', target: 78500.00, prob: 80, expectedPts: '-3400.00', range: '77800.00 - 81800.00' }
    ],
    contract: {
      question: 'Will Bitcoin (BTCUSDT) close HIGHER (BUY) or LOWER (SELL) by next session close?',
      buyOdds: 0.08,
      sellOdds: 0.92,
      buyPriceDisplay: '8¢',
      sellPriceDisplay: '92¢',
      volume24h: '$24.80M',
      totalPredictions: 4210,
      crowdBuyPct: 8,
      crowdSellPct: 92
    }
  }
};

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
    marketPrediction: initialMarketPredictions.XAUUSD,
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
    marketPrediction: initialMarketPredictions.BTCUSDT,
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
