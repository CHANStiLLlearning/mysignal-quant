# MySIGNAL QUANT // Autonomous AI Market Intelligence & Signal Terminal

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Production-black?style=for-the-badge&logo=vercel)](https://tradingtool-theta.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-CHANStiLLlearning%2Fmysignal--quant-181717?style=for-the-badge&logo=github)](https://github.com/CHANStiLLlearning/mysignal-quant)

> 🚀 **Live Production Application:** [https://tradingtool-theta.vercel.app](https://tradingtool-theta.vercel.app)  
> 🔗 **Official Repository:** [https://github.com/CHANStiLLlearning/mysignal-quant](https://github.com/CHANStiLLlearning/mysignal-quant)

---


## Key Features (Modeled after Zoqira)

### 1. Live AI Signals Desk
* **Multi-Asset Coverage**: Real-time setups for **Gold (XAUUSD)**, **Crude Oil (USOIL)**, **Forex (EURUSD, GBPUSD)**, **Crypto (BTCUSDT)**, and **Indices (NAS100)**.
* **Exact Quantitative Geometry**: Each card displays precise **Entry Price**, **Stop Loss**, and **Take Profit (TP1 & TP2)**.
* **AI Confidence Score & Reasoning**: Shows the underlying algorithmic thesis (e.g. *Fair Value Gap retest*, *Wilder's ADX trend power*, *Kaufman Efficiency Ratio*, and *liquidity sweeps*).
* **Instant Actions**:
  * 📊 **View on Chart**: Seamlessly updates the embedded TradingView chart to that exact asset and timeframe.
  * ⚖️ **Calculate Lots**: Injects the setup directly into the dynamic risk calculator to compute lot/position sizes.

### 2. Live Market Pulse Ticker Bar
* Live tickers with percentage change and market regime badges (`🟢 BULLISH`, `🔴 BEARISH`, `🟡 CHOP / RANGE`).
* Connects live to Binance's WebSocket stream for real-time cryptocurrency tick updates.

### 3. Integrated TradingView Web Terminal
* Embedded official TradingView Advanced Real-Time Chart widget.
* Instant timeframe buttons: **M1, M5, M15, H1, H4, D1**.

### 4. Dynamic Risk & Position Sizing Calculator
* Tailored for **Account Equity ($)** and target **Risk per Trade (%)**.
* Automatically scales position size:
  * **Lots (100oz)** for Gold (XAUUSD)
  * **Standard Lots (100k)** for Forex
  * **Contracts** for Crude Oil & Indices
  * **Coins** for Crypto (BTC/ETH)
* Generates exact asymmetric targets: **1.5R (TP1 - scale 50% and move to BE)** and **3.0R (TP2 - trend runner)**.

### 5. Verified Historical Track Record
* Transparent performance audit table tracking trade timestamps, assets, entry/exit, points/pips gained, and risk-to-reward outcomes.

### 6. Interactive AI Market Scan Simulator
* Click **"Run AI Scan"** to trigger a real-time multi-factor scanning animation complete with Web Audio synthesized chimes.

### 7. Pine Script v5 Engine Integration
* Click **"Pine Script v5"** to open a 1-click copy drawer containing the complete indicator code ready to drop directly into the Pine Editor on [TradingView.com/chart](https://www.tradingview.com/chart/).

---

## How to Launch

### Option A: Open directly in your browser
Double-click [index.html](file:///c:/Users/Dell/Desktop/tradingtool/index.html) or run in PowerShell:
```powershell
Start-Process "c:\Users\Dell\Desktop\tradingtool\index.html"
```

### Option B: Local Web Server
```powershell
# In PowerShell inside c:\Users\Dell\Desktop\tradingtool:
python -m http.server 3000
```
Then visit `http://localhost:3000` in any web browser.
