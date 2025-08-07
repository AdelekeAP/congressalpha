from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import Trade
from backend.schemas import (
    SimulationRequest,
    SimulationResponse,
    TradeSimulationResult,
    PoliticianSummary,
)
import datetime
import yfinance as yf
from collections import defaultdict, deque
import re

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def batch_get_prices(ticker, date_list):
    if not ticker or not date_list:
        return {dt: None for dt in date_list}
    start = min(date_list)
    end = max(date_list) + datetime.timedelta(days=7)
    try:
        data = yf.download(ticker, start=start, end=end, progress=False, auto_adjust=False)
        if data.empty:
            print(f"[WARNING] No data for ticker: '{ticker}' from {start} to {end}")
            return {dt: None for dt in date_list}
    except Exception as e:
        print(f"[ERROR] yfinance download failed for '{ticker}': {e}")
        return {dt: None for dt in date_list}
    prices = {}
    for dt in date_list:
        found = False
        for offset in range(5):
            check_date = dt + datetime.timedelta(days=offset)
            strdate = check_date.strftime("%Y-%m-%d")
            if strdate in data.index.strftime("%Y-%m-%d"):
                row = data.loc[strdate]
                close_val = row['Close']
                price = float(close_val.iloc[0]) if hasattr(close_val, "iloc") else float(close_val)
                if price > 0:
                    prices[dt] = price
                    found = True
                    break
        if not found:
            prices[dt] = None
    return prices

def parse_amount_range(amount_str):
    if not amount_str:
        return 5000
    matches = re.findall(r"[\d,]+", amount_str)
    if len(matches) == 2:
        low = int(matches[0].replace(",", ""))
        high = int(matches[1].replace(",", ""))
        return (low + high) / 2
    elif len(matches) == 1:
        return float(matches[0].replace(",", ""))
    return 5000

# ---- TECH STOCKS LIST ----
TECH_TICKERS = {
    "AAPL", "MSFT", "GOOGL", "GOOG", "NVDA", "META", "AMD", "TSLA", "CRM",
    "NFLX", "ADBE", "INTC", "ORCL", "AMZN", "PYPL", "QCOM", "AVGO", "CSCO",
    "SHOP", "ZM", "NOW", "SNOW", "TEAM", "PLTR", "UBER", "SQ", "TWLO"
}
def is_tech_stock(ticker):
    return ticker.upper() in TECH_TICKERS

