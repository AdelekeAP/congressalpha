# backend/routes/trades.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import Trade
from backend.schemas import TradeCreate, TradeOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create a new trade
@router.post("/", response_model=TradeOut)
def create_trade(trade: TradeCreate, db: Session = Depends(get_db)):
    db_trade = Trade(**trade.dict())
    db.add(db_trade)
    db.commit()
    db.refresh(db_trade)
    return db_trade

# Get all trades
@router.get("/", response_model=list[TradeOut])
def get_all_trades(db: Session = Depends(get_db)):
    return db.query(Trade).all()

# Get a single trade by ID
@router.get("/{trade_id}", response_model=TradeOut)
def get_trade(trade_id: int, db: Session = Depends(get_db)):
    trade = db.query(Trade).filter(Trade.id == trade_id).first()
    if not trade:
        raise HTTPException(status_code=404, detail="Trade not found")
    return trade

# Update a trade
@router.put("/{trade_id}", response_model=TradeOut)
def update_trade(trade_id: int, trade: TradeCreate, db: Session = Depends(get_db)):
    db_trade = db.query(Trade).filter(Trade.id == trade_id).first()
    if not db_trade:
        raise HTTPException(status_code=404, detail="Trade not found")
    for key, value in trade.dict().items():
        setattr(db_trade, key, value)
    db.commit()
    db.refresh(db_trade)
    return db_trade

# Delete a trade
@router.delete("/{trade_id}", response_model=dict)
def delete_trade(trade_id: int, db: Session = Depends(get_db)):
    db_trade = db.query(Trade).filter(Trade.id == trade_id).first()
    if not db_trade:
        raise HTTPException(status_code=404, detail="Trade not found")
    db.delete(db_trade)
    db.commit()
    return {"detail": f"Trade {trade_id} deleted"}
