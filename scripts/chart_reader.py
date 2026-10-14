#!/usr/bin/env python3
"""
Institutional Chart Reading & Price Action Engine
-------------------------------------------------
Automated Candlestick Anatomy, Market Structure (BOS/CHoCH),
Fair Value Gaps (FVG), Liquidity Sweeps, and Executive Chart Narrative.
"""

import sys
import json
import argparse
import urllib.request
import math

# Force UTF-8 encoding for Windows terminal
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def fetch_candles(pair):
    url = f"https://api.kraken.com/0/public/OHLC?pair={pair}&interval=15"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            pair_key = list(data.get('result', {}).keys())[0]
            raw_candles = data['result'][pair_key]
            # [time, open, high, low, close, vwap, volume, count]
            return [
                {
                    'time': int(c[0]),
                    'open': float(c[1]),
                    'high': float(c[2]),
                    'low': float(c[3]),
                    'close': float(c[4]),
                    'volume': float(c[6])
                }
                for c in raw_candles
            ]
    except Exception as e:
        print(f"[!] Error fetching candles from Kraken: {e}")
        return []

def render_ascii_chart(candles, lookback=16, height=10):
    subset = candles[-lookback:]
    highs = [c['high'] for c in subset]
    lows = [c['low'] for c in subset]
    max_p = max(highs)
    min_p = min(lows)
    p_range = max_p - min_p or 1.0

    lines = []
    lines.append(f"  ┌── ASCII M15 Candlestick Chart ({lookback} bars) " + "─" * 40)

    for h in range(height, -1, -1):
        price_level = min_p + (h / height) * p_range
        row = f"  │ {price_level:10.2f} ┤ "
        for c in subset:
            o, hi, lo, cl = c['open'], c['high'], c['low'], c['close']
            is_bull = cl >= o
            top_body = max(o, cl)
            bot_body = min(o, cl)

            # Check where this row intersects the candle
            if bot_body <= price_level <= top_body:
                row += "█ " if is_bull else "▒ "
            elif lo <= price_level <= hi:
                row += "│ "
            else:
                row += "  "
        lines.append(row)

    lines.append("  │" + " " * 12 + "└─" + "──" * lookback)
    lines.append("  │             Legend: █ Bullish Body | ▒ Bearish Body | │ Upper/Lower Wick")
    return "\n".join(lines)

