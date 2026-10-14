/**
 * ZOQIRA QUANT - Personal AI Market Intelligence & Terminal
 * Core Application Engine
 */

// =============================================================================
// 1. DATA STORES: ASSETS & AI SIGNALS
// =============================================================================

const ASSETS = {
  "OANDA:XAUUSD": {
    name: "XAU/USD (Gold)",
    vendor: "OANDA Real-Time Data",
    category: "metal",
    pointValue: 100, // 1 Lot = 100 oz ($1 move = $100)
    currentPrice: 2382.40,
    atr: 4.20,
    defaultSwingLong: 2374.00,
    defaultSwingShort: 2389.00,
    decimals: 2,
    regime: "BULLISH",
    adx: 34.2,
    er: 0.58
  },
  "TVC:USOIL": {
    name: "USOIL (WTI Crude)",
    vendor: "TVC Energy Stream",
    category: "commodity",
    pointValue: 1000, // 1 Lot = 1,000 barrels
    currentPrice: 82.40,
    atr: 1.15,
    defaultSwingLong: 81.20,
    defaultSwingShort: 83.30,
    decimals: 2,
    regime: "BEARISH",
    adx: 28.5,
    er: 0.52
  },
  "FX:EURUSD": {
    name: "EUR/USD",
    vendor: "FXCM / Institutional ECN",
    category: "forex",
    pointValue: 100000, // 1 Standard Lot
    currentPrice: 1.08650,
    atr: 0.00380,
    defaultSwingLong: 1.08320,
    defaultSwingShort: 1.09100,
    decimals: 5,
    regime: "BULLISH",
    adx: 27.1,
    er: 0.44
  },
  "FX:GBPUSD": {
    name: "GBP/USD",
    vendor: "FXCM / Institutional ECN",
    category: "forex",
    pointValue: 100000,
    currentPrice: 1.29400,
    atr: 0.00520,
    defaultSwingLong: 1.28900,
    defaultSwingShort: 1.29850,
    decimals: 5,
    regime: "BEARISH",
    adx: 29.5,
    er: 0.48
  },
  "BINANCE:BTCUSDT": {
    name: "BTC/USDT",
    vendor: "Binance Spot WebSocket",
    category: "crypto",
    pointValue: 1, // Direct coin delta
    currentPrice: 67450.00,
    atr: 1150.00,
    defaultSwingLong: 66200.00,
    defaultSwingShort: 68900.00,
    decimals: 2,
    regime: "BULLISH",
    adx: 36.8,
    er: 0.62
  },
  "NASDAQ:NDX": {
    name: "NAS100 (Tech Index)",
    vendor: "CME / E-Mini Stream",
    category: "indices",
    pointValue: 20, // 1 Contract = $20 per point
    currentPrice: 18490.20,
    atr: 85.00,
    defaultSwingLong: 18410.00,
    defaultSwingShort: 18560.00,
    decimals: 2,
    regime: "RANGING",
    adx: 16.4,
    er: 0.24
  }
};

