#!/usr/bin/env python3
"""
Autonomous 24/7 Chart Watching Bot & Setup Tier Signal Engine (A+, A, B, C)
=============================================================================
Continuously scans multi-asset exchange candles (XAUUSD Gold & BTCUSDT Bitcoin),
performs real-time candlestick anatomy, structural swing detection, and
computes institutional confluence scores to deliver graded setup signals:
  - Setup A+ (Prime Institutional - 5/5 Confluences)
  - Setup A  (High Probability Trend - 4/5 Confluences)
  - Setup B  (Momentum Pullback / Retest - 3/5 Confluences)
  - Setup C  (Speculative Scalp / Liquidity Fade - 1-2 Confluences)

Outputs actionable Entry, Dynamic SL, TP1 (1.5R), and TP2 (3.0R) targets.
Strict Rule: No currency symbols used ($), only pure numeric prices.
"""

import sys
import json
import time
import argparse
import urllib.request
import math
from datetime import datetime

# Windows terminal UTF-8 support
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# ANSI Color formatting
C_RESET   = "\033[0m"
C_BOLD    = "\033[1m"
C_GREEN   = "\033[92m"
C_RED     = "\033[91m"
C_YELLOW  = "\033[93m"
C_CYAN    = "\033[96m"
C_MAGENTA = "\033[95m"
C_WHITE   = "\033[97m"
C_BG_GREEN = "\033[42m\033[30m"
C_BG_RED   = "\033[41m\033[30m"
C_BG_PURPLE= "\033[45m\033[97m"

def fetch_kraken_ohlc(pair):
    """Fetches M15 candles from Kraken public REST API."""
    url = f"https://api.kraken.com/0/public/OHLC?pair={pair}&interval=15"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 QuantBot/2.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            if data.get('error'):
                return []
            pair_key = list(data.get('result', {}).keys())[0]
            raw = data['result'][pair_key]
            return [
                {
                    'time': int(c[0]),
                    'open': float(c[1]),
                    'high': float(c[2]),
                    'low': float(c[3]),
                    'close': float(c[4]),
                    'volume': float(c[6])
                }
                for c in raw
            ]
    except Exception as e:
        return []

def calculate_ema(prices, period):
    if len(prices) < period:
        return prices[-1] if prices else 0.0
    multiplier = 2.0 / (period + 1)
    ema = sum(prices[:period]) / period
    for p in prices[period:]:
        ema = (p - ema) * multiplier + ema
    return ema

def calculate_atr(candles, period=14):
    if len(candles) < period + 1:
        return 1.0
    trs = []
    for i in range(1, len(candles)):
        h = candles[i]['high']
        l = candles[i]['low']
        prev_c = candles[i-1]['close']
        tr = max(h - l, abs(h - prev_c), abs(l - prev_c))
        trs.append(tr)
    return sum(trs[-period:]) / period if trs else 1.0

def calculate_adx_and_er(candles, period=14):
    """Calculates Wilder ADX and Kaufman Efficiency Ratio."""
    closes = [c['close'] for c in candles]
    if len(closes) < period + 2:
        return 25.0, 0.40

    # Kaufman ER
    direction = abs(closes[-1] - closes[-period])
    volatility = sum(abs(closes[i] - closes[i-1]) for i in range(len(closes)-period, len(closes)))
    er = direction / volatility if volatility != 0 else 0.0

    # Simplified ADX approximation
    trs, plus_dms, minus_dms = [], [], []
    for i in range(1, len(candles)):
        h = candles[i]['high']
        l = candles[i]['low']
        prev_h = candles[i-1]['high']
        prev_l = candles[i-1]['low']
        prev_c = candles[i-1]['close']

        tr = max(h - l, abs(h - prev_c), abs(l - prev_c))
        trs.append(tr)

        up_move = h - prev_h
        down_move = prev_l - l

        plus_dm = up_move if (up_move > down_move and up_move > 0) else 0.0
        minus_dm = down_move if (down_move > up_move and down_move > 0) else 0.0
        plus_dms.append(plus_dm)
        minus_dms.append(minus_dm)

    recent_trs = sum(trs[-period:]) or 1.0
    recent_pdm = sum(plus_dms[-period:])
    recent_mdm = sum(minus_dms[-period:])

    pdi = (recent_pdm / recent_trs) * 100
    mdi = (recent_mdm / recent_trs) * 100
    di_diff = abs(pdi - mdi)
    di_sum = pdi + mdi
    dx = (di_diff / di_sum * 100) if di_sum != 0 else 25.0

    return dx, er