def analyze_chart(candles, symbol_name):
    if len(candles) < 20:
        return {"error": "Insufficient candle data"}

    opens = [c['open'] for c in candles]
    highs = [c['high'] for c in candles]
    lows = [c['low'] for c in candles]
    closes = [c['close'] for c in candles]
    volumes = [c['volume'] for c in candles]

    n = len(closes)
    last_o = opens[-1]
    last_h = highs[-1]
    last_l = lows[-1]
    last_c = closes[-1]
    prev_o = opens[-2]
    prev_h = highs[-2]
    prev_l = lows[-2]
    prev_c = closes[-2]

    # 1. Candlestick Anatomy
    rng = last_h - last_l or 0.0001
    body = abs(last_c - last_o)
    upper_wick = last_h - max(last_o, last_c)
    lower_wick = min(last_o, last_c) - last_l
    body_pct = round((body / rng) * 100, 1)
    upper_pct = round((upper_wick / rng) * 100, 1)
    lower_pct = round((lower_wick / rng) * 100, 1)
    is_bull = last_c >= last_o

    # 2. Candlestick Pattern Classification
    if lower_wick >= body * 2 and upper_wick <= body * 0.5:
        pattern = "Hammer / Bullish Pinbar Rejection"
        pattern_type = "BULLISH"
        pattern_desc = f"Heavy buyer absorption ({lower_pct}% lower wick) defending {last_l:.2f}."
    elif upper_wick >= body * 2 and lower_wick <= body * 0.5:
        pattern = "Shooting Star / Bearish Pinbar Rejection"
        pattern_type = "BEARISH"
        pattern_desc = f"Heavy overhead supply rejection ({upper_pct}% upper wick) at {last_h:.2f}."
    elif is_bull and prev_c < prev_o and last_c > prev_o and last_o < prev_c:
        pattern = "Bullish Engulfing Impulse"
        pattern_type = "BULLISH"
        pattern_desc = f"Green body ({body_pct}%) completely engulfed previous bear candle."
    elif not is_bull and prev_c > prev_o and last_c < prev_o and last_o > prev_c:
        pattern = "Bearish Engulfing Impulse"
        pattern_type = "BEARISH"
        pattern_desc = f"Red body ({body_pct}%) engulfed previous bull candle with institutional selling."
    elif body_pct < 15:
        pattern = "Doji / Volatility Compression"
        pattern_type = "NEUTRAL"
        pattern_desc = f"Equilibrium squeeze ({body_pct}% body). Pre-breakout compression."
    elif body_pct >= 75:
        pattern = "Bullish Marubozu Expansion" if is_bull else "Bearish Marubozu Expansion"
        pattern_type = "BULLISH" if is_bull else "BEARISH"
        pattern_desc = f"Pure directional velocity with {body_pct}% body dominance and minimal drag."
    elif last_h < prev_h and last_l > prev_l:
        pattern = "Inside Bar Consolidation"
        pattern_type = "NEUTRAL"
        pattern_desc = f"Contained within previous range ({prev_l:.2f} - {prev_h:.2f})."
    else:
        pattern = "Bullish Continuation" if is_bull else "Bearish Continuation"
        pattern_type = "BULLISH" if is_bull else "BEARISH"
        pattern_desc = f"Orderflow favoring {'buyers' if is_bull else 'sellers'} with {body_pct}% body dominance."

    # 3. Market Structure (BOS / CHoCH & Fractals)
    swings = []
    for i in range(3, n - 2):
        if highs[i] > highs[i-1] and highs[i] > highs[i-2] and highs[i] > highs[i+1] and highs[i] > highs[i+2]:
            swings.append({'type': 'HIGH', 'price': highs[i], 'idx': i})
        if lows[i] < lows[i-1] and lows[i] < lows[i-2] and lows[i] < lows[i+1] and lows[i] < lows[i+2]:
            swings.append({'type': 'LOW', 'price': lows[i], 'idx': i})

    recent_highs = [s for s in swings if s['type'] == 'HIGH'][-4:]
    recent_lows = [s for s in swings if s['type'] == 'LOW'][-4:]
    key_res = max([s['price'] for s in recent_highs]) if recent_highs else last_h * 1.008
    key_sup = min([s['price'] for s in recent_lows]) if recent_lows else last_l * 0.992

    if len(recent_highs) >= 2 and len(recent_lows) >= 2:
        last_sh = recent_highs[-1]['price']
        prev_sh = recent_highs[-2]['price']
        last_sl = recent_lows[-1]['price']
        prev_sl = recent_lows[-2]['price']

        if last_c > last_sh:
            structure = "BOS (BULLISH BREAK OF STRUCTURE)"
            structure_bias = "BULLISH"
            structure_details = f"Price closed above swing high at {last_sh:.2f}, unlocking upside expansion."
        elif last_c < last_sl:
            structure = "BOS (BEARISH BREAK OF STRUCTURE)"
            structure_bias = "BEARISH"
            structure_details = f"Price closed below swing low at {last_sl:.2f}, confirming breakdown."
        elif last_sh > prev_sh and last_sl > prev_sl:
            structure = "BULLISH MARKET STRUCTURE (Higher Highs & Higher Lows)"
            structure_bias = "BULLISH"
            structure_details = f"Ascending Higher Highs ({last_sh:.2f} > {prev_sh:.2f}) and Higher Lows ({last_sl:.2f} > {prev_sl:.2f})."
        elif last_sh < prev_sh and last_sl < prev_sl:
            structure = "BEARISH MARKET STRUCTURE (Lower Highs & Lower Lows)"
            structure_bias = "BEARISH"
            structure_details = f"Descending Lower Highs ({last_sh:.2f} < {prev_sh:.2f}) and Lower Lows ({last_sl:.2f} < {prev_sl:.2f})."
        else:
            structure = "EQUILIBRIUM CONSOLIDATION RANGE"
            structure_bias = "NEUTRAL"
            structure_details = f"Oscillating between swing resistance {last_sh:.2f} and support {last_sl:.2f}."
    else:
        structure = "BULLISH MOMENTUM" if is_bull else "BEARISH MOMENTUM"
        structure_bias = "BULLISH" if is_bull else "BEARISH"
        structure_details = f"Short-term velocity favoring {'buyers' if is_bull else 'sellers'}."

    # 4. Fair Value Gaps (FVG)
    fvgs = []
    for i in range(max(2, n - 15), n):
        if lows[i] > highs[i - 2]:
            fvgs.append({
                'type': 'BULLISH FVG (Demand Imbalance)',
                'top': round(lows[i], 2),
                'bottom': round(highs[i - 2], 2),
                'gap': round(lows[i] - highs[i - 2], 2)
            })
        if highs[i] < lows[i - 2]:
            fvgs.append({
                'type': 'BEARISH FVG (Supply Imbalance)',
                'top': round(lows[i - 2], 2),
                'bottom': round(highs[i], 2),
                'gap': round(lows[i - 2] - highs[i], 2)
            })
    active_fvg = fvgs[-1] if fvgs else None

    # 5. Liquidity Sweep
    liquidity_sweep = None
    if recent_highs:
        last_peak = recent_highs[-1]['price']
        if last_h > last_peak and last_c < last_peak:
            liquidity_sweep = f"BUY-SIDE LIQUIDITY SWEEP (Bearish Trap) above {last_peak:.2f}"
    if recent_lows and not liquidity_sweep:
        last_trough = recent_lows[-1]['price']
        if last_l < last_trough and last_c > last_trough:
            liquidity_sweep = f"SELL-SIDE LIQUIDITY SWEEP (Bullish Spring) beneath {last_trough:.2f}"

    # 6. Executive Reading
    s1 = f"{symbol_name} is exhibiting {structure.lower()} on the 15-minute timeframe."
    s2 = f"The active candle formed a {pattern} with {body_pct}% body dominance ({upper_pct}% upper wick rejection, {lower_pct}% lower wick support)."
    s3 = f"Active imbalance: {active_fvg['type']} between {active_fvg['bottom']} and {active_fvg['top']} ({active_fvg['gap']} pts)." if active_fvg else f"Price is trading between swing support at {key_sup:.2f} and resistance at {key_res:.2f}."
    s4 = f"Warning: {liquidity_sweep}." if liquidity_sweep else f"Orderflow bias remains {structure_bias.lower()} while price stays within technical boundaries."
    executive_reading = f"{s1} {s2} {s3} {s4}"

    return {
        'symbol': symbol_name,
        'current_price': last_c,
        'candle': {
            'open': last_o,
            'high': last_h,
            'low': last_l,
            'close': last_c,
            'range': round(rng, 2),
            'body': round(body, 2),
            'body_pct': body_pct,
            'upper_pct': upper_pct,
            'lower_pct': lower_pct,
            'is_bull': is_bull
        },
        'pattern': {
            'name': pattern,
            'type': pattern_type,
            'desc': pattern_desc
        },
        'structure': {
            'label': structure,
            'bias': structure_bias,
            'details': structure_details,
            'key_support': round(key_sup, 2),
            'key_resistance': round(key_res, 2)
        },
        'active_fvg': active_fvg,
        'liquidity_sweep': liquidity_sweep,
        'executive_reading': executive_reading
    }

