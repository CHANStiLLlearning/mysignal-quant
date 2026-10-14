"""
MySIGNAL QUANT - Institutional Python Deep Market Analyzer
===========================================================
Advanced Mathematical, Statistical, and Microstructure Diagnostics for
Spot Gold (XAUUSD / PAXG) and Bitcoin (BTCUSDT / XXBTZUSD).

Theoretical Framework:
1. Log-Return Higher Moments (Skewness, Kurtosis, Jarque-Bera Test)
2. Long-Range Memory: Hurst Exponent (R/S Fractal Dimension)
3. Ornstein-Uhlenbeck (O-U) Process & Mean-Reversion Half-Life
4. Extreme-Value Volatility Estimators (Parkinson & Garman-Klass)
5. Microstructure Order Flow: Volume-Weighted Average Price (VWAP) & Point of Control (POC)
6. Non-Gaussian Tail Risk: Cornish-Fisher Value-at-Risk (VaR) & Expected Shortfall (CVaR)
7. Fractional Kelly Criterion for Mathematical Position Sizing
"""

import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import json
import math
import urllib.request
from datetime import datetime, timezone
import numpy as np
import pandas as pd
from scipy import stats
from tabulate import tabulate

def fetch_kraken_json(url: str):
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "MySignalQuant-DeepAnalyzer/5.2 (Institutional Python Suite)"}
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))

def fetch_asset_ohlc(pair: str, interval: int = 15):
    """
    Fetch OHLC candles from Kraken Public API.
    Kraken returns: [time, open, high, low, close, vwap, volume, count]
    """
    url = f"https://api.kraken.com/0/public/OHLC?pair={pair}&interval={interval}"
    data = fetch_kraken_json(url)
    if "result" not in data or pair not in data["result"]:
        raise ValueError(f"Failed to fetch OHLC for pair {pair}: {data.get('error')}")
    
    raw = data["result"][pair]
    df = pd.DataFrame(raw, columns=[
        "time", "open", "high", "low", "close", "vwap", "volume", "count"
    ])
    for col in ["open", "high", "low", "close", "vwap", "volume"]:
        df[col] = df[col].astype(float)
    df["time"] = pd.to_datetime(df["time"], unit="s")
    df.sort_values("time", inplace=True)
    df.reset_index(drop=True, inplace=True)
    return df