def analyze_market_setup(candles, symbol_name):
    """Grades and evaluates setup into A+, A, B, or C."""
    if len(candles) < 30:
        return None

    current = candles[-1]
    prev = candles[-2]
    prev2 = candles[-3]
    closes = [c['close'] for c in candles]

    close = current['close']
    open_p = current['open']
    high = current['high']
    low = current['low']
    vol = current['volume']

    ema21 = calculate_ema(closes, 21)
    ema55 = calculate_ema(closes, 55)
    atr = calculate_atr(candles, 14)
    adx, er = calculate_adx_and_er(candles, 14)

    # Candlestick anatomy
    body = abs(close - open_p)
    total_range = high - low or 0.0001
    upper_wick = high - max(open_p, close)
    lower_wick = min(open_p, close) - low

    is_hammer = (lower_wick >= body * 1.8) and (upper_wick <= body * 0.5) and (total_range > atr * 0.6)
    is_shooting_star = (upper_wick >= body * 1.8) and (lower_wick <= body * 0.5) and (total_range > atr * 0.6)
    is_bull_engulf = (close > open_p) and (prev['close'] < prev['open']) and (close > prev['open']) and (open_p <= prev['close'])
    is_bear_engulf = (close < open_p) and (prev['close'] > prev['open']) and (close < prev['open']) and (open_p >= prev['close'])

    # Market Structure
    swing_highs = [c['high'] for c in candles[-15:-1]]
    swing_lows = [c['low'] for c in candles[-15:-1]]
    recent_high = max(swing_highs)
    recent_low = min(swing_lows)

    is_bull_bos = close > recent_high
    is_bear_bos = close < recent_low
    is_bull_sweep = (low < recent_low) and (close > recent_low)
    is_bear_sweep = (high > recent_high) and (close < recent_high)

    # Volume & Orderflow
    avg_vol = sum(c['volume'] for c in candles[-20:]) / 20.0
    vol_surge = vol > (avg_vol * 1.25)
    buyer_delta = ((close - low) / total_range) * 100
    seller_delta = ((high - close) / total_range) * 100

    # Trend Direction determination
    bull_points = 0
    bear_points = 0

    if close > ema21 and ema21 > ema55:
        bull_points += 2
    elif close < ema21 and ema21 < ema55:
        bear_points += 2

    if is_bull_bos or is_bull_engulf or is_hammer or is_bull_sweep:
        bull_points += 2
    if is_bear_bos or is_bear_engulf or is_shooting_star or is_bear_sweep:
        bear_points += 2

    if buyer_delta > 60:
        bull_points += 1
    if seller_delta > 60:
        bear_points += 1

    direction = "LONG" if bull_points >= bear_points else "SHORT"

    # Evaluate 5 Confluence Criteria
    criteria = []

    # 1. Trend Ribbon Alignment
    ribbon_pass = (close > ema21 and ema21 > ema55) if direction == "LONG" else (close < ema21 and ema21 < ema55)
    criteria.append({
        'title': 'Dual EMA Trend Ribbon',
        'desc': f"Price relative to EMA21 ({ema21:.2f}) & EMA55 ({ema55:.2f})",
        'passed': ribbon_pass
    })

    # 2. Structural Integrity (BOS / CHoCH)
    struct_pass = is_bull_bos if direction == "LONG" else is_bear_bos
    criteria.append({
        'title': 'Market Structure (BOS / CHoCH)',
        'desc': f"Clear breakout beyond swing {'high' if direction == 'LONG' else 'low'}",
        'passed': struct_pass
    })

    # 3. Liquidity Sweep & Candlestick Signature
    candle_pass = (is_hammer or is_bull_engulf or is_bull_sweep) if direction == "LONG" else (is_shooting_star or is_bear_engulf or is_bear_sweep)
    criteria.append({
        'title': 'Price Action / Liquidity Sweep',
        'desc': f"Institutional rejection wick or engulfing momentum",
        'passed': candle_pass
    })

    # 4. Orderflow Delta & Volume Surge
    orderflow_pass = vol_surge and ((buyer_delta > 55) if direction == "LONG" else (seller_delta > 55))
    criteria.append({
        'title': 'Orderflow Delta Dominance',
        'desc': f"Volume surge ({vol:.1f} vs avg {avg_vol:.1f}) & buyer/seller delta",
        'passed': orderflow_pass
    })

    # 5. Low-Noise Regime (Kaufman ER + ADX)
    regime_pass = (er >= 0.35) and (adx >= 22.0)
    criteria.append({
        'title': 'Kaufman ER / ADX Filter',
        'desc': f"ER: {er:.2f} (noise filter) & ADX: {adx:.1f} (trend velocity)",
        'passed': regime_pass
    })

    score = sum(1 for c in criteria if c['passed'])

    # Setup Grade assignment
    if score >= 5:
        grade = "A+"
        title = "Setup A+ (Prime Institutional)"
        color_code = C_BG_PURPLE
        advice = "Maximum institutional conviction. Dual EMA alignment + structural breach + volume confirmation."
    elif score == 4:
        grade = "A"
        title = "Setup A (High Probability Trend)"
        color_code = C_BG_GREEN
        advice = "High quality trend expansion. Standard institutional sizing."
    elif score == 3:
        grade = "B"
        title = "Setup B (Momentum Pullback / Retest)"
        color_code = C_YELLOW
        advice = "Valid pullback retest. Consider scaling entry or confirming on M5."
    else:
        grade = "C"
        title = "Setup C (Speculative Scalp / Chop Fade)"
        color_code = C_WHITE
        advice = "Low confluence environment. Reduce position size or stand aside."

    # Dynamic Risk & Execution Levels
    entry = close
    if direction == "LONG":
        struct_sl = recent_low - (0.4 * atr)
        vol_sl = entry - (1.5 * atr)
        sl = max(struct_sl, vol_sl)
        risk = entry - sl if entry > sl else atr * 1.5
        tp1 = entry + (1.5 * risk)
        tp2 = entry + (3.0 * risk)
    else:
        struct_sl = recent_high + (0.4 * atr)
        vol_sl = entry + (1.5 * atr)
        sl = min(struct_sl, vol_sl)
        risk = sl - entry if sl > entry else atr * 1.5
        tp1 = entry - (1.5 * risk)
        tp2 = entry - (3.0 * risk)

    return {
        'symbol': symbol_name,
        'direction': direction,
        'grade': grade,
        'score': score,
        'title': title,
        'color_code': color_code,
        'advice': advice,
        'criteria': criteria,
        'entry': entry,
        'sl': sl,
        'tp1': tp1,
        'tp2': tp2,
        'risk': risk,
        'atr': atr,
        'adx': adx,
        'er': er,
        'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }

def print_setup_banner(setup):
    """Prints a styled terminal card for the detected setup."""
    dir_color = C_GREEN if setup['direction'] == 'LONG' else C_RED
    grade_color = setup['color_code']

    print(f"\n{C_BOLD}┌────────────────────────────────────────────────────────────────────────────┐{C_RESET}")
    print(f"{C_BOLD}│  {grade_color} SETUP {setup['grade']} DETECTED {C_RESET} {C_WHITE}│{C_RESET} {C_BOLD}{setup['symbol']}{C_RESET} {dir_color}{setup['direction']}{C_RESET} {C_WHITE}│ Confidence: {setup['score']}/5 Confluences │ {setup['time']} │{C_RESET}")
    print(f"{C_BOLD}├────────────────────────────────────────────────────────────────────────────┤{C_RESET}")
    print(f"│  {C_BOLD}Entry Price:{C_RESET} {setup['entry']:.2f}   │  {C_RED}Stop Loss:{C_RESET} {setup['sl']:.2f}  │  {C_GREEN}TP1 (1.5R):{C_RESET} {setup['tp1']:.2f}  │  {C_GREEN}TP2 (3.0R):{C_RESET} {setup['tp2']:.2f} │")
    print(f"│  {C_BOLD}Risk Range:{C_RESET}  {setup['risk']:.2f} pts │  {C_BOLD}ATR (14):{C_RESET}  {setup['atr']:.2f}  │  {C_BOLD}Wilder ADX:{C_RESET} {setup['adx']:.1f}   │  {C_BOLD}Kaufman ER:{C_RESET} {setup['er']:.2f}   │")
    print(f"{C_BOLD}├────────────────────────────────────────────────────────────────────────────┤{C_RESET}")
    print(f"│  {C_CYAN}Confluence Matrix Audit:{C_RESET}")
    for idx, crit in enumerate(setup['criteria'], 1):
        status_sym = f"{C_GREEN}[PASS]{C_RESET}" if crit['passed'] else f"{C_RED}[FAIL]{C_RESET}"
        print(f"│    {idx}. {status_sym} {C_BOLD}{crit['title']}:{C_RESET} {crit['desc']}")
    print(f"{C_BOLD}├────────────────────────────────────────────────────────────────────────────┤{C_RESET}")
    print(f"│  {C_YELLOW}Execution Directive:{C_RESET} {setup['advice']}")
    print(f"{C_BOLD}└────────────────────────────────────────────────────────────────────────────┘{C_RESET}")

def run_bot(interval=15, once=False, min_grade=None):
    """Main chart watching loop."""
    print(f"{C_BOLD}{C_CYAN}========================================================================{C_RESET}")
    print(f"{C_BOLD}{C_WHITE}  Autonomous 24/7 Chart Watcher & Setup Quality Radar (A+, A, B, C){C_RESET}")
    print(f"{C_BOLD}{C_CYAN}========================================================================{C_RESET}")
    print(f"[*] Monitoring live pairs: XAUUSD (Gold) and BTCUSDT (Bitcoin)")
    print(f"[*] Scan cycle interval: {interval} seconds | Min Grade: {min_grade or 'All (A+, A, B, C)'}")
    print(f"[*] Audio chime on prime institutional setups: Enabled")
    print(f"[*] Press Ctrl+C to terminate bot cleanly.\n")

    scan_count = 0
    last_fingerprints = {}

    grade_weights = {'A+': 4, 'A': 3, 'B': 2, 'C': 1}
    min_weight = grade_weights.get(min_grade, 1)

    while True:
        scan_count += 1
        now_str = datetime.now().strftime('%H:%M:%S')
        print(f"[{now_str}] Scan #{scan_count}: Fetching live exchange candles...", end='\r')

        targets = [
            ('XAUUSD', 'XAUUSD', 'XAU/USD Gold'),
            ('XXBTZUSD', 'BTCUSDT', 'BTC/USDT Bitcoin')
        ]

        active_signals = []

        for kraken_pair, symbol_key, display_name in targets:
            candles = fetch_kraken_ohlc(kraken_pair)
            if not candles:
                continue

            setup = analyze_market_setup(candles, display_name)
            if not setup:
                continue

            active_signals.append(setup)

            # Check min grade filter
            if grade_weights.get(setup['grade'], 1) < min_weight:
                continue

            fingerprint = f"{symbol_key}-{setup['direction']}-{setup['grade']}-{round(setup['entry'], 1)}"
            if last_fingerprints.get(symbol_key) != fingerprint:
                last_fingerprints[symbol_key] = fingerprint
                
                # Audible terminal alert for Prime Setups
                if setup['grade'] in ['A+', 'A']:
                    sys.stdout.write('\a')
                    sys.stdout.flush()

                print_setup_banner(setup)

        # Write latest signals to JSON for web integration / persistence
        try:
            with open('signals_bot_output.json', 'w', encoding='utf-8') as f:
                json.dump({
                    'timestamp': datetime.now().isoformat(),
                    'scan_count': scan_count,
                    'signals': active_signals
                }, f, indent=2, ensure_ascii=False)
        except Exception:
            pass

        if once:
            break

        time.sleep(interval)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="24/7 Chart Watching Bot with Setup A+, A, B, C Grading")
    parser.add_argument("--interval", type=int, default=15, help="Scan interval in seconds (default: 15)")
    parser.add_argument("--once", action="store_true", help="Run a single scan cycle and exit")
    parser.add_argument("--min-grade", type=str, choices=['A+', 'A', 'B', 'C'], default=None, help="Filter minimum setup grade")
    args = parser.parse_args()

    try:
        run_bot(interval=args.interval, once=args.once, min_grade=args.min_grade)
    except KeyboardInterrupt:
        print(f"\n{C_YELLOW}[!] Autonomous Chart Watcher stopped by user.{C_RESET}")