@router.post("/simulate-trades", response_model=SimulationResponse)
def simulate_trades(request: SimulationRequest, db: Session = Depends(get_db)):
    if not request.politician_ids:
        raise HTTPException(status_code=400, detail="No politician selected")
    politician_id = request.politician_ids[0]
    trades = db.query(Trade).filter(Trade.politician_id == politician_id).all()

    start = request.start_date
    end = request.end_date
    strategy = request.simulation_strategy or "mirror"

    def get_trade_exec_date(trade_date):
        if strategy == "mirror":
            return trade_date
        elif strategy == "delayed":
            return trade_date + datetime.timedelta(days=7)
        # Tech stocks and other strategies use original trade_date
        return trade_date

    def is_in_range(trade):
        try:
            d = datetime.datetime.strptime(trade.date.strip(), "%Y-%m-%d").date()
            exec_date = get_trade_exec_date(d)
            return start <= exec_date <= end
        except Exception:
            return False

    filtered_trades = []
    for t in trades:
        if not t.stock or not t.stock.strip():
            continue
        if not is_in_range(t):
            continue
        filtered_trades.append(t)

    # --- STRATEGY FILTER: TECH SECTOR ONLY ---
    if strategy == "tech-sector":
        filtered_trades = [t for t in filtered_trades if is_tech_stock(t.stock)]

    # Sort trades by execution date (after any strategy adjustment)
    filtered_trades.sort(key=lambda t: get_trade_exec_date(
        datetime.datetime.strptime(t.date.strip(), "%Y-%m-%d").date())
    )

    # Price lookup - collect all exec dates needed
    trade_exec_dates = []
    unique_tickers = set()
    for t in filtered_trades:
        ticker = t.stock.strip().upper()
        if not ticker:
            continue
        orig_dt = datetime.datetime.strptime(t.date.strip(), "%Y-%m-%d").date()
        exec_date = get_trade_exec_date(orig_dt)
        trade_exec_dates.append(exec_date)
        unique_tickers.add(ticker)
    trade_exec_dates = sorted(set(trade_exec_dates))

    ticker_price_map = {}
    for ticker in unique_tickers:
        ticker_price_map[ticker] = batch_get_prices(ticker, trade_exec_dates)
    spy_prices = batch_get_prices("SPY", trade_exec_dates)
    spy_start = spy_prices[trade_exec_dates[0]] if trade_exec_dates else None

    # --- Proportional Simulation Logic with FIFO and Hold Time ---
    user_balance = float(request.investment_amount)
    user_holdings = defaultdict(float)        # ticker -> shares
    user_buy_history = defaultdict(deque)     # ticker -> deque of (shares, price, buy_date)
    trade_results = []
    portfolio_history = []
    sp500_history = []
    trade_returns = []
    hold_times = []
    win_count = 0
    lose_count = 0

    politician_start_balance = 1_000_000.0
    politician_balance = politician_start_balance
    pol_holdings = defaultdict(float)

    for t in filtered_trades:
        action = t.action.upper()
        stock = t.stock.strip().upper()
        if not stock:
            continue
        # Get the correct execution date for this trade per strategy
        orig_date = datetime.datetime.strptime(t.date.strip(), "%Y-%m-%d").date()
        exec_date = get_trade_exec_date(orig_date)
        price = ticker_price_map.get(stock, {}).get(exec_date)
        if price is None or price == 0:
            continue
        amount = parse_amount_range(t.amount)

        # Calculate % of politician's portfolio used for this trade
        pol_pct = 0.0
        if action == "P":
            pol_pct = min(amount / politician_balance, 1.0) if politician_balance > 0 else 1.0
            pol_shares = amount / price
            if pol_shares > 0:
                pol_holdings[stock] += pol_shares
                politician_balance -= amount
        elif action == "S":
            holding_value = pol_holdings[stock] * price
            pol_pct = min(amount / holding_value, 1.0) if holding_value > 0 else 0.0
            shares_to_sell = pol_holdings[stock] * pol_pct
            if shares_to_sell > 0:
                pol_holdings[stock] -= shares_to_sell
                politician_balance += shares_to_sell * price

        # --- User mirrors % of their own balance/holdings ---
        user_trade_amt = 0
        user_shares = 0
        trade_return = None
        avg_hold_days = None
        if action == "P":
            user_trade_amt = user_balance * pol_pct
            user_shares = user_trade_amt / price
            if user_shares > 0 and user_balance >= user_trade_amt:
                user_holdings[stock] += user_shares
                user_buy_history[stock].append((user_shares, price, exec_date))
                user_balance -= user_trade_amt
        elif action == "S":
            user_shares_to_sell = user_holdings[stock] * pol_pct
            if user_shares_to_sell <= 0:
                continue
            proceeds = user_shares_to_sell * price
            user_balance += proceeds

            # --- FIFO Cost Basis & Hold Time Calculation ---
            shares_remaining = user_shares_to_sell
            cost_basis = 0
            weighted_hold_time = 0
            total_shares_sold = user_shares_to_sell

            while shares_remaining > 0 and user_buy_history[stock]:
                buy_shares, buy_price, buy_date = user_buy_history[stock][0]
                lot_sell = min(buy_shares, shares_remaining)
                cost_basis += lot_sell * buy_price
                hold_time = (exec_date - buy_date).days
                weighted_hold_time += lot_sell * hold_time
                if lot_sell == buy_shares:
                    user_buy_history[stock].popleft()
                else:
                    user_buy_history[stock][0] = (buy_shares - lot_sell, buy_price, buy_date)
                shares_remaining -= lot_sell

            avg_buy_price = cost_basis / total_shares_sold if total_shares_sold else 0
            trade_return = ((price - avg_buy_price) / avg_buy_price) if avg_buy_price else 0
            avg_hold_days = weighted_hold_time / total_shares_sold if total_shares_sold else 0

            user_holdings[stock] -= user_shares_to_sell
            if trade_return > 0:
                win_count += 1
            elif trade_return < 0:
                lose_count += 1
            hold_times.append(avg_hold_days)
            trade_returns.append(trade_return)

            # Only append SELL trades (completed trades) for analytics
            trade_results.append(
                TradeSimulationResult(
                    trade_id=t.id,
                    ticker=stock,
                    buy_date=None,    # Could include more details if desired
                    buy_price=None,
                    sell_date=exec_date,
                    sell_price=price,
                    return_=trade_return,
                    politician_id=politician_id,
                )
            )
        else:
            continue

        portfolio_history.append({
            "date": exec_date.isoformat(),
            "balance": round(user_balance, 2)
        })
        spy_price_now = spy_prices.get(exec_date)
        if spy_start and spy_price_now:
            sp500_equity = float(request.investment_amount) * (spy_price_now / spy_start)
            sp500_history.append({
                "date": exec_date.isoformat(),
                "sp500_value": round(sp500_equity, 2)
            })

    # At the end, add value of any held stocks to cash balance (using latest known price)
    final_value = user_balance
    last_prices = {ticker: None for ticker in user_holdings}
    for ticker in user_holdings:
        last_price = None
        for dt in reversed(trade_exec_dates):
            if ticker_price_map[ticker].get(dt):
                last_price = ticker_price_map[ticker][dt]
                break
        last_prices[ticker] = last_price
        if last_price and user_holdings[ticker] > 0:
            final_value += user_holdings[ticker] * last_price

    total_return = (final_value - float(request.investment_amount)) / float(request.investment_amount) if request.investment_amount else 0

    # Best/Worst Trade Calculation: Only from SELLs with valid returns
    sell_trades = [tr for tr in trade_results if tr.return_ is not None]
    best_trade = max(sell_trades, key=lambda tr: tr.return_, default=None)
    worst_trade = min(sell_trades, key=lambda tr: tr.return_, default=None)
    avg_hold_time = round(sum(hold_times) / len(hold_times), 2) if hold_times else None

    trade_analysis = {
        "win_count": win_count,
        "lose_count": lose_count,
        "win_rate": round((win_count / (win_count + lose_count) * 100) if (win_count + lose_count) > 0 else 0, 1),
        "best_trade": {
            "ticker": best_trade.ticker if best_trade else "",
            "return": best_trade.return_ if best_trade else None,
        },
        "worst_trade": {
            "ticker": worst_trade.ticker if worst_trade else "",
            "return": worst_trade.return_ if worst_trade else None,
        },
        "average_hold_time": avg_hold_time,
    }

    summary_by_politician = [
        PoliticianSummary(politician_id=politician_id, return_=round(total_return, 4))
    ]

    return SimulationResponse(
        total_return=round(total_return, 4),
        final_balance=round(final_value, 2),
        trade_results=trade_results,
        summary_by_politician=summary_by_politician,
        portfolio_history=portfolio_history,
        sp500_history=sp500_history,
        trade_analysis=trade_analysis,
    )