def calculate_hurst_exponent(price_series: np.ndarray, max_lags: int = 64) -> float:
    """
    Calculates the Hurst Exponent (H) via Rescaled Range (R/S) Analysis.
    H < 0.45: Mean-Reverting (Anti-persistent)
    0.45 <= H <= 0.55: Random Walk / Brownian Motion
    H > 0.55: Trending (Persistent)
    """
    lags = [int(lag) for lag in np.logspace(np.log10(8), np.log10(min(max_lags, len(price_series)//2)), num=10)]
    lags = sorted(list(set(lags)))
    
    rs_values = []
    valid_lags = []
    
    for lag in lags:
        if lag < 4:
            continue
        n_chunks = len(price_series) // lag
        if n_chunks == 0:
            continue
            
        chunk_rs = []
        for i in range(n_chunks):
            chunk = price_series[i*lag : (i+1)*lag]
            returns = np.diff(np.log(chunk))
            if len(returns) == 0:
                continue
            mean_ret = np.mean(returns)
            dev = returns - mean_ret
            cum_dev = np.cumsum(dev)
            r = np.max(cum_dev) - np.min(cum_dev)
            s = np.std(returns, ddof=1)
            if s > 1e-12 and r > 1e-12:
                chunk_rs.append(r / s)
                
        if chunk_rs:
            rs_values.append(np.mean(chunk_rs))
            valid_lags.append(lag)
            
    if len(valid_lags) < 3:
        return 0.50
        
    poly = np.polyfit(np.log(valid_lags), np.log(rs_values), 1)
    hurst = float(poly[0])
    return max(0.01, min(0.99, hurst))

def calculate_ornstein_uhlenbeck(prices: np.ndarray):
    """
    Fit discrete Ornstein-Uhlenbeck: Delta P_t = alpha + beta * P_{t-1} + eps
    Half-Life = -ln(2) / beta
    """
    p_lag = prices[:-1]
    dp = np.diff(prices)
    
    slope, intercept, r_val, p_val, std_err = stats.linregress(p_lag, dp)
    theta = -slope
    if theta <= 0:
        half_life_bars = float("inf")
    else:
        half_life_bars = math.log(2.0) / theta
        
    return {
        "theta": theta,
        "half_life_bars": half_life_bars,
        "r_squared": r_val**2,
        "p_value": p_val
    }

def calculate_garman_klass_vol(df: pd.DataFrame, annualize_factor: float = math.sqrt(365 * 96)) -> float:
    """
    Garman-Klass volatility estimator takes into account High, Low, Open, Close.
    Up to 8x more statistically efficient than standard Close-to-Close estimator.
    """
    log_hl = np.log(df["high"] / df["low"]) ** 2
    log_co = np.log(df["close"] / df["open"]) ** 2
    gk = 0.5 * log_hl - (2 * math.log(2) - 1) * log_co
    return float(np.sqrt(np.mean(gk)) * annualize_factor)

def calculate_parkinson_vol(df: pd.DataFrame, annualize_factor: float = math.sqrt(365 * 96)) -> float:
    """
    Parkinson volatility estimator based on high-low range.
    """
    log_hl = np.log(df["high"] / df["low"]) ** 2
    return float(np.sqrt(np.mean(log_hl) / (4 * math.log(2))) * annualize_factor)

def calculate_vwap_profile(df: pd.DataFrame):
    """
    Calculates Intraday VWAP, Standard Deviation Bands, and Point of Control (POC).
    """
    typical_price = (df["high"] + df["low"] + df["close"]) / 3.0
    cum_vol = df["volume"].cumsum()
    cum_pv = (typical_price * df["volume"]).cumsum()
    vwap = cum_pv / np.maximum(cum_vol, 1e-12)
    
    # VWAP variance
    cum_sq_diff = ((typical_price - vwap) ** 2 * df["volume"]).cumsum()
    vwap_std = np.sqrt(cum_sq_diff / np.maximum(cum_vol, 1e-12))
    
    current_vwap = float(vwap.iloc[-1])
    current_std = float(vwap_std.iloc[-1])
    
    # Volume Profile: Point of Control (POC)
    bins = 40
    price_bins = np.linspace(df["low"].min(), df["high"].max(), bins)
    hist, edges = np.histogram(df["close"], bins=price_bins, weights=df["volume"])
    max_idx = np.argmax(hist)
    poc_price = float((edges[max_idx] + edges[max_idx + 1]) / 2.0)
    
    # Delta Volume Proxy: Buying volume (Close > Open) vs Selling volume (Close < Open)
    buy_vol = df.loc[df["close"] >= df["open"], "volume"].sum()
    sell_vol = df.loc[df["close"] < df["open"], "volume"].sum()
    total_vol = buy_vol + sell_vol
    delta_ratio = float((buy_vol - sell_vol) / total_vol) if total_vol > 0 else 0.0
    
    return {
        "vwap": current_vwap,
        "upper_1std": current_vwap + current_std,
        "lower_1std": current_vwap - current_std,
        "upper_2std": current_vwap + (2 * current_std),
        "lower_2std": current_vwap - (2 * current_std),
        "poc": poc_price,
        "buy_vol_pct": float(buy_vol / total_vol * 100) if total_vol > 0 else 50.0,
        "sell_vol_pct": float(sell_vol / total_vol * 100) if total_vol > 0 else 50.0,
        "delta_ratio": delta_ratio
    }

def analyze_asset_quant(symbol: str, pair: str, asset_name: str):
    print(f"[*] Ingesting live M15 institutional order book candles for {symbol} ({pair})...")
    df = fetch_asset_ohlc(pair, interval=15)
    
    current_price = float(df["close"].iloc[-1])
    n_candles = len(df)
    
    # 1. Log Returns
    log_returns = np.diff(np.log(df["close"].values))
    mean_ret = float(np.mean(log_returns))
    std_ret = float(np.std(log_returns, ddof=1))
    
    # Annualized Volatility (96 bars per day * 365 days)
    ann_factor = math.sqrt(365 * 96)
    ann_vol_close = std_ret * ann_factor
    gk_vol = calculate_garman_klass_vol(df, ann_factor)
    parkinson_vol = calculate_parkinson_vol(df, ann_factor)
    
    # 2. Higher Statistical Moments
    skewness = float(stats.skew(log_returns))
    excess_kurt = float(stats.kurtosis(log_returns, fisher=True)) # excess
    jb_stat, jb_p_value = stats.jarque_bera(log_returns)
    is_normal = jb_p_value > 0.05
    
    # 3. Fractal Memory & Regime (Hurst Exponent)
    hurst = calculate_hurst_exponent(df["close"].values)
    if hurst > 0.55:
        regime = "PERSISTENT TREND (Directional Breakout)"
    elif hurst < 0.45:
        regime = "MEAN REVERTING (Statistical Arbitrage / Range Fade)"
    else:
        regime = "RANDOM WALK (Geometric Brownian Noise)"
        
    # 4. Ornstein-Uhlenbeck Mean-Reversion Half-Life
    ou = calculate_ornstein_uhlenbeck(df["close"].values)
    half_life_hours = (ou["half_life_bars"] * 15) / 60.0 if not math.isinf(ou["half_life_bars"]) else float("nan")
    
    # 5. Microstructure VWAP & Point of Control
    vwap_data = calculate_vwap_profile(df)
    
    # 6. Tail Risk: Value at Risk (VaR) & Expected Shortfall (CVaR)
    confidence = 0.95
    # Historical VaR
    hist_var_95 = float(-np.percentile(log_returns, 5))
    hist_var_99 = float(-np.percentile(log_returns, 1))
    
    # Cornish-Fisher VaR (Adjusted for skewness and excess kurtosis)
    z_alpha = stats.norm.ppf(confidence)
    cf_z = (z_alpha + 
            (skewness / 6.0) * (z_alpha**2 - 1) + 
            (excess_kurt / 24.0) * (z_alpha**3 - 3 * z_alpha) - 
            (skewness**2 / 36.0) * (2 * z_alpha**3 - 5 * z_alpha))
    cf_var_95 = float(-(mean_ret - cf_z * std_ret))
    
    # Expected Shortfall (CVaR 95%) - mean loss beyond VaR
    cvar_95 = float(-np.mean(log_returns[log_returns <= -hist_var_95]))
    
    # 7. Dual EMA Trend Confluence
    ema21 = float(df["close"].ewm(span=21, adjust=False).mean().iloc[-1])
    ema55 = float(df["close"].ewm(span=55, adjust=False).mean().iloc[-1])
    ema_trend = "BULLISH" if ema21 >= ema55 else "BEARISH"
    
    # 8. Fractional Kelly Criterion Position Sizing
    # Probability of win based on trend alignment and momentum
    p_win = 0.62 if ema_trend == "BEARISH" and vwap_data["delta_ratio"] < 0 else 0.54
    b_ratio = 3.0 # 1:3 reward-to-risk
    full_kelly = (p_win * b_ratio - (1 - p_win)) / b_ratio
    half_kelly = max(0.01, full_kelly * 0.5)
    
    return {
        "symbol": symbol,
        "name": asset_name,
        "pair": pair,
        "current_price": current_price,
        "candles_analyzed": n_candles,
        "moments": {
            "mean_log_ret": mean_ret,
            "std_log_ret": std_ret,
            "annualized_vol_close": ann_vol_close * 100,
            "garman_klass_vol": gk_vol * 100,
            "parkinson_vol": parkinson_vol * 100,
            "skewness": skewness,
            "excess_kurtosis": excess_kurt,
            "jarque_bera_stat": jb_stat,
            "jarque_bera_p": jb_p_value,
            "is_gaussian": is_normal
        },
        "regime": {
            "hurst_exponent": hurst,
            "regime_type": regime,
            "ou_theta": ou["theta"],
            "ou_half_life_hours": half_life_hours
        },
        "microstructure": vwap_data,
        "tail_risk": {
            "hist_var_95_pct": hist_var_95 * 100,
            "hist_var_99_pct": hist_var_99 * 100,
            "cornish_fisher_var_95_pct": cf_var_95 * 100,
            "cvar_expected_shortfall_95_pct": cvar_95 * 100
        },
        "quant_verdict": {
            "ema21": ema21,
            "ema55": ema55,
            "trend_stack": ema_trend,
            "vwap_position": "BELOW VWAP (Bearish Pressure)" if current_price < vwap_data["vwap"] else "ABOVE VWAP (Bullish Dominance)",
            "half_kelly_optimal_risk_pct": half_kelly * 100,
            "action": "SELL / SHORT" if ema_trend == "BEARISH" else "BUY / LONG"
        }
    }

def print_institutional_report(results: list):
    now_utc = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')
    print("\n" + "=" * 88)
    print("  INSTITUTIONAL QUANTITATIVE MARKET DIAGNOSTIC REPORT (PYTHON ENGINE v5.2)")
    print(f"  Timestamp: {now_utc} | Public Kraken Feeds")
    print("=" * 88 + "\n")
    
    for r in results:
        sym = r["symbol"]
        px = r["current_price"]
        m = r["moments"]
        reg = r["regime"]
        vw = r["microstructure"]
        tr = r["tail_risk"]
        qv = r["quant_verdict"]
        
        print(f">> ASSET: {r['name']} ({sym}) -- CURRENT TICK: {px:,.2f}")
        print("-" * 88)
        
        # Table 1: Statistical Moments & Volatility Models
        moments_table = [
            ["Close-to-Close Annualized Vol", f"{m['annualized_vol_close']:.2f}%", "Garman-Klass Multi-Factor Vol", f"{m['garman_klass_vol']:.2f}%"],
            ["Parkinson Range Volatility", f"{m['parkinson_vol']:.2f}%", "Log Return Skewness (Tail Asymmetry)", f"{m['skewness']:.3f} ({'Left/Crash Tail' if m['skewness'] < 0 else 'Right/Rally Tail'})"],
            ["Excess Kurtosis (Fat Tail Measure)", f"{m['excess_kurtosis']:.2f} ({'Leptokurtic / Fat Tails' if m['excess_kurtosis'] > 0 else 'Platykurtic'})", "Jarque-Bera Normality Test", f"Stat={m['jarque_bera_stat']:.1f} (p={m['jarque_bera_p']:.4e})"],
            ["Gaussian Distribution Hypothesis", "REJECTED (Heavy Fat Tails)" if not m['is_gaussian'] else "Accepted", "Candles Sampled (M15)", f"{r['candles_analyzed']} bars"]
        ]
        print(tabulate(moments_table, headers=["Moment Metric", "Value", "Advanced Estimator", "Observation"], tablefmt="grid"))
        print()
        
        # Table 2: Long Memory & Microstructure (Hurst, O-U, VWAP, POC)
        regime_table = [
            ["Hurst Exponent (H)", f"{reg['hurst_exponent']:.3f}", "Market Dynamic Regime", reg['regime_type']],
            ["O-U Mean-Reversion Half-Life", f"{reg['ou_half_life_hours']:.1f} hours" if not math.isnan(reg['ou_half_life_hours']) else "No Mean Reversion (Trending)", "Volume Point of Control (POC)", f"{vw['poc']:,.2f}"],
            ["Intraday VWAP Pivot", f"{vw['vwap']:,.2f}", "Current Price vs VWAP", qv['vwap_position']],
            ["VWAP +1 / -1 Sigma Bands", f"{vw['upper_1std']:,.2f} / {vw['lower_1std']:,.2f}", "VWAP +2 / -2 Sigma Bands", f"{vw['upper_2std']:,.2f} / {vw['lower_2std']:,.2f}"],
            ["Aggressor Volume Ratio", f"Buy: {vw['buy_vol_pct']:.1f}% | Sell: {vw['sell_vol_pct']:.1f}%", "Orderflow Delta Imbalance", f"{vw['delta_ratio'] * 100:+.2f}% ({'Selling Dominance' if vw['delta_ratio'] < 0 else 'Buying Dominance'})"]
        ]
        print(tabulate(regime_table, headers=["Structural Measure", "Value", "Regime / Microstructure", "Interpretation"], tablefmt="grid"))
        print()
        
        # Table 3: Risk Capital, Tail Risk & Trade Execution
        risk_table = [
            ["Historical VaR 95% (15-min)", f"{tr['hist_var_95_pct']:.3f}%", "Cornish-Fisher VaR 95% (Skew/Fat-Tail Adj)", f"{tr['cornish_fisher_var_95_pct']:.3f}%"],
            ["Historical VaR 99% (Extreme Risk)", f"{tr['hist_var_99_pct']:.3f}%", "Expected Shortfall (CVaR 95%)", f"{tr['cvar_expected_shortfall_95_pct']:.3f}%"],
            ["Fast/Slow EMA 21 vs 55 Ribbon", f"EMA21={qv['ema21']:,.1f} | EMA55={qv['ema55']:,.1f}", "Algorithmic Ribbon Alignment", f"{qv['trend_stack']} STACK"],
            ["Half-Kelly Optimal Risk Allocation", f"{qv['half_kelly_optimal_risk_pct']:.2f}% of Account Equity", "FINAL QUANT ACTION", f">> {qv['action']} <<"]
        ]
        print(tabulate(risk_table, headers=["Risk Metric", "Value", "Execution Coordinate", "Parameters"], tablefmt="grid"))
        print("\n" + "=" * 88 + "\n")

def main():
    print("=" * 88)
    print("  INITIALIZING DEEP QUANTITATIVE PYTHON ENGINE...")
    print("=" * 88)
    
    assets = [
        ("XAUUSD", "PAXGUSD", "Gold Spot / US Dollar"),
        ("BTCUSDT", "XXBTZUSD", "Bitcoin / Tether Spot")
    ]
    
    all_results = []
    for sym, pair, name in assets:
        try:
            res = analyze_asset_quant(sym, pair, name)
            all_results.append(res)
        except Exception as e:
            print(f"[!] Error analyzing {sym}: {e}", file=sys.stderr)
            
    if all_results:
        print_institutional_report(all_results)
        
        def np_encoder(obj):
            if isinstance(obj, (np.integer, np.int64)):
                return int(obj)
            if isinstance(obj, (np.floating, np.float64)):
                return float(obj)
            if isinstance(obj, (np.bool_, bool)):
                return bool(obj)
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            return str(obj)

        out_file = "python_quant_report.json"
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump({
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "results": all_results
            }, f, indent=2, default=np_encoder)
        print(f"[+] Detailed quantitative diagnostics written to: {out_file}\n")

if __name__ == "__main__":
    main()