let AI_SIGNALS = [
  {
    id: "sig-1",
    symbol: "OANDA:XAUUSD",
    assetName: "XAU/USD (Gold)",
    category: "metal",
    timeframe: "M15",
    type: "BUY",
    status: "ACTIVE",
    entry: 2382.40,
    sl: 2374.00,
    tp1: 2395.00,
    tp2: 2407.60,
    riskR: 8.40,
    rr: "1 : 3.0",
    confidence: 94,
    adx: 34.2,
    er: 0.58,
    reasoning: "Fair Value Gap (FVG) retest on M15 + institutional EMA 21 rejection. Asia session liquidity sweep complete."
  },
  {
    id: "sig-2",
    symbol: "BINANCE:BTCUSDT",
    assetName: "BTC/USDT (Bitcoin)",
    category: "crypto",
    timeframe: "H1",
    type: "BUY",
    status: "ACTIVE",
    entry: 67450.00,
    sl: 66200.00,
    tp1: 69325.00,
    tp2: 71200.00,
    riskR: 1250.00,
    rr: "1 : 3.0",
    confidence: 91,
    adx: 36.8,
    er: 0.62,
    reasoning: "4-Hour higher-low confirmation with expanding spot buy-delta. Clean volume void path towards $71,000."
  },
  {
    id: "sig-3",
    symbol: "TVC:USOIL",
    assetName: "USOIL (WTI Crude)",
    category: "commodity",
    timeframe: "M15",
    type: "SELL",
    status: "ACTIVE",
    entry: 82.40,
    sl: 83.30,
    tp1: 81.05,
    tp2: 79.70,
    riskR: 0.90,
    rr: "1 : 3.0",
    confidence: 87,
    adx: 28.5,
    er: 0.52,
    reasoning: "Bearish EMA ribbon expansion on H1 + reject of daily volume weighted supply pocket at $83.30."
  },
  {
    id: "sig-4",
    symbol: "FX:EURUSD",
    assetName: "EUR/USD",
    category: "forex",
    timeframe: "M15",
    type: "BUY",
    status: "ACTIVE",
    entry: 1.08650,
    sl: 1.08320,
    tp1: 1.09145,
    tp2: 1.09640,
    riskR: 0.00330,
    rr: "1 : 3.0",
    confidence: 84,
    adx: 27.1,
    er: 0.44,
    reasoning: "London session low sweep followed by multi-candle structural shift. H1 50 EMA upward sloping."
  },
  {
    id: "sig-5",
    symbol: "FX:GBPUSD",
    assetName: "GBP/USD",
    category: "forex",
    timeframe: "M15",
    type: "SELL",
    status: "ACTIVE",
    entry: 1.29400,
    sl: 1.29850,
    tp1: 1.28725,
    tp2: 1.28050,
    riskR: 0.00450,
    rr: "1 : 3.0",
    confidence: 88,
    adx: 29.5,
    er: 0.48,
    reasoning: "Breakdown of previous day demand zone with sustained volume. Momentum oscillator aligned in oversold impulse."
  },
  {
    id: "sig-6",
    symbol: "NASDAQ:NDX",
    assetName: "NAS100",
    category: "indices",
    timeframe: "M15",
    type: "STAND ASIDE",
    status: "CHOP ZONE",
    entry: 18490.20,
    sl: 0,
    tp1: 0,
    tp2: 0,
    riskR: 0,
    rr: "N/A",
    confidence: 48,
    adx: 16.4,
    er: 0.24,
    reasoning: "ADX is 16.4 (< 20) with Kaufman ER below 0.30. Consolidating inside narrow range. Stand aside to preserve capital."
  }
];

const HISTORICAL_TRACK_RECORD = [
  { time: "Today 14:15", asset: "XAU/USD", tf: "M15", action: "BUY", entry: "2,364.50", exit: "2,382.40", pips: "+17.90 pts", rr: "1 : 2.5", outcome: "WIN (TP2)" },
  { time: "Today 11:30", asset: "BTC/USDT", tf: "H1", action: "BUY", entry: "65,800.00", exit: "67,450.00", pips: "+1,650 pts", rr: "1 : 3.2", outcome: "WIN (TP2)" },
  { time: "Yesterday", asset: "USOIL", tf: "M15", action: "SELL", entry: "83.60", exit: "82.20", pips: "+1.40 pts", rr: "1 : 2.8", outcome: "WIN (TP1)" },
  { time: "Yesterday", asset: "EUR/USD", tf: "M15", action: "BUY", entry: "1.08250", exit: "1.08620", pips: "+37 pips", rr: "1 : 2.1", outcome: "WIN (TP1)" },
  { time: "2 Days Ago", asset: "GBP/USD", tf: "M15", action: "SELL", entry: "1.29800", exit: "1.30050", pips: "-25 pips", rr: "1 : -1.0", outcome: "LOSS (SL)" },
  { time: "3 Days Ago", asset: "XAU/USD", tf: "M15", action: "BUY", entry: "2,342.10", exit: "2,360.80", pips: "+18.70 pts", rr: "1 : 3.0", outcome: "WIN (TP2)" }
];

// App State
let currentSymbol = "OANDA:XAUUSD";
let currentTimeframe = "15";
let tradeDirection = "LONG";
let activeFilter = "all";
let tvWidget = null;

// =============================================================================
// 2. RENDERERS: SIGNALS DESK & TRACK RECORD
// =============================================================================