def print_chart_reading(result, candles):
    print("\n" + "=" * 78)
    print(f"  AI PRICE ACTION CHART READER // {result['symbol']} @ {result['current_price']:.2f}")
    print("=" * 78)

    # 1. ASCII Chart
    print(render_ascii_chart(candles, lookback=16, height=8))
    print("─" * 78)

    # 2. Candlestick Anatomy
    c = result['candle']
    color_tag = "[+] GREEN" if c['is_bull'] else "[-] RED"
    print(f"  1. CANDLESTICK ANATOMY ({color_tag}):")
    print(f"     • Open: {c['open']:.2f} | High: {c['high']:.2f} | Low: {c['low']:.2f} | Close: {c['close']:.2f}")
    print(f"     • Bar Range: {c['range']} pts | Body Size: {c['body']} pts ({c['body_pct']}%)")
    print(f"     • Upper Wick Rejection: {c['upper_pct']}% | Lower Wick Absorption: {c['lower_pct']}%")

    # 3. Candlestick Pattern
    p = result['pattern']
    print(f"\n  2. CANDLESTICK PATTERN CLASSIFICATION:")
    print(f"     • Identified Pattern: {p['name']} [{p['type']}]")
    print(f"     • Rationale: {p['desc']}")

    # 4. Market Structure
    st = result['structure']
    print(f"\n  3. MARKET STRUCTURE & FRACTAL LEVELS:")
    print(f"     • Structure State: {st['label']}")
    print(f"     • Trend Bias: {st['bias']}")
    print(f"     • Fractal Resistance: {st['key_resistance']:.2f} | Fractal Support: {st['key_support']:.2f}")
    print(f"     • Notes: {st['details']}")

    # 5. Imbalances & Liquidity
    print(f"\n  4. IMBALANCE & LIQUIDITY ANALYSIS:")
    if result['active_fvg']:
        fvg = result['active_fvg']
        print(f"     • Fair Value Gap: {fvg['type']}")
        print(f"     • Gap Zone: {fvg['bottom']:.2f} to {fvg['top']:.2f} ({fvg['gap']} pts)")
    else:
        print("     • Fair Value Gap: No active imbalances detected in recent 15 bars.")
    if result['liquidity_sweep']:
        print(f"     • Liquidity Sweep: {result['liquidity_sweep']}")
    else:
        print("     • Liquidity Sweep: No stop hunts detected on recent swing levels.")

    # 6. Executive Chart Reading
    print("\n  5. EXECUTIVE INSTITUTIONAL CHART READ:")
    print(f"     \"{result['executive_reading']}\"")
    print("=" * 78 + "\n")

def main():
    parser = argparse.ArgumentParser(description="Institutional Chart Reading & Price Action Engine")
    parser.add_argument('--symbol', type=str, default='ALL', choices=['XAUUSD', 'BTCUSDT', 'ALL'], help="Asset symbol to analyze")
    args = parser.parse_args()

    targets = []
    if args.symbol in ['XAUUSD', 'ALL']:
        targets.append(('PAXGUSD', 'Gold Spot / US Dollar (XAUUSD)'))
    if args.symbol in ['BTCUSDT', 'ALL']:
        targets.append(('XXBTZUSD', 'Bitcoin / Tether Perpetual (BTCUSDT)'))

    for pair, name in targets:
        print(f"[*] Connecting to Kraken Exchange for {name} live M15 candles...")
        candles = fetch_candles(pair)
        if candles:
            analysis = analyze_chart(candles, name)
            print_chart_reading(analysis, candles)
        else:
            print(f"[!] Failed to pull live candles for {name}")

if __name__ == '__main__':
    main()
