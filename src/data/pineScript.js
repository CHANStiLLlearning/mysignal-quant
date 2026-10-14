export const pineScriptCode = `//@version=5
indicator("Institutional Trend & Dynamic TP/SL Engine [Quant v5]", shorttitle="QUANT_ENGINE_v5", overlay=true, max_lines_count=500, max_boxes_count=500, max_labels_count=500)

// =============================================================================
// 1. INPUTS & CONFIGURATION
// =============================================================================
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

// =============================================================================
// 2. MATHEMATICAL CORE & CALCULATIONS
// =============================================================================

// --- Moving Averages ---
emaFast = ta.ema(close, emaFastLen)
emaSlow = ta.ema(close, emaSlowLen)

// --- Higher Timeframe Alignment (prevents repainting via barstate.isrealtime handling) ---
htfClose = request.security(syminfo.tickerid, htfRes, close[barstate.isrealtime ? 1 : 0], gaps=barmerge.gaps_off, lookahead=barmerge.lookahead_off)
htfEma   = request.security(syminfo.tickerid, htfRes, ta.ema(close, htfEmaLen)[barstate.isrealtime ? 1 : 0], gaps=barmerge.gaps_off, lookahead=barmerge.lookahead_off)
htfBull  = not useHtf or (htfClose > htfEma)
htfBear  = not useHtf or (htfClose < htfEma)

// --- ATR Volatility ---
atrVal = ta.atr(atrLen)

// --- Wilder's ADX ---
[plusDi, minusDi, adxVal] = ta.dmi(adxLen, adxLen)

// --- Kaufman Efficiency Ratio (ER) ---
direction = math.abs(close - close[erLen])
volatility = math.sum(math.abs(close - close[1]), erLen)
kaufmanER = volatility != 0 ? (direction / volatility) : 0.0

// --- Market Regime State Definition ---
isTrending = (adxVal >= adxThresh) and (kaufmanER >= erThresh)
isBullish  = isTrending and (close > emaFast) and (emaFast > emaSlow) and htfBull
isBearish  = isTrending and (close < emaFast) and (emaFast < emaSlow) and htfBear
isRanging  = not isBullish and not isBearish

// --- Structural Swing Highs & Lows ---
swingLowest  = ta.lowest(low, swingLookbk)
swingHighest = ta.highest(high, swingLookbk)

// =============================================================================
// 3. SIGNAL GENERATION & DYNAMIC TP/SL BRACKETS
// =============================================================================

// Signal Triggers (Initial regime breakout)
longTrigger  = isBullish and not isBullish[1]
shortTrigger = isBearish and not isBearish[1]

// State variables to remember active trade geometry
var float entryP  = na
var float slP     = na
var float tp1P    = na
var float tp2P    = na
var float riskR   = na
var int   activeDir = 0 // 1: Long, -1: Short, 0: None

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

        if showBoxes
            box.new(left=bar_index, top=tp2P, right=bar_index + 15, bottom=entryP, 
                    bgcolor=color.new(color.green, 90), border_color=color.green, border_style=line.style_dashed)
            box.new(left=bar_index, top=entryP, right=bar_index + 15, bottom=slP, 
                    bgcolor=color.new(color.red, 90), border_color=color.red, border_style=line.style_dashed)
            label.new(bar_index, entryP, "LONG ENTRY\\n" + str.tostring(entryP, "#.##") + "\\nSL: " + str.tostring(slP, "#.##") + "\\nTP1: " + str.tostring(tp1P, "#.##") + "\\nTP2: " + str.tostring(tp2P, "#.##"), 
                      color=color.green, textcolor=color.white, style=label.style_label_up, size=size.small)

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

        if showBoxes
            box.new(left=bar_index, top=entryP, right=bar_index + 15, bottom=tp2P, 
                    bgcolor=color.new(color.green, 90), border_color=color.green, border_style=line.style_dashed)
            box.new(left=bar_index, top=slP, right=bar_index + 15, bottom=entryP, 
                    bgcolor=color.new(color.red, 90), border_color=color.red, border_style=line.style_dashed)
            label.new(bar_index, entryP, "SHORT ENTRY\\n" + str.tostring(entryP, "#.##") + "\\nSL: " + str.tostring(slP, "#.##") + "\\nTP1: " + str.tostring(tp1P, "#.##") + "\\nTP2: " + str.tostring(tp2P, "#.##"), 
                      color=color.red, textcolor=color.white, style=label.style_label_down, size=size.small)

// Invalidate if price hits SL or TP2
if activeDir == 1 and (low <= slP or high >= tp2P)
    activeDir := 0
if activeDir == -1 and (high >= slP or low <= tp2P)
    activeDir := 0

// =============================================================================
// 4. CHART READING ENGINE: CANDLESTICK PATTERNS, BOS & FVG
// =============================================================================
bodySize = math.abs(close - open)
totalRng = high - low
upperWk  = high - math.max(open, close)
lowerWk  = math.min(open, close) - low

// Pinbars
isHammer       = (lowerWk >= bodySize * 2) and (upperWk <= bodySize * 0.5) and (totalRng > atrVal * 0.7)
isShootingStar = (upperWk >= bodySize * 2) and (lowerWk <= bodySize * 0.5) and (totalRng > atrVal * 0.7)

// Engulfing
isBullEngulf   = (close > open) and (close[1] < open[1]) and (close > open[1]) and (open < close[1])
isBearEngulf   = (close < open) and (close[1] > open[1]) and (close < open[1]) and (open > close[1])

// Break of Structure (BOS)
isBullBOS      = ta.crossover(close, swingHighest[1])
isBearBOS      = ta.crossunder(close, swingLowest[1])

// Plot Chart Reading Labels on Candles
plotshape(isHammer, title="Hammer Rejection", style=shape.labelup, location=location.belowbar, color=color.new(color.teal, 10), text="PINBAR", textcolor=color.white, size=size.tiny)
plotshape(isShootingStar, title="Shooting Star Rejection", style=shape.labeldown, location=location.abovebar, color=color.new(color.maroon, 10), text="PINBAR", textcolor=color.white, size=size.tiny)
plotshape(isBullEngulf, title="Bullish Engulfing", style=shape.labelup, location=location.belowbar, color=color.new(color.green, 10), text="ENGULF", textcolor=color.white, size=size.tiny)
plotshape(isBearEngulf, title="Bearish Engulfing", style=shape.labeldown, location=location.abovebar, color=color.new(color.red, 10), text="ENGULF", textcolor=color.white, size=size.tiny)
plotshape(isBullBOS, title="Bullish BOS", style=shape.labelup, location=location.belowbar, color=color.new(color.blue, 10), text="BOS", textcolor=color.white, size=size.tiny)
plotshape(isBearBOS, title="Bearish BOS", style=shape.labeldown, location=location.abovebar, color=color.new(color.purple, 10), text="BOS", textcolor=color.white, size=size.tiny)

// =============================================================================
// 5. CHART PLOTS & VISUALS
// =============================================================================

// Plot Moving Averages
plot(emaFast, "EMA 21", color=color.aqua, linewidth=2)
plot(emaSlow, "EMA 55", color=color.orange, linewidth=2)

// Dynamic Active Levels
plot(activeDir != 0 ? slP : na, "Active Stop Loss", color=color.red, style=plot.style_linebr, linewidth=2)
plot(activeDir != 0 ? tp1P : na, "Active TP1 (1.5R)", color=color.lime, style=plot.style_linebr, linewidth=1)
plot(activeDir != 0 ? tp2P : na, "Active TP2 (3.0R)", color=color.green, style=plot.style_linebr, linewidth=2)

// Bar Coloring
barColor = colorBars ? (isBullish ? color.green : (isBearish ? color.red : color.gray)) : na
barcolor(barColor)

// Plot Signal Shapes
plotshape(longTrigger, title="Long Signal Icon", style=shape.triangleup, location=location.belowbar, color=color.green, size=size.normal)
plotshape(shortTrigger, title="Short Signal Icon", style=shape.triangledown, location=location.abovebar, color=color.red, size=size.normal)

// =============================================================================
// 6. ON-SCREEN HUD DASHBOARD TABLE
// =============================================================================
var table hud = table.new(position.top_right, 2, 9, bgcolor=color.new(#0d1117, 15), border_color=color.new(#30363d, 0), border_width=1)

if barstate.islast and showTable
    // Header
    table.cell(hud, 0, 0, "QUANT ENGINE v5", bgcolor=color.new(#161b22, 10), text_color=color.white, text_size=size.small)
    table.cell(hud, 1, 0, syminfo.ticker + " [" + timeframe.period + "]", bgcolor=color.new(#161b22, 10), text_color=color.aqua, text_size=size.small)

    // Market Regime
    regimeStr = isBullish ? "🟢 BULLISH" : (isBearish ? "🔴 BEARISH" : "🟡 CHOP / RANGE")
    regimeBg  = isBullish ? color.new(color.green, 70) : (isBearish ? color.new(color.red, 70) : color.new(color.yellow, 70))
    table.cell(hud, 0, 1, "Regime Status", text_color=color.silver, text_size=size.small)
    table.cell(hud, 1, 1, regimeStr, bgcolor=regimeBg, text_color=color.white, text_size=size.small)

    // ADX Trend Strength
    adxStr = str.tostring(adxVal, "#.#") + (adxVal >= adxThresh ? " (Trending)" : " (Chop)")
    adxCol = adxVal >= adxThresh ? color.lime : color.orange
    table.cell(hud, 0, 2, "ADX (14)", text_color=color.silver, text_size=size.small)
    table.cell(hud, 1, 2, adxStr, text_color=adxCol, text_size=size.small)

    // Kaufman Efficiency Ratio
    erStr = str.tostring(kaufmanER, "#.##") + (kaufmanER >= erThresh ? " (Smooth)" : " (Noisy)")
    erCol = kaufmanER >= erThresh ? color.lime : color.orange
    table.cell(hud, 0, 3, "Efficiency Ratio", text_color=color.silver, text_size=size.small)
    table.cell(hud, 1, 3, erStr, text_color=erCol, text_size=size.small)

    // Current ATR
    table.cell(hud, 0, 4, "Current ATR (14)", text_color=color.silver, text_size=size.small)
    table.cell(hud, 1, 4, str.tostring(atrVal, "#.####"), text_color=color.white, text_size=size.small)

    // Active Setup State
    activeStr = activeDir == 1 ? "LONG ACTIVE" : (activeDir == -1 ? "SHORT ACTIVE" : "STAND ASIDE")
    table.cell(hud, 0, 5, "Trade Setup", text_color=color.silver, text_size=size.small)
    table.cell(hud, 1, 5, activeStr, text_color=activeDir == 1 ? color.green : (activeDir == -1 ? color.red : color.gray), text_size=size.small)

    // Stop Loss Level
    slStr = activeDir != 0 ? str.tostring(slP, "#.##") + " (" + str.tostring(riskR, "#.##") + " pts)" : "--"
    table.cell(hud, 0, 6, "Dynamic SL", text_color=color.silver, text_size=size.small)
    table.cell(hud, 1, 6, slStr, text_color=color.red, text_size=size.small)

    // Take Profit Levels
    tpStr = activeDir != 0 ? "TP1: " + str.tostring(tp1P, "#.##") + "\\nTP2: " + str.tostring(tp2P, "#.##") : "--"
    table.cell(hud, 0, 7, "Targets (1.5R / 3R)", text_color=color.silver, text_size=size.small)
    table.cell(hud, 1, 7, tpStr, text_color=color.green, text_size=size.small)

    // Live Chart Reading
    paStr = isHammer ? "🔨 PINBAR (Hammer)" : (isShootingStar ? "⭐ PINBAR (Star)" : (isBullEngulf ? "🟢 BULL ENGULF" : (isBearEngulf ? "🔴 BEAR ENGULF" : (isBullBOS ? "📈 BULL BOS" : (isBearBOS ? "📉 BEAR BOS" : "📊 STEADY CONFLUENCE")))))
    table.cell(hud, 0, 8, "Chart Reading", text_color=color.silver, text_size=size.small)
    table.cell(hud, 1, 8, paStr, text_color=color.aqua, text_size=size.small)

// =============================================================================
// 7. ALERTS FOR AUTOMATION & WEB NOTIFICATIONS
// =============================================================================
alertcondition(longTrigger, title="[QUANT] Bullish Entry Signal", message="QUANT ALERT: Bullish Trend Confirmed on {{ticker}} at {{close}}. SL: Check chart, TP1: 1.5R, TP2: 3.0R")
alertcondition(shortTrigger, title="[QUANT] Bearish Entry Signal", message="QUANT ALERT: Bearish Trend Confirmed on {{ticker}} at {{close}}. SL: Check chart, TP1: 1.5R, TP2: 3.0R")
alertcondition(isHammer or isShootingStar, title="[QUANT] Pinbar Rejection Detected", message="QUANT ALERT: Pinbar Rejection on {{ticker}} at {{close}}.")
alertcondition(isBullBOS or isBearBOS, title="[QUANT] Break of Structure (BOS)", message="QUANT ALERT: Break of Structure on {{ticker}} at {{close}}.")
alertcondition(isRanging and not isRanging[1], title="[QUANT] Market Entered Chop Zone", message="QUANT ALERT: {{ticker}} entered ranging/chop zone. Stand aside.")
`;
