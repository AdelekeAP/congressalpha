from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import Politician, Trade
from backend.schemas import PoliticianCreate, PoliticianOut
import datetime
import yfinance as yf
import re

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def batch_get_prices(ticker, date_list):
    """Batch fetch closing prices for a ticker on date_list (datetime.date)."""
    if not ticker or ticker.strip() == "" or not date_list:
        print(f"[WARNING] Skipping blank ticker.")
        return {dt: None for dt in date_list}
    start = min(date_list)
    end = max(date_list) + datetime.timedelta(days=7)
    try:
        data = yf.download(ticker, start=start, end=end, progress=False, auto_adjust=False)
        if data is None or data.empty:
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
    """Parse amount like '$1,001 - $15,000' and return midpoint as float."""
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

@router.post("/", response_model=PoliticianOut)
def create_politician(politician: PoliticianCreate, db: Session = Depends(get_db)):
    db_politician = Politician(**politician.model_dump())
    db.add(db_politician)
    db.commit()
    db.refresh(db_politician)
    return db_politician

@router.get("/", response_model=list[PoliticianOut])
def get_all_politicians(db: Session = Depends(get_db)):
    politicians = db.query(Politician).all()
    out = []
    for pol in politicians:
        trades = db.query(Trade).filter(Trade.politician_id == pol.id).all()
        trade_count = len(trades)
        if not trades:
            pol_dict = pol.__dict__.copy()
            pol_dict['trades'] = 0
            pol_dict['total_return'] = "--"
            out.append(PoliticianOut(**pol_dict))
            continue

        # Build trade_dates and tickers
        trade_dates = []
        unique_tickers = set()
        for t in trades:
            ticker = t.stock.strip().upper() if t.stock else ""
            if not ticker:
                continue
            if "-" in t.date:
                dt = datetime.datetime.strptime(t.date.strip(), "%Y-%m-%d").date()
            else:
                dt = datetime.datetime.strptime(t.date.strip(), "%m/%d/%Y").date()
            trade_dates.append(dt)
            unique_tickers.add(ticker)
        trade_dates = sorted(set(trade_dates))

        ticker_price_map = {}
        for ticker in unique_tickers:
            ticker_price_map[ticker] = batch_get_prices(ticker, trade_dates)

        initial_balance = 100_000
        balance = initial_balance
        holdings = {}
        for t in trades:
            action = t.action.upper()
            stock = t.stock.strip().upper() if t.stock else ""
            if not stock:
                continue
            if "-" in t.date:
                parsed_date = datetime.datetime.strptime(t.date.strip(), "%Y-%m-%d").date()
            else:
                parsed_date = datetime.datetime.strptime(t.date.strip(), "%m/%d/%Y").date()
            price = ticker_price_map.get(stock, {}).get(parsed_date)
            if price is None or price == 0:
                continue
            amount = parse_amount_range(t.amount)
            shares = amount // price
            if shares == 0:
                continue
            if action == "P":
                total_cost = shares * price
                if balance >= total_cost:
                    prev_shares = holdings.get(stock, {}).get("shares", 0)
                    prev_avg = holdings.get(stock, {}).get("avg_price", 0)
                    new_avg = ((prev_shares * prev_avg) + total_cost) / (prev_shares + shares) if prev_shares > 0 else price
                    holdings[stock] = {"shares": prev_shares + shares, "avg_price": new_avg}
                    balance -= total_cost
            elif action == "S":
                if stock in holdings and holdings[stock]["shares"] > 0:
                    sell_shares = holdings[stock]["shares"]
                    proceeds = sell_shares * price
                    balance += proceeds
                    holdings[stock] = {"shares": 0, "avg_price": 0}

        if trade_count > 0:
            total_return = round((balance - initial_balance) / initial_balance * 100, 2)
            total_return_str = f"+{total_return}%" if total_return > 0 else f"{total_return}%"
        else:
            total_return_str = "--"
        pol_dict = pol.__dict__.copy()
        pol_dict['trades'] = trade_count
        pol_dict['total_return'] = total_return_str
        out.append(PoliticianOut(**pol_dict))

    def sort_key(p):
        if p.total_return == "--":
            return -9999
        return float(p.total_return.replace("%", "").replace("+", ""))
    out.sort(key=sort_key, reverse=True)
    return out

@router.get("/{politician_id}", response_model=PoliticianOut)
def get_politician(politician_id: int, db: Session = Depends(get_db)):
    pol = db.query(Politician).filter(Politician.id == politician_id).first()
    if not pol:
        raise HTTPException(status_code=404, detail="Politician not found")
    trades = db.query(Trade).filter(Trade.politician_id == pol.id).all()
    trade_count = len(trades)
    if not trades:
        pol_dict = pol.__dict__.copy()
        pol_dict['trades'] = 0
        pol_dict['total_return'] = "--"
        return PoliticianOut(**pol_dict)

    trade_dates = []
    unique_tickers = set()
    for t in trades:
        ticker = t.stock.strip().upper() if t.stock else ""
        if not ticker:
            continue
        if "-" in t.date:
            dt = datetime.datetime.strptime(t.date.strip(), "%Y-%m-%d").date()
        else:
            dt = datetime.datetime.strptime(t.date.strip(), "%m/%d/%Y").date()
        trade_dates.append(dt)
        unique_tickers.add(ticker)
    trade_dates = sorted(set(trade_dates))
    ticker_price_map = {}
    for ticker in unique_tickers:
        ticker_price_map[ticker] = batch_get_prices(ticker, trade_dates)

    initial_balance = 100_000
    balance = initial_balance
    holdings = {}
    for t in trades:
        action = t.action.upper()
        stock = t.stock.strip().upper() if t.stock else ""
        if not stock:
            continue
        if "-" in t.date:
            parsed_date = datetime.datetime.strptime(t.date.strip(), "%Y-%m-%d").date()
        else:
            parsed_date = datetime.datetime.strptime(t.date.strip(), "%m/%d/%Y").date()
        price = ticker_price_map.get(stock, {}).get(parsed_date)
        if price is None or price == 0:
            continue
        amount = parse_amount_range(t.amount)
        shares = amount // price
        if shares == 0:
            continue
        if action == "P":
            total_cost = shares * price
            if balance >= total_cost:
                prev_shares = holdings.get(stock, {}).get("shares", 0)
                prev_avg = holdings.get(stock, {}).get("avg_price", 0)
                new_avg = ((prev_shares * prev_avg) + total_cost) / (prev_shares + shares) if prev_shares > 0 else price
                holdings[stock] = {"shares": prev_shares + shares, "avg_price": new_avg}
                balance -= total_cost
        elif action == "S":
            if stock in holdings and holdings[stock]["shares"] > 0:
                sell_shares = holdings[stock]["shares"]
                proceeds = sell_shares * price
                balance += proceeds
                holdings[stock] = {"shares": 0, "avg_price": 0}

    if trade_count > 0:
        total_return = round((balance - initial_balance) / initial_balance * 100, 2)
        total_return_str = f"+{total_return}%" if total_return > 0 else f"{total_return}%"
    else:
        total_return_str = "--"
    pol_dict = pol.__dict__.copy()
    pol_dict['trades'] = trade_count
    pol_dict['total_return'] = total_return_str
    return PoliticianOut(**pol_dict)
