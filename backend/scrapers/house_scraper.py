# scrapers/house_scraper.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests
from database import SessionLocal
from models import Politician, Trade

def fetch_house_trades():
    url = "https://housestockwatcher.com/api/transactions"
    resp = requests.get(url)
    resp.raise_for_status()
    return resp.json()

def ingest_house_trades():
    db = SessionLocal()
    data = fetch_house_trades()
    for trade in data[:100]:  # just first 100 for initial testing, remove slice later!
        # --- Get or Create Politician ---
        pol = db.query(Politician).filter_by(name=trade['representative']).first()
        if not pol:
            pol = Politician(
                name=trade['representative'],
                party=trade.get('party', 'Unknown'),
                state=trade.get('state', ''),
                title=trade.get('disclosure_year', None),
                district=trade.get('district', None),
                # Fill more fields as you wish
            )
            db.add(pol)
            db.commit()
            db.refresh(pol)
        # --- Create Trade (no duplicate check for now) ---
        t = Trade(
            politician_id=pol.id,
            politician=pol.name,
            party=pol.party,
            stock=trade['ticker'],
            company=trade.get('asset_description', ''),
            action=trade['type'],
            amount=trade['amount'],
            date=trade['transaction_date'],
            price="0",  # Set real price if you want
            return_="0",  # Set or calculate
            status=trade.get('owner', ''),
        )
        db.add(t)
    db.commit()
    db.close()
    print("Ingested trades.")

if __name__ == "__main__":
    ingest_house_trades()