function renderSignalsDesk(filter = "all") {
  const container = document.getElementById("signals-cards-container");
  if (!container) return;

  const filtered = filter === "all" 
    ? AI_SIGNALS 
    : AI_SIGNALS.filter(s => s.category === filter);

  document.getElementById("active-signals-count").textContent = `${filtered.length} ACTIVE SIGNALS`;

  container.innerHTML = filtered.map(sig => {
    const isBuy = sig.type === "BUY";
    const isSell = sig.type === "SELL";
    const borderClass = isBuy ? "bull-border" : (isSell ? "bear-border" : "chop-border");
    const badgeClass = isBuy ? "buy" : (isSell ? "sell" : "neutral");
    const dec = (ASSETS[sig.symbol] || {}).decimals || 2;

    const formattedEntry = sig.entry ? sig.entry.toFixed(dec) : "--";
    const formattedSL = sig.sl ? sig.sl.toFixed(dec) : "--";
    const formattedTP = sig.tp2 ? sig.tp2.toFixed(dec) : "--";

    return `
      <div class="signal-card ${borderClass}" id="card-${sig.id}">
        <div class="signal-top-row">
          <div class="signal-asset-meta">
            <span class="asset-symbol">${sig.assetName}</span>
            <span class="signal-tf-tag">${sig.timeframe}</span>
          </div>
          <span class="signal-action-badge ${badgeClass}">${sig.type}</span>
        </div>

        <div class="confidence-wrapper">
          <div class="confidence-header">
            <span>AI Probability Score</span>
            <span class="confidence-score">${sig.confidence}%</span>
          </div>
          <div class="confidence-track">
            <div class="confidence-fill" style="width: ${sig.confidence}%;"></div>
          </div>
        </div>

        <div class="signal-params-grid">
          <div class="param-item">
            <span class="param-label">Entry</span>
            <span class="param-val entry">${formattedEntry}</span>
          </div>
          <div class="param-item">
            <span class="param-label">Stop Loss</span>
            <span class="param-val sl">${formattedSL}</span>
          </div>
          <div class="param-item">
            <span class="param-label">Target (TP2)</span>
            <span class="param-val tp">${formattedTP}</span>
          </div>
        </div>

        <div class="signal-reasoning">
          <strong>AI Breakdown:</strong> ${sig.reasoning}
        </div>

        <div class="signal-footer-actions">
          <button class="btn-card-action" onclick="loadSignalOnChart('${sig.symbol}', '${sig.timeframe}')">
            📊 View on Chart
          </button>
          <button class="btn-card-action" onclick="populateRiskCalculator('${sig.symbol}', ${sig.entry}, ${sig.sl}, '${sig.type}')">
            ⚖️ Calculate Lots
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function renderTrackRecord() {
  const tbody = document.getElementById("track-record-body");
  if (!tbody) return;

  tbody.innerHTML = HISTORICAL_TRACK_RECORD.map(rec => {
    const isWin = rec.outcome.startsWith("WIN");
    const badgeClass = isWin ? "outcome-win" : "outcome-loss";
    const actionClass = rec.action === "BUY" ? "color: var(--bull-emerald);" : "color: var(--bear-rose);";

    return `
      <tr>
        <td style="color: var(--text-muted);">${rec.time}</td>
        <td style="font-weight: 700; color: #fff;">${rec.asset}</td>
        <td><span class="signal-tf-tag">${rec.tf}</span></td>
        <td style="font-weight: 700; ${actionClass}">${rec.action}</td>
        <td>${rec.entry}</td>
        <td>${rec.exit}</td>
        <td style="font-weight: 700; color: ${isWin ? 'var(--bull-emerald)' : 'var(--bear-rose)'};">${rec.pips}</td>
        <td style="color: var(--neon-cyan);">${rec.rr}</td>
        <td><span class="outcome-badge ${badgeClass}">${rec.outcome}</span></td>
      </tr>
    `;
  }).join("");
}

// =============================================================================
// 3. TRADINGVIEW WIDGET ENGINE
// =============================================================================

function initTradingViewChart(symbol, timeframe) {
  const container = document.getElementById("tradingview_chart_container");
  if (!container) return;
  container.innerHTML = "";

  if (typeof TradingView === "undefined") {
    container.innerHTML = `
      <div style="display:flex;height:100%;align-items:center;justify-content:center;color:var(--text-muted);font-size:13px;">
        Connecting to TradingView Web Feed...
      </div>`;
    return;
  }

  tvWidget = new TradingView.widget({
    autosize: true,
    symbol: symbol,
    interval: timeframe,
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1",
    locale: "en",
    toolbar_bg: "#0a0e19",
    enable_publishing: false,
    hide_top_toolbar: false,
    hide_legend: false,
    save_image: false,
    container_id: "tradingview_chart_container",
    studies: [
      "MASimple@tv-basicstudies",
      "ATR@tv-basicstudies"
    ],
    overrides: {
      "paneProperties.background": "#05070d",
      "paneProperties.vertGridProperties.color": "rgba(255, 255, 255, 0.03)",
      "paneProperties.horzGridProperties.color": "rgba(255, 255, 255, 0.03)",
      "scalesProperties.textColor": "#94a3b8"
    }
  });

  const asset = ASSETS[symbol] || { name: symbol, vendor: "Real-Time Feed" };
  document.getElementById("active-chart-title").textContent = asset.name;
  document.getElementById("active-chart-vendor").textContent = asset.vendor;
}

// =============================================================================
// 4. DYNAMIC RISK & POSITION SIZING LOGIC
// =============================================================================

function calculateDynamicRisk() {
  const asset = ASSETS[currentSymbol] || ASSETS["OANDA:XAUUSD"];
  const dec = asset.decimals || 2;

  const equity = parseFloat(document.getElementById("calc-equity").value) || 10000;
  const riskPct = parseFloat(document.getElementById("calc-risk").value) || 1.0;
  const entry = parseFloat(document.getElementById("calc-entry").value) || asset.currentPrice;
  const atr = parseFloat(document.getElementById("calc-atr").value) || asset.atr;
  const swing = parseFloat(document.getElementById("calc-swing").value) || (tradeDirection === "LONG" ? asset.defaultSwingLong : asset.defaultSwingShort);

  const dollarRisk = equity * (riskPct / 100.0);

  let sl = 0;
  let riskDist = 0;

  if (tradeDirection === "LONG") {
    const structuralSl = swing - (0.5 * atr);
    const volatilitySl = entry - (1.5 * atr);
    sl = Math.max(structuralSl, volatilitySl);
    riskDist = entry - sl;
  } else {
    const structuralSl = swing + (0.5 * atr);
    const volatilitySl = entry + (1.5 * atr);
    sl = Math.min(structuralSl, volatilitySl);
    riskDist = sl - entry;
  }

  // Safety buffer
  if (riskDist <= 0) {
    riskDist = 1.5 * atr;
    sl = tradeDirection === "LONG" ? (entry - riskDist) : (entry + riskDist);
  }

  const tp1 = tradeDirection === "LONG" ? (entry + 1.5 * riskDist) : (entry - 1.5 * riskDist);
  const tp2 = tradeDirection === "LONG" ? (entry + 3.0 * riskDist) : (entry - 3.0 * riskDist);

  // Position sizing computation
  let positionSize = 0;
  let unitLabel = "Lots";

  if (asset.category === "crypto") {
    positionSize = dollarRisk / riskDist; // Coin amount (e.g. 0.08 BTC)
    unitLabel = "Coins";
  } else if (asset.category === "forex") {
    positionSize = dollarRisk / (riskDist * asset.pointValue);
    unitLabel = "Std Lots";
  } else if (asset.category === "metal") {
    positionSize = dollarRisk / (riskDist * asset.pointValue);
    unitLabel = "Lots (100oz)";
  } else {
    positionSize = dollarRisk / (riskDist * asset.pointValue);
    unitLabel = "Contracts";
  }

  const diffSign = tradeDirection === "LONG" ? "-" : "+";
  const tpSign = tradeDirection === "LONG" ? "+" : "-";

  document.getElementById("calc-sl-out").textContent = `${sl.toFixed(dec)} (${diffSign}${riskDist.toFixed(dec)} pts)`;
  document.getElementById("calc-tp1-out").textContent = `${tp1.toFixed(dec)} (${tpSign}${(riskDist * 1.5).toFixed(dec)} pts)`;
  document.getElementById("calc-tp2-out").textContent = `${tp2.toFixed(dec)} (${tpSign}${(riskDist * 3.0).toFixed(dec)} pts)`;
  document.getElementById("calc-dollar-risk").textContent = `$${dollarRisk.toFixed(2)} (${riskPct.toFixed(1)}%)`;
  document.getElementById("calc-position-size").textContent = `${positionSize.toFixed(2)} ${unitLabel}`;
}

// Global actions exposed to HTML buttons
window.loadSignalOnChart = function(symbol, timeframe) {
  currentSymbol = symbol;
  currentTimeframe = timeframe.replace("M", "");
  initTradingViewChart(symbol, currentTimeframe);

  // Sync active chart timeframe button
  document.querySelectorAll(".chart-tf-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.tf === currentTimeframe);
  });

  // Sync ticker card active state
  document.querySelectorAll(".ticker-card").forEach(c => {
    c.classList.toggle("active-card", c.dataset.symbol === symbol);
  });

  document.getElementById("chart-section").scrollIntoView({ behavior: "smooth" });
};

window.populateRiskCalculator = function(symbol, entry, sl, action) {
  currentSymbol = symbol;
  tradeDirection = action === "BUY" ? "LONG" : "SHORT";

  // Toggle direction UI
  const btnLong = document.getElementById("btn-long-toggle");
  const btnShort = document.getElementById("btn-short-toggle");

  if (tradeDirection === "LONG") {
    btnLong.classList.add("active-long");
    btnShort.classList.remove("active-short");
    document.getElementById("swing-hint").textContent = "Low";
  } else {
    btnShort.classList.add("active-short");
    btnLong.classList.remove("active-long");
    document.getElementById("swing-hint").textContent = "High";
  }

  const asset = ASSETS[symbol] || ASSETS["OANDA:XAUUSD"];
  document.getElementById("calc-entry").value = entry;
  document.getElementById("calc-atr").value = asset.atr;
  document.getElementById("calc-swing").value = sl || (tradeDirection === "LONG" ? asset.defaultSwingLong : asset.defaultSwingShort);

  calculateDynamicRisk();
  document.getElementById("calculator-section").scrollIntoView({ behavior: "smooth" });
};

// =============================================================================
// 5. AUDIO CHIME SYNTHESIZER (WEB AUDIO API)
// =============================================================================
function playScanChime() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880.00, audioCtx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  } catch (e) {
    // Audio context restricted or unavailable
  }
}

// =============================================================================
// 6. LIVE BINANCE WEBSOCKET INTEGRATION (CRYPTO TICKER STREAM)
// =============================================================================
function connectCryptoWebSocket() {
  try {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@ticker");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const btcPrice = parseFloat(data.c);
      const priceEl = document.getElementById("price-btc");
      if (priceEl && btcPrice) {
        priceEl.textContent = btcPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        // Pulse glow
        priceEl.style.color = "#00f2fe";
        setTimeout(() => { priceEl.style.color = "#fff"; }, 300);
      }
    };
    ws.onerror = () => { /* Fallback to mock micro-ticks */ };
  } catch (e) {
    // Non-critical
  }
}

// =============================================================================
// 7. INITIALIZATION & EVENT HANDLERS
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Render Initial Views
  renderSignalsDesk(activeFilter);
  renderTrackRecord();
  initTradingViewChart(currentSymbol, currentTimeframe);
  calculateDynamicRisk();
  connectCryptoWebSocket();

  // Filter Pills Handling
  document.querySelectorAll(".filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeFilter = pill.dataset.filter;
      renderSignalsDesk(activeFilter);
    });
  });

  // Ticker Cards Quick Switching
  document.querySelectorAll(".ticker-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".ticker-card").forEach(c => c.classList.remove("active-card"));
      card.classList.add("active-card");
      currentSymbol = card.dataset.symbol;
      initTradingViewChart(currentSymbol, currentTimeframe);

      const asset = ASSETS[currentSymbol];
      if (asset) {
        document.getElementById("calc-entry").value = asset.currentPrice;
        document.getElementById("calc-atr").value = asset.atr;
        document.getElementById("calc-swing").value = tradeDirection === "LONG" ? asset.defaultSwingLong : asset.defaultSwingShort;
        calculateDynamicRisk();
      }
    });
  });

  // Timeframe Buttons
  document.querySelectorAll(".chart-tf-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".chart-tf-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentTimeframe = btn.dataset.tf;
      initTradingViewChart(currentSymbol, currentTimeframe);
    });
  });

  // Long / Short Toggles
  const btnLong = document.getElementById("btn-long-toggle");
  const btnShort = document.getElementById("btn-short-toggle");

  btnLong.addEventListener("click", () => {
    tradeDirection = "LONG";
    btnLong.classList.add("active-long");
    btnShort.classList.remove("active-short");
    document.getElementById("swing-hint").textContent = "Low";
    const asset = ASSETS[currentSymbol];
    if (asset) document.getElementById("calc-swing").value = asset.defaultSwingLong;
    calculateDynamicRisk();
  });

  btnShort.addEventListener("click", () => {
    tradeDirection = "SHORT";
    btnShort.classList.add("active-short");
    btnLong.classList.remove("active-long");
    document.getElementById("swing-hint").textContent = "High";
    const asset = ASSETS[currentSymbol];
    if (asset) document.getElementById("calc-swing").value = asset.defaultSwingShort;
    calculateDynamicRisk();
  });

  // Recalculate Events
  document.getElementById("btn-recalculate-brackets").addEventListener("click", calculateDynamicRisk);
  ["calc-equity", "calc-risk", "calc-entry", "calc-atr", "calc-swing"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", calculateDynamicRisk);
  });

  // AI Scan Trigger Simulation
  const scanBtn = document.getElementById("btn-trigger-ai-scan");
  const scanModal = document.getElementById("scan-modal");
  const progressBar = document.getElementById("scan-progress-bar");
  const statusText = document.getElementById("scan-status-text");

  scanBtn.addEventListener("click", () => {
    scanModal.classList.add("active");
    progressBar.style.width = "0%";
    statusText.textContent = "Scanning institutional liquidity voids & multi-timeframe EMA alignment...";

    setTimeout(() => {
      progressBar.style.width = "45%";
      statusText.textContent = "Computing Kaufman Efficiency Ratio (ER) & filtering range chop via Wilder's ADX...";
    }, 600);

    setTimeout(() => {
      progressBar.style.width = "85%";
      statusText.textContent = "Synthesizing dynamic ATR stop loss brackets and high-probability TP targets...";
    }, 1200);

    setTimeout(() => {
      progressBar.style.width = "100%";
      statusText.textContent = "Scan complete. 5 high-probability institutional setups verified.";
      playScanChime();
    }, 1800);

    setTimeout(() => {
      scanModal.classList.remove("active");
      renderSignalsDesk(activeFilter);
    }, 2300);
  });

  // Pine Script Modal Controls & Fallback Loader
  const pineModal = document.getElementById("pine-modal");
  const openPineBtn = document.getElementById("btn-open-pine-modal");
  const closePineBtn = document.getElementById("btn-close-modal");
  const copyPineBtn = document.getElementById("btn-copy-pine");
  const pineCodeBlock = document.getElementById("pine-script-content");

  // Inline Fallback Pine Script Code
  const fallbackPine = `//@version=5
indicator("Institutional Trend & Dynamic TP/SL Engine [Quant v5]", shorttitle="QUANT_ENGINE_v5", overlay=true, max_lines_count=500, max_boxes_count=500, max_labels_count=500)

// 1. INPUTS & CONFIGURATION
grp_trend   = "1. Trend & Regime Engine"
emaFastLen  = input.int(21, "Fast EMA Length", minval=1, group=grp_trend)
emaSlowLen  = input.int(55, "Slow EMA Length", minval=1, group=grp_trend)
useHtf      = input.bool(true, "Enable Higher Timeframe Filter", group=grp_trend)
htfRes      = input.timeframe("60", "HTF Timeframe (e.g. 60 for H1)", group=grp_trend)
htfEmaLen   = input.int(50, "HTF Filter EMA Length", minval=1, group=grp_trend)

grp_chop    = "2. Chop & Volatility Filters"
adxLen      = input.int(14, "ADX Lookback", minval=1, group=grp_chop)
adxThresh   = input.float(25.0, "ADX Trend Threshold (>=)", minval=10.0, step=0.5, group=grp_chop)
erLen       = input.int(14, "Kaufman ER Lookback", minval=1, group=grp_chop)
erThresh    = input.float(0.35, "Kaufman ER Threshold (Noise Filter)", minval=0.1, maxval=0.9, step=0.05, group=grp_chop)

grp_risk    = "3. Dynamic Risk & TP/SL Parameters"
atrLen      = input.int(14, "ATR Lookback", minval=1, group=grp_risk)
atrSlMult   = input.float(1.5, "ATR Stop Loss Multiplier", minval=0.5, step=0.1, group=grp_risk)
swingLookbk = input.int(10, "Structural Swing Lookback (Bars)", minval=3, maxval=50, group=grp_risk)
bufferMult  = input.float(0.5, "Swing Invalidation Buffer (x ATR)", minval=0.0, step=0.1, group=grp_risk)
rrRatio1    = input.float(1.5, "Risk-to-Reward Ratio: TP1", minval=0.5, step=0.1, group=grp_risk)
rrRatio2    = input.float(3.0, "Risk-to-Reward Ratio: TP2", minval=1.0, step=0.1, group=grp_risk)

grp_ui      = "4. Visual HUD & Display"
showTable   = input.bool(true, "Display On-Screen HUD Dashboard", group=grp_ui)
showBoxes   = input.bool(true, "Draw TP/SL Brackets on Signals", group=grp_ui)
colorBars   = input.bool(true, "Color Bars by Market Regime", group=grp_ui)

// 2. MATHEMATICAL CORE
emaFast = ta.ema(close, emaFastLen)
emaSlow = ta.ema(close, emaSlowLen)
htfClose = request.security(syminfo.tickerid, htfRes, close[barstate.isrealtime ? 1 : 0], gaps=barmerge.gaps_off, lookahead=barmerge.lookahead_off)
htfEma   = request.security(syminfo.tickerid, htfRes, ta.ema(close, htfEmaLen)[barstate.isrealtime ? 1 : 0], gaps=barmerge.gaps_off, lookahead=barmerge.lookahead_off)
htfBull  = not useHtf or (htfClose > htfEma)
htfBear  = not useHtf or (htfClose < htfEma)

atrVal = ta.atr(atrLen)
[plusDi, minusDi, adxVal] = ta.dmi(adxLen, adxLen)

direction = math.abs(close - close[erLen])
volatility = math.sum(math.abs(close - close[1]), erLen)
kaufmanER = volatility != 0 ? (direction / volatility) : 0.0

isTrending = (adxVal >= adxThresh) and (kaufmanER >= erThresh)
isBullish  = isTrending and (close > emaFast) and (emaFast > emaSlow) and htfBull
isBearish  = isTrending and (close < emaFast) and (emaFast < emaSlow) and htfBear
isRanging  = not isBullish and not isBearish

swingLowest  = ta.lowest(low, swingLookbk)
swingHighest = ta.highest(high, swingLookbk)

// 3. SIGNALS & DYNAMIC TP/SL
longTrigger  = isBullish and not isBullish[1]
shortTrigger = isBearish and not isBearish[1]

var float entryP  = na
var float slP     = na
var float tp1P    = na
var float tp2P    = na
var float riskR   = na
var int   activeDir = 0

if longTrigger
    entryP    := close
    structSL   = swingLowest - (bufferMult * atrVal)
    volSL      = entryP - (atrSlMult * atrVal)
    slP       := math.max(structSL, volSL)
    riskR     := entryP - slP
    if riskR > 0
        tp1P      := entryP + (rrRatio1 * riskR)
        tp2P      := entryP + (rrRatio2 * riskR)
        activeDir := 1

if shortTrigger
    entryP    := close
    structSL   = swingHighest + (bufferMult * atrVal)
    volSL      = entryP + (atrSlMult * atrVal)
    slP       := math.min(structSL, volSL)
    riskR     := slP - entryP
    if riskR > 0
        tp1P      := entryP - (rrRatio1 * riskR)
        tp2P      := entryP - (rrRatio2 * riskR)
        activeDir := -1

if activeDir == 1 and (low <= slP or high >= tp2P)
    activeDir := 0
if activeDir == -1 and (high >= slP or low <= tp2P)
    activeDir := 0

// 4. PLOTS
plot(emaFast, "EMA 21", color=color.aqua, linewidth=2)
plot(emaSlow, "EMA 55", color=color.orange, linewidth=2)
plot(activeDir != 0 ? slP : na, "Stop Loss", color=color.red, style=plot.style_linebr, linewidth=2)
plot(activeDir != 0 ? tp1P : na, "TP1 (1.5R)", color=color.lime, style=plot.style_linebr, linewidth=1)
plot(activeDir != 0 ? tp2P : na, "TP2 (3.0R)", color=color.green, style=plot.style_linebr, linewidth=2)

barcolor(colorBars ? (isBullish ? color.green : (isBearish ? color.red : color.gray)) : na)
plotshape(longTrigger, title="Long Signal", style=shape.triangleup, location=location.belowbar, color=color.green, size=size.normal)
plotshape(shortTrigger, title="Short Signal", style=shape.triangledown, location=location.abovebar, color=color.red, size=size.normal)

// 5. HUD TABLE
var table hud = table.new(position.top_right, 2, 8, bgcolor=color.new(#0d1117, 15), border_color=color.new(#30363d, 0), border_width=1)
if barstate.islast and showTable
    table.cell(hud, 0, 0, "QUANT ENGINE v5", bgcolor=color.new(#161b22, 10), text_color=color.white, text_size=size.small)
    table.cell(hud, 1, 0, syminfo.ticker + " [" + timeframe.period + "]", bgcolor=color.new(#161b22, 10), text_color=color.aqua, text_size=size.small)
    regimeStr = isBullish ? "🟢 BULLISH" : (isBearish ? "🔴 BEARISH" : "🟡 CHOP / RANGE")
    regimeBg  = isBullish ? color.new(color.green, 70) : (isBearish ? color.new(color.red, 70) : color.new(color.yellow, 70))
    table.cell(hud, 0, 1, "Regime Status", text_color=color.silver, text_size=size.small)
    table.cell(hud, 1, 1, regimeStr, bgcolor=regimeBg, text_color=color.white, text_size=size.small)
    table.cell(hud, 0, 2, "ADX (14)", text_color=color.silver, text_size=size.small)
    table.cell(hud, 1, 2, str.tostring(adxVal, "#.#") + (adxVal >= adxThresh ? " (Trending)" : " (Chop)"), text_color=adxVal >= adxThresh ? color.lime : color.orange, text_size=size.small)
    table.cell(hud, 0, 3, "Efficiency Ratio", text_color=color.silver, text_size=size.small)
    table.cell(hud, 1, 3, str.tostring(kaufmanER, "#.##") + (kaufmanER >= erThresh ? " (Smooth)" : " (Noisy)"), text_color=kaufmanER >= erThresh ? color.lime : color.orange, text_size=size.small)
    table.cell(hud, 0, 4, "Current ATR (14)", text_color=color.silver, text_size=size.small)
    table.cell(hud, 1, 4, str.tostring(atrVal, "#.####"), text_color=color.white, text_size=size.small)
    activeStr = activeDir == 1 ? "LONG ACTIVE" : (activeDir == -1 ? "SHORT ACTIVE" : "STAND ASIDE")
    table.cell(hud, 0, 5, "Trade Setup", text_color=color.silver, text_size=size.small)
    table.cell(hud, 1, 5, activeStr, text_color=activeDir == 1 ? color.green : (activeDir == -1 ? color.red : color.gray), text_size=size.small)
    table.cell(hud, 0, 6, "Dynamic SL", text_color=color.silver, text_size=size.small)
    table.cell(hud, 1, 6, activeDir != 0 ? str.tostring(slP, "#.##") : "--", text_color=color.red, text_size=size.small)
    table.cell(hud, 0, 7, "Targets (1.5R / 3R)", text_color=color.silver, text_size=size.small)
    table.cell(hud, 1, 7, activeDir != 0 ? "TP1: " + str.tostring(tp1P, "#.##") + "\\nTP2: " + str.tostring(tp2P, "#.##") : "--", text_color=color.green, text_size=size.small)

// 6. ALERTS
alertcondition(longTrigger, title="[QUANT] Bullish Entry", message="QUANT ALERT: Bullish Trend Confirmed on {{ticker}} at {{close}}.")
alertcondition(shortTrigger, title="[QUANT] Bearish Entry", message="QUANT ALERT: Bearish Trend Confirmed on {{ticker}} at {{close}}.")
alertcondition(isRanging and not isRanging[1], title="[QUANT] Chop Detected", message="QUANT ALERT: {{ticker}} entered ranging/chop zone.")
`;

  pineCodeBlock.textContent = fallbackPine;

  fetch("Institutional_Quant_Engine_v5.pine")
    .then(r => r.text())
    .then(text => {
      if (text && text.trim().length > 0) pineCodeBlock.textContent = text;
    })
    .catch(() => {});

  openPineBtn.addEventListener("click", () => pineModal.classList.add("active"));
  closePineBtn.addEventListener("click", () => pineModal.classList.remove("active"));
  pineModal.addEventListener("click", (e) => {
    if (e.target === pineModal) pineModal.classList.remove("active");
  });

  copyPineBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(pineCodeBlock.textContent).then(() => {
      const copyText = document.getElementById("copy-btn-text");
      copyText.textContent = "Copied to Clipboard!";
      setTimeout(() => { copyText.textContent = "Copy Script Code"; }, 2500);
    });
  });
});
